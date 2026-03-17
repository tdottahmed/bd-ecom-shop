import React, { useState } from "react";
import { User, MessageCircle, X, Menu, LogIn } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

import Logo from "./Header/Logo";
import MobileMenuButton from "./Header/MobileMenuButton";
import MessengerIcon from "./Header/MessengerIcon";
import CartIcon from "./Header/CartIcon";
import SearchToggle from "./Header/SearchToggle";
import SearchAutocomplete from "./SearchAutocomplete";
import { useCartStore } from "@/Stores/useCartStore";

interface HeaderProps {
    onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const { setIsOpen, getCartCount } = useCartStore();
    const cartCount = getCartCount();
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const { auth, messengerLink }: any = usePage().props;
    const isAuthenticated = !!auth?.user;

    const onCartClick = () => {
        setIsOpen(true);
    };

    return (
        <>
            <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 relative">
                        {/* Mobile Left: Menu & Messenger */}
                        <div className="flex items-center gap-2 md:hidden">
                            <MobileMenuButton onClick={onMenuClick} />
                            {messengerLink && <MessengerIcon />}
                        </div>

                        {/* Desktop Left: Menu & Logo */}
                        <div className="hidden md:flex items-center gap-4">
                            <button
                                onClick={onMenuClick}
                                className="p-2 -ml-2 rounded-md text-gray-600 hover:text-gray-900"
                            >
                                <Menu size={24} />
                            </button>
                            {messengerLink && (
                                <a
                                    href={messengerLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Messenger"
                                >
                                    <MessageCircle size={20} />
                                </a>
                            )}
                            <Logo />
                        </div>

                        {/* Mobile Logo (Centered) */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 md:hidden">
                            <Logo />
                        </div>

                        {/* Desktop Search (Center) */}
                        <div className="hidden md:flex flex-1 max-w-2xl">
                            <SearchAutocomplete />
                        </div>

                        {/* Mobile Right: Search, Login & Cart */}
                        <div className="flex items-center gap-2 md:hidden">
                            <SearchToggle
                                onClick={() => setIsMobileSearchOpen(true)}
                            />
                            {!isAuthenticated && (
                                <Link
                                    href={route("login")}
                                    className="p-2 text-gray-800 hover:text-gray-900 transition-colors"
                                >
                                    <LogIn size={20} />
                                </Link>
                            )}
                            <button
                                onClick={onCartClick}
                                className="p-2 text-gray-800 hover:text-gray-900 transition-colors"
                            >
                                <CartIcon count={cartCount} />
                            </button>
                        </div>

                        {/* Desktop Right: Login & Cart */}
                        <div className="hidden md:flex items-center gap-2 sm:gap-4">
                            {!isAuthenticated && (
                                <Link
                                    href={route("login")}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <LogIn size={18} />
                                    <span className="text-sm font-medium">
                                        Login
                                    </span>
                                </Link>
                            )}
                            <button
                                onClick={onCartClick}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                            >
                                <span className="hidden sm:inline text-sm font-medium">
                                    Cart
                                </span>
                                <CartIcon
                                    count={cartCount}
                                    className="text-white"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Modal */}
                {isMobileSearchOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setIsMobileSearchOpen(false)}
                        />

                        {/* Modal Content */}
                        <div className="absolute top-0 left-0 right-0 bg-white shadow-lg flex flex-col">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <SearchAutocomplete
                                            isMobile={true}
                                            onClose={() =>
                                                setIsMobileSearchOpen(false)
                                            }
                                        />
                                    </div>
                                    <button
                                        onClick={() =>
                                            setIsMobileSearchOpen(false)
                                        }
                                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;
