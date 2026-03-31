import React, { useRef, useCallback, useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { ChevronDown, ArrowRight, LayoutGrid } from "lucide-react";
import Image from "@/Components/Ui/Image";
import { getAssetUrl, formatCurrency } from "@/Utils/helpers";

interface Product {
    id: number;
    name: string;
    slug: string;
    images?: string[];
    sale_price?: number;
    has_discount?: boolean;
    discounted_sale_price?: number;
}

interface Category {
    id: number;
    title: string;
    slug: string;
    image?: string;
    products?: Product[];
}

interface Props {
    categories: Category[];
    featuredCategories: Category[];
    isOpen: boolean;
    onToggle: () => void;
    onMouseEnter: () => void;
    onClose: () => void;
}

const CategoriesMegaMenu: React.FC<Props> = ({
    categories,
    isOpen,
    onToggle,
    onMouseEnter,
    onClose,
}) => {
    const allCategories = categories ?? [];
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const firstCategoryWithProducts =
        allCategories.find((c) => (c.products ?? []).length > 0) ??
        allCategories[0];

    const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(
        firstCategoryWithProducts?.slug ?? null,
    );

    const scheduleClose = useCallback(() => {
        closeTimer.current = setTimeout(() => onClose(), 150);
    }, [onClose]);

    const cancelClose = useCallback(() => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    }, []);

    // Sync default when categories load asynchronously
    useEffect(() => {
        if (!activeCategorySlug && allCategories.length > 0) {
            const first =
                allCategories.find((c) => (c.products ?? []).length > 0) ??
                allCategories[0];
            setActiveCategorySlug(first?.slug ?? null);
        }
    }, [allCategories]);

    const activeCategory =
        allCategories.find((c) => c.slug === activeCategorySlug) ??
        firstCategoryWithProducts;
    const activeProducts = (activeCategory?.products ?? []).slice(0, 4);
    const fillerCount = Math.max(0, 4 - activeProducts.length);

    return (
        <div
            className="relative flex"
            onMouseLeave={scheduleClose}
            onMouseEnter={cancelClose}
        >
            <button
                type="button"
                onMouseEnter={() => {
                    cancelClose();
                    onMouseEnter();
                }}
                onClick={onToggle}
                className="px-2 py-2 md:px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors inline-flex items-center gap-2"
                aria-expanded={isOpen}
            >
                Categories
                <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div
                    className="absolute left-0 top-full mt-2 lg:mt-0 lg:fixed lg:left-8 lg:right-8 lg:top-16 xl:left-16 xl:right-16 bg-white border border-gray-100/50 lg:rounded-b-2xl md:rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
                    onMouseEnter={cancelClose}
                    onMouseLeave={scheduleClose}
                >
                    {allCategories.length > 0 ? (
                        <div className="flex flex-col md:flex-row max-h-[70vh]">
                            {/* Left: Category List */}
                            <div className="md:w-56 lg:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto">
                                <div className="p-4">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-2">
                                        All Categories
                                    </p>
                                    <ul className="space-y-0.5">
                                        {allCategories.map((c) => (
                                            <li key={c.id}>
                                                <Link
                                                    href={route(
                                                        "products.category",
                                                        c.slug,
                                                    )}
                                                    onMouseEnter={() =>
                                                        setActiveCategorySlug(
                                                            c.slug,
                                                        )
                                                    }
                                                    onFocus={() =>
                                                        setActiveCategorySlug(
                                                            c.slug,
                                                        )
                                                    }
                                                    onClick={onClose}
                                                    className={`flex items-center gap-3 px-2 py-2 rounded-xl group transition-colors ${
                                                        activeCategory?.slug ===
                                                        c.slug
                                                            ? "bg-gray-100"
                                                            : "hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={getAssetUrl(
                                                                c.image,
                                                            )}
                                                            alt={c.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1 truncate">
                                                        {c.title}
                                                    </span>
                                                    <ArrowRight
                                                        size={13}
                                                        className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                                                    />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="p-4 border-t border-gray-100">
                                    <Link
                                        href={route("products.index")}
                                        onClick={onClose}
                                        className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
                                    >
                                        <LayoutGrid size={14} />
                                        Browse All
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Hovered Category Products */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                                    {activeCategory
                                        ? `${activeCategory.title} Products`
                                        : "Category Products"}
                                </p>

                                {activeProducts.length > 0 ? (
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                                        {activeProducts.map((p) => {
                                            const price = p.has_discount
                                                ? p.discounted_sale_price
                                                : p.sale_price;
                                            const primaryImage = p.images?.[0]
                                                ? getAssetUrl(p.images[0])
                                                : null;

                                            return (
                                                <Link
                                                    key={p.id}
                                                    href={route(
                                                        "products.show",
                                                        p.slug,
                                                    )}
                                                    onClick={onClose}
                                                    className="group/card flex flex-col bg-gray-50/50 hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-sm rounded-lg p-1.5 transition-all duration-300"
                                                >
                                                    <div className="aspect-square w-full rounded-md bg-white border border-gray-100 mb-1.5 overflow-hidden">
                                                        {primaryImage ? (
                                                            <Image
                                                                src={
                                                                    primaryImage
                                                                }
                                                                alt={p.name}
                                                                className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                                <span className="text-gray-400 text-xs">
                                                                    No image
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <h4 className="text-[11px] font-semibold text-gray-800 line-clamp-2 mb-0.5 group-hover/card:text-blue-600 transition-colors leading-tight">
                                                            {p.name}
                                                        </h4>
                                                        <div className="text-[11px] font-bold text-gray-900 mt-auto">
                                                            {formatCurrency(
                                                                price || 0,
                                                            )}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                        {fillerCount > 0 && (
                                            <>
                                                <Link
                                                    key="filler-explore-category"
                                                    href={route(
                                                        "products.category",
                                                        activeCategory?.slug,
                                                    )}
                                                    onClick={onClose}
                                                    className="group/card flex flex-col bg-gray-50/60 border border-dashed border-gray-200 rounded-lg p-2 transition-all duration-300 hover:border-gray-300 hover:bg-white"
                                                >
                                                    <div className="aspect-square w-full rounded-md bg-gray-100/80 border border-gray-100 mb-1.5 flex items-center justify-center">
                                                        <span className="text-gray-400 text-[11px] text-center px-2">
                                                            More from{" "}
                                                            {
                                                                activeCategory?.title
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-end">
                                                        <div className="text-[11px] font-semibold text-gray-700 group-hover/card:text-blue-600">
                                                            Explore Category
                                                        </div>
                                                    </div>
                                                </Link>
                                                {Array.from({
                                                    length: fillerCount - 1,
                                                }).map((_, idx) => (
                                                    <div
                                                        key={`filler-empty-${idx}`}
                                                        className="hidden lg:block rounded-lg border border-transparent"
                                                        aria-hidden="true"
                                                    />
                                                ))}
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-40 text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        No products available in this category.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 p-8 text-center bg-gray-50">
                            No categories available
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoriesMegaMenu;
