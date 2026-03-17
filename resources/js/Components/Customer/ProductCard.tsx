import React from "react";
import { Link } from "@inertiajs/react";
import { ShoppingCart, Trash2, Check } from "lucide-react";
import { getAssetUrl, isNewProduct, formatPrice } from "@/Utils/helpers";
import { Product } from "@/types";
import Image from "../Ui/Image";
import { useCartStore } from "@/Stores/useCartStore";
import { useDebounce } from "@/Hooks/useDebounce";
import QuantitySelector from "../Ui/QuantitySelector";
import ProductVariationModal from "./ProductVariationModal";
interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { cart, addToCart, removeFromCart, updateQuantity } = useCartStore();

    const hasVariations =
        product.product_variations && product.product_variations.length > 0;

    // For simple products, we use product.id as the key.
    // For variable products, keys are complex so we don't show inline controls here.
    const cartKey = String(product.id);
    const cartItem = cart[cartKey];

    // Only consider "isInCart" for simple products to show inline controls
    const isInCart = !hasVariations && !!cartItem;

    const [quantity, setQuantity] = React.useState(cartItem?.quantity || 0);
    const [showVariationModal, setShowVariationModal] = React.useState(false);
    const debouncedQuantity = useDebounce(quantity, 300);

    React.useEffect(() => {
        setQuantity(cartItem?.quantity || 0);
    }, [cartItem?.quantity]);

    React.useEffect(() => {
        if (
            !hasVariations &&
            debouncedQuantity > 0 &&
            cartItem &&
            debouncedQuantity !== cartItem.quantity
        ) {
            updateQuantity(cartKey, debouncedQuantity);
        }
    }, [debouncedQuantity, updateQuantity, cartKey, hasVariations]);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (hasVariations) {
            setShowVariationModal(true);
        } else {
            addToCart(product, 1);
        }
    };

    const handleVariationAddToCart = (variations: any[], quantity: number) => {
        addToCart(product, quantity, variations);
    };

    const handleUpdateQuantity = (newQuantity: number) => {
        if (newQuantity < 1) return;
        setQuantity(newQuantity);
    };

    const handleRemoveFromCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!hasVariations) {
            removeFromCart(cartKey);
        }
    };

    return (
        <div className="group bg-white rounded-xl border border-gray-300 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full relative">
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex gap-2">
                {product.stock > 0 ? (
                    <span className="bg-green-300 text-green-900 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <Check size={10} strokeWidth={4} />
                        In Stock
                    </span>
                ) : product.is_preorder ? (
                    <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-1 rounded-md">
                        Pre Order
                    </span>
                ) : (
                    <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-md">
                        Out of Stock
                    </span>
                )}
            </div>

            {/* NEW Badge - Show if created within last 30 days */}
            {isNewProduct(product.created_at) && (
                <div className="absolute top-3 right-3 z-10">
                    <span className="bg-cyan-300 text-cyan-900 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3"
                        >
                            <path
                                d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                                fill="currentColor"
                            />
                        </svg>
                        NEW
                    </span>
                </div>
            )}

            {/* Image Container */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <Link href={route("products.show", product.slug)}>
                    <Image
                        src={getAssetUrl(product.images?.[0])}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </Link>
            </div>

            {/* Content */}
            <div className="p-1 md:p-4 flex-1 flex flex-col">
                <Link
                    href={route("products.show", product.slug)}
                    className="block mb-1"
                >
                    <h3 className="text-sm font-medium text-gray-900 px-2 line-clamp-2 min-h-[40px]">
                        {product.name}
                    </h3>
                </Link>
                <div className="mb-2 md:mb-4 px-2">
                    <div className="flex flex-wrap items-baseline gap-2">
                        {(() => {
                            const hasDiscount =
                                product.discounted_sale_price != null &&
                                Number(product.discounted_sale_price) < Number(product.sale_price);
                            if (
                                product.product_variations &&
                                product.product_variations.length > 0
                            ) {
                                const prices = product.product_variations
                                    .map((v) =>
                                        v.price
                                            ? parseFloat(String(v.price))
                                            : 0,
                                    )
                                    .filter((p) => p > 0);

                                if (prices.length > 0) {
                                    const minPrice = Math.min(...prices);
                                    const maxPrice = Math.max(...prices);
                                    const rangeStr =
                                        minPrice !== maxPrice
                                            ? `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
                                            : formatPrice(minPrice);
                                    return (
                                        <span className="text-l font-bold text-gray-900">
                                            {rangeStr}
                                        </span>
                                    );
                                }
                            }
                            const effectivePrice = hasDiscount
                                ? Number(product.discounted_sale_price)
                                : product.sale_price;
                            return (
                                <>
                                    {hasDiscount && (
                                        <span className="text-sm text-gray-500 line-through">
                                            {formatPrice(product.sale_price)}
                                        </span>
                                    )}
                                    <span className="text-l font-bold text-gray-900">
                                        {formatPrice(effectivePrice)}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-xs font-semibold text-green-600">
                                            Sale
                                        </span>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>

                <div className="mt-auto">
                    {isInCart ? (
                        <div className="flex items-center justify-between border-solid border-rose-200 rounded-3xl border-2 p-2 bg-slate-100/30 text-rose-600">
                            <button
                                onClick={handleRemoveFromCart}
                                className="w-8 h-8 flex items-center justify-center rounded-full border border-rose-800 text-rose-800 hover:bg-rose-50 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>

                            <QuantitySelector
                                quantity={quantity}
                                onDecrease={() =>
                                    handleUpdateQuantity(quantity - 1)
                                }
                                onIncrease={() =>
                                    handleUpdateQuantity(quantity + 1)
                                }
                                min={1}
                                max={
                                    product.is_preorder
                                        ? undefined
                                        : product.stock
                                }
                                size="sm"
                            />
                        </div>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            disabled={
                                !product.is_preorder && product.stock <= 0
                            }
                            className={`w-full py-3 rounded-3xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-300 ${
                                product.stock > 0 || product.is_preorder
                                    ? "bg-[#1A1B2E] text-white hover:bg-[#2D2E45] shadow-lg hover:shadow-xl"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                            {product.is_preorder && product.stock <= 0
                                ? "Pre Order"
                                : hasVariations
                                  ? "Select Options"
                                  : "Add to cart"}
                        </button>
                    )}
                </div>
            </div>

            {/* Variation Modal */}
            {hasVariations && (
                <ProductVariationModal
                    isOpen={showVariationModal}
                    onClose={() => setShowVariationModal(false)}
                    product={product}
                    onAddToCart={handleVariationAddToCart}
                />
            )}
        </div>
    );
};

export default ProductCard;
