import React, { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import { getAssetUrl } from "@/Utils/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "../Ui/Image";

interface HeroProps {
    bannerImages?: string[];
    bannerActive?: boolean;
}

const MagneticCta: React.FC<{ href: string; children: React.ReactNode }> = ({
    href,
    children,
}) => {
    const btnRef = useRef<HTMLAnchorElement>(null);
    const frame = useRef<number | null>(null);

    const onMove = (e: React.MouseEvent) => {
        const el = btnRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) * 0.12;
        const dy = (e.clientY - cy) * 0.12;
        if (frame.current) cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            el.style.transform = `translate(${dx}px, ${dy}px)`;
        });
    };

    const onLeave = () => {
        const el = btnRef.current;
        if (!el) return;
        el.style.transform = "translate(0, 0)";
    };

    return (
        <Link
            ref={btnRef}
            href={href}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            className="inline-flex items-center justify-center rounded-full bg-black px-8 py-3.5 text-sm font-extrabold tracking-wide text-white shadow-luxury-lg transition-[box-shadow,transform] duration-300 ease-out hover:shadow-[0_0_40px_rgba(99,102,241,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366f1]"
        >
            {children}
        </Link>
    );
};

const Hero: React.FC<HeroProps> = ({
    bannerImages,
    bannerActive = false,
}) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const parallaxRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);

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
        if (displayImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % displayImages.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [displayImages.length]);

    useEffect(() => {
        const layer = parallaxRef.current;
        const section = sectionRef.current;
        if (!layer || !section) return;

        const onScroll = () => {
            const rect = section.getBoundingClientRect();
            const vh = window.innerHeight || 1;
            const progress = 1 - Math.min(Math.max(rect.top / vh, 0), 1);
            const offset = (progress - 0.5) * 48;
            layer.style.transform = `scale(1.08) translateY(${offset}px)`;
        };

        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [currentSlide]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % displayImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide(
            (prev) => (prev - 1 + displayImages.length) % displayImages.length,
        );
    };

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden rounded-[24px] bg-black md:min-h-[min(560px,78vh)] md:flex md:flex-row"
        >
            <div className="relative z-10 flex w-full flex-col justify-center bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] px-6 py-12 sm:px-10 md:w-[44%] md:max-w-xl md:py-16 lg:px-12">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    True by Malaysia
                </p>
                <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-black sm:text-5xl lg:text-[3.25rem]">
                    Elevate Your Lifestyle
                </h1>
                <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
                    Discover our curated collection of premium essentials designed
                    for the modern home.
                </p>
                <div className="mt-8">
                    <MagneticCta href={route("products.index")}>
                        Shop New Arrivals
                    </MagneticCta>
                </div>
            </div>

            <div className="relative min-h-[240px] flex-1 md:min-h-0">
                <div className="absolute inset-0 z-[1] bg-gradient-to-r from-[#e2e8f0] via-transparent to-transparent md:from-[#f1f5f9] md:via-[#f8fafc]/40" />
                <div className="absolute inset-0 overflow-hidden">
                    {displayImages.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                                index === currentSlide
                                    ? "opacity-100"
                                    : "opacity-0"
                            }`}
                        >
                            <div
                                ref={index === currentSlide ? parallaxRef : undefined}
                                className="h-full w-full will-change-transform"
                            >
                                <Image
                                    src={image}
                                    alt={`Hero ${index + 1}`}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {displayImages.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/30 bg-white/20 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/35"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft size={22} />
                        </button>
                        <button
                            type="button"
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/30 bg-white/20 p-2.5 text-white backdrop-blur-md transition-colors hover:bg-white/35"
                            aria-label="Next slide"
                        >
                            <ChevronRight size={22} />
                        </button>
                        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                            {displayImages.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 w-2 rounded-full transition-all ${
                                        index === currentSlide
                                            ? "w-6 bg-white"
                                            : "bg-white/45 hover:bg-white/70"
                                    }`}
                                    aria-label={`Slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
};

export default Hero;
