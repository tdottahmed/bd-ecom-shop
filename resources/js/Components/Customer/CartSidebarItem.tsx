import React, { useState, useEffect } from "react";
import { formatPrice, getAssetUrl } from "@/Utils/helpers";
import { CartItem } from "@/types";
import { useCartStore } from "@/Stores/useCartStore";
import { Trash2, Minus, Plus, AlertTriangle } from "lucide-react";
import Image from "../Ui/Image";

interface CartSidebarItemProps {
    item: CartItem & { cart_id: string };
}

function getEffectiveStock(item: CartItem): number {
    if (item.variations && item.variations.length > 0) {
        const stocks = item.variations
            .map((v) => Number(v.stock ?? item.stock))
            .filter((s) => !isNaN(s) && s >= 0);
        return stocks.length > 0 ? Math.min(...stocks) : Number(item.stock ?? 0);
    }
    return Number(item.stock ?? 0);
}

const CartSidebarItem: React.FC<CartSidebarItemProps> = ({ item }) => {
    const { removeFromCart, updateQuantity } = useCartStore();
    const [quantity, setQuantity] = useState<number>(item.quantity ?? 1);
    const cartId = item?.cart_id;

    const effectiveStock = getEffectiveStock(item);
    const isUnavailable = !item?.is_preorder && effectiveStock <= 0;
    const isLowStock = !item?.is_preorder && !isUnavailable && effectiveStock <= 3;

    useEffect(() => {
        setQuantity(item.quantity ?? 1);
    }, [item.quantity]);

    const handleUpdateQuantity = (newQuantity: number) => {
        if (!cartId) return;
        updateQuantity(cartId, newQuantity);
    };

    const handleQuantityChange = (newQuantity: number) => {
        setQuantity(newQuantity);
        handleUpdateQuantity(newQuantity);
    };

    const handleRemove = () => {
        if (cartId) removeFromCart(cartId);
    };

    return (
        <div
            className={`flex gap-4 p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow ${
                isUnavailable ? "border-rose-200 bg-rose-50/30" : "border-gray-100"
            }`}
        >
            {/* Image */}
            <div
                className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border ${
                    isUnavailable
                        ? "border-rose-200 bg-rose-50"
                        : "border-gray-200 bg-gray-50"
                } relative`}
            >
                <Image
                    src={getAssetUrl(item?.image ?? null)}
                    alt={item?.name ?? ""}
                    className={`w-full h-full object-cover ${isUnavailable ? "opacity-50 grayscale" : ""}`}
                />
                {isUnavailable && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AlertTriangle size={20} className="text-rose-400" />
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <div className="flex-1 min-w-0">
                            <h4
                                className={`font-medium text-sm line-clamp-2 leading-tight ${
                                    isUnavailable ? "text-gray-400" : "text-gray-900"
                                }`}
                            >
                                {item?.name ?? "Product"}
                            </h4>
                            {(item?.original_price ?? 0) > (Number(item?.price) ?? 0) && (
                                <span className="inline-block mt-1 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    SALE
                                </span>
                            )}
                        </div>
                        <div className="text-right shrink-0">
                            {(item?.original_price ?? 0) > (Number(item?.price) ?? 0) && (
                                <div className="text-[10px] text-gray-400 line-through mb-0.5">
                                    {formatPrice(
                                        (Number(item?.original_price) || 0) *
                                            (Number(item?.quantity) || 0),
                                    )}
                                </div>
                            )}
                            <div
                                className={`font-bold text-sm whitespace-nowrap ${
                                    isUnavailable ? "text-gray-400" : "text-gray-900"
                                }`}
                            >
                                {formatPrice(
                                    (Number(item?.price) || 0) *
                                        (Number(item?.quantity) || 0),
                                )}
                            </div>
                        </div>
                    </div>

                    {item?.variations && item.variations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.variations.map((variation, index) => (
                                <span
                                    key={variation?.id ?? index}
                                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] border ${
                                        isUnavailable
                                            ? "bg-rose-50 text-rose-400 border-rose-200"
                                            : "bg-gray-100 text-gray-600 border-gray-200"
                                    }`}
                                >
                                    <span className="font-medium mr-1">
                                        {variation?.product_attribute?.name ||
                                            variation?.attribute?.name ||
                                            "Option"}
                                        :
                                    </span>
                                    {variation?.value}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Stock status messages */}
                    {isUnavailable && (
                        <p className="text-[11px] text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block shrink-0" />
                            Out of stock — please remove
                        </p>
                    )}
                    {isLowStock && (
                        <p className="text-[11px] text-amber-600 font-semibold mt-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block shrink-0" />
                            Only {effectiveStock} left
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-500 font-medium">
                            {(item?.original_price ?? 0) > (Number(item?.price) ?? 0) && (
                                <span className="text-gray-400 line-through mr-1">
                                    {formatPrice(item.original_price ?? 0)}
                                </span>
                            )}
                            {formatPrice(item?.price ?? 0)}{" "}
                            <span className="text-gray-400"> × </span>{" "}
                            {quantity}
                        </div>
                        <button
                            onClick={handleRemove}
                            className="flex items-center justify-center w-6 h-6 rounded-md text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                            aria-label="Remove item"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>

                    <div
                        className={`flex items-center border rounded-lg h-7 ${
                            isUnavailable
                                ? "bg-gray-50 border-gray-200 opacity-50 pointer-events-none"
                                : "bg-gray-50 border-gray-200"
                        }`}
                    >
                        <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className={`w-7 h-full flex items-center justify-center rounded-l-lg transition-colors border-r border-gray-200 ${
                                quantity <= 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white"
                            }`}
                            disabled={quantity <= 1}
                        >
                            <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-gray-900">
                            {quantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className={`w-7 h-full flex items-center justify-center rounded-r-lg transition-colors border-l border-gray-200 ${
                                !item?.is_preorder && quantity >= effectiveStock
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white"
                            }`}
                            disabled={!item?.is_preorder && quantity >= effectiveStock}
                        >
                            <Plus size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartSidebarItem;
