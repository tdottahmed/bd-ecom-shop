import React from "react";
import { Link } from "@inertiajs/react";
import { ChevronDown, ArrowRight } from "lucide-react";
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
    featuredCategories,
    isOpen,
    onToggle,
    onMouseEnter,
    onClose,
}) => {
    const sectionsSource =
        (featuredCategories ?? []).length > 0 ? featuredCategories : categories;

    const limitedSections = (sectionsSource ?? []).slice(0, 8);
    const sectionsWithProducts = limitedSections.filter(
        (c) => (c.products ?? []).length > 0
    );
    const sections =
        sectionsWithProducts.length > 0 ? sectionsWithProducts : limitedSections;

    return (
        <div
            className="relative flex"
            onMouseLeave={() => {
                if (isOpen) onClose();
            }}
        >
            <button
                type="button"
                onMouseEnter={onMouseEnter}
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

            {/* In mobile/tablet, we might want it relative to the button, but for desktop lg+, we want it wide. 
                We use fixed positioning for large screens to ensure it spans beautifully from the bottom of the header. 
                For 'md' screens (the second row navbar), it can be relative to the viewport or left aligned.
            */}
            {isOpen && (
                <div className="absolute left-0 top-full mt-2 lg:mt-0 lg:fixed lg:left-8 lg:right-8 lg:top-16 xl:left-16 xl:right-16 bg-white border border-gray-100/50 lg:rounded-b-2xl md:rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] z-50 overflow-hidden transform transition-all duration-300 origin-top">
                    {sections.length > 0 ? (
                        <div className="flex flex-col max-h-[70vh] overflow-y-auto">
                            <div className="p-6 md:p-8 space-y-8">
                                {sections.map((c, index) => (
                                    <div key={c.id} className="group/section">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={getAssetUrl(c.image)}
                                                        alt={c.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 tracking-tight">
                                                    {c.title}
                                                </h3>
                                            </div>
                                            <Link
                                                href={route("products.category", c.slug)}
                                                onClick={onClose}
                                                className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline group-hover/section:translate-x-1 transition-all duration-300"
                                            >
                                                Show More <ArrowRight size={14} />
                                            </Link>
                                        </div>

                                        {/* Products Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                            {(c.products ?? []).length > 0 ? (
                                                c.products?.slice(0, 4).map((p) => {
                                                    const price = p.has_discount ? p.discounted_sale_price : p.sale_price;
                                                    const primaryImage = p.images?.[0] ? getAssetUrl(p.images[0]) : null;

                                                    return (
                                                        <Link
                                                            key={p.id}
                                                            href={route("products.show", p.slug)}
                                                            onClick={onClose}
                                                            className="group/card flex flex-col bg-gray-50/50 hover:bg-white border text-left border-transparent hover:border-gray-200 hover:shadow-xl rounded-2xl p-3 sm:p-4 transition-all duration-300"
                                                        >
                                                            <div className="aspect-square w-full rounded-xl bg-white border border-gray-100 mb-3 overflow-hidden relative">
                                                                {primaryImage ? (
                                                                    <Image
                                                                        src={primaryImage}
                                                                        alt={p.name}
                                                                        className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                                        <span className="text-gray-400 text-xs">No image</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 flex flex-col justify-between">
                                                                <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1 group-hover/card:text-blue-600 transition-colors">
                                                                    {p.name}
                                                                </h4>
                                                                <div className="text-sm font-bold text-gray-900 mt-auto">
                                                                    {formatCurrency(price || 0)}
                                                                </div>
                                                            </div>
                                                        </Link>
                                                    );
                                                })
                                            ) : (
                                                <div className="col-span-full py-6 text-center text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                                    No featured products yet.
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 sm:hidden">
                                            <Link
                                                href={route("products.category", c.slug)}
                                                onClick={onClose}
                                                className="inline-flex w-full justify-center items-center gap-2 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-xl transition-colors"
                                            >
                                                View all {c.title}
                                            </Link>
                                        </div>

                                        {/* Visual separator except for last item */}
                                        {index < sections.length - 1 && (
                                            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-8" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            {categories.length > sections.length && (
                                <div className="bg-gray-50 border-t border-gray-100 p-4 text-center">
                                    <Link
                                        href={route("products.index")}
                                        onClick={onClose}
                                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-full shadow-sm hover:shadow transition-all"
                                    >
                                        Browse Directory of All Categories
                                    </Link>
                                </div>
                            )}
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
