import React from "react";
import { Link } from "@inertiajs/react";
import { ArrowRight, PhoneCall, ShoppingBag } from "lucide-react";

type NewsletterSectionProps = {
    enabled?: boolean;
    title?: string;
    description?: string;
    browseText?: string;
    contactText?: string;
    browseLink?: string;
    contactLink?: string;
};

const CtaSection: React.FC<NewsletterSectionProps> = ({
    enabled = true,
    title = "Ready to Discover Something Exceptional?",
    description = "Explore premium picks curated for modern living, or reach out and let us help you choose the right products.",
    browseText = "Browse Our Products",
    contactText = "Contact Us",
    browseLink = "/products",
    contactLink = "/contact-us",
}) => {
    if (!enabled) return null;

    return (
        <section className="group relative overflow-hidden rounded-[30px] border border-white/40 bg-gradient-to-br from-brand-dark via-[#2D0A1F] to-brand-dark px-6 py-12 text-white shadow-[0_25px_90px_rgba(26,17,26,0.5)] sm:px-10 sm:py-14">
            <div className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-brand-primary/30 blur-3xl transition-transform duration-700 group-hover:scale-110" />
            <div className="pointer-events-none absolute -bottom-24 left-1/2 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-brand-accent/20 blur-3xl transition-transform duration-700 group-hover:scale-110" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(225,29,109,0.25),transparent_35%)]" />

            <style>{`
                @keyframes ctaFloat {
                    0%, 100% { transform: translateY(0); opacity: 0.6; }
                    50% { transform: translateY(-10px); opacity: 1; }
                }
            `}</style>
            <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
                <div>
                    <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-brand-tint">
                        Your next favorite find
                    </span>
                    <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                        {title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-200 sm:text-base lg:text-lg">
                        {description}
                    </p>
                </div>
                <div className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link
                        href={browseLink}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        <span>{browseText}</span>
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                        href={contactLink}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/35 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                    >
                        <PhoneCall className="h-4 w-4" />
                        <span>{contactText}</span>
                    </Link>
                </div>
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-35">
                <div className="absolute left-[16%] top-[24%] h-2 w-2 animate-[ctaFloat_5s_ease-in-out_infinite] rounded-full bg-white/80" />
                <div className="absolute left-[34%] top-[76%] h-1.5 w-1.5 animate-[ctaFloat_6.5s_ease-in-out_infinite] rounded-full bg-brand-tint/80" />
                <div className="absolute right-[20%] top-[30%] h-2 w-2 animate-[ctaFloat_7s_ease-in-out_infinite] rounded-full bg-brand-accent/80" />
            </div>
        </section>
    );
};

export default CtaSection;
