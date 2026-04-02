import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, Product, ProductVariation } from "@/types";

const CART_STORAGE_KEY = "cart-storage";

// Helper to generate unique cart key
const generateCartKey = (productId: number, variations: ProductVariation[] = []) => {
    if (!variations || variations.length === 0) return String(productId);
    const sortedVarIds = variations.map(v => v.id).sort((a, b) => a - b);
    return `${productId}-${sortedVarIds.join("-")}`;
};

/** Sanitize persisted cart so stale/deleted products and bad data don't break the UI. */
function sanitizeCart(
    cart: Record<string, unknown>
): Record<string, CartItem & { cart_id: string }> {
    const result: Record<string, CartItem & { cart_id: string }> = {};
    for (const [key, value] of Object.entries(cart)) {
        if (!key || !value || typeof value !== "object") continue;
        const item = value as Record<string, unknown>;
        const productId = Number(item.product_id);
        const price = Number(item.price);
        const quantity = Number(item.quantity);
        // Keep only items with valid required fields and quantity >= 1
        if (isNaN(productId) || isNaN(price) || quantity < 1 || isNaN(quantity))
            continue;
        const name =
            typeof item.name === "string" && item.name.trim()
                ? item.name
                : "Unknown product";
        const stock =
            typeof item.stock === "number" && !isNaN(item.stock)
                ? item.stock
                : Number(item.stock) || 0;
        const originalPrice =
            typeof item.original_price === "number" && !isNaN(item.original_price)
                ? item.original_price
                : undefined;
        result[key] = {
            cart_id: key,
            product_id: productId,
            name,
            price: isNaN(price) ? 0 : price,
            quantity: Math.floor(quantity),
            stock: isNaN(stock) ? 0 : stock,
            image:
                typeof item.image === "string" || item.image === null
                    ? item.image
                    : null,
            is_preorder: Boolean(item.is_preorder),
            variations: Array.isArray(item.variations) ? item.variations : undefined,
            category_id:
                typeof item.category_id === "number" ? item.category_id : undefined,
            ...(originalPrice !== undefined && { original_price: originalPrice }),
        };
    }
    return result;
}

/** Safe storage: parse errors or invalid data don't crash the app; cart is sanitized on load. */
function createSafeCartStorage() {
    return {
        getItem: (name: string): string | null => {
            try {
                const raw = localStorage.getItem(name);
                if (!raw) return null;
                const parsed = JSON.parse(raw) as {
                    state?: { cart?: Record<string, unknown>; isOpen?: boolean };
                    version?: number;
                };
                if (parsed?.state && parsed.state.cart && typeof parsed.state.cart === "object") {
                    parsed.state.cart = sanitizeCart(parsed.state.cart);
                }
                return JSON.stringify(parsed);
            } catch {
                return null;
            }
        },
        setItem: (name: string, value: string): void => {
            try {
                localStorage.setItem(name, value);
            } catch {
                // quota exceeded or storage disabled
            }
        },
        removeItem: (name: string): void => {
            try {
                localStorage.removeItem(name);
            } catch {
                // ignore
            }
        },
    };
}

interface CartState {
    cart: Record<string, CartItem & { cart_id: string }>;
    isOpen: boolean;
    addToCart: (
        product: Product,
        quantity?: number,
        variations?: ProductVariation[]
    ) => void;
    removeFromCart: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
    setIsOpen: (isOpen: boolean) => void;
    getCartTotal: () => number;
    getCartCount: () => number;
    /** Merge server-saved account cart lines into the local cart (same keys overwrite). */
    mergeSavedCartFromAccount: (
        items: (CartItem & { cart_id: string })[]
    ) => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: {},
            isOpen: false,

            addToCart: (
                product: Product,
                quantity: number = 1,
                variations: ProductVariation[] = []
            ) => {
                set((state) => {
                    const key = generateCartKey(product.id, variations);
                    const existingItem = state.cart[key];
                    const newQuantity = existingItem
                        ? existingItem.quantity + quantity
                        : quantity;

                    // Calculate stock logic
                    let stock = Number(product.stock);
                    if (variations && variations.length > 0) {
                        const variationStocks = variations
                            .map((v) => (v.stock ?? product.stock))
                            .map((s) => Number(s))
                            .filter(
                                (s) =>
                                    !isNaN(s)
                            );
                        if (variationStocks.length > 0) {
                            stock = Math.min(Number(product.stock), ...variationStocks);
                        }
                    }

                    // Calculate price logic: use discounted sale price when available
                    const basePrice = Number(
                        product.discounted_sale_price ?? product.sale_price
                    );
                    let price = basePrice;
                    if (variations && variations.length > 0) {
                        const varPrices = variations
                            .map((v) =>
                                v.price ? parseFloat(String(v.price)) : null
                            )
                            .filter((p) => p !== null) as number[];

                        if (varPrices.length > 0) {
                            price = Math.max(...varPrices);
                        } else {
                            price = basePrice;
                        }
                    }

                    const originalPrice = Number(product.sale_price);
                    return {
                        cart: {
                            ...state.cart,
                            [key]: {
                                cart_id: key,
                                product_id: product.id,
                                name: product.name,
                                price: price,
                                original_price: originalPrice > 0 ? originalPrice : undefined,
                                stock: stock,
                                quantity: newQuantity,
                                image: product.images?.[0] || null,
                                is_preorder: product.is_preorder,
                                variations: variations,
                                category_id: product.category_id,
                            },
                        },
                        isOpen: window.innerWidth >= 768,
                    };
                });
            },

            removeFromCart: (cartId: string) => {
                if (!cartId) return;
                set((state) => {
                    const newCart = { ...state.cart };
                    delete newCart[cartId];
                    return { cart: newCart };
                });
            },

            updateQuantity: (cartId: string, quantity: number) => {
                if (quantity < 1) {
                    // Allow removing by setting quantity to 0 (e.g. for unavailable items)
                    get().removeFromCart(cartId);
                    return;
                }
                set((state) => {
                    if (!state.cart[cartId]) return state;
                    return {
                        cart: {
                            ...state.cart,
                            [cartId]: {
                                ...state.cart[cartId],
                                quantity: quantity,
                            },
                        },
                    };
                });
            },

            clearCart: () => set({ cart: {} }),

            mergeSavedCartFromAccount: (
                items: (CartItem & { cart_id: string })[]
            ) => {
                set((state) => {
                    const next = { ...state.cart };
                    for (const item of items) {
                        const id =
                            item.cart_id ||
                            generateCartKey(item.product_id, item.variations ?? []);
                        next[id] = { ...item, cart_id: id };
                    }
                    return { cart: next };
                });
            },

            setIsOpen: (isOpen: boolean) => set({ isOpen }),

            getCartTotal: () => {
                const state = get();
                return Object.values(state.cart).reduce((total, item) => {
                    const price = Number(item.price);
                    const qty = Number(item.quantity);
                    return total + (isNaN(price) || isNaN(qty) ? 0 : price * qty);
                }, 0);
            },

            getCartCount: () => {
                const state = get();
                return Object.values(state.cart).reduce((count, item) => {
                    const qty = Number(item.quantity);
                    return count + (isNaN(qty) ? 0 : qty);
                }, 0);
            },
        }),
        {
            name: CART_STORAGE_KEY,
            storage: createJSONStorage(() => createSafeCartStorage()),
        }
    )
);
