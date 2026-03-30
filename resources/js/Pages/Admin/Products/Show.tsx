import Header from "@/Components/Layouts/Header";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import Master from "@/Layouts/Master";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { ShowPageProps, ProductVariation } from "@/types";
import {
    EditIcon,
    ArrowLeftIcon,
    PackageIcon,
    TagIcon,
    LayersIcon,
    AlertTriangleIcon,
    TrendingUpIcon,
    BoxIcon,
} from "lucide-react";
import ImageGallery from "@/Components/Ui/ImageGallery";
import { formatPrice, getAssetUrl, ensureVariationImagePath } from "@/Utils/helpers";

// ── helpers ───────────────────────────────────────────────────────────────────

function variantTotalStock(variations: ProductVariation[]): number {
    return variations.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
}

function variantPriceRange(variations: ProductVariation[]): { min: number; max: number } | null {
    const prices = variations.map((v) => Number(v.price) || 0).filter((p) => p > 0);
    if (!prices.length) return null;
    return { min: Math.min(...prices), max: Math.max(...prices) };
}

// ── component ─────────────────────────────────────────────────────────────────

export default function Show({ product }: ShowPageProps) {
    const isVariant = product.product_type === "variant";
    const variations = product.product_variations ?? [];

    // Single product stats
    const profit = !isVariant ? product.sale_price - product.purchase_price : null;
    const profitPct =
        profit !== null && product.purchase_price > 0
            ? ((profit / product.purchase_price) * 100).toFixed(1)
            : null;

    // Variant stats
    const totalStock = isVariant ? variantTotalStock(variations) : (product.stock || 0);
    const priceRange = isVariant ? variantPriceRange(variations) : null;

    const getAttributeName = (variation: ProductVariation) =>
        variation.product_attribute?.name ?? variation.attribute_id?.toString() ?? "—";

    return (
        <Master
            title={product.name}
            head={<Header title={product.name} showUserMenu={true} />}
        >
            <div className="lg:p-8 p-4 max-w-8xl mx-auto">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">
                                Active
                            </span>
                            {isVariant && (
                                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#2DE3A7]/10 text-[#2DE3A7] border border-[#2DE3A7]/30">
                                    <LayersIcon size={11} />
                                    Variable Product
                                </span>
                            )}
                        </div>
                        <p className="text-gray-400 flex items-center gap-2 text-sm">
                            <TagIcon size={13} />
                            {product.category?.title ?? "No Category"}
                            {product.brand && (
                                <>
                                    <span className="mx-1">•</span>
                                    {product.brand.title}
                                </>
                            )}
                            <span className="mx-1">•</span>
                            ID: {product.id.toString().padStart(6, "0")}
                        </p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <PrimaryButton as="link" href={route("admin.products.index")} variant="outline" className="justify-center">
                            <ArrowLeftIcon size={15} className="mr-2" />
                            Back
                        </PrimaryButton>
                        <PrimaryButton as="link" href={route("admin.product.edit", product.id)} className="justify-center">
                            <EditIcon size={15} className="mr-2" />
                            Edit Product
                        </PrimaryButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* ── Left: images + quick stats ── */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card padding="none" className="overflow-hidden">
                            <CardContent padding="none" className="p-4 bg-[#0C1311]">
                                {product.images?.length ? (
                                    <ImageGallery
                                        images={product.images.map((url, i) => ({
                                            id: i.toString(),
                                            url: getAssetUrl(url),
                                            alt: `${product.name} image ${i + 1}`,
                                        }))}
                                    />
                                ) : (
                                    <div className="aspect-square flex items-center justify-center bg-[#1E2826] rounded-lg text-gray-500">
                                        <div className="text-center">
                                            <PackageIcon className="w-14 h-14 mx-auto mb-2 opacity-40" />
                                            <p className="text-sm">No images</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Stats */}
                        <Card padding="none">
                            <CardHeader className="px-6 pt-5">
                                <CardTitle className="text-base">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent padding="none" className="px-6 pb-5 pt-3 space-y-3">
                                {isVariant ? (
                                    <>
                                        {/* Total stock across all variations */}
                                        <StatRow
                                            icon={<LayersIcon size={16} />}
                                            iconBg="bg-[#2DE3A7]/10 text-[#2DE3A7]"
                                            label="Total Stock"
                                            value={
                                                <span className={totalStock <= 10 ? "text-red-400" : "text-white"}>
                                                    {totalStock}
                                                    {totalStock <= 10 && (
                                                        <span className="ml-2 text-xs text-red-400 font-normal">Low stock</span>
                                                    )}
                                                </span>
                                            }
                                        />
                                        <StatRow
                                            icon={<BoxIcon size={16} />}
                                            iconBg="bg-blue-500/10 text-blue-400"
                                            label="Variants"
                                            value={<span className="text-white">{variations.length}</span>}
                                        />
                                        {priceRange && (
                                            <StatRow
                                                icon={<TrendingUpIcon size={16} />}
                                                iconBg="bg-amber-500/10 text-amber-400"
                                                label="Price Range"
                                                value={
                                                    <span className="text-[#2DE3A7]">
                                                        {priceRange.min === priceRange.max
                                                            ? formatPrice(priceRange.min)
                                                            : `${formatPrice(priceRange.min)} – ${formatPrice(priceRange.max)}`}
                                                    </span>
                                                }
                                            />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <StatRow
                                            icon={<LayersIcon size={16} />}
                                            iconBg="bg-blue-500/10 text-blue-400"
                                            label="Stock"
                                            value={
                                                <span className={totalStock <= 10 ? "text-red-400" : "text-white"}>
                                                    {totalStock}
                                                    {totalStock <= 10 && (
                                                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-red-400 font-normal">
                                                            <AlertTriangleIcon size={10} /> Low
                                                        </span>
                                                    )}
                                                </span>
                                            }
                                        />
                                        {profit !== null && (
                                            <StatRow
                                                icon={<TrendingUpIcon size={16} />}
                                                iconBg="bg-[#2DE3A7]/10 text-[#2DE3A7]"
                                                label="Profit"
                                                value={
                                                    <span className="text-[#2DE3A7]">
                                                        {formatPrice(profit)}
                                                        {profitPct && (
                                                            <span className="ml-2 text-xs bg-[#2DE3A7]/10 px-1.5 py-0.5 rounded">
                                                                {profitPct}%
                                                            </span>
                                                        )}
                                                    </span>
                                                }
                                            />
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── Right: pricing + details ── */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Pricing card */}
                        <Card padding="none" className="border-l-4 border-l-[#2DE3A7]">
                            <CardContent padding="none" className="p-6">
                                {isVariant ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                                        <PriceCell
                                            label="Base Cost"
                                            value={product.purchase_price > 0 ? formatPrice(product.purchase_price) : "—"}
                                            valueClass="text-white"
                                        />
                                        <PriceCell
                                            label="Price Range"
                                            value={
                                                priceRange
                                                    ? priceRange.min === priceRange.max
                                                        ? formatPrice(priceRange.min)
                                                        : `${formatPrice(priceRange.min)} – ${formatPrice(priceRange.max)}`
                                                    : "Not set"
                                            }
                                            valueClass="text-[#2DE3A7]"
                                        />
                                        <PriceCell
                                            label="Variants"
                                            value={`${variations.length} option${variations.length !== 1 ? "s" : ""}`}
                                            valueClass="text-white"
                                        />
                                        <PriceCell
                                            label="Total Stock"
                                            value={totalStock.toString()}
                                            valueClass={totalStock <= 10 ? "text-red-400" : "text-white"}
                                        />
                                        {product.brand && (
                                            <PriceCell label="Brand" value={product.brand.title} valueClass="text-gray-300" />
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                        <PriceCell
                                            label="Sale Price"
                                            value={formatPrice(product.sale_price)}
                                            valueClass="text-[#2DE3A7] text-xl"
                                        />
                                        {product.has_discount && product.discounted_sale_price != null && (
                                            <PriceCell
                                                label="Offer Price"
                                                value={formatPrice(Number(product.discounted_sale_price))}
                                                valueClass="text-amber-400 text-xl"
                                            />
                                        )}
                                        <PriceCell
                                            label="Purchase Price"
                                            value={formatPrice(product.purchase_price)}
                                            valueClass="text-white"
                                        />
                                        {profit !== null && (
                                            <div>
                                                <p className="text-sm text-gray-400 mb-1">Profit</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-lg font-bold text-[#2DE3A7]">{formatPrice(profit)}</p>
                                                    {profitPct && (
                                                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-[#2DE3A7]/10 text-[#2DE3A7]">
                                                            {profitPct}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {product.brand && (
                                            <PriceCell label="Brand" value={product.brand.title} valueClass="text-gray-300" />
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card padding="none">
                            <CardHeader className="px-6 pt-5">
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent padding="none" className="px-6 pb-6 pt-2">
                                <div
                                    className="prose prose-invert max-w-none text-gray-300 leading-relaxed text-sm"
                                    dangerouslySetInnerHTML={{
                                        __html: (product.description || "No description provided.")
                                            .replace(/\\n/g, "<br/>")
                                            .replace(/\n/g, "<br/>"),
                                    }}
                                />
                            </CardContent>
                        </Card>

                        {/* Variations table — only for variant products */}
                        {isVariant && variations.length > 0 && (
                            <Card padding="none">
                                <CardHeader className="px-6 pt-5">
                                    <CardTitle className="flex items-center gap-2">
                                        <LayersIcon size={16} className="text-[#2DE3A7]" />
                                        Variations
                                        <span className="ml-1 text-xs font-normal text-gray-500">({variations.length})</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent padding="none">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-400 uppercase bg-[#0C1311] border-b border-[#1E2826]">
                                                <tr>
                                                    <th className="px-5 py-3">Image</th>
                                                    <th className="px-5 py-3">Attribute</th>
                                                    <th className="px-5 py-3">Value</th>
                                                    <th className="px-5 py-3">Stock</th>
                                                    <th className="px-5 py-3">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#1E2826]">
                                                {variations.map((variation) => {
                                                    const vStock = Number(variation.stock) || 0;
                                                    const vPrice = Number(variation.price) || 0;
                                                    return (
                                                        <tr key={variation.id} className="hover:bg-[#0C1311] transition-colors">
                                                            <td className="px-5 py-3">
                                                                {variation.image ? (
                                                                    <img
                                                                        src={getAssetUrl(ensureVariationImagePath(variation.image))}
                                                                        alt={variation.value}
                                                                        className="w-10 h-10 rounded-lg object-cover border border-[#1E2826]"
                                                                        onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-lg border border-[#1E2826] bg-[#0C1311] flex items-center justify-center text-gray-600 text-xs">
                                                                        —
                                                                    </div>
                                                                )}
                                                            </td>
                                                            <td className="px-5 py-3 font-medium text-gray-300">
                                                                {getAttributeName(variation)}
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <span className="px-2 py-1 bg-[#1E2826] rounded-md text-gray-200 text-xs font-medium">
                                                                    {variation.value}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                <span className={`font-medium ${vStock <= 5 ? "text-red-400" : "text-white"}`}>
                                                                    {vStock}
                                                                    {vStock <= 5 && vStock > 0 && (
                                                                        <span className="ml-1 text-[10px] text-red-400">Low</span>
                                                                    )}
                                                                    {vStock === 0 && (
                                                                        <span className="ml-1 text-[10px] text-red-500">Out</span>
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-3">
                                                                {vPrice > 0 ? (
                                                                    <span className="font-semibold text-[#2DE3A7]">
                                                                        {formatPrice(vPrice)}
                                                                    </span>
                                                                ) : (
                                                                    <span className="text-gray-600 italic text-xs">Not set</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Qty Pricing */}
                        {product.qty_price && product.qty_price.length > 0 && (
                            <Card padding="none">
                                <CardHeader className="px-6 pt-5">
                                    <CardTitle>Wholesale Pricing</CardTitle>
                                </CardHeader>
                                <CardContent padding="none">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#1E2826] border-t border-[#1E2826]">
                                        {product.qty_price.map((qp, i) => (
                                            <div key={i} className="p-4 flex flex-col items-center text-center hover:bg-[#0C1311] transition-colors">
                                                <span className="text-xs text-gray-500 mb-1">Buy {qp.qty}+ units</span>
                                                <span className="text-lg font-bold text-[#2DE3A7]">{formatPrice(qp.price)}</span>
                                                <span className="text-xs text-gray-500 mt-1">per unit</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </Master>
    );
}

// ── small shared sub-components ───────────────────────────────────────────────

function StatRow({
    icon,
    iconBg,
    label,
    value,
}: {
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div className="flex justify-between items-center p-3 bg-[#0C1311] rounded-lg border border-[#1E2826]">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
                <span className="text-sm font-medium text-gray-300">{label}</span>
            </div>
            <div className="text-right text-base font-bold">{value}</div>
        </div>
    );
}

function PriceCell({
    label,
    value,
    valueClass = "text-white",
}: {
    label: string;
    value: string;
    valueClass?: string;
}) {
    return (
        <div>
            <p className="text-sm text-gray-400 mb-1">{label}</p>
            <p className={`text-lg font-bold ${valueClass}`}>{value}</p>
        </div>
    );
}
