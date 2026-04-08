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
        <section className="relative w-full h-[400px] sm:h-[460px] md:h-[min(600px,80vh)] lg:h-[min(680px,85vh)] overflow-hidden rounded-[16px] md:rounded-[20px] bg-zinc-900 group">
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

            {/* Custom Animations */}
            <style>{`
                @keyframes fadeInUpHero {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up-hero {
                    opacity: 0;
                    animation: fadeInUpHero 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

            {/* Central Content - Minimalist Editorial Style */}
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 md:px-12 pointer-events-none">
                <div 
                    key={currentSlide} // Forces React to re-trigger the entrance animation on every slide change
                    className="flex flex-col items-center max-w-4xl pointer-events-auto w-full"
                >
                    {/* Subtitle */}
                    <span 
                        className="mb-3 md:mb-5 text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase animate-fade-in-up-hero text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400"
                        style={{ 
                            animationDelay: '150ms', 
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.8))'
                        }}
                    >
                        {content?.subtitle || "True buy Malaysia"}
                    </span>
                    
                    {/* Title */}
                    <h1 
                        className="mb-5 md:mb-8 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] font-extrabold tracking-tight leading-[1.1] md:leading-[1.05] animate-fade-in-up-hero text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-100 to-zinc-400"
                        style={{ 
                            animationDelay: '300ms', 
                            filter: 'drop-shadow(0px 4px 24px rgba(0,0,0,0.7)) drop-shadow(0px 2px 4px rgba(0,0,0,0.9))'
                        }}
                    >
                        {content?.title || "Elevate Your Lifestyle"}
                    </h1>
                    
                    {/* Description */}
                    <p 
                        className="mb-8 md:mb-12 text-sm sm:text-base md:text-lg font-medium leading-relaxed text-zinc-50 max-w-2xl px-4 sm:px-0 animate-fade-in-up-hero"
                        style={{ 
                            animationDelay: '450ms', 
                            textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,1)' 
                        }}
                    >
                        {content?.description || "Discover our curated collection of premium essentials designed for the modern home. Immerse yourself in uncompromising quality and timeless aesthetics."}
                    </p>
                    
                    {/* Premium Standard Button */}
                    <div className="animate-fade-in-up-hero" style={{ animationDelay: '600ms' }}>
                        <Link
                            href={content?.button_link || route("products.index")}
                            className="group inline-flex items-center justify-center gap-3 bg-brand-primary px-8 py-4 md:px-12 md:py-5 text-[11px] sm:text-xs md:text-sm font-extrabold tracking-[0.2em] text-white transition-all duration-300 hover:bg-brand-primary/90 hover:shadow-[0_12px_30px_rgba(225,29,109,0.45)] hover:-translate-y-1 uppercase rounded-full shadow-xl"
                        >
                            <span>{content?.button_text || "Shop New Arrivals"}</span>
                            <ChevronRight size={16} strokeWidth={3} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Premium Slider Controls */}
            {displayImages.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={prevSlide}
                        className="absolute left-2 md:left-8 top-1/2 z-40 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-all opacity-100 md:opacity-0 group-hover:opacity-100 hover:-translate-x-1"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                    </button>
                    <button
                        type="button"
                        onClick={nextSlide}
                        className="absolute right-2 md:right-8 top-1/2 z-40 -translate-y-1/2 p-2 text-white/50 hover:text-white transition-all opacity-100 md:opacity-0 group-hover:opacity-100 hover:translate-x-1"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                    </button>
                    
                    {/* Minimalist Progress Indicators */}
                    <div className="absolute bottom-6 md:bottom-8 left-1/2 z-40 flex -translate-x-1/2 gap-2 md:gap-3">
                        {displayImages.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCurrentSlide(index)}
                                className="py-2 px-1 group"
                                aria-label={`Slide ${index + 1}`}
                            >
                                <div className={`h-[2px] w-6 sm:w-8 md:w-12 transition-all duration-300 ${
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
