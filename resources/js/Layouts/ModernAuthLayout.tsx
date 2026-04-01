import React, { ReactNode } from "react";
import BrandLogo from "@/Components/Utility/BrandLogo";
import { Link, usePage } from "@inertiajs/react";
import Logo from "@/Components/Customer/Header/Logo";
import CustomerLayout from "./CustomerLayout";

interface ModernAuthLayoutProps {
    title: string;
    subtitle?: string;
    children: ReactNode;
    quote?: string;
    quoteAuthor?: string;
}

export default function ModernAuthLayout({
    title,
    subtitle,
    children,
    quote,
    quoteAuthor,
}: ModernAuthLayoutProps) {
    const { seo, siteDescription, authPageImage }: any = usePage().props;

    const displayQuote =
        quote ||
        siteDescription ||
        "Empowering your business with seamless and efficient management tools.";

    return (
        <CustomerLayout>
            <div className="flex min-h-screen bg-white p-4 sm:p-6 lg:p-8">
                <div className="flex w-full max-w-[1400px] mx-auto overflow-hidden">
                    {/* Visual Column - Hidden on mobile, visible on lg+ screens */}
                    <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 relative bg-[#0C1311] overflow-hidden flex-col justify-between p-12 rounded-[2.5rem] shadow-lg">
                        {/* Background */}
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            {authPageImage ? (
                                <>
                                    <img
                                        src={`/storage/${authPageImage}`}
                                        alt="Authentication Background"
                                        className="absolute inset-0 w-full h-full object-cover scale-105"
                                        style={{
                                            animation:
                                                "authImgDrift 20s ease-in-out infinite alternate",
                                        }}
                                    />
                                    {/* Multi-layer overlay for depth */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0C1311]/95 via-[#0C1311]/50 to-transparent" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C1311] via-transparent to-transparent" />
                                    {/* Accent glow */}
                                    <div
                                        className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-[#2DE3A7]/10 blur-3xl"
                                        style={{
                                            animation:
                                                "authPulse 6s ease-in-out infinite",
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    {/* Base */}
                                    <div className="absolute inset-0 bg-[#0C1311]" />

                                    {/* Animated orbs */}
                                    <div
                                        className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-[#2DE3A7]/15 blur-3xl"
                                        style={{
                                            animation:
                                                "authOrb1 12s ease-in-out infinite alternate",
                                        }}
                                    />
                                    <div
                                        className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-[#2DE3A7]/10 blur-3xl"
                                        style={{
                                            animation:
                                                "authOrb2 15s ease-in-out infinite alternate",
                                        }}
                                    />
                                    <div
                                        className="absolute -bottom-16 left-1/3 w-72 h-72 rounded-full bg-[#2DE3A7]/8 blur-3xl"
                                        style={{
                                            animation:
                                                "authOrb3 10s ease-in-out infinite alternate",
                                        }}
                                    />

                                    {/* Dot pattern */}
                                    <div
                                        className="absolute inset-0 opacity-[0.06]"
                                        style={{
                                            backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
                                            backgroundSize: "28px 28px",
                                        }}
                                    />

                                    {/* Diagonal accent line */}
                                    <div
                                        className="absolute inset-0 opacity-[0.04]"
                                        style={{
                                            backgroundImage:
                                                "linear-gradient(135deg, #2DE3A7 25%, transparent 25%, transparent 75%, #2DE3A7 75%)",
                                            backgroundSize: "80px 80px",
                                        }}
                                    />
                                </>
                            )}

                            {/* Shared: top vignette */}
                            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#0C1311]/60 to-transparent" />
                        </div>

                        <style>{`
                        @keyframes authImgDrift {
                            from { transform: scale(1.05) translate(0, 0); }
                            to   { transform: scale(1.05) translate(-1.5%, -1%); }
                        }
                        @keyframes authPulse {
                            0%, 100% { opacity: 0.6; transform: scale(1); }
                            50%       { opacity: 1;   transform: scale(1.15); }
                        }
                        @keyframes authOrb1 {
                            from { transform: translate(0, 0) scale(1); }
                            to   { transform: translate(40px, 60px) scale(1.2); }
                        }
                        @keyframes authOrb2 {
                            from { transform: translate(0, 0) scale(1); }
                            to   { transform: translate(-50px, -40px) scale(1.15); }
                        }
                        @keyframes authOrb3 {
                            from { transform: translate(0, 0) scale(1); }
                            to   { transform: translate(30px, -50px) scale(1.1); }
                        }
                    `}</style>

                        {/* Top Content */}
                        <div className="relative z-10 flex">
                            <div className="text-white font-bold text-2xl drop-shadow-md">
                                {seo?.siteName || "True Buy Malaysia"}
                            </div>
                        </div>

                        {/* Bottom Content / Quote */}
                        <div className="relative z-10 max-w-lg mb-8">
                            <blockquote className="text-3xl xl:text-4xl font-bold text-white leading-[1.2] mb-6 drop-shadow-lg">
                                {displayQuote}
                            </blockquote>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="w-full lg:w-[55%] xl:w-1/2 flex flex-col justify-center items-center py-8 px-4 sm:px-12 lg:px-20 xl:px-32">
                        <div className="w-full max-w-[420px]">
                            {/* Always show Logo above the form */}
                            <div className="flex justify-center mb-10">
                                <Logo />
                            </div>

                            <div className="mb-10 text-center">
                                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0C1311] tracking-tight mb-3">
                                    {title}
                                </h1>
                                {subtitle && (
                                    <p className="text-gray-500 text-[15px] font-medium leading-relaxed">
                                        {subtitle}
                                    </p>
                                )}
                            </div>

                            {/* The Auth Form / Content */}
                            <div className="bg-white">{children}</div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
