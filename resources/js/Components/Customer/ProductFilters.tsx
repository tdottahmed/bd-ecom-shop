import React from "react";
import { SlidersHorizontal } from "lucide-react";

interface ProductFiltersProps {
    sort: string;
    setSort: (sort: string) => void;
    setIsFilterOpen: (isOpen: boolean) => void;
    filters: {
        search?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
        in_stock?: string;
        is_preorder?: string;
        stock_out?: string;
        category_id?: string;
        brand_id?: string;
    };
    categories?: { id: number; title: string; slug: string }[];
    brands?: { id: number; title: string; slug: string }[];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
    sort,
    setSort,
    setIsFilterOpen,
    filters,
    categories = [],
    brands = [],
}) => {
    return (
        <div className="bg-white border-b border-gray-200">
            <div className="max-w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="hidden sm:block text-2xl font-bold text-gray-900">
                        Products
                    </h2>
                    {/* Sort and Filter Controls */}
                    <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
                        {/* Sort Dropdown */}
                        <div className="relative hidden sm:block flex-1 sm:flex-initial min-w-[150px]">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="w-full appearance-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-primary/40 focus:border-brand-primary block p-2.5 pr-8"
                            >
                                <option value="latest"> Latest </option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="name"> Name: A - Z </option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsFilterOpen(true)}
                            className="flex-1 sm:flex-initial px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm font-medium whitespace-nowrap shadow-sm"
                        >
                            <SlidersHorizontal
                                size={18}
                                className="text-gray-500"
                            />
                            <span>Filters </span>
                        </button>

                    </div>
                </div>

                {/* Active Filters Display */}
                {(filters.search ||
                    filters.min_price ||
                    filters.max_price ||
                    filters.in_stock ||
                    filters.category_id ||
                    filters.brand_id ||
                    (filters.sort && filters.sort !== "latest")) && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {filters.search && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-bg text-brand-primary">
                                Search: {filters.search}
                            </span>
                        )}
                        {filters.min_price && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-bg text-brand-primary">
                                Min: ৳{filters.min_price}
                            </span>
                        )}
                        {filters.max_price && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-bg text-brand-primary">
                                Max: ৳{filters.max_price}
                            </span>
                        )}
                        {filters.in_stock === "true" && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-bg text-brand-primary">
                                In Stock Only
                            </span>
                        )}
                        {filters.category_id && categories.length > 0 && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-bg text-brand-primary">
                                Category: {categories.find(c => c.id.toString() === filters.category_id)?.title || filters.category_id}
                            </span>
                        )}
                        {filters.brand_id && brands.length > 0 && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-bg text-brand-primary">
                                Brand: {brands.find(b => b.id.toString() === filters.brand_id)?.title || filters.brand_id}
                            </span>
                        )}
                        {filters.sort && filters.sort !== "latest" && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-brand-bg text-brand-primary">
                                Sort:{" "}
                                {filters.sort === "price_low"
                                    ? "Price Low to High"
                                    : filters.sort === "price_high"
                                      ? "Price High to Low"
                                      : "Name A-Z"}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductFilters;
