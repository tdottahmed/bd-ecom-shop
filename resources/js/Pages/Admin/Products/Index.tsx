import React, { useState } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import { Link, router } from "@inertiajs/react";
import ProductsGrid from "@/Components/Product/ProductsGrid";
import ProductsList from "@/Components/Product/ProductsList";
import { Plus } from "lucide-react";

import { ProductsIndexProps } from "@/types";

import Pagination from "@/Components/Ui/Pagination";
import HeaderStats from "@/Components/Product/HeaderStats";
import ProductFilters from "@/Components/Product/ProductFilters";

const Index: React.FC<ProductsIndexProps> = ({
    products,
    categories,
    suppliers,
    stats,
    filters,
}) => {
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");

    const clearAllFilters = () => {
        router.get(route("admin.products.index"));
    };

    return (
        <Master
            title="Products"
            head={<Header title="Products" showUserMenu={true} />}
        >
            <div className="md:p-6 space-y-6 max-w-8xl mx-auto">
                <HeaderStats stats={stats} />
                <ProductFilters
                    filters={filters}
                    categories={categories}
                    suppliers={suppliers}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                />

                {/* Products Grid/List */}
                <div className="mt-6">
                    {products.data.length > 0 ? (
                        viewMode === "grid" ? (
                            <ProductsGrid products={products.data} />
                        ) : (
                            <ProductsList products={products.data} />
                        )
                    ) : (
                        <div className="text-center py-12 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
                            <p className="text-gray-400">
                                {" "}
                                No products found matching your filters.
                            </p>
                            <button
                                onClick={clearAllFilters}
                                className="mt-2 text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <Pagination data={products} />

                {/* Bottom Info */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400 pt-4 border-t border-gray-800">
                    <div>
                        Showing {products.from || 0} to {products.to || 0} of{" "}
                        {products.total} products
                        {stats.total !== products.total &&
                            ` (${stats.total} total in inventory)`}
                    </div>
                </div>
                <Link
                    href={route("admin.products.create")}
                    className="fixed bottom-20 right-6 z-50 p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                >
                    <Plus size={24} />
                </Link>
            </div>
        </Master>
    );
};

export default Index;
