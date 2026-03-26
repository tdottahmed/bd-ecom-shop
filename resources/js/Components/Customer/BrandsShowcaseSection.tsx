import React, { useMemo } from "react";
import { Link, usePage } from "@inertiajs/react";
import Image from "@/Components/Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";
import { ArrowRight, Sparkles } from "lucide-react";

type Brand = {
    id: number;
    title: string;
    slug: string;
    image?: string | null;
};

interface BrandsShowcaseSectionProps {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    ctaText?: string;
}

export default function BrandsShowcaseSection({
    enabled = true,
    title = "Shop by Brand",
    subtitle = "Discover authentic products from brands you already love.",
    ctaText = "View all brands",
}: BrandsShowcaseSectionProps) {
    const { brands } = usePage().props as any;
    const items = useMemo(() => (Array.isArray(brands) ? (brands as Brand[]) : []), [brands]);

    if (!enabled || items.length === 0) return null;

    const featured = items.slice(0, 12);

    return (
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white/80 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl">
            {/* Background accents */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-300/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.10),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(16,185,129,0.10),transparent_45%)]" />

            <div className="relative p-6 sm:p-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            <Sparkles size={14} />
                            Trusted brands
                        </div>
                        <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                            {title}
                        </h2>
                        <p className="mt-2 text-slate-600 max-w-2xl">
                            {subtitle}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route("brands.index")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(15,23,42,0.25)] hover:bg-slate-800 transition-colors"
                        >
                            {ctaText}
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* Grid */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {featured.map((b) => (
                        <Link
                            key={b.id}
                            href={route("brands.show", b.slug)}
                            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors p-4"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.18),transparent_55%)]" />
                            <div className="relative flex flex-col items-center justify-center gap-3">
                                <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                                    {b.image ? (
                                        <Image
                                            src={getAssetUrl(b.image)}
                                            alt={b.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-xs font-bold text-slate-700">
                                            {b.title.slice(0, 2).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="text-sm font-semibold text-slate-800 text-center line-clamp-2">
                                    {b.title}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

