import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { getAssetUrl } from "@/Utils/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "../Ui/Image";

interface HeroProps {
    bannerImages?: string[];
    bannerActive?: boolean;
    content?: {
        subtitle?: string;
        title?: string;
        description?: string;
        button_text?: string;
        button_link?: string;
    };
}

const Hero: React.FC<HeroProps> = ({ bannerImages, bannerActive = false, content }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    const effectiveBannerImages = bannerActive
        ? (bannerImages ?? []).filter(
              (img) => typeof img === "string" && img.trim().length > 0,
          )
        : [];

    const displayImages =
        effectiveBannerImages.length > 0
            ? effectiveBannerImages.map((img) => getAssetUrl(img))
            : ["/images/banner-1.jpg", "/images/banner-2.jpeg"];

    useEffect(() => {
        setIsMounted(true);
        if (displayImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % displayImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [displayImages.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % displayImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide(
            (prev) => (prev - 1 + displayImages.length) % displayImages.length,
        );
    };

    return (
        <section className="relative w-full h-[540px] md:h-[min(700px,85vh)] overflow-hidden rounded-[20px] bg-zinc-900 group">
            {/* Background Image Slider */}
            <div className="absolute inset-0 z-0">
                {displayImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                        <div
                            className={`h-full w-full transition-transform duration-[10000ms] ease-out ${
                                index === currentSlide ? "scale-100" : "scale-105"
                            }`}
                        >
                            <Image
                                src={image}
                                alt={`Banner ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                ))}
                
                {/* Clean, uniform dark overlay to ensure text contrast without muddiness */}
                <div className="absolute inset-0 z-20 bg-black/40" />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
            </div>

            {/* Central Content - Minimalist Editorial Style */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 md:px-12 pointer-events-none">
                <div 
                    className={`flex flex-col items-center max-w-3xl transform transition-all duration-1000 delay-100 ease-out pointer-events-auto ${
                        isMounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
                >
                    <span className="mb-4 text-xs font-semibold tracking-[0.3em] text-white/90 uppercase drop-shadow-md">
                        {content?.subtitle || "True by Malaysia"}
                    </span>
                    <h1 className="mb-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-xl">
                        {content?.title || "Elevate Your Lifestyle"}
                    </h1>
                    <p className="mb-10 text-sm sm:text-base md:text-lg font-light leading-relaxed text-white/90 drop-shadow-md max-w-2xl">
                        {content?.description || "Discover our curated collection of premium essentials designed for the modern home. Immerse yourself in uncompromising quality and timeless aesthetics."}
                    </p>
                    
                    <Link
                        href={content?.button_link || route("products.index")}
                        className="group relative inline-flex items-center justify-center bg-white px-10 py-4 text-xs sm:text-sm font-bold tracking-[0.15em] text-black transition-transform duration-300 hover:scale-105 uppercase"
                    >
                        {content?.button_text || "Shop New Arrivals"}
                    </Link>
                </div>
            </div>

            {/* Premium Slider Controls */}
            {displayImages.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={prevSlide}
                        className="absolute left-4 md:left-8 top-1/2 z-40 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100 hover:-translate-x-1"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={40} strokeWidth={1} />
                    </button>
                    <button
                        type="button"
                        onClick={nextSlide}
                        className="absolute right-4 md:right-8 top-1/2 z-40 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100 hover:translate-x-1"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={40} strokeWidth={1} />
                    </button>
                    
                    {/* Minimalist Progress Indicators */}
                    <div className="absolute bottom-8 left-1/2 z-40 flex -translate-x-1/2 gap-3">
                        {displayImages.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentSlide(index)}
                                className="py-2 px-1 group"
                                aria-label={`Slide ${index + 1}`}
                            >
                                <div className={`h-[2px] w-8 md:w-12 transition-all duration-300 ${
                                    index === currentSlide ? "bg-white" : "bg-white/40 group-hover:bg-white/80"
                                }`} />
                            </button>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default Hero;
