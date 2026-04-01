import React, { useEffect, useRef, useState } from "react";
import { Search, LogOut, User, MessageCircle } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";

import Logo from "./Header/Logo";
import MobileMenuButton from "./Header/MobileMenuButton";
import CartIcon from "./Header/CartIcon";
import SearchToggle from "./Header/SearchToggle";
import SearchAutocomplete from "./SearchAutocomplete";
import DesktopNav from "./Header/DesktopNav";
import { useCartStore } from "@/Stores/useCartStore";

interface HeaderProps {
    onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const { setIsOpen, getCartCount } = useCartStore();
    const cartCount = getCartCount();

    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);

    const {
        auth,
        customerAuthEnabled,
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
    const dropdownRefLg = useRef<HTMLDivElement | null>(null);
    const dropdownRefMd = useRef<HTMLDivElement | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    const customerAuthActive = Boolean(customerAuthEnabled);
    const isLoggedIn = Boolean(auth?.user);
    const userInitial =
        (auth?.user?.name as string | undefined)?.trim()[0]?.toUpperCase() ??
        "U";
    const userName =
        (auth?.user?.name as string | undefined)?.split(" ")[0] ?? "";

    // Close mega-menu on outside click
    useEffect(() => {
        const handleDocClick = (e: MouseEvent) => {
            const t = e.target as Node | null;
            if (!t) return;
            const inLg =
                !!dropdownRefLg.current && dropdownRefLg.current.contains(t);
            const inMd =
                !!dropdownRefMd.current && dropdownRefMd.current.contains(t);
            if (!inLg && !inMd) setOpenDropdown(null);
        };
        document.addEventListener("click", handleDocClick);
        return () => document.removeEventListener("click", handleDocClick);
    }, []);

    // Scroll shadow
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 8);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ⌘K / Ctrl+K → open desktop overlay; Escape → close everything
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsDesktopSearchOpen(true);
            }
            if (e.key === "Escape") {
                setIsDesktopSearchOpen(false);
                setIsMobileSearchOpen(false);
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, []);

    const featuredCategories = menuCategories.slice(0, 8);
    const featuredBrands = menuBrands.slice(0, 8);

    return (
        <>
            <header
                className={`sticky top-0 z-40 transition-all duration-200 ${
                    isScrolled
                        ? "bg-white/95 backdrop-blur-md shadow-sm"
                        : "bg-white"
                } border-b border-gray-100`}
            >
                {/* ── Main row ── */}
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-3">
                        {/* Left: hamburger (mobile) + optional messenger + logo */}
                        <div className="flex items-center gap-2 shrink-0">
                            <div className="md:hidden">
                                <MobileMenuButton onClick={onMenuClick} />
                            </div>
                            {messengerLink && (
                                <a
                                    href={messengerLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hidden md:flex p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Messenger"
                                >
                                    <MessageCircle size={18} />
                                </a>
                            )}
                            <Logo />
                        </div>

                        {/* Center: nav (lg+) | inline search (md only) */}
                        <div className="flex-1 flex items-center justify-center min-w-0">
                            {/* lg+: desktop nav */}
                            <div
                                ref={dropdownRefLg}
                                className="hidden lg:flex items-center gap-1"
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

                            {/* md only: inline search bar */}
                            <div className="hidden md:flex lg:hidden w-full max-w-lg">
                                <SearchAutocomplete />
                            </div>
                        </div>

                        {/* Right: actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                            {/* lg+: search icon trigger */}
                            <button
                                onClick={() => setIsDesktopSearchOpen(true)}
                                className="hidden lg:flex p-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Search"
                                title="Search (⌘K)"
                            >
                                <Search size={20} strokeWidth={2} />
                            </button>

                            {/* Mobile: search toggle */}
                            <div className="md:hidden">
                                <SearchToggle
                                    onClick={() => setIsMobileSearchOpen(true)}
                                />
                            </div>

                            {/* Cart */}
                            <button
                                onClick={() => setIsOpen(true)}
                                className="flex items-center gap-2  rounded-full transition-colors text-sm font-medium"
                            >
                                <CartIcon
                                    count={cartCount}
                                    className="text-gray-950"
                                />
                            </button>
                            {/* Auth — desktop (md+) */}
                            {customerAuthActive && (
                                <div className="hidden md:flex items-center gap-1">
                                    {isLoggedIn ? (
                                        <>
                                            <Link
                                                href={route(
                                                    "account.dashboard",
                                                )}
                                                className="flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors group"
                                                title="My account"
                                            >
                                                {/* Avatar circle */}
                                                <span className="w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                    {userInitial}
                                                </span>
                                                <span className="hidden lg:block text-sm font-medium text-gray-700 group-hover:text-gray-900 max-w-[80px] truncate">
                                                    {userName}
                                                </span>
                                            </Link>
                                            <Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                title="Logout"
                                            >
                                                <LogOut size={16} />
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                href={route("login")}
                                                className="px-3.5 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                href={route("register")}
                                                className="px-3.5 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
                                            >
                                                Register
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* Mobile: account icon (logged-in only) */}
                            {customerAuthActive && isLoggedIn && (
                                <Link
                                    href={route("account.dashboard")}
                                    className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="My account"
                                >
                                    <User size={20} />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── md-only navigation row ── */}
                <div className="hidden md:block lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur">
                    <div
                        ref={dropdownRefMd}
                        className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5"
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

                {/* ── Mobile search modal ── */}
                {isMobileSearchOpen && (
                    <div className="fixed inset-0 z-50 md:hidden search-backdrop-in">
                        <div
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsMobileSearchOpen(false)}
                        />
                        <div className="absolute top-0 left-0 right-0 bg-white shadow-2xl rounded-b-2xl search-panel-in">
                            <div className="flex items-center gap-3 px-4 py-3">
                                <div className="flex-1">
                                    <SearchAutocomplete
                                        isMobile
                                        onClose={() =>
                                            setIsMobileSearchOpen(false)
                                        }
                                    />
                                </div>
                                <button
                                    onClick={() => setIsMobileSearchOpen(false)}
                                    className="shrink-0 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors px-1"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* ── Desktop search overlay (lg+) ── */}
            {isDesktopSearchOpen && (
                <div
                    className="fixed inset-0 z-50 hidden lg:flex items-start justify-center pt-20 px-4 search-backdrop-in"
                    onClick={() => setIsDesktopSearchOpen(false)}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

                    {/* Search panel */}
                    <div
                        className="relative w-full max-w-2xl search-panel-in"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl shadow-[0_25px_60px_-10px_rgba(0,0,0,0.25)] ring-1 ring-black/5">
                            <SearchAutocomplete
                                isOverlay
                                autoFocus
                                onClose={() => setIsDesktopSearchOpen(false)}
                            />
                        </div>
                        <p className="text-center text-xs text-white/60 mt-3">
                            Press{" "}
                            <kbd className="px-1.5 py-0.5 bg-white/20 rounded text-white text-[10px]">
                                Esc
                            </kbd>{" "}
                            to close
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;
