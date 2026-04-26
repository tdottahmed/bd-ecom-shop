import React, { useMemo, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { ChevronDown, ChevronRight, FileText, Home, Layers, LogIn, LogOut, Tags, X } from "lucide-react";
import Image from "@/Components/Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";
import Logo from "@/Components/Customer/Header/Logo";
import { resolvePageHref } from "@/Utils/pageLink";

type NavCategory = {
    id: number;
    title: string;
    slug: string;
    image: string | null;
};

type NavBrand = {
    id: number;
    title: string;
    slug: string;
    image: string | null;
};

type NavPage = {
    title: string;
    slug: string;
};

interface NavigationSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NavigationSidebar({ isOpen, onClose }: NavigationSidebarProps) {
    const { props } = usePage() as any;
    const categories = (props?.categories ?? []) as NavCategory[];
    const brands = (props?.brands ?? []) as NavBrand[];
    const headerPages = (props?.headerPages ?? []) as NavPage[];
    const isAuthenticated = !!props?.auth?.user;

    const [showCategories, setShowCategories] = useState(true);
    const [showBrands, setShowBrands] = useState(false);

    const featuredCategories = useMemo(() => categories.slice(0, 12), [categories]);
    const featuredBrands = useMemo(() => brands.slice(0, 12), [brands]);

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed inset-y-0 left-0 w-[320px] max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
                role="dialog"
                aria-modal="true"
                aria-label="Site navigation"
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
                        <div className="flex items-center">
                            <Logo />
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="px-3 py-3">
                            <div className="space-y-1">
                                <Link
                                    href={route("home")}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors"
                                    onClick={onClose}
                                >
                                    <Home size={18} className="text-gray-500" />
                                    <span className="font-medium">Home</span>
                                </Link>

                                <Link
                                    href={route("products.index")}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors"
                                    onClick={onClose}
                                >
                                    <Layers size={18} className="text-gray-500" />
                                    <span className="font-medium">All Products</span>
                                </Link>
                            </div>
                        </div>

                        <div className="px-3 pb-3">
                            <button
                                type="button"
                                onClick={() => setShowCategories((v) => !v)}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-900 hover:bg-gray-50 transition-colors"
                                aria-expanded={showCategories}
                            >
                                <div className="flex items-center gap-3">
                                    <Tags size={18} className="text-gray-500" />
                                    <span className="font-semibold">Categories</span>
                                </div>
                                {showCategories ? (
                                    <ChevronDown size={18} className="text-gray-400" />
                                ) : (
                                    <ChevronRight size={18} className="text-gray-400" />
                                )}
                            </button>

                            {showCategories && (
                                <div className="mt-1 pl-1">
                                    {featuredCategories.length > 0 ? (
                                        <ul className="space-y-1">
                                            {featuredCategories.map((c) => (
                                                <li key={c.id}>
                                                    <Link
                                                        href={route("products.category", c.slug)}
                                                        className="flex items-center justify-between px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors group"
                                                        onClick={onClose}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <Image
                                                                src={getAssetUrl(c.image)}
                                                                alt={c.title}
                                                                className="w-8 h-8 rounded-lg object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
                                                            />
                                                            <span className="truncate">{c.title}</span>
                                                        </div>
                                                        <ChevronRight
                                                            size={16}
                                                            className="text-gray-300 group-hover:text-gray-400 transition-colors"
                                                        />
                                                    </Link>
                                                </li>
                                            ))}
                                            {categories.length > featuredCategories.length && (
                                                <li>
                                                    <Link
                                                        href={route("products.index")}
                                                        className="flex items-center justify-between px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors group"
                                                        onClick={onClose}
                                                    >
                                                        <span className="text-sm font-medium">
                                                            View all categories
                                                        </span>
                                                        <ChevronRight
                                                            size={16}
                                                            className="text-gray-300 group-hover:text-gray-400 transition-colors"
                                                        />
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                    ) : (
                                        <div className="px-3 py-2 text-sm text-gray-500">
                                            No categories found.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="px-3 pb-3">
                            <button
                                type="button"
                                onClick={() => setShowBrands((v) => !v)}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-gray-900 hover:bg-gray-50 transition-colors"
                                aria-expanded={showBrands}
                            >
                                <div className="flex items-center gap-3">
                                    <Layers size={18} className="text-gray-500" />
                                    <span className="font-semibold">Brands</span>
                                </div>
                                {showBrands ? (
                                    <ChevronDown size={18} className="text-gray-400" />
                                ) : (
                                    <ChevronRight size={18} className="text-gray-400" />
                                )}
                            </button>

                            {showBrands && (
                                <div className="mt-1 pl-1">
                                    {featuredBrands.length > 0 ? (
                                        <ul className="space-y-1">
                                            {featuredBrands.map((b) => (
                                                <li key={b.id}>
                                                    <Link
                                                        href={route("brands.show", b.slug)}
                                                        className="flex items-center justify-between px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors group"
                                                        onClick={onClose}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <Image
                                                                src={getAssetUrl(b.image)}
                                                                alt={b.title}
                                                                className="w-8 h-8 rounded-lg object-cover border border-gray-100 bg-gray-50 flex-shrink-0"
                                                            />
                                                            <span className="truncate">{b.title}</span>
                                                        </div>
                                                        <ChevronRight
                                                            size={16}
                                                            className="text-gray-300 group-hover:text-gray-400 transition-colors"
                                                        />
                                                    </Link>
                                                </li>
                                            ))}
                                            {brands.length > featuredBrands.length && (
                                                <li>
                                                    <Link
                                                        href={route("brands.index")}
                                                        className="flex items-center justify-between px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors group"
                                                        onClick={onClose}
                                                    >
                                                        <span className="text-sm font-medium">
                                                            View all brands
                                                        </span>
                                                        <ChevronRight
                                                            size={16}
                                                            className="text-gray-300 group-hover:text-gray-400 transition-colors"
                                                        />
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                    ) : (
                                        <div className="px-3 py-2 text-sm text-gray-500">
                                            No brands found.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="px-3 pb-6">
                            <div className="h-px bg-gray-200 my-2" />

                            <div className="space-y-1">
                                {headerPages.map((page) => (
                                    <Link
                                        key={page.slug}
                                        href={resolvePageHref(page)}
                                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-800 hover:bg-gray-50 transition-colors"
                                        onClick={onClose}
                                    >
                                        <FileText size={18} className="text-gray-500" />
                                        <span className="font-medium">{page.title}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom auth area (always visible) */}
                    <div className="border-t border-gray-200 p-3 bg-white">
                        {!isAuthenticated ? (
                            <Link
                                href={route("login")}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors"
                                onClick={onClose}
                            >
                                <LogIn size={18} />
                                <span className="font-semibold">Login</span>
                            </Link>
                        ) : (
                            <div className="grid grid-cols-2 gap-2">
                                <Link
                                    href={route("admin.dashboard")}
                                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-brand-dark text-white hover:bg-brand-dark/80 transition-colors"
                                    onClick={onClose}
                                >
                                    <span className="font-semibold">Dashboard</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onClose();
                                        router.post(route("logout"));
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 text-gray-800 hover:bg-gray-50 transition-colors"
                                >
                                    <LogOut size={18} />
                                    <span className="font-semibold">Logout</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

