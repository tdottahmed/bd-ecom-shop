import React from "react";
import { Head, Link } from "@inertiajs/react";
import {
    CheckCircle2,
    Quote,
    Sparkles,
    Truck,
    ShieldCheck,
    ChevronRight,
    Home,
    Users,
    Star,
    ArrowRight,
} from "lucide-react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import NewsletterSection from "@/Components/Customer/CtaSection";
import CtaSection from "@/Components/Customer/CtaSection";

const processSteps = [
    {
        title: "Curated Sourcing",
        description:
            "We select practical, high-demand products from trusted suppliers so every launch solves a real customer need.",
        icon: Sparkles,
        step: "01",
        color: "bg-indigo-50 text-indigo-600",
    },
    {
        title: "Quality & Authenticity",
        description:
            "Each listing is reviewed for quality, images, and product accuracy before it appears in our store.",
        icon: ShieldCheck,
        step: "02",
        color: "bg-emerald-50 text-emerald-600",
    },
    {
        title: "Fast Fulfillment",
        description:
            "Orders are packed with care and shipped quickly through reliable courier partners across Malaysia.",
        icon: Truck,
        step: "03",
        color: "bg-sky-50 text-sky-600",
    },
];

const values = [
    "Customer-first thinking in every decision",
    "Practical product selection with honest value",
    "Consistent communication from order to delivery",
    "Long-term trust over short-term sales",
];

const defaultStats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "500+", label: "Products Listed" },
    { value: "99%", label: "Genuine Products" },
    { value: "24h", label: "Support Response" },
];

const defaultTestimonials = [
    {
        name: "Nusrat Jahan",
        role: "Regular Customer",
        quote: "Packaging was neat, delivery was fast, and the product quality matched exactly what I saw on the website.",
        rating: 5,
    },
    {
        name: "Arif Hasan",
        role: "First-time Buyer",
        quote: "I placed my order at night and got updates quickly. The entire buying process felt smooth and professional.",
        rating: 5,
    },
    {
        name: "Sadia Rahman",
        role: "Repeat Customer",
        quote: "TrueBuy has become my go-to store. Prices are fair, service is responsive, and products are always genuine.",
        rating: 5,
    },
];

export default function About({
    page,
    stats = [],
    testimonials = [],
}: {
    page?: { title: string; slug: string; content?: string | null };
    stats?: { value: string; label: string }[];
    testimonials?: {
        name: string;
        role: string;
        quote: string;
        rating: number;
    }[];
}) {
    const displayStats = stats.length > 0 ? stats : defaultStats;
    const displayTestimonials =
        testimonials.length > 0 ? testimonials : defaultTestimonials;

    return (
        <CustomerLayout>
            <Head title="About Us" />

            <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
                {/* Background blobs */}
                <div className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center">
                    <div className="h-72 w-[36rem] rounded-full bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 opacity-30 blur-3xl" />
                </div>
                <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 right-0 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
                    {/* Hero heading */}
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                            <Users size={12} />
                            Our Story
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
                            About True by Malaysia
                        </h1>
                        <p className="max-w-xl mx-auto text-lg text-slate-500">
                            We started with a simple mission — make online
                            shopping dependable. Here's how we got here and what
                            drives us every day.
                        </p>
                    </div>

                    {/* Hero */}
                    <div className="rounded-3xl border border-slate-100 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.10)] overflow-hidden mb-10">
                        <div className="grid lg:grid-cols-2 items-center">
                            <div className="p-10 sm:p-14">
                                <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
                                    <CheckCircle2 size={12} />
                                    TrueBuy Malaysia
                                </div>
                                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 leading-tight mb-5">
                                    Building a trusted shopping experience
                                </h1>
                                <p className="text-slate-500 text-base leading-relaxed mb-8">
                                    TrueBuy Malaysia started with one simple
                                    mission: make online shopping dependable. We
                                    focus on products people actually use,
                                    present them clearly, and deliver every
                                    order with care so customers can buy with
                                    confidence.
                                </p>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg"
                                >
                                    Browse Products
                                    <ArrowRight size={15} />
                                </Link>
                            </div>

                            {/* Stats panel */}
                            <div className="bg-slate-900 p-10 sm:p-14 h-full">
                                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-8">
                                    By the numbers
                                </p>
                                <div className="grid grid-cols-2 gap-8">
                                    {displayStats.map(({ value, label }) => (
                                        <div key={label}>
                                            <p className="text-3xl font-black text-white">
                                                {value}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1 font-medium">
                                                {label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Story + Values */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-10">
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10">
                            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-widest mb-3">
                                Our Story
                            </p>
                            <h2 className="text-2xl font-bold text-slate-900 mb-5">
                                Setting a higher standard
                            </h2>
                            <p className="text-slate-500 leading-relaxed text-sm mb-4">
                                We saw too many buyers disappointed by unclear
                                product details, slow communication, and
                                uncertain delivery timelines. TrueBuy Malaysia
                                was created to set a higher standard: better
                                product curation, clear information, and
                                dependable post-order support.
                            </p>
                            <p className="text-slate-500 leading-relaxed text-sm">
                                Today, our team combines smart sourcing, careful
                                quality checks, and efficient logistics so every
                                customer receives value beyond the price tag.
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10">
                            <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-3">
                                What Defines Us
                            </p>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">
                                Our core principles
                            </h2>
                            <ul className="space-y-4">
                                {values.map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                            <CheckCircle2
                                                size={13}
                                                className="text-emerald-500"
                                            />
                                        </div>
                                        <span className="text-slate-600 text-sm leading-relaxed">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* How We Work */}
                    <div className="mb-10">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                                How we work
                            </h2>
                            <p className="text-slate-500 text-sm max-w-xl mx-auto">
                                A focused process keeps our standards high and
                                your shopping experience smooth.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {processSteps.map((step) => {
                                const Icon = step.icon;
                                return (
                                    <div
                                        key={step.title}
                                        className="relative bg-white rounded-3xl border border-slate-100 shadow-sm p-7 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
                                    >
                                        <span className="absolute top-5 right-6 text-5xl font-black text-slate-50 select-none">
                                            {step.step}
                                        </span>
                                        <div
                                            className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${step.color}`}
                                        >
                                            <Icon size={20} />
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Testimonials */}
                    <div className="mb-10">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                                Customer Testimonials
                            </h2>
                            <p className="text-slate-500 text-sm">
                                Real feedback from buyers who shop with TrueBuy
                                Malaysia.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {displayTestimonials.map((review) => (
                                <div
                                    key={review.name}
                                    className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <div className="flex items-center gap-0.5 mb-4">
                                        {Array.from({
                                            length: review.rating,
                                        }).map((_, i) => (
                                            <Star
                                                key={i}
                                                size={13}
                                                className="text-amber-400 fill-amber-400"
                                            />
                                        ))}
                                    </div>
                                    <Quote
                                        size={24}
                                        className="text-slate-100 mb-3"
                                    />
                                    <p className="text-slate-600 text-sm leading-relaxed mb-5">
                                        "{review.quote}"
                                    </p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                                        <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                                            <Users
                                                size={15}
                                                className="text-slate-500"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900">
                                                {review.name}
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {review.role}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter */}
                    <CtaSection />
                </div>
            </div>
        </CustomerLayout>
    );
}
