import React, { useState, useEffect } from "react";
import { formatPrice, getAssetUrl } from "@/Utils/helpers";
import { CartItem } from "@/types";
import { useDebounce } from "@/Hooks/useDebounce";
import { useCartStore } from "@/Stores/useCartStore";
import { Trash2 } from "lucide-react";
import Image from "@/Components/Ui/Image";

interface CartRowItemProps {
    item: CartItem & { cart_id: string };
}

const CartRowItem: React.FC<CartRowItemProps> = ({ item }) => {
    const { updateQuantity, removeFromCart } = useCartStore();
    const cartId = item.cart_id;
    const [quantity, setQuantity] = useState(item.quantity);
    const debouncedQuantity = useDebounce(quantity, 400);

    const isUnavailable =
        !item.is_preorder && (Number(item.stock) ?? 0) <= 0;
    const maxQty = item.is_preorder
        ? 999
        : Math.max(1, Number(item.stock) ?? 1);

    useEffect(() => {
        setQuantity(item.quantity);
    }, [item.quantity]);

    useEffect(() => {
        if (
            debouncedQuantity !== item.quantity &&
            debouncedQuantity >= 1 &&
            cartId
        ) {
            updateQuantity(cartId, debouncedQuantity);
        }
    }, [
        debouncedQuantity,
        item.quantity,
        updateQuantity,
        cartId,
    ]);

    const handleQuantityChange = (next: number) => {
        if (next < 1) return;
        if (!item.is_preorder && next > maxQty) return;
        setQuantity(next);
    };

    const lineTotal = (Number(item.price) || 0) * quantity;

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex gap-4 flex-1 min-w-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-200">
                    <Image
                        src={getAssetUrl(item.image ?? null)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 text-base leading-snug">
                            {item.name}
                        </h3>
                        {isUnavailable && (
                            <p className="text-xs text-brand-primary font-medium mt-1">
                                Out of stock — remove to continue
                            </p>
                        )}
                        {item.variations && item.variations.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {item.variations.map((v, i) => (
                                    <span
                                        key={v.id ?? i}
                                        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-gray-50 text-gray-600 border border-gray-200"
                                    >
                                        <span className="font-medium text-gray-500 mr-1">
                                            {v.product_attribute?.name ||
                                                v.attribute?.name ||
                                                "Option"}
                                            :
                                        </span>
                                        {v.value}
                                    </span>
                                ))}
                            </div>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                            {formatPrice(item.price)} each
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 border-t sm:border-t-0 border-gray-100 pt-4 sm:pt-0">
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 h-10">
                    <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-white rounded-l-xl border-r border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-gray-900 tabular-nums">
                        {quantity}
                    </span>
                    <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={!item.is_preorder && quantity >= maxQty}
                        className="w-10 h-full flex items-center justify-center text-gray-600 hover:bg-white rounded-r-xl border-l border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>

                <div className="text-right min-w-[5.5rem]">
                    {(item.original_price ?? 0) > (Number(item.price) ?? 0) && (
                        <p className="text-xs text-gray-400 line-through">
                            {formatPrice(
                                (Number(item.original_price) || 0) * quantity,
                            )}
                        </p>
                    )}
                    <p className="text-lg font-bold text-gray-900 tabular-nums">
                        {formatPrice(lineTotal)}
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => removeFromCart(cartId)}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-brand-primary hover:bg-brand-bg transition-colors"
                    aria-label="Remove from cart"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default CartRowItem;
