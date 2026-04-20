import { useEffect, useRef, useState } from "react";
import {
    LogOut,
    User,
    ChevronDown,
    LayoutDashboard,
    ShoppingBag,
    MapPin,
    Settings,
} from "lucide-react";
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

    const {
        auth,
        customerAuthEnabled,
        blogEnabled,
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
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement | null>(null);
    const navRowRef = useRef<HTMLDivElement | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const lastScrollY = useRef(0);

    const customerAuthActive = Boolean(customerAuthEnabled);
    const isLoggedIn = Boolean(auth?.user);
    const userInitial =
        (auth?.user?.name as string | undefined)?.trim()[0]?.toUpperCase() ??
        "U";
    const userName =
        (auth?.user?.name as string | undefined)?.split(" ")[0] ?? "";

    // Close mega-menu and user menu on outside click
    useEffect(() => {
        const handleDocClick = (e: MouseEvent) => {
            const t = e.target as Node | null;
            if (!t) return;
            if (navRowRef.current && !navRowRef.current.contains(t)) {
                setOpenDropdown(null);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(t)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("click", handleDocClick);
        return () => document.removeEventListener("click", handleDocClick);
    }, []);

    // Scroll shadow + hide-on-scroll-down
    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setIsScrolled(y > 8);

            if (y > 120) {
                if (y > lastScrollY.current + 6) {
                    setIsHidden(true);
                    setOpenDropdown(null);
                    setIsUserMenuOpen(false);
                } else if (y < lastScrollY.current - 6) {
                    setIsHidden(false);
                }
            } else {
                setIsHidden(false);
            }

            lastScrollY.current = y;
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const featuredCategories = menuCategories.slice(0, 8);
    const featuredBrands = menuBrands.slice(0, 8);

    return (
        <>
            <header
                className={`sticky top-0 z-40 transition-transform duration-300 ${
                    isHidden ? "-translate-y-full" : "translate-y-0"
                }`}
            >
                {/* ── Row 1: Brand bar ── */}
                <div
                    className={`bg-brand-ivory transition-all duration-300 ${
                        isScrolled
                            ? "shadow-sm border-b border-gray-100"
                            : "border-b border-gray-100"
                    }`}
                >
                    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 md:h-20 gap-3">
                            {/* Left: hamburger (mobile) + logo */}
                            <div className="flex items-center gap-1 shrink-0">
                                <div className="md:hidden">
                                    <MobileMenuButton onClick={onMenuClick} />
                                </div>
                                <div className="py-2">
                                    <Logo />
                                </div>
                            </div>

                            {/* Center: search bar (md+) */}
                            <div className="hidden md:flex flex-1 max-w-sm lg:max-w-lg xl:max-w-xl">
                                <SearchAutocomplete />
                            </div>

                            {/* Right: actions */}
                            <div className="flex items-center gap-1 shrink-0">
                                {/* Mobile search toggle */}
                                <div className="md:hidden">
                                    <SearchToggle
                                        onClick={() =>
                                            setIsMobileSearchOpen(true)
                                        }
                                    />
                                </div>

                                {/* Cart */}
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="p-2 text-brand-dark hover:text-brand-primary hover:bg-brand-bg rounded-full transition-colors"
                                    aria-label="Open cart"
                                >
                                    <CartIcon count={cartCount} />
                                </button>

                                {/* Auth — desktop (md+) */}
                                {customerAuthActive && (
                                    <div className="hidden md:flex items-center ml-1">
                                        {isLoggedIn ? (
                                            <div
                                                ref={userMenuRef}
                                                className="relative"
                                            >
                                                <button
                                                    onClick={() =>
                                                        setIsUserMenuOpen(
                                                            (v) => !v,
                                                        )
                                                    }
                                                    className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full hover:bg-brand-bg transition-colors group"
                                                >
                                                    <span className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                                                        {userInitial}
                                                    </span>
                                                    <span className="hidden lg:block text-sm font-medium text-brand-dark group-hover:text-brand-primary max-w-[80px] truncate">
                                                        {userName}
                                                    </span>
                                                    <ChevronDown
                                                        size={14}
                                                        className={`hidden lg:block text-gray-400 transition-transform duration-200 ${
                                                            isUserMenuOpen
                                                                ? "rotate-180 text-brand-primary"
                                                                : ""
                                                        }`}
                                                    />
                                                </button>

                                                {isUserMenuOpen && (
                                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                                        <div className="px-4 py-3 border-b border-gray-100">
                                                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                                                Signed in as
                                                            </p>
                                                            <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">
                                                                {
                                                                    auth?.user
                                                                        ?.name
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="py-1">
                                                            <Link
                                                                href={route(
                                                                    "account.dashboard",
                                                                )}
                                                                onClick={() =>
                                                                    setIsUserMenuOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-bg hover:text-brand-primary transition-colors"
                                                            >
                                                                <LayoutDashboard
                                                                    size={16}
                                                                    className="text-gray-400"
                                                                />
                                                                Dashboard
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "account.orders",
                                                                )}
                                                                onClick={() =>
                                                                    setIsUserMenuOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-bg hover:text-brand-primary transition-colors"
                                                            >
                                                                <ShoppingBag
                                                                    size={16}
                                                                    className="text-gray-400"
                                                                />
                                                                My Orders
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "account.addresses",
                                                                )}
                                                                onClick={() =>
                                                                    setIsUserMenuOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-bg hover:text-brand-primary transition-colors"
                                                            >
                                                                <MapPin
                                                                    size={16}
                                                                    className="text-gray-400"
                                                                />
                                                                Addresses
                                                            </Link>
                                                            <Link
                                                                href={route(
                                                                    "account.profile",
                                                                )}
                                                                onClick={() =>
                                                                    setIsUserMenuOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-bg hover:text-brand-primary transition-colors"
                                                            >
                                                                <Settings
                                                                    size={16}
                                                                    className="text-gray-400"
                                                                />
                                                                Settings
                                                            </Link>
                                                        </div>

                                                        <div className="border-t border-gray-100 py-1">
                                                            <Link
                                                                href={route(
                                                                    "logout",
                                                                )}
                                                                method="post"
                                                                as="button"
                                                                onClick={() =>
                                                                    setIsUserMenuOpen(
                                                                        false,
                                                                    )
                                                                }
                                                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-brand-primary hover:bg-brand-bg transition-colors"
                                                            >
                                                                <LogOut
                                                                    size={16}
                                                                />
                                                                Sign out
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={route("login")}
                                                    className="px-3.5 py-1.5 text-sm font-medium text-brand-dark hover:text-brand-primary hover:bg-brand-bg rounded-full transition-colors"
                                                >
                                                    Login
                                                </Link>
                                                <Link
                                                    href={route("register")}
                                                    className="px-3.5 py-1.5 text-sm font-semibold bg-brand-primary text-white rounded-full hover:bg-brand-primary/85 transition-colors"
                                                >
                                                    Register
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Mobile: account icon (logged-in only) */}
                                {customerAuthActive && isLoggedIn && (
                                    <Link
                                        href={route("account.dashboard")}
                                        className="md:hidden p-2 text-brand-dark hover:text-brand-primary hover:bg-brand-bg rounded-full transition-colors"
                                        aria-label="My account"
                                    >
                                        <User size={20} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Row 2: Navigation bar (md+) ── */}
                <div className="hidden md:block bg-gradient-to-r from-brand-bg via-white to-brand-bg border-b border-brand-primary/15">
                    <div
                        ref={navRowRef}
                        className="max-w-full mx-auto px-4 sm:px-6 lg:px-8"
                    >
                        <div className="flex items-center gap-0.5 h-11">
                            <DesktopNav
                                categories={menuCategories}
                                featuredCategories={featuredCategories}
                                brands={menuBrands}
                                featuredBrands={featuredBrands}
                                openDropdown={openDropdown}
                                setOpenDropdown={setOpenDropdown}
                                blogEnabled={Boolean(blogEnabled)}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Mobile search modal ── */}
                {isMobileSearchOpen && (
                    <div className="fixed inset-0 z-50 md:hidden search-backdrop-in">
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
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
        </>
    );
};

export default Header;
