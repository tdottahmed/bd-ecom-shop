import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Order } from "@/types";
import { useEffect } from "react";
import { useCartStore } from "@/Stores/useCartStore";
import { CheckCircle, ShoppingBag, Receipt, CreditCard, Banknote } from "lucide-react";
import { formatPrice, addGuestOrder } from "@/Utils/helpers";

const PAYMENT_LABELS: Record<string, { label: string; color: string }> = {
    cod:        { label: "Cash on Delivery", color: "text-gray-700" },
    bkash:      { label: "bKash",            color: "text-[#e2136e]" },
    nagad:      { label: "Nagad",            color: "text-[#f37021]" },
    sslcommerz: { label: "SSLCommerz",       color: "text-[#2196f3]" },
    shurjopay:  { label: "ShurjoPay",        color: "text-[#6c3baa]" },
    aamarpay:   { label: "aamarPay",         color: "text-[#0f9d58]" },
};

interface OrderSuccessProps {
    order: Order;
}

export default function OrderSuccess({ order }: OrderSuccessProps) {
    const { clearCart } = useCartStore();

    useEffect(() => {
        // Save order to history with reliable cookie management
        // This will add the order and refresh cookie expiration to 2 years
        addGuestOrder(order.id);
        clearCart();
    }, [order.id]);

    return (
        <CustomerLayout>
            <Head title="Order Success" />
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    {/* Success Animation/Header */}
                    <div className="text-center space-y-4">
                        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 animate-in zoom-in duration-500">
                            <CheckCircle
                                className="h-12 w-12 text-green-600"
                                strokeWidth={3}
                            />
                        </div>
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl tracking-tight">
                            Order Placed!
                        </h1>
                        <p className="text-lg text-gray-600">
                            Thank you for your purchase.Your order has been
                            received.
                        </p>
                    </div>

                    {/* Order Receipt Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all hover:shadow-2xl duration-300">
                        <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/90">
                                <Receipt size={20} />
                                <span className="font-medium">Receipt</span>
                            </div>
                            <span className="text-white font-mono font-bold">#{order.id}</span>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                <span className="text-gray-600 text-sm">Order status</span>
                                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-yellow-100 text-yellow-800">
                                    {order.status}
                                </span>
                            </div>

                            {/* Payment method row */}
                            {(order as any).payment_method && (
                                <div className="flex justify-between items-center text-sm text-gray-600">
                                    <span className="flex items-center gap-1.5">
                                        {(order as any).payment_method === 'cod'
                                            ? <Banknote size={15} className="text-gray-500" />
                                            : <CreditCard size={15} className="text-gray-500" />
                                        }
                                        Payment
                                    </span>
                                    <span className={`font-semibold ${PAYMENT_LABELS[(order as any).payment_method]?.color ?? 'text-gray-900'}`}>
                                        {PAYMENT_LABELS[(order as any).payment_method]?.label ?? (order as any).payment_method}
                                        {(order as any).payment_status === 'paid' && (
                                            <span className="ml-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">Paid</span>
                                        )}
                                    </span>
                                </div>
                            )}

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Delivery</span>
                                    <span className="font-medium text-gray-900">{formatPrice(order.delivery_cost)}</span>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-bold text-gray-900">Total Amount</span>
                                    <span className="text-2xl font-extrabold text-indigo-600">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative jagged edge at bottom (optional, using CSS or SVG) */}
                        <div className="relative h-4 bg-white">
                            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_33.333%,#ffffff_33.333%,#ffffff_66.667%,transparent_66.667%),linear-gradient(-45deg,transparent_33.333%,#ffffff_33.333%,#ffffff_66.667%,transparent_66.667%)] bg-[length:20px_40px] bg-[position:0_-20px]">
                                {" "}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-4">
                        <Link
                            href={route("home")}
                            className="w-full group flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-base font-bold text-white shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <ShoppingBag
                                size={20}
                                className="group-hover:animate-bounce"
                            />
                            Continue Shopping
                        </Link>

                        <p className="text-center text-sm text-gray-500 mt-4">
                            A confirmation has been sent to your phone.
                        </p>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
