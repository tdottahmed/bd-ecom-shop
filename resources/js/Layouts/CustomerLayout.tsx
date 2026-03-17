import React, { useState, ReactNode } from "react";
import { Head, usePage } from "@inertiajs/react";
import { ShoppingBag } from "lucide-react";
import Header from "@/Components/Customer/Header";
import CartSidebar from "@/Components/Customer/CartSidebar";
import CategorySidebar from "@/Components/Customer/CategorySidebar";
import Preloader from "@/Components/Utility/Preloader";
import Footer from "@/Components/Customer/Footer";

import { useCartStore } from "@/Stores/useCartStore";

import { Toaster } from "sonner";

interface CustomerLayoutProps {
    children: ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
    const { setIsOpen, getCartCount } = useCartStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartItemCount = getCartCount();

    const { url, component } = usePage();
    const isCheckoutPage = url.includes("/checkout");

    React.useEffect(() => {
        const handleOpenCart = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            }
        };
        window.addEventListener("open-cart", handleOpenCart);
        return () => window.removeEventListener("open-cart", handleOpenCart);
    }, [setIsOpen]);

    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            <Toaster position="top-center" richColors />

            <Header onMenuClick={() => setIsMenuOpen(true)} />

            <CategorySidebar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <main> {children} </main>

            {/* Floating Cart Button for Mobile */}
            {cartItemCount > 0 && !isCheckoutPage && (
                <div className="fixed bottom-6 right-6 z-40 md:hidden">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-[#1A1B2E] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 hover:bg-[#2D2E45] transition-colors"
                    >
                        <div className="relative">
                            <ShoppingBag size={20} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </div>
                        <span className="font-bold text-sm"> View Cart </span>
                    </button>
                </div>
            )}

            <Footer />

            <CartSidebar />
        </div>
    );
};

export default CustomerLayout;
