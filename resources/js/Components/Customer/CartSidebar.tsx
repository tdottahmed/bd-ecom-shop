import { Link, usePage } from "@inertiajs/react";
import {
    X,
    ShoppingBag,
    ArrowRight,
    ShoppingCart,
    History,
} from "lucide-react";
import { formatPrice } from "@/Utils/helpers";
import CartSidebarItem from "./CartSidebarItem";
import OrderHistoryList from "./OrderHistoryList";

import { useCartStore } from "@/Stores/useCartStore";
import { useMemo, useState } from "react";

const CartSidebar = () => {
    const { cart, isOpen, setIsOpen, getCartTotal } = useCartStore();
    const cartItems = Object.values(cart);
    const cartTotal = getCartTotal();
    const [activeTab, setActiveTab] = useState<"cart" | "orders">("cart");

    const onClose = () => setIsOpen(false);

    const handleCheckout = () => {
        onClose();
    };

    const { props } = usePage();

    // Parse and sort rules once
    const discountRules = useMemo(() => {
        try {
            const rawRules = props.discount
                ? typeof props.discount === "string"
                    ? JSON.parse(props.discount)
                    : props.discount
                : [];

            if (!Array.isArray(rawRules)) return [];

            return rawRules
                .map((rule: any) => ({
                    qty: parseInt(rule.qty) || 0,
                    discount: parseFloat(rule.discount) || 0,
                }))
                .sort((a, b) => b.qty - a.qty);
        } catch (error) {
            console.error("Failed to parse discount rules:", error);
            return [];
        }
    }, [props.discount]);

    const getDiscount = () => {
        if (!discountRules.length) return 0;

        let totalDiscount = 0;

        cartItems.forEach((item) => {
            const applicableRule = discountRules.find(
                (rule) => item.quantity >= rule.qty,
            );

            if (applicableRule) {
                totalDiscount += item.quantity * applicableRule.discount;
            }
        });

        return totalDiscount;
    };

    const discountAmount = getDiscount();
    const finalTotal = cartTotal - discountAmount;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar/Bottom Sheet */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setActiveTab("cart")}
                                className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors relative ${
                                    activeTab === "cart"
                                        ? "text-gray-900"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                <ShoppingCart size={18} />
                                Cart({cartItems.length})
                                {activeTab === "cart" && (
                                    <span className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-gray-900" />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("orders")}
                                className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-colors relative ${
                                    activeTab === "orders"
                                        ? "text-gray-900"
                                        : "text-gray-400 hover:text-gray-600"
                                }`}
                            >
                                <History size={18} />
                                Orders
                                {activeTab === "orders" && (
                                    <span className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-gray-900" />
                                )}
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto bg-gray-50">
                        {activeTab === "cart" ? (
                            <div className="p-4 space-y-4">
                                {cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-[60vh] text-gray-500 space-y-4">
                                        <ShoppingBag
                                            size={48}
                                            className="opacity-50"
                                        />
                                        <p className="text-lg font-medium">
                                            Your cart is empty
                                        </p>
                                        <button
                                            onClick={onClose}
                                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <CartSidebarItem
                                            key={item.cart_id}
                                            item={item}
                                        />
                                    ))
                                )}
                            </div>
                        ) : (
                            <OrderHistoryList />
                        )}
                    </div>

                    {/* Footer - Only show for Cart tab */}
                    {activeTab === "cart" && cartItems.length > 0 && (
                        <div className="p-4 border-t bg-white">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-base text-gray-600">
                                        <p>Subtotal </p>
                                        <p> {formatPrice(cartTotal)} </p>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex items-center justify-between text-base text-green-600 font-medium">
                                            <p>Quantity Discount </p>
                                            <p>
                                                {" "}
                                                -
                                                {formatPrice(
                                                    discountAmount,
                                                )}{" "}
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                                        <p>Total </p>
                                        <p> {formatPrice(finalTotal)} </p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Shipping and taxes calculated at checkout.
                                </p>
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href={route("checkout.index")}
                                        className="w-full flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 text-base font-bold text-white shadow-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 active:translate-y-0 active:shadow-md"
                                        onClick={handleCheckout}
                                    >
                                        Proceed to Checkout
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CartSidebar;
