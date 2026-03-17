import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import ProductCard from "@/Components/Customer/ProductCard";
import FilterSidebar from "@/Components/Customer/FilterSidebar";
import { Category, PaginatedData, Product } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";

interface ProductListProps {
    products: PaginatedData<Product>;
    category?: Category;
    filters?: {
        search?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
        in_stock?: string;
        is_preorder?: string;
    };
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    category,
    filters = {},
}) => {
    const title = category
        ? `${category.title} - Paikari World`
        : "All Products - Paikari World";

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(filters.search || "");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const currentUrl = category
            ? route("products.category", category.slug)
            : route("products.index");

        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        if (filters.min_price) params.min_price = filters.min_price;
        if (filters.max_price) params.max_price = filters.max_price;
        if (filters.sort && filters.sort !== "latest")
            params.sort = filters.sort;
        if (filters.in_stock) params.in_stock = filters.in_stock;
        if (filters.is_preorder) params.is_preorder = filters.is_preorder;

        router.visit(currentUrl, {
            data: params,
            preserveState: true,
            preserveScroll: false,
        });
    };

    const currentUrl = category
        ? route("products.category", category.slug)
        : route("products.index");

    return (
        <CustomerLayout>
            <Head title={title} />

            <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                currentUrl={currentUrl}
            />

            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* <div>
                            <h1 className="text-3xl font-extrabold text-gray-900">
                                {category ? category.title : "All Products"}
                            </h1>
                            {category && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Browse our collection of {category.title}
                                </p>
                            )}
                        </div> */}

                        {/* Search and Filter Controls */}
                        <div className="flex gap-2 items-center">
                            <form
                                onSubmit={handleSearch}
                                className="flex-1 sm:flex-initial"
                            >
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        placeholder="Search products..."
                                        className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                    />
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                </div>
                            </form>
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                            >
                                <SlidersHorizontal size={18} />
                                <span className="hidden sm:inline">
                                    {" "}
                                    Filters{" "}
                                </span>
                            </button>
                            <button
                                onClick={() => {
                                    const params: Record<string, string> = {};
                                    if (searchQuery)
                                        params.search = searchQuery;
                                    if (filters.min_price)
                                        params.min_price = filters.min_price;
                                    if (filters.max_price)
                                        params.max_price = filters.max_price;
                                    if (
                                        filters.sort &&
                                        filters.sort !== "latest"
                                    )
                                        params.sort = filters.sort;
                                    if (filters.in_stock)
                                        params.in_stock = filters.in_stock;

                                    // Toggle preorder
                                    if (filters.is_preorder === "true") {
                                        delete params.is_preorder;
                                    } else {
                                        params.is_preorder = "true";
                                    }

                                    router.visit(currentUrl, {
                                        data: params,
                                        preserveState: true,
                                        preserveScroll: false,
                                    });
                                }}
                                className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
                                    filters.is_preorder === "true"
                                        ? "bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700"
                                        : "border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                                <span className="hidden sm:inline">
                                    {" "}
                                    Preorder{" "}
                                </span>
                                <span className="sm:hidden"> Pre </span>
                            </button>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {(filters.search ||
                        filters.min_price ||
                        filters.max_price ||
                        filters.in_stock ||
                        (filters.sort && filters.sort !== "latest")) && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {filters.search && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                                    Search: {filters.search}
                                </span>
                            )}
                            {filters.min_price && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                                    Min: ৳{filters.min_price}
                                </span>
                            )}
                            {filters.max_price && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                                    Max: ৳{filters.max_price}
                                </span>
                            )}
                            {filters.in_stock === "true" && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                                    In Stock Only
                                </span>
                            )}
                            {filters.sort && filters.sort !== "latest" && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
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

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {products.data?.length ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-12">
                        No products found.
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
};

export default ProductList;
