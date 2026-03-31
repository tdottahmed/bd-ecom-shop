import React from "react";
import { Link } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import Image from "@/Components/Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";

interface Brand {
    id: number;
    title: string;
    slug: string;
    image?: string;
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
    featuredBrands,
    isOpen,
    onToggle,
    onMouseEnter,
    onClose,
}) => {
    return (
        <div className="relative">
            <button
                type="button"
                onMouseEnter={onMouseEnter}
                onClick={onToggle}
                className="px-2 py-2 md:px-3 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-colors inline-flex items-center gap-2"
                aria-expanded={isOpen}
            >
                Brands
                <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute left-0 lg:-translate-x-1/2 top-full mt-2 w-[320px] bg-white border border-gray-100/50 rounded-2xl shadow-xl p-3 z-50 transform origin-top transition-all duration-200">
                    {featuredBrands.length > 0 ? (
                        <div className="space-y-1">
                            {featuredBrands.map((b) => (
                                <Link
                                    key={b.id}
                                    href={route("brands.show", b.slug)}
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 group-hover:shadow-sm">
                                        <Image
                                            src={getAssetUrl(b.image)}
                                            alt={b.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="text-sm font-semibold text-gray-800 truncate group-hover:text-blue-600 transition-colors">
                                        {b.title}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-gray-500 p-4 text-center">
                            No brands
                        </div>
                    )}

                    {brands.length > featuredBrands.length && (
                        <div className="mt-2 text-center border-t border-gray-100 pt-2">
                            <Link
                                href={route("brands.index")}
                                onClick={onClose}
                                className="block text-sm font-bold text-gray-700 hover:text-blue-600 hover:bg-gray-50 py-2 rounded-xl transition-colors"
                            >
                                View all brands
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BrandsDropdown;
