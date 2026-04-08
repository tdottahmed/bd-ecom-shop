import React, { useState, useEffect, useRef, useCallback } from "react";
import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import ProductCard from "@/Components/Customer/ProductCard";
import FilterSidebar from "@/Components/Customer/FilterSidebar";
import ProductFilters from "@/Components/Customer/ProductFilters";
import { Category, PaginatedData, Product } from "@/types";
import CtaSection from "@/Components/Customer/CtaSection";
import { ChevronRight, Home, PackageSearch } from "lucide-react";

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
        category_id?: string;
        brand_id?: string;
    };
    categories?: Category[];
    brands?: { id: number; title: string; slug: string }[];
}

const ProductSkeleton = () => (
    <div className="animate-pulse rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm">
        <div className="bg-gray-100 aspect-square w-full" />
        <div className="p-3 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-7 bg-gray-100 rounded w-full mt-2" />
        </div>
    </div>
);

const ProductList: React.FC<ProductListProps> = ({
    products,
    category,
    filters = {},
    categories = [],
    brands = [],
}) => {
    const title = category
        ? `${category.title} - Products`
        : "All Products";

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sort, setSort] = useState(filters.sort || "latest");

    const [allProducts, setAllProducts] = useState<Product[]>(products.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(products.next_page_url);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const isLoadMoreRef = useRef(false);
    const isLoadingMoreRef = useRef(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const currentUrl = category
        ? route("products.category", category.slug)
        : route("products.index");

    useEffect(() => {
        if (isLoadMoreRef.current) {
            setAllProducts((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const newItems = products.data.filter((p) => !existingIds.has(p.id));
                return [...prev, ...newItems];
            });
            isLoadMoreRef.current = false;
        } else {
            setAllProducts(products.data);
        }
        setNextPageUrl(products.next_page_url);
        setIsLoadingMore(false);
        isLoadingMoreRef.current = false;
    }, [products]);

    const loadMore = useCallback(() => {
        if (!nextPageUrl || isLoadingMoreRef.current) return;
        isLoadingMoreRef.current = true;
        isLoadMoreRef.current = true;
        setIsLoadingMore(true);
        router.visit(nextPageUrl, {
            preserveState: true,
            preserveScroll: true,
            only: ["products"],
        });
    }, [nextPageUrl]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && nextPageUrl && !isLoadingMoreRef.current) {
                    loadMore();
                }
            },
            { threshold: 0, rootMargin: "300px" },
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [nextPageUrl, loadMore]);

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

    const handleApplyFilters = (params: Record<string, string>) => {
        let targetUrl = currentUrl;
        if (params.category_id) {
            const selectedCat = categories?.find((c) => c.id.toString() === params.category_id);
            if (selectedCat) {
                targetUrl = route("products.category", selectedCat.slug);
                delete params.category_id;
            }
        } else if (currentUrl.includes("/category/")) {
            targetUrl = route("products.index");
        }
        router.visit(targetUrl, { data: params, preserveState: true, preserveScroll: true });
    };

    const handleRemoveFilter = (key: string) => {
        const params: Record<string, string> = {};
        Object.entries(filters).forEach(([k, v]) => {
            if (k !== key && v) params[k] = String(v);
        });
        let targetUrl = currentUrl;
        if (key === "category_id" && currentUrl.includes("/category/")) {
            targetUrl = route("products.index");
        }
        router.visit(targetUrl, {
            data: params,
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleSearch = (query: string) => {
        const params: Record<string, string> = {};
        if (query) params.search = query;
        if (filters.min_price) params.min_price = filters.min_price;
        if (filters.max_price) params.max_price = filters.max_price;
        if (sort && sort !== "latest") params.sort = sort;
        if (filters.in_stock) params.in_stock = filters.in_stock;
        if (filters.is_preorder) params.is_preorder = filters.is_preorder;
        if (filters.stock_out) params.stock_out = filters.stock_out;
        if (filters.category_id) params.category_id = filters.category_id;
        if (filters.brand_id) params.brand_id = filters.brand_id;
        router.visit(currentUrl, {
            data: params,
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasMore = !!nextPageUrl;
    const isEmpty = allProducts.length === 0;

    const activeFilterCount = [
        filters.search,
        filters.min_price,
        filters.max_price,
        filters.in_stock,
        filters.category_id,
        filters.brand_id,
        filters.is_preorder,
        filters.stock_out,
    ].filter(Boolean).length;

    return (
        <CustomerLayout>
            <Head title={title} />

            <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                categories={categories}
                brands={brands}
                onApply={handleApplyFilters}
            />

            <div className="min-h-screen bg-brand-ivory">

                {/* ── Breadcrumb ── */}
                {/* <div className="bg-white border-b border-gray-100">
                    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3">
                        <nav className="flex items-center gap-1.5 text-sm text-gray-500">
                            <Link
                                href={route("home")}
                                className="flex items-center gap-1 hover:text-brand-primary transition-colors"
                            >
                                <Home size={14} />
                                <span>Home</span>
                            </Link>
                            <ChevronRight size={14} className="text-gray-300" />
                            <Link
                                href={route("products.index")}
                                className={`hover:text-brand-primary transition-colors ${!category ? "text-brand-primary font-medium" : ""}`}
                            >
                                Products
                            </Link>
                            {category && (
                                <>
                                    <ChevronRight size={14} className="text-gray-300" />
                                    <span className="text-brand-primary font-medium truncate max-w-[160px]">
                                        {category.title}
                                    </span>
                                </>
                            )}
                        </nav>
                    </div>
                </div> */}

                {/* ── Category Hero ── */}
                {category && (
                    <div className="bg-gradient-to-r from-brand-bg via-white to-brand-bg border-b border-brand-primary/10">
                        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-brand-primary uppercase tracking-widest mb-2">
                                        Category
                                    </p>
                                    <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
                                        {category.title}
                                    </h1>
                                    {products.total > 0 && (
                                        <p className="mt-2 text-gray-500 text-sm">
                                            {products.total.toLocaleString()} product{products.total !== 1 ? "s" : ""} available
                                        </p>
                                    )}
                                </div>
                                <div className="shrink-0">
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-semibold">
                                        {products.total.toLocaleString()} Items
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── All Products heading (non-category) ── */}
                {!category && (
                    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-2">
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-dark tracking-tight">
                                    All Products
                                </h1>
                                {products.total > 0 && (
                                    <p className="mt-1 text-sm text-gray-500">
                                        {products.total.toLocaleString()} product{products.total !== 1 ? "s" : ""} found
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Filters + Grid ── */}
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-4">

                    {/* Filters toolbar */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-5 overflow-hidden">
                        <ProductFilters
                            sort={sort}
                            setSort={setSort}
                            setIsFilterOpen={setIsFilterOpen}
                            filters={filters}
                            categories={categories}
                            brands={brands}
                            totalCount={products.total}
                            activeFilterCount={activeFilterCount}
                            onRemoveFilter={handleRemoveFilter}
                            onSearch={handleSearch}
                        />
                    </div>

                    {/* Product grid */}
                    {isEmpty ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center py-24 px-4 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-brand-bg flex items-center justify-center mb-5">
                                <PackageSearch size={36} className="text-brand-primary/60" />
                            </div>
                            <h3 className="text-lg font-bold text-brand-dark mb-1">
                                No products found
                            </h3>
                            <p className="text-sm text-gray-500 max-w-sm mb-6">
                                Try adjusting your filters or search to find what you're looking for.
                            </p>
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={() => router.visit(currentUrl, { replace: true })}
                                    className="px-5 py-2 bg-brand-primary text-white text-sm font-semibold rounded-full hover:bg-brand-primary/85 transition-colors"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                                {allProducts.map((product, i) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        index={i}
                                    />
                                ))}
                                {isLoadingMore &&
                                    Array.from({ length: 6 }).map((_, i) => (
                                        <ProductSkeleton key={`skeleton-${i}`} />
                                    ))}
                            </div>

                            {/* Sentinel + footer */}
                            <div ref={sentinelRef} className="mt-10 flex flex-col items-center gap-4">
                                {isLoadingMore && (
                                    <div className="flex items-center gap-2.5 text-sm text-gray-500">
                                        <span className="w-5 h-5 rounded-full border-2 border-brand-primary/30 border-t-brand-primary animate-spin" />
                                        Loading more products…
                                    </div>
                                )}

                                {!hasMore && !isLoadingMore && allProducts.length > 0 && (
                                    <div className="flex items-center gap-4 text-sm text-gray-400 py-2">
                                        <span className="h-px w-16 bg-gray-200" />
                                        <span className="whitespace-nowrap">
                                            All <span className="font-semibold text-brand-dark">{products.total.toLocaleString()}</span> products shown
                                        </span>
                                        <span className="h-px w-16 bg-gray-200" />
                                    </div>
                                )}

                                {hasMore && !isLoadingMore && (
                                    <button
                                        onClick={loadMore}
                                        className="px-6 py-2.5 border border-brand-primary/30 text-brand-primary text-sm font-semibold rounded-full hover:bg-brand-bg transition-colors"
                                    >
                                        Load more
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="max-w-full mx-auto px-4 md:px-6 py-8 md:py-12">
                <CtaSection />
            </div>
        </CustomerLayout>
    );
};

export default ProductList;
