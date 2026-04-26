import React from "react";
import { Trash2, ShoppingBag, AlertTriangle } from "lucide-react";
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

function getEffectiveStock(item: CartItem): number {
    if (item.variations && item.variations.length > 0) {
        const stocks = item.variations
            .map((v) => Number(v.stock ?? item.stock))
            .filter((s) => !isNaN(s) && s >= 0);
        return stocks.length > 0 ? Math.min(...stocks) : Number(item.stock ?? 0);
    }
    return Number(item.stock ?? 0);
}

export default function CheckoutItem({
    item,
    onRemove,
    onQuantityChange,
}: CheckoutItemProps) {
    const effectiveStock = getEffectiveStock(item);
    const isUnavailable = !item.is_preorder && effectiveStock <= 0;
    const isLowStock = !item.is_preorder && !isUnavailable && effectiveStock <= 3;

    return (
        <div
            className={`flex gap-4 py-4 border-b border-gray-100 last:border-0 ${
                isUnavailable ? "opacity-75" : ""
            }`}
        >
            {/* Image */}
            <div
                className={`w-16 h-16 rounded-lg border overflow-hidden flex-shrink-0 relative ${
                    isUnavailable ? "bg-rose-50 border-rose-200" : "bg-gray-50 border-gray-200"
                }`}
            >
                {item.image ? (
                    <img
                        src={getAssetUrl(item.image)}
                        alt={item.name}
                        className={`w-full h-full object-cover ${isUnavailable ? "grayscale opacity-60" : ""}`}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ShoppingBag size={24} />
                    </div>
                )}
                {isUnavailable && (
                    <div className="absolute inset-0 flex items-center justify-center bg-rose-50/60">
                        <AlertTriangle size={16} className="text-rose-400" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <div className="flex justify-start flex-col flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                            <h3
                                className={`text-sm font-semibold line-clamp-2 flex-1 ${
                                    isUnavailable ? "text-gray-400" : "text-gray-900"
                                }`}
                            >
                                {item.name}
                            </h3>
                            {(item.original_price ?? 0) > (item.price ?? 0) && (
                                <span className="shrink-0 bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    SALE
                                </span>
                            )}
                        </div>
                        {item.variations && item.variations.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                {item.variations.map((v, idx) => (
                                    <div
                                        key={v.id || idx}
                                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border ${
                                            isUnavailable
                                                ? "bg-rose-50 border-rose-200 text-rose-400"
                                                : "bg-gray-50 border-gray-200"
                                        }`}
                                    >
                                        <span
                                            className={`text-xs font-semibold uppercase tracking-wider ${
                                                isUnavailable ? "text-rose-400" : "text-gray-500"
                                            }`}
                                        >
                                            {v.attribute?.name ||
                                                v.product_attribute?.name ||
                                                "Option"}
                                            :
                                        </span>
                                        <span
                                            className={`text-xs font-bold ${
                                                isUnavailable ? "text-rose-400" : "text-gray-900"
                                            }`}
                                        >
                                            {v.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Stock status messages */}
                        {isUnavailable && (
                            <p className="text-[11px] text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                                <AlertTriangle size={11} />
                                Out of stock — please remove before placing order
                            </p>
                        )}
                        {isLowStock && (
                            <p className="text-[11px] text-amber-600 font-semibold mt-1.5">
                                Only {effectiveStock} left in stock
                            </p>
                        )}
                    </div>
                    <button
                        onClick={(e) => onRemove(e, item.cart_id)}
                        className="text-gray-400 hover:text-rose-500 transition-colors p-1 shrink-0"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                <div className="flex justify-between items-end mt-2">
                    <QuantitySelector
                        quantity={item.quantity}
                        onDecrease={() =>
                            onQuantityChange(item.cart_id, item.quantity - 1)
                        }
                        onIncrease={() =>
                            onQuantityChange(item.cart_id, item.quantity + 1)
                        }
                        min={1}
                        max={item.is_preorder ? undefined : effectiveStock}
                        size="sm"
                        disabled={isUnavailable}
                    />

                    <div className="text-right shrink-0">
                        {(item.original_price ?? 0) > (item.price ?? 0) && (
                            <div className="text-xs text-gray-400 line-through mb-0.5">
                                {formatPrice((item.original_price ?? 0) * item.quantity)}
                            </div>
                        )}
                        <div className={`text-sm font-bold ${isUnavailable ? "text-gray-400" : "text-gray-900"}`}>
                            {formatPrice(item.price * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                            <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                                {(item.original_price ?? 0) > (item.price ?? 0) && (
                                    <span className="line-through text-gray-400">{formatPrice(item.original_price ?? 0)}</span>
                                )}
                                {formatPrice(item.price)} / unit
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
