import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import ProductCard from "@/Components/Customer/ProductCard";
import FilterSidebar from "@/Components/Customer/FilterSidebar";
import ProductFilters from "@/Components/Customer/ProductFilters";
import Pagination from "@/Components/Ui/Pagination";
import ScrollReveal from "@/Components/Ui/ScrollReveal";
import { Category, PaginatedData, Product } from "@/types";

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
        stock_out?: string;
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
    const [sort, setSort] = useState(filters.sort || "latest");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (sort !== (filters.sort || "latest")) {
                const params: Record<string, string> = {};
                if (filters.search) params.search = filters.search;
                if (filters.min_price) params.min_price = filters.min_price;
                if (filters.max_price) params.max_price = filters.max_price;
                if (sort && sort !== "latest") params.sort = sort;
                if (filters.in_stock) params.in_stock = filters.in_stock;
                if (filters.is_preorder) params.is_preorder = filters.is_preorder;
                if (filters.stock_out) params.stock_out = filters.stock_out;

                const currentUrl = category
                    ? route("products.category", category.slug)
                    : route("products.index");

                router.visit(currentUrl, {
                    data: params,
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [sort, filters, category]);

    const currentUrl = category
        ? route("products.category", category.slug)
        : route("products.index");

    return (
        <CustomerLayout>
            <Head title={title} />

            <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
                {/* Background accents */}
                <div className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center">
                    <div className="h-72 w-[36rem] rounded-full bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 opacity-40 blur-3xl" />
                </div>
                <div className="pointer-events-none absolute -bottom-32 left-0 h-64 w-64 rounded-full bg-emerald-300/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-indigo-300/25 blur-3xl" />

                <FilterSidebar
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    currentUrl={currentUrl}
                />

                <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
                    {/* Header Layout */}
                    <ScrollReveal animation="fade-up" delay="delay-100">
                        <div className="text-center mb-6 mt-4">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                                {category ? category.title : "All Products"}
                            </h1>
                            {category && (
                                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                                    Browse our premium collection of {category.title}
                                </p>
                            )}
                        </div>
                    </ScrollReveal>

                    {/* Filters & Grid Container */}
                    <ScrollReveal animation="fade-up" delay="delay-150">
                        <div className="rounded-3xl border border-slate-100 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl overflow-hidden">
                            <ProductFilters
                                sort={sort}
                                setSort={setSort}
                                setIsFilterOpen={setIsFilterOpen}
                                filters={filters}
                            />
                            
                            <div className="p-4 sm:p-6 lg:p-8">
                                {products.data?.length ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6">
                                        {products.data.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-24 text-center">
                                        <div className="rounded-full bg-indigo-50 p-6 mb-4">
                                            <svg className="h-12 w-12 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria to find what you're looking for.</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Pagination Component */}
                            {products.last_page > 1 && (
                                <div className="border-t border-gray-100 overflow-hidden">
                                    <Pagination data={products} preserveScroll={true} />
                                </div>
                            )}
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default ProductList;
