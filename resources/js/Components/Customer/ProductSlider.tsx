import React, { useRef } from "react";
import { Link } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/types";
import ProductCard from "./ProductCard";

interface ProductSliderProps {
    products: Product[];
    title?: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ products, title = "You Might Also Like" }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = current.clientWidth * 0.8; // Scroll almost a full page
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    if (!products || products.length === 0) return null;

    return (
        <div className="relative w-full py-8 md:py-12">
            <div className="flex items-center justify-between mb-8 md:mb-10 px-2 md:px-6">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center">
                    <span className="w-2 h-8 bg-indigo-500 rounded-full mr-3 sm:mr-4 hidden sm:block"></span>
                    {title.split(' ').map((word, i, arr) => (
                        i === arr.length - 1 ? (
                            <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-400 ml-1 sm:ml-2">{word}</span>
                        ) : (
                            <span key={i} className="mr-1 sm:mr-2">{word}</span>
                        )
                    ))}
                </h2>
                
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <Link href={route("products.index")} className="hidden md:flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 rounded-full transition-all mr-2">
                        View All
                    </Link>
                    <button
                        onClick={() => scroll("left")}
                        className="p-2 sm:p-3 rounded-full bg-white border border-slate-100 shadow-sm hover:shadow-md hover:bg-slate-50 text-slate-600 transition-all flex items-center justify-center"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="p-2 sm:p-3 rounded-full bg-white border border-slate-100 shadow-sm hover:shadow-md hover:bg-slate-50 text-slate-600 transition-all flex items-center justify-center"
                        aria-label="Scroll right"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Slider Track */}
            <div
                ref={scrollRef}
                className="flex gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide snap-x px-2 md:px-6 pb-8 pt-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {products.map((product, idx) => (
                    <div key={product.id} className="min-w-[260px] max-w-[280px] sm:min-w-[280px] sm:max-w-[300px] snap-start shrink-0 transition-transform duration-300 hover:-translate-y-2">
                        <ProductCard product={product} index={idx} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductSlider;
