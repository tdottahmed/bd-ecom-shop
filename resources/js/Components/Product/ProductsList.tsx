import React from "react";
import { Link } from "@inertiajs/react";
import { Edit2, Eye, Package, TrendingUp, Layers } from "lucide-react";
import { getAssetUrl, formatPrice } from "@/Utils/helpers";
import { Product, ProductVariation } from "@/types";

interface ProductsListProps {
    products: Product[];
    isLoading?: boolean;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function variantStock(variations: ProductVariation[]): number {
    return variations.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
}

function variantPriceRange(variations: ProductVariation[]): { min: number; max: number } | null {
    const prices = variations.map((v) => Number(v.price) || 0).filter((p) => p > 0);
    if (!prices.length) return null;
    return { min: Math.min(...prices), max: Math.max(...prices) };
}

function stockStyle(stock: number) {
    if (stock > 15) return { color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" };
    if (stock > 5)  return { color: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20"  };
    return              { color: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20"    };
}

// ── skeleton ──────────────────────────────────────────────────────────────────

const Skeleton = () => (
    <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-[#0E1614] border border-[#1E2826] rounded-lg p-4 animate-pulse">
                <div className="flex gap-4">
                    <div className="w-24 h-24 bg-[#1E2826] rounded-lg shrink-0" />
                    <div className="flex-1 space-y-3">
                        <div className="h-5 bg-[#1E2826] rounded w-2/3" />
                        <div className="h-4 bg-[#1E2826] rounded w-1/2" />
                        <div className="flex gap-4">
                            <div className="h-4 bg-[#1E2826] rounded w-20" />
                            <div className="h-4 bg-[#1E2826] rounded w-20" />
                        </div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// ── main ──────────────────────────────────────────────────────────────────────

const ProductsList: React.FC<ProductsListProps> = ({ products, isLoading = false }) => {
    if (isLoading) return <Skeleton />;

    if (products.length === 0) {
        return (
            <div className="text-center py-12 bg-[#0E1614] rounded-lg border-2 border-dashed border-[#1E2826]">
                <Package size={40} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 font-medium">No products found</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {products.map((product) => (
                <ProductListItem key={product.id} product={product} />
            ))}
        </div>
    );
};

// ── list item ─────────────────────────────────────────────────────────────────

const ProductListItem: React.FC<{ product: Product }> = ({ product }) => {
    const isVariant = product.product_type === "variant";
    const variations = product.product_variations ?? [];

    const stock = isVariant ? variantStock(variations) : (product.stock || 0);
    const st = stockStyle(stock);

    const priceRange = isVariant ? variantPriceRange(variations) : null;
    const profit = !isVariant ? product.sale_price - product.purchase_price : null;
    const profitPct =
        profit !== null && product.purchase_price > 0
            ? ((profit / product.purchase_price) * 100).toFixed(1)
            : null;

    return (
        <div className="bg-[#0E1614] border border-[#1E2826] rounded-lg hover:border-[#2DE3A7]/30 transition-all duration-200 overflow-hidden">
            <div className="p-4">
                <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative w-24 h-24 bg-[#0F1A18] rounded-lg overflow-hidden shrink-0">
                        <img
                            src={product.images?.length ? getAssetUrl(product.images[0]) : "/placeholder.png"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {isVariant ? (
                            <div className="absolute top-1 left-1 flex items-center gap-1 bg-[#0C1311]/80 border border-[#2DE3A7]/40 text-[#2DE3A7] px-1.5 py-0.5 rounded text-[10px] font-bold">
                                <Layers size={9} />
                                {variations.length}v
                            </div>
                        ) : profitPct !== null ? (
                            <div className="absolute top-1 left-1 bg-[#2DE3A7] text-[#0C1311] px-1.5 py-0.5 rounded text-[10px] font-bold">
                                +{profitPct}%
                            </div>
                        ) : null}
                    </div>

                    {/* Body */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white text-base line-clamp-1">{product.name}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                    {product.category && (
                                        <span className="text-xs text-gray-500">{product.category.title}</span>
                                    )}
                                    {isVariant && (
                                        <span className="text-[10px] font-semibold text-[#2DE3A7] bg-[#2DE3A7]/10 border border-[#2DE3A7]/20 px-1.5 py-0.5 rounded">
                                            VARIANT
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap border ${st.bg} ${st.color} ${st.border}`}>
                                <Package size={11} />
                                {stock} in stock
                            </div>
                        </div>

                        {/* Pricing grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                            {/* Cost */}
                            <div className="bg-[#0C1311] rounded-lg px-3 py-2 border border-[#1E2826]">
                                <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wide">Cost</p>
                                <p className="text-sm font-medium text-gray-300">
                                    {product.purchase_price > 0
                                        ? formatPrice(product.purchase_price)
                                        : <span className="text-gray-600">—</span>}
                                </p>
                            </div>

                            {/* Price / range */}
                            <div className="bg-[#0C1311] rounded-lg px-3 py-2 border border-[#1E2826]">
                                <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wide">
                                    {isVariant ? "Price Range" : "Price"}
                                </p>
                                <p className="text-sm font-semibold text-[#2DE3A7]">
                                    {isVariant
                                        ? priceRange
                                            ? priceRange.min === priceRange.max
                                                ? formatPrice(priceRange.min)
                                                : `${formatPrice(priceRange.min)} – ${formatPrice(priceRange.max)}`
                                            : <span className="text-gray-600 font-normal text-xs">No price set</span>
                                        : formatPrice(product.sale_price)}
                                </p>
                            </div>

                            {/* Profit (single) / Variant count (variant) */}
                            <div className="bg-[#0C1311] rounded-lg px-3 py-2 border border-[#1E2826]">
                                <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wide flex items-center gap-1">
                                    {isVariant
                                        ? <><Layers size={9} /> Variants</>
                                        : <><TrendingUp size={9} /> Profit</>}
                                </p>
                                <p className="text-sm font-bold text-[#2DE3A7]">
                                    {isVariant
                                        ? `${variations.length} option${variations.length !== 1 ? "s" : ""}`
                                        : profit !== null
                                            ? formatPrice(profit)
                                            : <span className="text-gray-600">—</span>}
                                </p>
                            </div>

                            {/* Discounted price or brand */}
                            <div className="bg-[#0C1311] rounded-lg px-3 py-2 border border-[#1E2826]">
                                <p className="text-[10px] text-gray-500 mb-0.5 uppercase tracking-wide">
                                    {product.has_discount ? "Offer Price" : "Brand"}
                                </p>
                                <p className="text-sm font-medium truncate">
                                    {product.has_discount && product.discounted_sale_price
                                        ? <span className="text-amber-400">{formatPrice(product.discounted_sale_price)}</span>
                                        : <span className="text-gray-300">{product.brand?.title ?? <span className="text-gray-600">—</span>}</span>}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <Link
                                href={route("admin.product.show", product.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E2826] text-gray-300 rounded-lg text-sm hover:bg-[#2A3633] hover:text-white transition-colors border border-[#2A3633]"
                            >
                                <Eye size={13} />
                                View
                            </Link>
                            <Link
                                href={route("admin.product.edit", product.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2DE3A7]/10 text-[#2DE3A7] rounded-lg text-sm hover:bg-[#2DE3A7]/20 transition-colors border border-[#2DE3A7]/30"
                            >
                                <Edit2 size={13} />
                                Edit
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsList;
