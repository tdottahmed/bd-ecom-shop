import React from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import { CartItem } from "@/types";
import QuantitySelector from "@/Components/Ui/QuantitySelector";
import { formatPrice, getAssetUrl } from "@/Utils/helpers";

interface CheckoutItemProps {
    item: CartItem;
    onRemove: (e: React.MouseEvent, id: string) => void;
    onQuantityChange: (
        id: string,
        newQuantity: number,
        e?: React.MouseEvent,
    ) => void;
}

export default function CheckoutItem({
    item,
    onRemove,
    onQuantityChange,
}: CheckoutItemProps) {
    return (
        <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
            {/* Image */}
            <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0">
                {item.image ? (
                    <img
                        src={getAssetUrl(item.image)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag size={24} />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <div className="flex justify-start flex-col flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                            {item.name}
                        </h3>
                        {item.variations && item.variations.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1.5">
                                {item.variations.map((v, idx) => (
                                    <div
                                        key={v.id || idx}
                                        className="inline-flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200"
                                    >
                                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                            {v.attribute?.name ||
                                                v.product_attribute?.name ||
                                                "Option"}
                                            :
                                        </span>
                                        <span className="text-xs font-bold text-gray-900">
                                            {v.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={(e) => onRemove(e, item.cart_id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="flex justify-between items-end mt-2">
                    {/* Quantity Controls */}
                    <QuantitySelector
                        quantity={item.quantity}
                        onDecrease={() =>
                            onQuantityChange(item.cart_id, item.quantity - 1)
                        }
                        onIncrease={() =>
                            onQuantityChange(item.cart_id, item.quantity + 1)
                        }
                        min={1}
                        max={item.is_preorder ? undefined : item.stock}
                        size="sm"
                    />

                    <div className="text-right shrink-0">
                        {(item.original_price ?? 0) > (item.price ?? 0) && (
                            <div className="text-xs text-gray-400 line-through mb-0.5">
                                {formatPrice((item.original_price ?? 0) * item.quantity)}
                            </div>
                        )}
                        <div className="text-sm font-bold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                            <div className="text-xs text-gray-500">
                                {formatPrice(item.price)} / unit
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
