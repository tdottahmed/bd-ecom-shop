import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Clock, ShoppingBag } from "lucide-react";
import { router } from "@inertiajs/react";

type PromoBannerProps = {
    enabled?: boolean;
    badge?: string;
    title?: string;
    description?: string;
    bgImage?: string;
    primaryCtaText?: string;
    secondaryCtaText?: string;
};

const PromoBanner: React.FC<PromoBannerProps> = ({
    enabled = true,
    badge = "Premium Collection",
    title = "Elevate Your Lifestyle",
    description = "Discover our exclusive range of high-quality products. Uncompromising elegance, offering the best deals of the season.",
    bgImage = "/images/banner-1.jpg",
    primaryCtaText = "Shop Collection",
    secondaryCtaText = "Explore Offers",
}) => {
    if (!enabled) return null;
    // Meaningful e-commerce element: Countdown Timer
    const [timeLeft, setTimeLeft] = useState({
        days: 2,
        hours: 14,
        minutes: 45,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { days, hours, minutes, seconds } = prev;
                if (seconds > 0) {
                    seconds--;
                } else {
                    seconds = 59;
                    if (minutes > 0) {
                        minutes--;
                    } else {
                        minutes = 59;
                        if (hours > 0) {
                            hours--;
                        } else {
                            hours = 23;
                            if (days > 0) {
                                days--;
                            }
                        }
                    }
                }
                return { days, hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleShopClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Scroll to products section smoothly
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback
            try {
                // @ts-ignore
                if (typeof route === 'function') {
                    // @ts-ignore
                    router.visit(route('home') + '#products-section');
                } else {
                    window.location.href = '/#products-section';
                }
            } catch (err) {
                window.location.href = '/#products-section';
            }
        }
    };

    return (
        <div className="relative w-full rounded-3xl overflow-hidden bg-slate-900 shadow-[0_20px_50px_rgba(15,23,42,0.2)] group">
            {/* Background Image with Overlay */}
            <div 
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url('${bgImage}')` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 md:via-slate-900/80 to-slate-900/40 lg:to-transparent"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 py-12 md:px-16 md:py-20 min-h-[400px]">
                {/* Left Content */}
                <div className="w-full lg:w-3/5 flex flex-col items-start text-left">
                    <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-xs sm:text-sm font-semibold mb-6 backdrop-blur-md border border-amber-500/20 uppercase tracking-wider shadow-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>{badge}</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
                        {title}
                    </h2>
                    
                    <p className="text-slate-300 text-lg md:text-xl font-light mb-8 max-w-lg leading-relaxed drop-shadow-md">
                        {description}
                    </p>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-10">
                        <div className="flex flex-col items-center justify-center bg-white/10 border border-white/20 backdrop-blur-md rounded-xl w-16 h-16 sm:w-20 sm:h-20 shadow-lg">
                            <span className="text-2xl sm:text-3xl font-bold text-amber-400">{String(timeLeft.days).padStart(2, '0')}</span>
                            <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-medium mt-1">Days</span>
                        </div>
                        <span className="text-2xl font-bold text-white/50 -mt-4 animate-pulse">:</span>
                        <div className="flex flex-col items-center justify-center bg-white/10 border border-white/20 backdrop-blur-md rounded-xl w-16 h-16 sm:w-20 sm:h-20 shadow-lg">
                            <span className="text-2xl sm:text-3xl font-bold text-amber-400">{String(timeLeft.hours).padStart(2, '0')}</span>
                            <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-medium mt-1">Hours</span>
                        </div>
                        <span className="text-2xl font-bold text-white/50 -mt-4 animate-pulse">:</span>
                        <div className="flex flex-col items-center justify-center bg-white/10 border border-white/20 backdrop-blur-md rounded-xl w-16 h-16 sm:w-20 sm:h-20 shadow-lg">
                            <span className="text-2xl sm:text-3xl font-bold text-amber-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
                            <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-medium mt-1">Mins</span>
                        </div>
                        <span className="text-2xl font-bold text-white/50 -mt-4 animate-pulse">:</span>
                        <div className="flex flex-col items-center justify-center bg-white/10 border border-white/20 backdrop-blur-md rounded-xl w-16 h-16 sm:w-20 sm:h-20 shadow-lg">
                            <span className="text-2xl sm:text-3xl font-bold text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                            <span className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wider font-medium mt-1">Secs</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button
                            onClick={handleShopClick}
                            className="group inline-flex items-center justify-center px-8 py-4 text-base font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 rounded-xl hover:from-amber-300 hover:to-amber-200 transition-all duration-300 shadow-[0_10px_30px_rgba(251,191,36,0.3)] hover:shadow-[0_15px_40px_rgba(251,191,36,0.5)] hover:-translate-y-1 w-full sm:w-auto overflow-hidden relative"
                        >
                            <span className="absolute inset-0 w-full h-full bg-white/30 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                            <ShoppingBag className="w-5 h-5 mr-2" />
                            {primaryCtaText}
                        </button>
                        <a
                            href="#products-section"
                            className="group inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-white/5 border border-white/20 backdrop-blur-md rounded-xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 w-full sm:w-auto shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            {secondaryCtaText}
                            <ArrowRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                    </div>
                </div>

                {/* Right Content - Trust Badges or Features */}
                <div className="hidden lg:flex w-2/5 flex-col gap-6 items-end mt-12 md:mt-0">
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-full max-w-[340px] transform transition-all duration-500 hover:translate-x-[-15px] hover:bg-slate-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-default group/card">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-lg group-hover/card:scale-110 transition-transform duration-300">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg tracking-wide">Authentic Quality</h4>
                                <p className="text-slate-300 text-sm mt-1 leading-relaxed">Guaranteed 100% genuine products directly from brands.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl w-full max-w-[340px] transform transition-all duration-500 hover:translate-x-[-15px] hover:bg-slate-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-default group/card translate-x-4">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shrink-0 shadow-lg group-hover/card:scale-110 transition-transform duration-300">
                                <Clock className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-lg tracking-wide">Flash Delivery</h4>
                                <p className="text-slate-300 text-sm mt-1 leading-relaxed">Get your premium items delivered within 24 hours securely.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Custom Animation Keyframes for Shimmer */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes shimmer {
                    100% {
                        transform: translateX(100%);
                    }
                }
            `}} />
        </div>
    );
};

export default PromoBanner;
