import React, { useState, useMemo } from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head, Link } from "@inertiajs/react";
import Image from "@/Components/Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";
import NewsletterSection from "@/Components/Customer/CtaSection";
import { Search, ArrowRight, ChevronRight, Home, Package } from "lucide-react";

type Brand = {
    id: number;
    title: string;
    slug: string;
    image: string | null;
    products_count?: number;
};

interface Props {
    brands: Brand[];
}

function BrandInitial({ title }: { title: string }) {
    const hue =
        title.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;
    const initials = title
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");

    return (
        <div
            className="w-full h-full flex items-center justify-center text-3xl font-black text-white select-none"
            style={{
                background: `linear-gradient(135deg, hsl(${hue},55%,62%), hsl(${(hue + 40) % 360},60%,50%))`,
            }}
        >
            {initials || title[0]?.toUpperCase()}
        </div>
    );
}

export default function Brands({ brands }: Props) {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return q
            ? brands.filter((b) => b.title.toLowerCase().includes(q))
            : brands;
    }, [brands, search]);

    return (
        <CustomerLayout>
            <Head title="All Brands" />

            <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
                {/* Background blobs */}
                <div className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center">
                    <div className="h-72 w-[36rem] rounded-full bg-gradient-to-r from-brand-primary via-brand-tint to-brand-accent opacity-20 blur-3xl" />
                </div>
                <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-brand-primary/10 blur-3xl" />

                <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-2">
                                All Brands
                            </h1>
                            <p className="text-slate-500 text-base">
                                {brands.length} brand
                                {brands.length !== 1 ? "s" : ""} — browse
                                products by brand.
                            </p>
                        </div>
                        <Link
                            href={route("products.index")}
                            className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-brand-primary/30 self-start sm:self-auto"
                        >
                            View all products
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-md mb-10">
                        <Search
                            size={15}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Search brands…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 text-slate-800 placeholder-slate-300 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-bg transition-all shadow-sm"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-1 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {/* Grid */}
                    {filtered.length > 0 ? (
                        <>
                            {search && (
                                <p className="text-sm text-slate-400 mb-5">
                                    {filtered.length} result
                                    {filtered.length !== 1 ? "s" : ""} for "
                                    <span className="text-slate-600 font-medium">
                                        {search}
                                    </span>
                                    "
                                </p>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {filtered.map((brand) => (
                                    <Link
                                        key={brand.id}
                                        href={route("brands.show", brand.slug)}
                                        className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-brand-bg hover:-translate-y-1.5 transition-all duration-200 overflow-hidden flex flex-col"
                                    >
                                        {/* Logo */}
                                        <div className="relative w-full aspect-square bg-slate-50 overflow-hidden">
                                            {brand.image ? (
                                                <Image
                                                    src={getAssetUrl(
                                                        brand.image,
                                                    )}
                                                    alt={brand.title}
                                                    className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-110"
                                                />
                                            ) : (
                                                <BrandInitial
                                                    title={brand.title}
                                                />
                                            )}
                                        </div>

                                        {/* Name + count */}
                                        <div className="px-4 py-3 border-t border-slate-100">
                                            <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-brand-primary transition-colors">
                                                {brand.title}
                                            </p>
                                            {brand.products_count != null && (
                                                <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                                                    <Package size={10} />
                                                    {brand.products_count}{" "}
                                                    product
                                                    {brand.products_count !== 1
                                                        ? "s"
                                                        : ""}
                                                </p>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 text-center">
                            <Search
                                size={40}
                                className="mx-auto text-slate-200 mb-4"
                            />
                            <p className="text-slate-500 font-medium">
                                No brands match "{search}"
                            </p>
                            <button
                                onClick={() => setSearch("")}
                                className="mt-3 text-sm text-brand-primary/70 hover:text-brand-primary font-medium transition-colors"
                            >
                                Clear search
                            </button>
                        </div>
                    )}
                </div>

                {/* Newsletter */}
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                    <NewsletterSection />
                </div>
            </div>
        </CustomerLayout>
    );
}
