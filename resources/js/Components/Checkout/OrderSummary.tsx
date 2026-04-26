import React from "react";
import { CartItem } from "@/types";
import { formatPrice } from "@/Utils/helpers";
import CheckoutItem from "./CheckoutItem";

export interface OrderSummaryProps {
    cartItems: CartItem[];
    cartTotal: number;
    deliveryCost: number;
    productSavings?: number;
    discountAmount?: number;
    total: number;
    processing: boolean;
    paymentMethod?: string;
    onRemoveItem: (e: React.MouseEvent, id: string) => void;
    onQuantityChange: (
        id: string,
        newQuantity: number,
        e?: React.MouseEvent
    ) => void;
}

const PAYMENT_LABELS: Record<string, string> = {
    cod: "Place order",
    bkash: "Pay with bKash",
    nagad: "Pay with Nagad",
    sslcommerz: "Pay with SSLCommerz",
    shurjopay: "Pay with ShurjoPay",
    aamarpay: "Pay with aamarPay",
};

const OrderSummary: React.FC<OrderSummaryProps> = ({
    cartItems,
    cartTotal,
    deliveryCost,
    productSavings = 0,
    discountAmount = 0,
    total,
    processing,
    paymentMethod = "cod",
    onRemoveItem,
    onQuantityChange,
}) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Your order</h2>
                <div className="text-sm text-gray-500">
                    Items: <span className="font-medium text-gray-900">{cartItems.length}</span>
                    {" · "}
                    Qty: <span className="font-medium text-gray-900">
                        {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                </div>
            </div>

            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                    <CheckoutItem
                        key={item.cart_id}
                        item={item}
                        onRemove={onRemoveItem}
                        onQuantityChange={onQuantityChange}
                    />
                ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Product total</span>
                    <span className="font-semibold text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className="font-semibold text-gray-900">{formatPrice(deliveryCost)}</span>
                </div>
                {productSavings > 0 && (
                    <div className="flex justify-between text-sm text-amber-700 font-medium bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"/></svg>
                            Discount savings
                        </span>
                        <span className="font-bold">-{formatPrice(productSavings)}</span>
                    </div>
                )}
                {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-emerald-600 font-medium bg-emerald-50/80 rounded-lg px-3 py-2">
                        <span>Quantity discount</span>
                        <span>-{formatPrice(discountAmount)}</span>
                    </div>
                )}
                {(productSavings > 0 || discountAmount > 0) && (
                    <div className="text-xs text-center text-amber-700 font-semibold bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                        You save {formatPrice(productSavings + discountAmount)} on this order!
                    </div>
                )}

                <div className="pt-4 mt-2 border-t border-gray-100">
                    <div className="flex justify-between items-end">
                        <span className="text-base font-bold text-gray-900">Final total</span>
                        <span className="text-2xl font-bold text-gray-900">{formatPrice(total)}</span>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                form="checkout-form"
                disabled={processing}
                className="w-full mt-6 bg-[#1A1A1A] text-white font-bold py-4 rounded-xl hover:bg-gray-900 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-200"
            >
                {processing ? (
                    <>
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        {PAYMENT_LABELS[paymentMethod] ?? "Place order"}
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </>
                )}
            </button>
        </div>
    );
};

export default OrderSummary;
