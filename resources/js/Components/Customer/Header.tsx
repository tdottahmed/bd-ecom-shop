import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, ChevronDown } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

import Logo from "./Header/Logo";
import MobileMenuButton from "./Header/MobileMenuButton";
import MessengerIcon from "./Header/MessengerIcon";
import CartIcon from "./Header/CartIcon";
import SearchToggle from "./Header/SearchToggle";
import SearchAutocomplete from "./SearchAutocomplete";
import DesktopNav from "./Header/DesktopNav";
import { useCartStore } from "@/Stores/useCartStore";
import Image from "@/Components/Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";

interface HeaderProps {
    onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const { setIsOpen, getCartCount } = useCartStore();
    const cartCount = getCartCount();
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const {
        auth,
        messengerLink,
        categories,
        navCategories,
        brands,
        navBrands,
    }: any = usePage().props;
    const menuCategories = navCategories ?? categories ?? [];
    const menuBrands = navBrands ?? brands ?? [];

    const [openDropdown, setOpenDropdown] = useState<
        "categories" | "brands" | null
    >(null);
    // There are two desktop nav variants (lg+ integrated row, and md+ second row).
    // Both exist in the DOM (one is just hidden by CSS), so we must not reuse
    // a single ref for outside-click detection (it would get overwritten).
    const dropdownRefLg = useRef<HTMLDivElement | null>(null);
    const dropdownRefMd = useRef<HTMLDivElement | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleDocClick = (e: MouseEvent) => {
            const target = e.target as Node | null;
            if (!target) return;

            const inLg =
                !!dropdownRefLg.current &&
                dropdownRefLg.current.contains(target);
            const inMd =
                !!dropdownRefMd.current &&
                dropdownRefMd.current.contains(target);

            if (!inLg && !inMd) {
                setOpenDropdown(null);
            }
        };

        // Close only when the user actually clicks outside.
        // Using `mousedown` can cause the dropdown to disappear on some trackpad/mouse interactions
        // while the user is trying to hover/select the dropdown items.
        document.addEventListener("click", handleDocClick);
        return () => {
            document.removeEventListener("click", handleDocClick);
        };
    }, []);

    useEffect(() => {
        const onScroll = () => {
            setIsScrolled(window.scrollY > 8);
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const featuredCategories = menuCategories.slice(0, 8);
    const featuredBrands = menuBrands.slice(0, 8);

    const onCartClick = () => {
        setIsOpen(true);
    };

    return (
        <>
            <header
                className={`sticky top-0 z-50 border-b border-gray-100 transition-all duration-200 ${
                    isScrolled
                        ? "bg-white/90 backdrop-blur shadow-sm"
                        : "bg-white"
                }`}
            >
                <div className="bg-white border-b border-gray-100 shadow-sm">
                    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16 relative">
                            {/* Mobile Left: Menu & Logo */}
                            <div className="flex items-center gap-2 md:hidden relative z-10">
                                <MobileMenuButton onClick={onMenuClick} />
                                <Logo />
                            </div>

                            {/* Desktop Left: Logo & Messenger */}
                            <div className="hidden md:flex items-center gap-4">
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


                            {/* Desktop Navigation (lg+) - single-row header */}
                            <div className="hidden lg:flex flex-1 items-center justify-center">
                                <div
                                    ref={dropdownRefLg}
                                    className="flex items-center gap-1 whitespace-nowrap"
                                >
                                    <DesktopNav
                                        categories={menuCategories}
                                        featuredCategories={featuredCategories}
                                        brands={menuBrands}
                                        featuredBrands={featuredBrands}
                                        openDropdown={openDropdown}
                                        setOpenDropdown={setOpenDropdown}
                                    />
                                </div>
                            </div>

                            {/* Desktop Search (Center) - md only (lg+ moves search to the right) */}
                            <div className="hidden md:flex flex-1 max-w-2xl lg:hidden">
                                <SearchAutocomplete />
                            </div>

                            {/* Mobile Right: Search, Login & Cart */}
                            <div className="flex items-center gap-2 md:hidden relative z-10">
                                <SearchToggle
                                    onClick={() => setIsMobileSearchOpen(true)}
                                />
                                <button
                                    onClick={onCartClick}
                                    className="p-2 text-gray-800 hover:text-gray-900 transition-colors"
                                >
                                    <CartIcon count={cartCount} />
                                </button>
                            </div>

                            {/* Desktop Right: Login & Cart */}
                            <div className="hidden md:flex items-center gap-2 sm:gap-4">
                                <div className="hidden lg:block w-[320px]">
                                    <SearchAutocomplete />
                                </div>
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
                </div>

                {/* Desktop navigation row (md+) */}
                <div className="hidden md:flex lg:hidden bg-white/95 backdrop-blur border-t border-gray-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 transition-all duration-200">
                    <div
                        ref={dropdownRefMd}
                        className="flex items-center gap-1 w-full"
                    >
                        <DesktopNav
                            categories={menuCategories}
                            featuredCategories={featuredCategories}
                            brands={menuBrands}
                            featuredBrands={featuredBrands}
                            openDropdown={openDropdown}
                            setOpenDropdown={setOpenDropdown}
                            isMdRow={true}
                        />
                    </div>
                </div>

                {/* Mobile Search Modal */}
                {isMobileSearchOpen && (
                    <div className="fixed inset-0 z-50 md:hidden search-backdrop-in">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsMobileSearchOpen(false)}
                        />

                        {/* Slide-down panel */}
                        <div className="absolute top-0 left-0 right-0 bg-white shadow-2xl rounded-b-2xl search-panel-in">
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className="flex-1">
                                    <SearchAutocomplete
                                        isMobile={true}
                                        onClose={() =>
                                            setIsMobileSearchOpen(false)
                                        }
                                    />
                                </div>
                                <button
                                    onClick={() => setIsMobileSearchOpen(false)}
                                    className="flex-shrink-0 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors px-1 py-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        </>
    );
};

export default Header;
