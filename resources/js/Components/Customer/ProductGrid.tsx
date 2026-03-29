import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import ProductCard from "./ProductCard";
import { Category, Product } from "@/types";
import { ChevronRight, Loader2 } from "lucide-react";

export interface CategoryProducts {
    category: Category;
    products: {
        data: Product[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

interface ProductGridProps {
    productsByCategory: CategoryProducts[];
    filters?: {
        search?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
        in_stock?: string;
    };
}

const ProductGrid: React.FC<ProductGridProps> = ({
    productsByCategory,
    filters = {},
}) => {
    const [sections, setSections] = useState<
        Record<
            number,
            { products: Product[]; nextPage: number | null; loading?: boolean }
        >
    >(() => {
        const initial: Record<
            number,
            { products: Product[]; nextPage: number | null }
        > = {};
        productsByCategory?.forEach(({ category, products: p }) => {
            initial[category.id] = {
                products: p?.data ?? [],
                nextPage:
                    p && p.current_page < p.last_page
                        ? p.current_page + 1
                        : null,
            };
        });
        return initial;
    });

    useEffect(() => {
        const next: Record<
            number,
            { products: Product[]; nextPage: number | null }
        > = {};
        productsByCategory?.forEach(({ category, products: p }) => {
            next[category.id] = {
                products: p?.data ?? [],
                nextPage:
                    p && p.current_page < p.last_page
                        ? p.current_page + 1
                        : null,
            };
        });
        setSections(next);
    }, [productsByCategory]);

    const loadMore = async (category: Category) => {
        const section = sections[category.id];
        if (!section?.nextPage || section.loading) return;

        setSections((prev) => ({
            ...prev,
            [category.id]: { ...prev[category.id], loading: true },
        }));

        const params = new URLSearchParams();
        params.set("page", String(section.nextPage));
        if (filters.search) params.set("search", filters.search);
        if (filters.min_price) params.set("min_price", filters.min_price);
        if (filters.max_price) params.set("max_price", filters.max_price);
        if (filters.sort) params.set("sort", filters.sort);
        if (filters.in_stock) params.set("in_stock", filters.in_stock);

        try {
            const res = await fetch(
                `/api/categories/${encodeURIComponent(category.slug)}/products?${params.toString()}`,
            );
            const json = await res.json();
            const newProducts = (json.data ?? []) as Product[];

            setSections((prev) => {
                const current = prev[category.id];
                const nextPage =
                    json.current_page < json.last_page
                        ? json.current_page + 1
                        : null;
                return {
                    ...prev,
                    [category.id]: {
                        products: [
                            ...(current?.products ?? []),
                            ...newProducts,
                        ],
                        nextPage,
                        loading: false,
                    },
                };
            });
        } catch (e) {
            setSections((prev) => ({
                ...prev,
                [category.id]: { ...prev[category.id], loading: false },
            }));
        }
    };

    if (!productsByCategory?.length) return null;

    return (
        <div className="max-w-full mx-auto px-2 md:px-6 lg:px-8 py-2 md:py-4 lg:py-6">
            <div className="space-y-10 md:space-y-12">
                {productsByCategory.map(({ category }) => {
                    const section = sections[category.id];
                    const products = section?.products ?? [];
                    const hasMore = section?.nextPage != null;
                    const loading = section?.loading ?? false;

                    return (
                        <section
                            key={category.id}
                            className="scroll-mt-4"
                            id={`category-${category.slug}`}
                        >
                            <div className="flex items-center justify-between gap-4 mb-4 md:mb-6">
                                <h2 className="text-lg md:text-xl font-semibold text-slate-800 truncate">
                                    {category.title}
                                </h2>
                                <Link
                                    href={route(
                                        "products.category",
                                        category.slug,
                                    )}
                                    className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 shrink-0"
                                >
                                    View all
                                    <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>

                            {products.length === 0 ? (
                                <div className="rounded-xl border border-slate-100 bg-slate-50/50 py-10 text-center">
                                    <p className="text-slate-500 text-sm">
                                        No products in this category right now.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                        {products.map((product, idx) => (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                index={idx}
                                            />
                                        ))}
                                    </div>

                                    {hasMore && (
                                        <div className="mt-6 flex justify-center">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    loadMore(category)
                                                }
                                                disabled={loading}
                                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 text-slate-700 text-sm font-medium hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none transition-colors"
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Loading…
                                                    </>
                                                ) : (
                                                    "Load more"
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </section>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductGrid;
