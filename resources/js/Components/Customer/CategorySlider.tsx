import React, { useRef } from "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft, ArrowRight, LayoutGrid } from "lucide-react";
import { Category } from "@/types";
import Image from "../Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";

interface CategorySliderProps {
    categories: Category[];
    activeCategory?: Category;
}

const CategorySlider: React.FC<CategorySliderProps> = ({
    categories,
    activeCategory,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef;
            const scrollAmount = current.clientWidth * 0.7;
            current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    if (!categories || categories.length === 0) {
        return (
            <div className="p-8 md:p-12 text-center">
                <Link
                    href={route("products.index")}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-zinc-900 text-white font-semibold transition-all hover:bg-zinc-800 hover:-translate-y-1 hover:shadow-xl"
                >
                    <LayoutGrid className="h-5 w-5" />
                    <span>Browse All Products</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="px-5 py-8 md:px-10 md:py-10">
            {/* Header */}
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 md:text-4xl">
                        Shop by Category
                    </h2>
                    <p className="mt-2 text-sm text-zinc-600 font-medium">
                        Explore our curated collections
                    </p>
                </div>

                {/* Desktop controls */}
                <div className="hidden items-center gap-2 md:flex">
                    <button
                        onClick={() => scroll("left")}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-600 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white active:scale-95"
                        aria-label="Scroll left"
                    >
                        <ArrowLeft size={20} strokeWidth={1.5} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-600 shadow-sm backdrop-blur-sm transition-all hover:scale-105 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white active:scale-95"
                        aria-label="Scroll right"
                    >
                        <ArrowRight size={20} strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* Slider */}
            <div className="relative -mx-5 px-5 md:-mx-10 md:px-10">
                <div
                    ref={scrollContainerRef}
                    className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-6 scrollbar-hide md:gap-5"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {categories.map((cat, index) => (
                        <Link
                            key={cat.id}
                            href={route("products.category", cat.slug)}
                            className="group relative flex w-[150px] shrink-0 snap-start flex-col overflow-hidden rounded-[16px] bg-white sm:w-[200px] md:w-[280px] md:rounded-[24px] shadow-sm hover:shadow-xl transition-shadow duration-500 border border-zinc-100/50"
                        >
                            <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100">
                                <Image
                                    src={getAssetUrl(cat.image)}
                                    alt={cat.title}
                                    className="h-full w-full object-cover transition-transform duration-[800ms] ease-out group-hover:scale-110"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/90 via-zinc-900/10 to-transparent opacity-80" />
                            </div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-7">
                                <h3 className="font-display text-lg font-bold tracking-wide text-white sm:text-xl md:text-2xl drop-shadow-md">
                                    {cat.title}
                                </h3>

                                <div className="mt-2 md:mt-3 flex items-center justify-between pointer-events-none">
                                    <span className="hidden text-[10px] sm:text-xs font-bold tracking-[0.2em] text-white/90 uppercase drop-shadow-sm transition-transform duration-500 group-hover:translate-x-1 sm:block">
                                        Explore
                                    </span>
                                    <div className="flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:bg-white group-hover:text-zinc-900">
                                        <ArrowRight
                                            size={14}
                                            strokeWidth={2}
                                            className="md:w-4 md:h-4"
                                        />
                                    </div>
                                </div>
                            </div>

                            {activeCategory?.id === cat.id && (
                                <div className="absolute top-3 right-3 md:top-4 md:right-4 rounded-full border border-white/20 bg-white/10 px-2 py-1 md:px-3 md:py-1.5 backdrop-blur-md shadow-sm">
                                    <span className="text-[9px] md:text-[10px] font-extrabold uppercase tracking-widest text-white drop-shadow-sm">
                                        Active
                                    </span>
                                </div>
                            )}
                        </Link>
                    ))}

                    {/* View All Collection Card */}
                    <Link
                        href={route("products.index")}
                        className="group relative flex w-[150px] shrink-0 snap-start flex-col justify-center overflow-hidden rounded-[16px] md:rounded-[24px] border-2 border-dashed border-zinc-300/60 bg-white/40 p-4 md:p-6 backdrop-blur-sm sm:w-[200px] md:w-[280px] transition-all hover:bg-white/80 hover:border-zinc-400 hover:shadow-lg"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-zinc-900 text-white shadow-xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl mb-4 md:mb-6">
                                <LayoutGrid
                                    size={20}
                                    strokeWidth={1.5}
                                    className="md:w-6 md:h-6"
                                />
                            </div>
                            <h3 className="font-display text-lg font-extrabold text-zinc-900 sm:text-xl md:text-2xl">
                                View All
                            </h3>
                            <p className="mt-1 md:mt-2 text-[11px] md:text-sm font-medium text-zinc-500 px-1 md:px-4">
                                Browse our entire catalog
                            </p>
                        </div>
                    </Link>

                    {/* Spacer block to fix trailing padding cutoff on mobile overflow */}
                    <div className="w-1 shrink-0 md:hidden" />
                </div>
            </div>

            {/* Global style to hide scrollbar */}
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
        </div>
    );
};

export default CategorySlider;
