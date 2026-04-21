import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";
import { ChevronDown, ArrowRight, LayoutGrid } from "lucide-react";
import Image from "@/Components/Ui/Image";
import { getAssetUrl, formatCurrency } from "@/Utils/helpers";

interface Brand {
    id: number;
    title: string;
    slug: string;
    image?: string;
    products?: Product[];
}

interface Product {
    id: number;
    name: string;
    slug: string;
    images?: string[];
    sale_price?: number;
    has_discount?: boolean;
    discounted_sale_price?: number;
}

interface Props {
    brands: Brand[];
    featuredBrands: Brand[];
    isOpen: boolean;
    onToggle: () => void;
    onMouseEnter: () => void;
    onClose: () => void;
}

const BrandsDropdown: React.FC<Props> = ({
    brands,
    isOpen,
    onToggle,
    onMouseEnter,
    onClose,
}) => {
    const allBrands = brands ?? [];
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const firstBrandWithProducts =
        allBrands.find((b) => (b.products ?? []).length > 0) ?? allBrands[0];
    const [activeBrandSlug, setActiveBrandSlug] = useState<string | null>(
        firstBrandWithProducts?.slug ?? null,
    );

    const scheduleClose = useCallback(() => {
        closeTimer.current = setTimeout(() => onClose(), 300);
    }, [onClose]);

    const cancelClose = useCallback(() => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current);
            closeTimer.current = null;
        }
    }, []);

    useEffect(() => {
        if (!activeBrandSlug && allBrands.length > 0) {
            const first =
                allBrands.find((b) => (b.products ?? []).length > 0) ??
                allBrands[0];
            setActiveBrandSlug(first?.slug ?? null);
        }
    }, [activeBrandSlug, allBrands]);

    const activeBrand =
        allBrands.find((b) => b.slug === activeBrandSlug) ??
        firstBrandWithProducts;
    const activeProducts = (activeBrand?.products ?? []).slice(0, 6);

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
                className="px-3 py-1.5 text-sm font-medium text-brand-dark hover:text-brand-primary hover:bg-brand-bg rounded-full transition-colors inline-flex items-center gap-1.5"
                aria-expanded={isOpen}
            >
                Brands
                <ChevronDown
                    size={15}
                    className={`text-brand-dark/40 transition-transform duration-200 ${isOpen ? "rotate-180 text-brand-primary" : ""}`}
                />
            </button>

            {isOpen && (
                <>
                    {/* Invisible bridge fills the gap between trigger and panel so mouseLeave doesn't fire mid-travel */}
                    <div
                        className="absolute left-0 top-full w-full h-3 z-50"
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                    />
                    <div
                        className="absolute left-0 top-full mt-2 lg:mt-0 lg:fixed lg:left-8 lg:right-8 lg:top-[132px] xl:left-16 xl:right-16 bg-white border border-gray-100/50 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                    >
                    {allBrands.length > 0 ? (
                        <div className="flex flex-col md:flex-row max-h-[70vh]">
                            {/* Left: Brand List */}
                            <div className="md:w-56 lg:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-gray-100 overflow-y-auto">
                                <div className="p-4">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-2">
                                        All Brands
                                    </p>
                                    <ul className="space-y-0.5">
                                        {allBrands.map((b) => (
                                            <li key={b.id}>
                                                <Link
                                                    href={route(
                                                        "brands.show",
                                                        b.slug,
                                                    )}
                                                    onMouseEnter={() =>
                                                        setActiveBrandSlug(
                                                            b.slug,
                                                        )
                                                    }
                                                    onFocus={() =>
                                                        setActiveBrandSlug(
                                                            b.slug,
                                                        )
                                                    }
                                                    onClick={onClose}
                                                    className={`flex items-center gap-3 px-2 py-2 rounded-xl group transition-colors ${
                                                        activeBrand?.slug ===
                                                        b.slug
                                                            ? "bg-brand-bg text-brand-primary"
                                                            : "hover:bg-brand-bg/60"
                                                    }`}
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-100 overflow-hidden flex-shrink-0">
                                                        <Image
                                                            src={getAssetUrl(
                                                                b.image,
                                                            )}
                                                            alt={b.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 flex-1 truncate">
                                                        {b.title}
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
                                        href={route("brands.index")}
                                        onClick={onClose}
                                        className="flex items-center justify-center gap-2 w-full py-2 px-3 bg-brand-primary/10 hover:bg-brand-primary/15 text-brand-primary text-sm font-medium rounded-xl transition-colors"
                                    >
                                        <LayoutGrid size={14} />
                                        Browse All
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Hovered Brand Products */}
                            <div className="flex-1 overflow-y-auto p-6">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                                    {activeBrand
                                        ? `${activeBrand.title} Products`
                                        : "Brand Products"}
                                </p>

                                {activeProducts.length > 0 ? (
                                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-2.5">
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
                                                        <h4 className="text-[11px] font-semibold text-gray-800 line-clamp-2 mb-0.5 group-hover/card:text-brand-primary transition-colors leading-tight">
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
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-40 text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        No products available in this brand.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 p-8 text-center bg-gray-50">
                            No brands available
                        </div>
                    )}
                    </div>
                </>
            )}
        </div>
    );
};

export default BrandsDropdown;
