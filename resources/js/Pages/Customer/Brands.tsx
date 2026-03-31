import React from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, Link } from "@inertiajs/react";
import Card from "@/Components/Ui/Card";
import Image from "@/Components/Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";
import NewsletterSection from "@/Components/Customer/CtaSection";

type Brand = {
    id: number;
    title: string;
    slug: string;
    image: string | null;
};

interface Props {
    brands: Brand[];
}

export default function Brands({ brands }: Props) {
    return (
        <CustomerLayout>
            <Head title="Brands" />

            <div className="max-w-full mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="flex items-end justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                            Brands
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm">
                            Browse products by brand.
                        </p>
                    </div>
                    <Link
                        href={route("products.index")}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        View all products
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mt-6">
                    {brands.map((b) => (
                        <Link key={b.id} href={route("brands.show", b.slug)}>
                            <Card className="h-full hover:border-gray-300 transition-colors">
                                <div className="flex flex-col items-center text-center gap-3 p-2">
                                    <Image
                                        src={getAssetUrl(b.image)}
                                        alt={b.title}
                                        className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-gray-100"
                                    />
                                    <div className="text-sm font-semibold text-gray-900 line-clamp-2">
                                        {b.title}
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="max-w-full mx-auto px-4 md:px-6 py-8 md:py-12">
                <NewsletterSection />
            </div>
        </CustomerLayout>
    );
}
