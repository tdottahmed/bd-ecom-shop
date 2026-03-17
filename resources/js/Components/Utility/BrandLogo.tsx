import { Link, usePage } from "@inertiajs/react";
import React from "react";

interface BrandLogoProps {
    size?: "sm" | "md" | "lg" | "xl";
    withText?: boolean;
    className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({
    size = "md",
    withText = true,
    className = "",
}) => {
    const { siteLogo }: any = usePage().props;

    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16",
        xl: "w-20 h-20",
    };

    const imgSizeClasses = {
        sm: "h-8",
        md: "h-12",
        lg: "h-16",
        xl: "h-20",
    };

    const textSizes = {
        sm: "text-lg",
        md: "text-xl",
        lg: "text-2xl",
        xl: "text-3xl",
    };

    return (
        <Link href="/" className={`flex items-center gap-3 ${className}`}>
            {siteLogo ? (
                <img
                    src={`/storage/${siteLogo}`}
                    alt="Logo"
                    className={`${imgSizeClasses[size]} w-auto`}
                />
            ) : (
                <div className={`relative ${sizeClasses[size]}`}>
                    <svg
                        viewBox="0 0 120 120"
                        className="w-full h-full drop-shadow-lg"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Outer Circle with Gradient */}
                        <circle
                            cx="60"
                            cy="60"
                            r="55"
                            fill="url(#logoGradient)"
                            stroke="#0F1A18"
                            strokeWidth="2"
                        />

                        {/* Inner Circle */}
                        <circle
                            cx="60"
                            cy="60"
                            r="35"
                            fill="#0C1311"
                            stroke="#1E2826"
                            strokeWidth="1"
                        />

                        {/* P Letter */}
                        <path
                            d="M45 40 L45 80 L60 80 C65 80 65 75 65 70 C65 65 60 65 60 65 L50 65 L50 55 L60 55 C65 55 65 50 65 45 C65 40 60 40 60 40 L45 40Z"
                            fill="#2DE3A7"
                        />

                        {/* W Letter */}
                        <path
                            d="M70 40 L65 65 L70 80 L75 65 L80 80 L85 65 L80 40 L75 55 L70 40Z"
                            fill="#2DE3A7"
                        />

                        {/* Decorative Elements */}
                        <circle
                            cx="40"
                            cy="45"
                            r="3"
                            fill="#2DE3A7"
                            opacity="0.6"
                        />
                        <circle
                            cx="80"
                            cy="75"
                            r="3"
                            fill="#2DE3A7"
                            opacity="0.6"
                        />

                        {/* Gradient Definition */}
                        <defs>
                            <linearGradient
                                id="logoGradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#2DE3A7"
                                    stopOpacity="0.8"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#22c996"
                                    stopOpacity="0.9"
                                />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-full bg-[#2DE3A7] opacity-20 blur-md -z-10 animate-pulse-slow"></div>
                </div>
            )}

            {/* Text */}
            {withText && !siteLogo && (
                <div className="flex flex-col">
                    <span
                        className={`font-bold text-white ${textSizes[size]} leading-tight`}
                    >
                        Paikari
                    </span>
                    <span
                        className={`font-light text-[#2DE3A7] ${textSizes[size]} leading-tight -mt-1`}
                    >
                        World
                    </span>
                </div>
            )}
        </Link>
    );
};

export default BrandLogo;
