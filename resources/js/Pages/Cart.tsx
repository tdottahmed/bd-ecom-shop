import React from "react";
import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { formatPrice } from "@/Utils/helpers";
import CartRowItem from "@/Components/Customer/CartRowItem";
import { useCartStore } from "@/Stores/useCartStore";

import { Toaster, toast } from "sonner";

const Cart = () => {
    const { cart, getCartTotal, getCartCount } = useCartStore();
    const cartItems = Object.values(cart);
    const cartTotal = getCartTotal();

    const handleCheckout = (e: React.MouseEvent) => {
        const totalCartCount = getCartCount();
        if (totalCartCount < 3) {
            e.preventDefault();
            toast.warning("You have to order at least 3 products");
            return;
        }
    };

    return (
        <CustomerLayout>
            <Head title="Cart" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8"> Shopping Cart </h1>
                {cartItems.length === 0 ? (
                    <div className="text-center">
                        <p className="text-xl mb-4"> Your cart is empty.</p>
                        <Link
                            href={route("home")}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            {cartItems.map((item) => (
                                <CartRowItem
                                    key={item.product_id}
                                    item={item}
                                />
                            ))}
                        </div>
                        <div className="lg:col-span-1">
                            <div className="bg-gray-100 p-6 rounded-lg">
                                <h2 className="text-xl font-bold mb-4">
                                    {" "}
                                    Order Summary{" "}
                                </h2>
                                <div className="flex justify-between mb-2">
                                    <span>Subtotal </span>
                                    <span className="font-semibold">
                                        {formatPrice(cartTotal)}{" "}
                                    </span>
                                </div>
                                <div className="border-t my-4"> </div>
                                <Link
                                    href={route("checkout.index")}
                                    onClick={handleCheckout}
                                    className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded hover:bg-blue-700 transition font-semibold"
                                >
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
};

export default Cart;
