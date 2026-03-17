import React, { useState, useEffect } from "react";
import { formatPrice, getAssetUrl } from "@/Utils/helpers";
import { CartItem } from "@/types";
import { useCartStore } from "@/Stores/useCartStore";
import { X, Minus, Plus } from "lucide-react";
import Image from "../Ui/Image";

interface CartSidebarItemProps {
    item: CartItem & { cart_id: string };
}

const CartSidebarItem: React.FC<CartSidebarItemProps> = ({ item }) => {
    const { removeFromCart, updateQuantity } = useCartStore();
    const [quantity, setQuantity] = useState<number>(item.quantity ?? 1);
    const cartId = item?.cart_id;
    const isUnavailable =
        !item?.is_preorder && (Number(item?.stock) ?? 0) <= 0;

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
            <div className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm relative group hover:shadow-md transition-shadow">
            <button
                onClick={handleRemove}
                className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10 text-gray-400 hover:text-red-500 border border-gray-100"
                aria-label="Remove item"
            >
                <X size={14} />
            </button>

            <div className="w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                <Image
                    src={getAssetUrl(item?.image ?? null)}
                    alt={item?.name ?? ""}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 leading-tight">
                            {item?.name ?? "Product"}
                        </h4>
                        <div className="text-right shrink-0">
                            {(item?.original_price ?? 0) > (Number(item?.price) ?? 0) && (
                                <div className="text-[10px] text-gray-400 line-through mb-0.5">
                                    {formatPrice(
                                        (Number(item?.original_price) || 0) * (Number(item?.quantity) || 0)
                                    )}
                                </div>
                            )}
                            <div className="font-bold text-gray-900 text-sm whitespace-nowrap">
                                {formatPrice(
                                    (Number(item?.price) || 0) * (Number(item?.quantity) || 0)
                                )}
                            </div>
                        </div>
                    </div>

                    {isUnavailable && (
                        <p className="text-xs text-amber-600 font-medium mt-1">
                            No longer available — remove from cart
                        </p>
                    )}

                    {item?.variations && item.variations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                            {item.variations.map((variation, index) => (
                                <span
                                    key={variation?.id ?? index}
                                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-600 border border-gray-200"
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
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="text-xs text-gray-500 font-medium">
                        {formatPrice(item?.price ?? 0)}{" "}
                        <span className="text-gray-400"> x </span> {quantity}
                    </div>

                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-7">
                        <button
                            onClick={() => handleQuantityChange(quantity - 1)}
                            className={`w-7 h-full flex items-center justify-center rounded-l-lg transition-colors border-r border-gray-200 ${
                                !isUnavailable &&
                                quantity <= 1
                                    ? "text-gray-300 cursor-not-allowed"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white"
                            }`}
                            disabled={
                                !isUnavailable &&
                                quantity <= 1
                            }
                        >
                            <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-gray-900">
                            {quantity}
                        </span>
                        <button
                            onClick={() => handleQuantityChange(quantity + 1)}
                            className="w-7 h-full flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-white rounded-r-lg transition-colors border-l border-gray-200"
                            disabled={
                                !item?.is_preorder &&
                                quantity >= (Number(item?.stock) ?? 0)
                            }
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
