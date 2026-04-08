import React, { useState, useEffect, useRef, useCallback } from "react";
import { Head, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import ProductCard from "@/Components/Customer/ProductCard";
import FilterSidebar from "@/Components/Customer/FilterSidebar";
import ProductFilters from "@/Components/Customer/ProductFilters";
import ScrollReveal from "@/Components/Ui/ScrollReveal";
import { Category, PaginatedData, Product } from "@/types";
import CtaSection from "@/Components/Customer/CtaSection";

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
    <div className="animate-pulse rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-sm">
        <div className="bg-slate-200 aspect-square w-full" />
        <div className="p-3 space-y-2">
            <div className="h-3 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-4 bg-slate-200 rounded w-2/5 mt-1" />
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
        ? `${category.title} - Paikari World`
        : "All Products - Paikari World";

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sort, setSort] = useState(filters.sort || "latest");

    // Infinite scroll state
    const [allProducts, setAllProducts] = useState<Product[]>(products.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(
        products.next_page_url,
    );
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Refs to avoid stale closures
    const isLoadMoreRef = useRef(false);
    const isLoadingMoreRef = useRef(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    // Sync when products prop changes (filter/sort navigation resets; load-more appends)
    useEffect(() => {
        if (isLoadMoreRef.current) {
            setAllProducts((prev) => {
                const existingIds = new Set(prev.map((p) => p.id));
                const newItems = products.data.filter(
                    (p) => !existingIds.has(p.id),
                );
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

    // IntersectionObserver on sentinel
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    nextPageUrl &&
                    !isLoadingMoreRef.current
                ) {
                    loadMore();
                }
            },
            { threshold: 0, rootMargin: "300px" },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [nextPageUrl, loadMore]);

    // Sort change navigation (reset, not load-more)
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (sort !== (filters.sort || "latest")) {
                const params: Record<string, string> = {};
                if (filters.search) params.search = filters.search;
                if (filters.min_price) params.min_price = filters.min_price;
                if (filters.max_price) params.max_price = filters.max_price;
                if (sort && sort !== "latest") params.sort = sort;
                if (filters.in_stock) params.in_stock = filters.in_stock;
                if (filters.is_preorder)
                    params.is_preorder = filters.is_preorder;
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

    const handleApplyFilters = (params: Record<string, string>) => {
        let targetUrl = currentUrl;

        if (params.category_id) {
            const selectedCat = categories?.find(
                (c) => c.id.toString() === params.category_id,
            );
            if (selectedCat) {
                targetUrl = route("products.category", selectedCat.slug);
                delete params.category_id;
            }
        } else if (currentUrl.includes("/category/")) {
            targetUrl = route("products.index");
        }

        router.visit(targetUrl, {
            data: params,
            preserveState: true,
            preserveScroll: true,
        });
    };

    const hasMore = !!nextPageUrl;
    const isEmpty = allProducts.length === 0;

    return (
        <CustomerLayout>
            <Head title={title} />

            <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
                {/* Background accents */}
                <div className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center">
                    <div className="h-72 w-[36rem] rounded-full bg-gradient-to-r from-brand-primary via-brand-tint to-brand-accent opacity-20 blur-3xl" />
                </div>
                <div className="pointer-events-none absolute -bottom-32 left-0 h-64 w-64 rounded-full bg-brand-success/15 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-brand-primary/15 blur-3xl" />

                <FilterSidebar
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    categories={categories}
                    brands={brands}
                    onApply={handleApplyFilters}
                />

                <div className="relative mx-auto flex max-w-full flex-col gap-6 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
                    {/* Header */}
                    <ScrollReveal animation="fade-up" delay="delay-100">
                        <div className="text-center mb-6 mt-4">
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                                {category ? category.title : "All Products"}
                            </h1>
                            {category && (
                                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                                    Browse our premium collection of{" "}
                                    {category.title}
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
                                {isEmpty ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-center">
                                        <div className="rounded-full bg-brand-bg p-6 mb-4">
                                            <svg
                                                className="h-12 w-12 text-brand-primary/50"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                                />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">
                                            No products found
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Try adjusting your search or filter
                                            criteria to find what you're looking
                                            for.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Product grid — 2 cols mobile → 3 tablet → 4 md → 5 desktop */}
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
                                            {allProducts.map((product) => (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                />
                                            ))}

                                            {/* Skeleton cards during load */}
                                            {isLoadingMore &&
                                                Array.from({ length: 5 }).map(
                                                    (_, i) => (
                                                        <ProductSkeleton
                                                            key={`skeleton-${i}`}
                                                        />
                                                    ),
                                                )}
                                        </div>

                                        {/* Sentinel + status footer */}
                                        <div
                                            ref={sentinelRef}
                                            className="mt-8 flex flex-col items-center gap-3"
                                        >
                                            {isLoadingMore && (
                                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                                    <svg
                                                        className="h-4 w-4 animate-spin text-brand-primary"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                        />
                                                    </svg>
                                                    Loading more products…
                                                </div>
                                            )}

                                            {!hasMore && !isLoadingMore && (
                                                <div className="flex items-center gap-3 text-sm text-slate-400 py-4">
                                                    <span className="h-px w-16 bg-slate-200" />
                                                    Showing all {products.total}{" "}
                                                    products
                                                    <span className="h-px w-16 bg-slate-200" />
                                                </div>
                                            )}

                                            {/* Manual fallback button when auto-scroll missed */}
                                            {hasMore && !isLoadingMore && (
                                                <button
                                                    onClick={loadMore}
                                                    className="text-sm text-brand-primary hover:text-brand-primary/80 underline underline-offset-2"
                                                >
                                                    Load more
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </div>

            <div className="max-w-full mx-auto px-4 md:px-6 py-8 md:py-12">
                <CtaSection />
            </div>
        </CustomerLayout>
    );
};

export default ProductList;
