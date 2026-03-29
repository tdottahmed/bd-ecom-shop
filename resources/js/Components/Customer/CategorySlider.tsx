import React from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { Category } from "@/types";
import Image from "../Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";

interface CategorySliderProps {
    categories: Category[];
    activeCategory?: Category;
}

const glassCard =
    "relative overflow-hidden rounded-[24px] border border-white/30 bg-white/70 shadow-luxury backdrop-blur-[15px] transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-luxury-lg";

const CategorySlider: React.FC<CategorySliderProps> = ({
    categories,
    activeCategory,
}) => {
    if (!categories || categories.length === 0) {
        return (
            <div className="px-4 py-8 md:px-8">
                <Link
                    href={route("products.index")}
                    className={`${glassCard} flex min-h-[200px] items-center justify-center gap-3 p-8`}
                >
                    <LayoutGrid className="h-8 w-8 text-[#6366f1]" />
                    <span className="font-display text-xl font-bold text-black">
                        All Products
                    </span>
                    <ArrowRight className="h-6 w-6 text-[#6366f1]" />
                </Link>
            </div>
        );
    }

    const [first, second] = categories;

    return (
        <div className="px-4 py-6 md:px-8 md:py-8">
            <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                    <h2 className="font-display text-2xl font-extrabold tracking-tight text-black md:text-3xl">
                        Shop by category
                    </h2>
                    <p className="mt-1 text-sm font-medium text-slate-600">
                        Curated essentials in a glance
                    </p>
                </div>
                <Link
                    href={route("products.index")}
                    className="hidden items-center gap-1 text-sm font-bold text-[#6366f1] transition-colors hover:text-indigo-700 sm:inline-flex"
                >
                    View all
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid min-h-[320px] grid-cols-1 gap-4 md:min-h-[400px] md:grid-cols-2 md:grid-rows-2">
                <Link
                    href={route("products.category", first.slug)}
                    className={`${glassCard} md:row-span-2 flex min-h-[280px] flex-col md:min-h-0`}
                    style={{ animationDelay: "0ms" }}
                >
                    <div className="relative flex flex-1 flex-col p-6 md:p-8">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            Featured
                        </span>
                        <h3 className="font-display mt-2 text-2xl font-extrabold text-black md:text-3xl">
                            {first.title}
                        </h3>
                        <div className="relative mt-6 flex flex-1 items-end justify-center md:mt-8">
                            <div className="relative aspect-square w-[min(100%,220px)] overflow-hidden rounded-2xl bg-white/50 shadow-inner">
                                <Image
                                    src={getAssetUrl(first.image)}
                                    alt={first.title}
                                    className="h-full w-full object-contain object-center p-3"
                                />
                            </div>
                        </div>
                    </div>
                    {activeCategory?.id === first.id && (
                        <span className="absolute right-4 top-4 rounded-full bg-[#6366f1] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white">
                            Active
                        </span>
                    )}
                </Link>

                {second ? (
                    <Link
                        href={route("products.category", second.slug)}
                        className={`${glassCard} flex min-h-[160px] flex-row items-center gap-4 p-5 md:min-h-0`}
                        style={{ animationDelay: "80ms" }}
                    >
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100/80 sm:h-28 sm:w-28">
                            <Image
                                src={getAssetUrl(second.image)}
                                alt={second.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-display text-lg font-bold text-black sm:text-xl">
                                {second.title}
                            </h3>
                            <p className="mt-1 text-xs font-medium text-slate-500">
                                Explore collection
                            </p>
                        </div>
                        <ArrowRight className="h-5 w-5 shrink-0 text-[#6366f1]" />
                    </Link>
                ) : (
                    <div
                        className={`${glassCard} flex min-h-[160px] items-center justify-center p-6 md:min-h-0`}
                    >
                        <p className="text-center text-sm font-medium text-slate-500">
                            More categories coming soon
                        </p>
                    </div>
                )}

                <Link
                    href={route("products.index")}
                    className={`group ${glassCard} flex min-h-[140px] items-center justify-between gap-4 p-6 md:min-h-0`}
                    style={{ animationDelay: "160ms" }}
                >
                    <div>
                        <h3 className="font-display text-lg font-extrabold text-black sm:text-xl">
                            All Products
                        </h3>
                        <p className="mt-1 text-xs font-medium text-slate-600">
                            Browse the full catalog
                        </p>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-black text-white shadow-luxury transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_28px_rgba(99,102,241,0.35)]">
                        <ArrowRight className="h-5 w-5" />
                    </div>
                </Link>
            </div>

            {categories.length > 2 && (
                <div className="mt-4 flex flex-wrap gap-3 md:mt-6">
                    {categories.slice(2).map((cat, i) => (
                        <Link
                            key={cat.id}
                            href={route("products.category", cat.slug)}
                            className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/60 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur-sm transition-all hover:border-[#6366f1]/40 hover:shadow-md"
                            style={{ animationDelay: `${200 + i * 40}ms` }}
                        >
                            <span className="h-2 w-2 rounded-full bg-[#6366f1]" />
                            {cat.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategorySlider;
