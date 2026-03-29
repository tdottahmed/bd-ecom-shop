import React from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, Link } from "@inertiajs/react";
import Image from "@/Components/Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";
import ProductCard from "@/Components/Customer/ProductCard";
import NewsletterSection from "@/Components/Customer/NewsletterSection";

type Brand = {
    id: number;
    title: string;
    slug: string;
    image: string | null;
};

interface Props {
    brand: Brand;
    products: any;
}

export default function BrandPage({ brand, products }: Props) {
    return (
        <CustomerLayout>
            <Head title={brand.title} />

            <div className="max-w-full mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <Image
                            src={getAssetUrl(brand.image)}
                            alt={brand.title}
                            className="w-12 h-12 rounded-2xl object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">
                                {brand.title}
                            </h1>
                            <p className="text-gray-600 mt-1 text-sm">
                                {products?.total ?? 0} products
                            </p>
                        </div>
                    </div>
                    <Link
                        href={route("brands.index")}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        All brands
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-6">
                    {(products?.data ?? []).map((p: any) => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>

                {products?.links && (
                    <div className="mt-8 flex justify-center">
                        {/* Simple pagination via Inertia links */}
                        <div className="flex flex-wrap gap-2">
                            {products.links.map((l: any, idx: number) => (
                                <Link
                                    key={idx}
                                    href={l.url || "#"}
                                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                                        l.active
                                            ? "bg-gray-900 text-white border-gray-900"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                    } ${!l.url ? "opacity-50 pointer-events-none" : ""}`}
                                    dangerouslySetInnerHTML={{
                                        __html: l.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="max-w-full mx-auto px-4 md:px-6 py-8 md:py-12">
                <NewsletterSection />
            </div>
        </CustomerLayout>
    );
}
