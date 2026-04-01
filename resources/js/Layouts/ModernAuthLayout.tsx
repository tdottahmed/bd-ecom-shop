import React, { ReactNode } from "react";
import BrandLogo from "@/Components/Utility/BrandLogo";
import { Link } from "@inertiajs/react";

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
    quote = "Empowering your business with seamless and efficient management tools.",
    quoteAuthor = "Paikari World",
}: ModernAuthLayoutProps) {
    return (
        <div className="flex min-h-screen bg-white">
            {/* Visual Column - Hidden on mobile, visible on lg+ screens */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#0C1311] overflow-hidden flex-col justify-between p-12">
                {/* Background Details */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#2DE3A7]/20 via-[#0C1311] to-[#0C1311]"></div>
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#2DE3A7]/10 via-transparent to-transparent"></div>
                    
                    {/* Subtle grid pattern */}
                    <div 
                        className="absolute inset-0 opacity-[0.03]" 
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.83v58.34h-58.34v-.83h57.51v-57.51h.83z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
                        }}
                    ></div>
                </div>

                {/* Top Content */}
                <div className="relative z-10">
                    <BrandLogo size="lg" withText={true} />
                </div>

                {/* Bottom Content / Quote */}
                <div className="relative z-10 max-w-lg">
                    <blockquote className="text-2xl font-medium text-white leading-relaxed mb-6">
                        "{quote}"
                    </blockquote>
                    <p className="text-[#2DE3A7] font-semibold text-lg">{quoteAuthor}</p>
                    <div className="mt-8 flex gap-2">
                        <div className="w-12 h-1 bg-[#2DE3A7] rounded-full"></div>
                        <div className="w-2 h-1 bg-gray-700 rounded-full"></div>
                        <div className="w-2 h-1 bg-gray-700 rounded-full"></div>
                    </div>
                </div>
            </div>

            {/* Form Column - Full width on mobile, 50% on lg+ screens */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 lg:px-24 xl:px-32">
                <div className="w-full max-w-md">
                    {/* Mobile Logo - Only shown when visual column is hidden */}
                    <div className="lg:hidden flex justify-center mb-10">
                        <div className="bg-[#0C1311] p-4 rounded-2xl shadow-lg border border-gray-100">
                           <BrandLogo size="md" withText={true} />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-gray-500 text-base leading-relaxed">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {/* The Auth Form / Content */}
                    <div className="bg-white">
                        {children}
                    </div>

                    {/* Helpful Links */}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-gray-500">
                            By continuing, you agree to our{" "}
                            <Link href="#" className="font-medium text-gray-900 hover:text-[#2DE3A7] transition-colors underline decoration-gray-300 underline-offset-4">Terms of Service</Link>
                            {" "}and{" "}
                            <Link href="#" className="font-medium text-gray-900 hover:text-[#2DE3A7] transition-colors underline decoration-gray-300 underline-offset-4">Privacy Policy</Link>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
