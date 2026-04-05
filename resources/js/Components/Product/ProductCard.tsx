import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { Edit2, Eye, Box, Layers, PackagePlus } from "lucide-react";
import { getAssetUrl, formatPrice } from "@/Utils/helpers";
import { Product, ProductVariation } from "@/types";

interface ProductCardProps {
    product: Product;
    onEdit?: (product: Product) => void;
    onUpdateStock?: (product: Product) => void;
}

function variantStock(variations: ProductVariation[]): number {
    return variations.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
}

function variantPriceRange(variations: ProductVariation[]): { min: number; max: number } | null {
    const prices = variations.map((v) => Number(v.price) || 0).filter((p) => p > 0);
    if (!prices.length) return null;
    return { min: Math.min(...prices), max: Math.max(...prices) };
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onUpdateStock }) => {
    const { additionalCost } = usePage().props as any;
    const isVariant = product.product_type === "variant";
    const variations = product.product_variations ?? [];

    const displayStock = isVariant ? variantStock(variations) : (product.stock || 0);
    const priceRange = isVariant ? variantPriceRange(variations) : null;

    const actualCost = (product.purchase_price || 0) + (parseFloat(additionalCost) || 0);
    const profit = !isVariant ? product.sale_price - actualCost : null;

    const isNew = new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return (
        <div className="bg-[#0E1614] border border-[#1E2826] rounded-lg shadow-sm hover:shadow-lg hover:border-[#2DE3A7]/30 transition-all duration-300 overflow-hidden group flex flex-col h-full relative">
            {/* Image */}
            <div className="relative aspect-[4/4] bg-[#F5F5F0] overflow-hidden shrink-0">
                <img
                    src={product.images?.length ? getAssetUrl(product.images[0]) : "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />

                {isNew && (
                    <div className="absolute top-2 left-2 bg-[#0C1311] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        NEW
                    </div>
                )}

                {/* Stock / variant badge */}
                {isVariant ? (
                    <div className="absolute bottom-2 left-2 bg-[#2DE3A7] text-[#0C1311] text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <Layers size={12} strokeWidth={2.5} />
                        {displayStock}
                    </div>
                ) : (
                    <div className="absolute bottom-2 left-2 bg-[#2DD4BF] text-[#0C1311] text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                        <Box size={12} strokeWidth={2.5} />
                        {displayStock}
                    </div>
                )}

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                    <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Link
                            href={route("admin.product.show", product.id)}
                            className="p-2 bg-white text-black rounded-full hover:bg-[#2DE3A7] transition-colors"
                            title="View"
                        >
                            <Eye size={16} />
                        </Link>
                        <Link
                            href={route("admin.product.edit", product.id)}
                            className="p-2 bg-white text-black rounded-full hover:bg-[#2DE3A7] transition-colors"
                            title="Edit"
                        >
                            <Edit2 size={16} />
                        </Link>
                        <button
                            onClick={() => onUpdateStock?.(product)}
                            className="p-2 bg-white text-black rounded-full hover:bg-amber-400 transition-colors"
                            title="Update Stock"
                        >
                            <PackagePlus size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Name */}
            <div className="p-2 flex-1 flex flex-col justify-center">
                <p className="text-sm font-medium text-white line-clamp-2" title={product.name}>
                    {product.name}
                </p>
                {isVariant && (
                    <p className="text-[10px] text-[#2DE3A7] mt-0.5">{variations.length} variant{variations.length !== 1 ? "s" : ""}</p>
                )}
            </div>

            {/* Footer price info */}
            <div className="bg-[#0C1311] p-2 border-t border-[#1E2826]">
                {isVariant ? (
                    <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="flex flex-col items-center border-r border-[#1E2826] text-xs">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Cost</span>
                            <span className="text-white font-bold">
                                {product.purchase_price > 0 ? formatPrice(product.purchase_price) : "—"}
                            </span>
                        </div>
                        <div className="flex flex-col items-center text-xs">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Price</span>
                            <span className="text-[#2DE3A7] font-bold text-[11px]">
                                {priceRange
                                    ? priceRange.min === priceRange.max
                                        ? formatPrice(priceRange.min)
                                        : `${formatPrice(priceRange.min)}–${formatPrice(priceRange.max)}`
                                    : "—"}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="flex flex-col items-center border-r border-[#1E2826] text-xs">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Buy</span>
                            <span className="text-white font-bold">{formatPrice(product.purchase_price || 0)}</span>
                        </div>
                        <div className="flex flex-col items-center border-r border-[#1E2826] text-xs">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Sale</span>
                            <span className="text-white font-bold">{formatPrice(product.sale_price || 0)}</span>
                        </div>
                        <div className="flex flex-col items-center text-xs">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider">Profit</span>
                            <span className="text-white font-bold">{profit !== null ? formatPrice(profit) : "—"}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
