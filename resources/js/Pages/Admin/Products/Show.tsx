import Header from "@/Components/Layouts/Header";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import Master from "@/Layouts/Master";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { ShowPageProps } from "@/types";
import {
    EditIcon,
    ArrowLeftIcon,
    PackageIcon,
    TagIcon,
    LayersIcon,
    AlertTriangleIcon,
} from "lucide-react";
import ImageGallery from "@/Components/Ui/ImageGallery";
import { formatPrice, getAssetUrl } from "@/Utils/helpers";
import { get } from "http";

export default function Show({ product }: ShowPageProps) {
    const profit = product.sale_price - product.purchase_price;
    const profitPercentage = ((profit / product.purchase_price) * 100).toFixed(
        1
    );

    const getCategoryName = () => {
        return product.category?.title || "N/A";
    };

    const getAttributeName = (attributeId: number) => {
        return (
            product.product_variations?.find(
                (v) =>
                    v.attribute_id === attributeId ||
                    v.product_attribute_id === attributeId
            )?.product_attribute?.name || attributeId.toString()
        );
    };

    return (
        <Master
            title={product.name}
            head={<Header title={product.name} showUserMenu={true} />}
        >
            <div className="lg:p-8 p-4 max-w-8xl mx-auto">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-white">
                                {product.name}
                            </h1>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">
                                Active
                            </span>
                        </div>
                        <p className="text-gray-400 flex items-center gap-2">
                            <TagIcon size={14} />
                            {getCategoryName()}
                            <span className="mx-1">•</span>
                            <span className="text-sm">
                                SKU: {product.id.toString().padStart(6, "0")}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <PrimaryButton
                            as="link"
                            href={route("admin.products.index")}
                            variant="outline"
                            className="justify-center"
                        >
                            <ArrowLeftIcon size={16} className="mr-2" />
                            Back
                        </PrimaryButton>
                        <PrimaryButton
                            as="link"
                            href={route("admin.product.edit", product.id)}
                            className="justify-center"
                        >
                            <EditIcon size={16} className="mr-2" />
                            Edit Product
                        </PrimaryButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-5 space-y-6">
                        <Card className="overflow-hidden border-0 shadow-sm">
                            <CardContent
                                padding="none"
                                className="p-4 bg-gray-800"
                            >
                                {product.images && product.images.length > 0 ? (
                                    <ImageGallery
                                        images={product.images.map(
                                            (url, index) => ({
                                                id: index.toString(),
                                                url: getAssetUrl(url),
                                                alt: `${product.name} image ${
                                                    index + 1
                                                }`,
                                            })
                                        )}
                                    />
                                ) : (
                                    <div className="aspect-square flex items-center justify-center bg-gray-700 rounded-lg text-gray-400">
                                        <div className="text-center">
                                            <PackageIcon className="w-16 h-16 mx-auto mb-2 opacity-50" />
                                            <p>No images available </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Stats Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Quick Stats
                                </CardTitle>
                            </CardHeader>
                            <CardContent padding="md">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-900/30 rounded-full text-blue-400">
                                                <LayersIcon size={18} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-300">
                                                Stock
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span
                                                className={`text-lg font-bold ${
                                                    product.stock <= 10
                                                        ? "text-red-500"
                                                        : "text-white"
                                                }`}
                                            >
                                                {product.stock}
                                            </span>
                                            {product.stock <= 10 && (
                                                <div className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
                                                    <AlertTriangleIcon
                                                        size={10}
                                                    />
                                                    Low Stock
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Pricing Card */}
                        <Card className="border-l-4 border-l-emerald-500">
                            <CardContent padding="lg">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">
                                            Sale Price
                                        </p>
                                        <p className="text-xl font-bold text-emerald-400">
                                            {formatPrice(product.sale_price)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">
                                            Purchase Price
                                        </p>
                                        <p className="text-xl font-semibold text-white">
                                            {formatPrice(
                                                product.purchase_price
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">
                                            Profit
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-bold text-emerald-400">
                                                {formatPrice(profit)}
                                            </p>
                                            <span className="text-xs font-medium px-2 py-0.5 rounded bg-emerald-900/30 text-emerald-400">
                                                {profitPercentage} %
                                            </span>
                                        </div>
                                    </div>
                                   
                                    {product.brand && (
                                        <div>
                                            <p className="text-sm text-gray-400 mb-1">
                                                Brand
                                            </p>
                                            <p className="text-lg font-medium text-gray-300">
                                                {product.brand.title}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Description </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-invert max-w-none text-gray-300">
                                    <p className="whitespace-pre-wrap leading-relaxed">
                                        {product.description ||
                                            "No description provided."}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Variations */}
                        {product.product_variations &&
                            product.product_variations.length > 0 && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Variations </CardTitle>
                                    </CardHeader>
                                    <CardContent padding="none">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-gray-400 uppercase bg-gray-800">
                                                    <tr>
                                                        <th className="px-6 py-3">
                                                            Attribute
                                                        </th>
                                                        <th className="px-6 py-3">
                                                            Value
                                                        </th>
                                                        <th className="px-6 py-3">
                                                            Stock
                                                        </th>
                                                        <th className="px-6 py-3">
                                                            Price Override
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {product.product_variations.map(
                                                        (variation) => (
                                                            <tr
                                                                key={
                                                                    variation.id
                                                                }
                                                                className="bg-gray-900 border-b border-gray-800 hover:bg-gray-800/50"
                                                            >
                                                                <td className="px-6 py-4 font-medium text-white">
                                                                    {getAttributeName(
                                                                        variation.attribute_id
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    <span className="px-2 py-1 bg-gray-800 rounded text-gray-300">
                                                                        {
                                                                            variation.value
                                                                        }
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {variation.stock ? (
                                                                        <span
                                                                            className={
                                                                                variation.stock <=
                                                                                5
                                                                                    ? "text-red-500 font-medium"
                                                                                    : "text-white"
                                                                            }
                                                                        >
                                                                            {
                                                                                variation.stock
                                                                            }
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-gray-400 italic">
                                                                            Inherited
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {variation.price ? (
                                                                        <span className="font-medium text-emerald-400">
                                                                            {formatPrice(
                                                                                variation.price
                                                                            )}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-gray-400 italic">
                                                                            Inherited
                                                                        </span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                        {/* Quantity Prices */}
                        {product.qty_price && product.qty_price.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Wholesale Pricing </CardTitle>
                                </CardHeader>
                                <CardContent padding="none">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-700 border-t border-gray-700">
                                        {product.qty_price.map(
                                            (qtyPrice, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 flex flex-col items-center justify-center text-center hover:bg-gray-800/50 transition-colors"
                                                >
                                                    <span className="text-sm text-gray-400 mb-1">
                                                        Buy {qtyPrice.qty} +
                                                        units
                                                    </span>
                                                    <span className="text-lg font-bold text-emerald-400">
                                                        {formatPrice(
                                                            qtyPrice.price
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-gray-400 mt-1">
                                                        per unit
                                                    </span>
                                                </div>
                                            )
                                        )}
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
