import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Order } from "@/types";
import { XCircle, RefreshCw, ShoppingBag, HeadphonesIcon } from "lucide-react";
import { formatPrice } from "@/Utils/helpers";

interface Props {
    order?: Order | null;
}

const PAYMENT_LABELS: Record<string, string> = {
    bkash:      "bKash",
    sslcommerz: "SSLCommerz",
    nagad:      "Nagad",
    shurjopay:  "ShurjoPay",
    aamarpay:   "aamarPay",
};

export default function PaymentFailed({ order }: Props) {
    return (
        <CustomerLayout>
            <Head title="Payment Failed" />
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 px-4 py-12">
                <div className="w-full max-w-md space-y-8">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100 animate-in zoom-in duration-500">
                            <XCircle className="h-12 w-12 text-red-500" strokeWidth={2.5} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                            Payment Failed
                        </h1>
                        <p className="text-base text-gray-500">
                            {order
                                ? "We couldn't process your payment for this order."
                                : "Something went wrong during payment processing."}
                        </p>
                    </div>

                    {/* Order details (if available) */}
                    {order && (
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                            <div className="bg-red-50 border-b border-red-100 px-6 py-4 flex items-center justify-between">
                                <span className="text-sm font-medium text-red-700">Order Reference</span>
                                <span className="font-mono font-bold text-red-700">#{order.id}</span>
                            </div>
                            <div className="p-6 space-y-3">
                                {order.payment_method && order.payment_method !== 'cod' && (
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>Payment via</span>
                                        <span className="font-medium text-gray-900">
                                            {PAYMENT_LABELS[order.payment_method] ?? (order.payment_method as string)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Order amount</span>
                                    <span className="font-medium text-gray-900">{formatPrice(order.total)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span>Payment status</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                                        {order.payment_status ?? "Failed"}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                                    Your order is saved. You can retry payment or contact support with the order reference above.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                        {/* Retry — go back to checkout */}
                        <Link
                            href={route('checkout.index')}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-4 text-sm font-bold text-white hover:bg-gray-800 transition-all duration-200 shadow-md"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </Link>

                        <Link
                            href={route('home')}
                            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                            <ShoppingBag size={18} />
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Support note */}
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-800">
                        <HeadphonesIcon size={18} className="flex-shrink-0 text-amber-600" />
                        <span>
                            If you were charged but the order failed, please contact our support with your order reference.
                        </span>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
