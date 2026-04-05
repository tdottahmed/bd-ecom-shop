import React, { useState } from "react";
import ProductCard from "./ProductCard";
import StockUpdateDialog from "./StockUpdateDialog";
import { Product } from "@/types";

interface ProductsGridProps {
    products: Product[];
    isLoading?: boolean;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
    products,
    isLoading = false,
}) => {
    const [stockProduct, setStockProduct] = useState<Product | null>(null);
    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {[...Array(10)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse"
                    >
                        <div className="aspect-[4/3] bg-gray-200"></div>
                        <div className="p-3 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                            <div className="flex justify-between pt-2">
                                <div className="h-6 bg-gray-200 rounded w-16"></div>
                                <div className="h-6 bg-gray-200 rounded w-16"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12 px-4">
                <div className="text-gray-300 text-5xl mb-3">📦</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No products yet
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                    Start by adding your first product to the inventory
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onUpdateStock={() => setStockProduct(product)}
                    />
                ))}
            </div>
            <StockUpdateDialog
                product={stockProduct}
                onClose={() => setStockProduct(null)}
            />
        </>
    );
};

export default ProductsGrid;
