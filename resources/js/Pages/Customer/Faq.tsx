import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { ChevronRight, Home, HelpCircle, Plus, Minus, MessageCircle } from "lucide-react";

interface FAQ {
    question: string;
    answer: string;
}

export default function Faq({ faqs = [] }: { faqs?: FAQ[] }) {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const toggle = (i: number) => setOpenFaq(openFaq === i ? null : i);

    return (
        <CustomerLayout>
            <Head title="FAQ" />
            <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
                {/* Blobs */}
                <div className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center">
                    <div className="h-72 w-[36rem] rounded-full bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 opacity-30 blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-8">
                        <Link
                            href="/"
                            className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                        >
                            <Home size={12} /> Home
                        </Link>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-slate-600 font-medium">FAQ</span>
                    </nav>

                    {/* Hero */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                            <HelpCircle size={12} /> Help Center
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="max-w-xl mx-auto text-lg text-slate-500">
                            Find answers to the most common questions about our products, shipping, and policies.
                        </p>
                    </div>

                    {/* FAQ list */}
                    {faqs.length > 0 ? (
                        <div className="space-y-3 mb-16">
                            {faqs.map((faq, i) => {
                                const isOpen = openFaq === i;
                                return (
                                    <div
                                        key={i}
                                        className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                                            isOpen
                                                ? "border-indigo-200 shadow-indigo-50"
                                                : "border-slate-100 hover:border-slate-200"
                                        }`}
                                    >
                                        <button
                                            onClick={() => toggle(i)}
                                            className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
                                        >
                                            <span
                                                className={`text-sm font-semibold pr-4 transition-colors ${
                                                    isOpen ? "text-indigo-600" : "text-slate-700"
                                                }`}
                                            >
                                                {faq.question}
                                            </span>
                                            <span
                                                className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                                                    isOpen
                                                        ? "bg-indigo-100 text-indigo-600"
                                                        : "bg-slate-100 text-slate-400"
                                                }`}
                                            >
                                                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                                            </span>
                                        </button>
                                        <div
                                            className={`transition-all duration-300 ease-in-out ${
                                                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                            }`}
                                        >
                                            <div className="px-6 pb-5 pt-4 text-sm text-slate-500 leading-relaxed border-t border-slate-100">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center mb-16">
                            <HelpCircle size={40} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500">No FAQs have been added yet.</p>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-center">
                        <h2 className="text-xl font-bold text-white mb-2">Still have questions?</h2>
                        <p className="text-slate-400 text-sm mb-6">
                            Can't find what you're looking for? Our team is happy to help.
                        </p>
                        <Link
                            href="/contact-us"
                            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg"
                        >
                            <MessageCircle size={15} /> Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
