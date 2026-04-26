import React, { useEffect, useMemo, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import Image from "@/Components/Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

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
    const items = useMemo(
        () => (Array.isArray(brands) ? (brands as Brand[]) : []),
        [brands],
    );
    const sliderRef = useRef<HTMLDivElement>(null);
    const autoplayPausedRef = useRef(false);

    if (!enabled || items.length === 0) return null;

    const featured = items.slice(0, 16);

    const scroll = (direction: "left" | "right") => {
        if (!sliderRef.current) return;
        const amount = Math.max(sliderRef.current.clientWidth * 0.8, 260);
        sliderRef.current.scrollBy({
            left: direction === "left" ? -amount : amount,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        const el = sliderRef.current;
        if (!el) return;

        const timer = window.setInterval(() => {
            if (autoplayPausedRef.current) return;

            const maxLeft = el.scrollWidth - el.clientWidth;
            const step = Math.max(el.clientWidth * 0.65, 240);
            const nextLeft = el.scrollLeft + step;

            if (nextLeft >= maxLeft - 2) {
                el.scrollTo({ left: 0, behavior: "smooth" });
                return;
            }

            el.scrollTo({ left: nextLeft, behavior: "smooth" });
        }, 3200);

        return () => window.clearInterval(timer);
    }, [featured.length]);

    return (
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.14)]">
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-success/15 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(225,29,109,0.08),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(22,181,125,0.08),transparent_45%)]" />

            <div className="relative p-6 sm:p-10">
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-brand-bg bg-brand-bg px-3 py-1 text-xs font-semibold text-brand-primary">
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
                        <div className="hidden sm:flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => scroll("left")}
                                className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                                aria-label="Scroll brands left"
                            >
                                <ChevronLeft size={18} className="mx-auto" />
                            </button>
                            <button
                                type="button"
                                onClick={() => scroll("right")}
                                className="h-10 w-10 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors"
                                aria-label="Scroll brands right"
                            >
                                <ChevronRight size={18} className="mx-auto" />
                            </button>
                        </div>
                        <Link
                            href={route("brands.index")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.25)] hover:bg-slate-100 transition-colors"
                        >
                            {ctaText}
                            <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>

                <div
                    ref={sliderRef}
                    className="brand-showcase-slider mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    onMouseEnter={() => {
                        autoplayPausedRef.current = true;
                    }}
                    onMouseLeave={() => {
                        autoplayPausedRef.current = false;
                    }}
                >
                    {featured.map((b) => (
                        <Link
                            key={b.id}
                            href={route("brands.show", b.slug)}
                            className="group relative min-w-[170px] sm:min-w-[190px] md:min-w-[220px] snap-start overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-50"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.18),transparent_60%)]" />
                            <div className="relative flex items-center gap-3">
                                <div className="h-14 w-14 shrink-0 rounded-2xl bg-white/90 border border-white/50 overflow-hidden flex items-center justify-center">
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
                                <div className="min-w-0">
                                    <div className="text-sm font-semibold text-slate-900 line-clamp-2">
                                        {b.title}
                                    </div>
                                    <div className="mt-1 text-xs text-slate-500">
                                        Explore products
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <style>{`
                .brand-showcase-slider::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}

