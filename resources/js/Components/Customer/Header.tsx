import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, ChevronDown } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

import Logo from "./Header/Logo";
import MobileMenuButton from "./Header/MobileMenuButton";
import MessengerIcon from "./Header/MessengerIcon";
import CartIcon from "./Header/CartIcon";
import SearchToggle from "./Header/SearchToggle";
import SearchAutocomplete from "./SearchAutocomplete";
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
    const { auth, messengerLink, categories, brands }: any = usePage().props;

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

    const featuredCategories = (categories ?? []).slice(0, 8);
    const featuredBrands = (brands ?? []).slice(0, 8);

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
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16 relative">
                            {/* Mobile Left: Menu & Messenger */}
                            <div className="flex items-center gap-2 md:hidden relative z-10">
                                <MobileMenuButton onClick={onMenuClick} />
                                {messengerLink && <MessengerIcon />}
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

                            {/* Mobile Logo (Centered) */}
                            <div className="absolute inset-x-0 flex justify-center md:hidden pointer-events-none">
                                <div className="w-full max-w-md mx-auto pointer-events-auto">
                                    <Logo />
                                </div>
                            </div>

                            {/* Desktop Navigation (lg+) - single-row header */}
                            <div className="hidden lg:flex flex-1 items-center justify-center">
                                <div
                                    ref={dropdownRefLg}
                                    className="flex items-center gap-1 whitespace-nowrap"
                                >
                                    <Link
                                        href={route("home")}
                                        className="px-2 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href={route("products.index")}
                                        className="px-2 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                    >
                                        Products
                                    </Link>

                                    {/* Categories dropdown */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onMouseEnter={() =>
                                                setOpenDropdown("categories")
                                            }
                                            onClick={() =>
                                                setOpenDropdown((prev) =>
                                                    prev === "categories"
                                                        ? null
                                                        : "categories",
                                                )
                                            }
                                            className="px-2 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors inline-flex items-center gap-2"
                                        >
                                            Categories
                                            <ChevronDown
                                                size={16}
                                                className="text-gray-500"
                                            />
                                        </button>

                                        {openDropdown === "categories" && (
                                            <div className="absolute left-0 top-full mt-2 w-[320px] bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-50">
                                                {featuredCategories.length >
                                                0 ? (
                                                    <div className="space-y-1">
                                                        {featuredCategories.map(
                                                            (c: any) => (
                                                                <Link
                                                                    key={c.id}
                                                                    href={route(
                                                                        "products.category",
                                                                        c.slug,
                                                                    )}
                                                                    onClick={() =>
                                                                        setOpenDropdown(
                                                                            null,
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                                                                >
                                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                                                        <Image
                                                                            src={getAssetUrl(
                                                                                c.image,
                                                                            )}
                                                                            alt={
                                                                                c.title
                                                                            }
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="text-sm text-gray-800 truncate">
                                                                        {
                                                                            c.title
                                                                        }
                                                                    </div>
                                                                </Link>
                                                            ),
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-gray-500 p-2">
                                                        No categories
                                                    </div>
                                                )}

                                                {categories.length >
                                                    featuredCategories.length && (
                                                    <div className="mt-2">
                                                        <Link
                                                            href={route(
                                                                "products.index",
                                                            )}
                                                            onClick={() =>
                                                                setOpenDropdown(
                                                                    null,
                                                                )
                                                            }
                                                            className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                                        >
                                                            View all categories
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href={route("pages.about")}
                                        className="px-2 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap"
                                    >
                                        About Us
                                    </Link>
                                    <Link
                                        href={route("pages.contact")}
                                        className="px-2 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap"
                                    >
                                        Contact Us
                                    </Link>
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
                        <Link
                            href={route("home")}
                            className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            href={route("products.index")}
                            className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            Products
                        </Link>

                        {/* Categories dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onMouseEnter={() =>
                                    setOpenDropdown("categories")
                                }
                                onClick={() =>
                                    setOpenDropdown((prev) =>
                                        prev === "categories"
                                            ? null
                                            : "categories",
                                    )
                                }
                                className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors inline-flex items-center gap-2"
                            >
                                Categories
                                <ChevronDown
                                    size={16}
                                    className="text-gray-500"
                                />
                            </button>

                            {openDropdown === "categories" && (
                                <div className="absolute left-0 top-full mt-2 w-[320px] bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-50">
                                    {featuredCategories.length > 0 ? (
                                        <div className="space-y-1">
                                            {featuredCategories.map(
                                                (c: any) => (
                                                    <Link
                                                        key={c.id}
                                                        href={route(
                                                            "products.category",
                                                            c.slug,
                                                        )}
                                                        onClick={() =>
                                                            setOpenDropdown(
                                                                null,
                                                            )
                                                        }
                                                        className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                                            <Image
                                                                src={getAssetUrl(
                                                                    c.image,
                                                                )}
                                                                alt={c.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="text-sm text-gray-800 truncate">
                                                            {c.title}
                                                        </div>
                                                    </Link>
                                                ),
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 p-2">
                                            No categories
                                        </div>
                                    )}

                                    {categories.length >
                                        featuredCategories.length && (
                                        <div className="mt-2">
                                            <Link
                                                href={route("products.index")}
                                                onClick={() =>
                                                    setOpenDropdown(null)
                                                }
                                                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                            >
                                                View all categories
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Brands dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onMouseEnter={() => setOpenDropdown("brands")}
                                onClick={() =>
                                    setOpenDropdown((prev) =>
                                        prev === "brands" ? null : "brands",
                                    )
                                }
                                className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors inline-flex items-center gap-2"
                            >
                                Brands
                                <ChevronDown
                                    size={16}
                                    className="text-gray-500"
                                />
                            </button>

                            {openDropdown === "brands" && (
                                <div className="absolute left-0 top-full mt-2 w-[320px] bg-white border border-gray-200 rounded-2xl shadow-lg p-3 z-50">
                                    {featuredBrands.length > 0 ? (
                                        <div className="space-y-1">
                                            {featuredBrands.map((b: any) => (
                                                <Link
                                                    key={b.id}
                                                    href={route(
                                                        "brands.show",
                                                        b.slug,
                                                    )}
                                                    onClick={() =>
                                                        setOpenDropdown(null)
                                                    }
                                                    className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={getAssetUrl(
                                                                b.image,
                                                            )}
                                                            alt={b.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="text-sm text-gray-800 truncate">
                                                        {b.title}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500 p-2">
                                            No brands
                                        </div>
                                    )}

                                    {brands.length > featuredBrands.length && (
                                        <div className="mt-2">
                                            <Link
                                                href={route("brands.index")}
                                                onClick={() =>
                                                    setOpenDropdown(null)
                                                }
                                                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                            >
                                                View all brands
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex-1" />

                        <Link
                            href={route("pages.about")}
                            className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap"
                        >
                            About Us
                        </Link>
                        <Link
                            href={route("pages.contact")}
                            className="px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap"
                        >
                            Contact Us
                        </Link>
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
