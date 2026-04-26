import { Link, usePage } from "@inertiajs/react";
import {
    X,
    ShoppingBag,
    ArrowRight,
    ShoppingCart,
    History,
    Sparkles,
} from "lucide-react";
import { formatPrice } from "@/Utils/helpers";
import CartSidebarItem from "./CartSidebarItem";
import OrderHistoryList from "./OrderHistoryList";

import { useCartStore } from "@/Stores/useCartStore";
import { useMemo, useState } from "react";

const CartSidebar = () => {
    const { cart, isOpen, setIsOpen, getCartTotal } = useCartStore();
    const cartItems = Object.values(cart);
    const cartTotal = getCartTotal();
    const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");

    const onClose = () => setIsOpen(false);

    const handleCheckout = () => {
        onClose();
    };

    const { props } = usePage();

    // Parse and sort rules once
    const discountRules = useMemo(() => {
        try {
            const rawRules = props.discount
                ? typeof props.discount === "string"
                    ? JSON.parse(props.discount)
                    : props.discount
                : [];

            if (!Array.isArray(rawRules)) return [];

            return rawRules
                .map((rule: any) => ({
                    qty: parseInt(rule.qty) || 0,
                    discount: parseFloat(rule.discount) || 0,
                }))
                .sort((a, b) => b.qty - a.qty);
        } catch (error) {
            console.error("Failed to parse discount rules:", error);
            return [];
        }
    }, [props.discount]);

    const getDiscount = () => {
        if (!discountRules.length) return 0;

        let totalDiscount = 0;

        cartItems.forEach((item) => {
            const applicableRule = discountRules.find(
                (rule) => item.quantity >= rule.qty,
            );

            if (applicableRule) {
                totalDiscount += item.quantity * applicableRule.discount;
            }
        });

        return totalDiscount;
    };

    const discountAmount = getDiscount();

    // Product discount savings (original_price - price) per item
    const productSavings = useMemo(() => {
        return cartItems.reduce((sum, item) => {
            const orig = Number(item.original_price ?? 0);
            const price = Number(item.price ?? 0);
            const qty = Number(item.quantity ?? 0);
            if (orig > price && qty > 0) return sum + (orig - price) * qty;
            return sum;
        }, 0);
    }, [cartItems]);

    const finalTotal = cartTotal - discountAmount;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar/Bottom Sheet */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab("cart")}
                                className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors relative ${
                                    activeTab === "cart"
                                        ? "text-brand-primary"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                <ShoppingCart size={18} />
                                Cart({cartItems.length})
                                {activeTab === "cart" && (
                                    <span className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-brand-primary" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors relative ${
                                    activeTab === "orders"
                                        ? "text-brand-primary"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                <History size={18} />
                                Orders
                                {activeTab === "orders" && (
                                    <span className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-brand-primary" />
                                )}
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-gray-50">
                        {activeTab === "cart" ? (
                            <div className="p-4 space-y-4">
                                {cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 space-y-4">
                                        <ShoppingBag
                                            size={48}
                                            className="opacity-50"
                                        />
                                        <p className="text-lg font-medium">
                                            Your cart is empty
                                        </p>
                                        <button
                                            onClick={onClose}
                                            className="text-brand-primary hover:text-brand-primary/80 font-medium"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <CartSidebarItem
                                            key={item.cart_id}
                                            item={item}
                                        />
                                    ))
                                )}
                            </div>
                        ) : (
                            <OrderHistoryList />
                        )}
                    </div>

                    {/* Footer - Only show for Cart tab */}
                    {activeTab === "cart" && cartItems.length > 0 && (
                        <div className="p-4 border-t bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-base text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(cartTotal)}</span>
                                    </div>
                                    {productSavings > 0 && (
                                        <div className="flex items-center justify-between text-sm text-amber-700 font-medium bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                                            <span className="flex items-center gap-1.5">
                                                <Sparkles size={14} />
                                                Discount savings
                                            </span>
                                            <span className="font-bold">-{formatPrice(productSavings)}</span>
                                        </div>
                                    )}
                                    {discountAmount > 0 && (
                                        <div className="flex items-center justify-between text-sm text-brand-success font-medium bg-brand-success/10 rounded-lg px-3 py-2">
                                            <span>Quantity discount</span>
                                            <span>-{formatPrice(discountAmount)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100">
                                        <span>Total</span>
                                        <span>{formatPrice(finalTotal)}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={route("checkout.index")}
                                        className="w-full flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-4 text-base font-bold text-white shadow-[0_8px_24px_rgba(225,29,109,0.35)] hover:bg-brand-primary/90 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0 active:shadow-md"
                                        onClick={handleCheckout}
                                    >
                                        Proceed to Checkout
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
