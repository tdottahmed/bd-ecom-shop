import React, { useState, useEffect } from "react";
import { getAssetUrl } from "@/Utils/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "../Ui/Image";
import { usePage } from "@inertiajs/react";

interface HeroProps {
    bannerImages?: string[];
}

const Hero: React.FC<HeroProps> = ({ bannerImages }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Prefer banner images from shared middleware props:
    // - `bannerActive` is usually a string like "1" / "0"
    // - `bannerImages` is usually JSON text (because `get_setting()` returns raw `value`)
    const { bannerImages: sharedBannerImages, bannerActive } =
        usePage().props as any;

    const isBannerActive =
        bannerActive === true ||
        bannerActive === 1 ||
        bannerActive === "1" ||
        bannerActive === "true";

    const parsedSharedBannerImages: string[] = (() => {
        if (Array.isArray(sharedBannerImages)) {
            return sharedBannerImages.filter(
                (img) => typeof img === "string" && img.trim().length > 0,
            );
        }

        if (typeof sharedBannerImages === "string") {
            try {
                const parsed = JSON.parse(sharedBannerImages);
                if (Array.isArray(parsed)) {
                    return parsed.filter(
                        (img) =>
                            typeof img === "string" &&
                            img.trim().length > 0,
                    );
                }
            } catch {
                // ignore invalid JSON
            }
        }

        return [];
    })();

    const effectiveBannerImages = (
        isBannerActive
            ? parsedSharedBannerImages.length > 0
                ? parsedSharedBannerImages
                : bannerImages ?? []
            : []
    ).filter((img) => typeof img === "string" && img.trim().length > 0);

    const displayImages =
        effectiveBannerImages.length > 0
            ? effectiveBannerImages.map((img) => getAssetUrl(img))
            : ["/images/banner-1.jpg", "/images/banner-2.jpeg"];

    // Auto-play for slider
    useEffect(() => {
        if (displayImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % displayImages.length);
        }, 5000);

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
        <div className="relative max-w-8xl mx-auto">
            <div className="relative bg-gray-900 overflow-hidden h-[150px] md:h-[400px] rounded-xl shadow-lg">
                {displayImages.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <Image
                            src={image}
                            alt={`Banner ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}

                {/* Slider Controls */}
                {displayImages.length > 1 && (
                    <>
                        {/* Arrows */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors backdrop-blur-sm z-10"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors backdrop-blur-sm z-10"
                            aria-label="Next slide"
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                            {displayImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Hero;
