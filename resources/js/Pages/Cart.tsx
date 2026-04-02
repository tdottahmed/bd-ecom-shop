import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { formatPrice } from "@/Utils/helpers";
import CartRowItem from "@/Components/Customer/CartRowItem";
import { useCartStore } from "@/Stores/useCartStore";
import { toast } from "sonner";
import { ShoppingBag, ArrowRight, Package } from "lucide-react";

const MIN_ITEMS_FOR_CHECKOUT = 3;

const Cart = () => {
    const { cart, getCartTotal, getCartCount, clearCart } = useCartStore();
    const cartItems = Object.values(cart);
    const cartTotal = getCartTotal();
    const itemCount = getCartCount();
    const meetsMinimum = itemCount >= MIN_ITEMS_FOR_CHECKOUT;
    const hasUnavailable = cartItems.some(
        (i) => !i.is_preorder && (Number(i.stock) ?? 0) <= 0,
    );

    const goToCheckout = () => {
        if (!meetsMinimum) {
            toast.warning(
                `Add at least ${MIN_ITEMS_FOR_CHECKOUT} items (total quantity) to checkout.`,
            );
            return;
        }
        if (hasUnavailable) {
            toast.error("Remove out-of-stock items before checkout.");
            return;
        }
        router.visit(route("checkout.index"));
    };

    return (
        <CustomerLayout>
            <Head title="Shopping cart" />
            <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
                                Your cart
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {cartItems.length === 0
                                    ? "No items yet"
                                    : `${itemCount} item${itemCount !== 1 ? "s" : ""} · ${cartItems.length} product line${cartItems.length !== 1 ? "s" : ""}`}
                            </p>
                        </div>
                        {cartItems.length > 0 && (
                            <Link
                                href={route("products.index")}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 underline underline-offset-2 w-fit"
                            >
                                Continue shopping
                            </Link>
                        )}
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 sm:p-14 text-center">
                            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                                <ShoppingBag
                                    className="w-8 h-8 text-gray-400"
                                    strokeWidth={1.5}
                                />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                                Your cart is empty
                            </h2>
                            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
                                Browse the store and add products — your
                                selections will appear here.
                            </p>
                            <Link
                                href={route("products.index")}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white px-6 py-3 text-sm font-semibold hover:bg-black transition-colors"
                            >
                                <Package className="w-4 h-4" />
                                Shop products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            <div className="lg:col-span-8 space-y-4">
                                {hasUnavailable && (
                                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                                        Some items are out of stock. Remove
                                        them to proceed to checkout.
                                    </div>
                                )}
                                {cartItems.map((item) => (
                                    <CartRowItem
                                        key={item.cart_id}
                                        item={item}
                                    />
                                ))}
                                <div className="flex justify-end pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (
                                                confirm(
                                                    "Clear all items from your cart?",
                                                )
                                            ) {
                                                clearCart();
                                                toast.success("Cart cleared");
                                            }
                                        }}
                                        className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors"
                                    >
                                        Clear cart
                                    </button>
                                </div>
                            </div>

                            <div className="lg:col-span-4 lg:sticky lg:top-24">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Order summary
                                    </h2>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span className="font-medium text-gray-900 tabular-nums">
                                                {formatPrice(cartTotal)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            Shipping is calculated at checkout.
                                        </p>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4">
                                        <div className="flex justify-between items-baseline mb-4">
                                            <span className="font-semibold text-gray-900">
                                                Estimated total
                                            </span>
                                            <span className="text-xl font-bold text-gray-900 tabular-nums">
                                                {formatPrice(cartTotal)}
                                            </span>
                                        </div>
                                        {!meetsMinimum && (
                                            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mb-4">
                                                Minimum {MIN_ITEMS_FOR_CHECKOUT}{" "}
                                                items (total quantity) required
                                                for checkout. You have{" "}
                                                {itemCount}.
                                            </p>
                                        )}
                                        <button
                                            type="button"
                                            onClick={goToCheckout}
                                            disabled={
                                                !meetsMinimum || hasUnavailable
                                            }
                                            className="w-full flex items-center justify-center gap-2 rounded-full bg-gray-900 text-white py-3.5 text-sm font-semibold hover:bg-black transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
                                        >
                                            Proceed to checkout
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                        <p className="text-xs text-center text-gray-400 mt-3">
                                            Secure checkout · You can review
                                            everything before paying
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Cart;
