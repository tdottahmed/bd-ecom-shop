import React, { useState } from "react";
import { useAntiSpam } from "@/Hooks/useAntiSpam";
import { Head, Link, useForm } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Plus,
    Minus,
    Send,
    MessageCircle,
    ChevronRight,
    Home,
} from "lucide-react";
import NewsletterIndex from "../Admin/Newsletter/Index";
import CtaSection from "@/Components/Customer/CtaSection";

interface FAQItem {
    question: string;
    answer: string;
}

interface ContactInfo {
    address: string;
    phone: string;
    email: string;
    hours: string;
    map_embed: string;
}

export default function Contact({
    page,
    faqs = [],
    contactInfo,
}: {
    page?: any;
    faqs?: FAQItem[];
    contactInfo?: ContactInfo;
}) {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const toggleFaq = (index: number) =>
        setOpenFaq(openFaq === index ? null : index);
    const { honeypot, setHoneypot, validate } = useAntiSpam(3);
    const { data, setData, post, processing, reset, errors } = useForm({
        _hp: '',
        first_name: '',
        last_name: '',
        email: '',
        subject: '',
        message: '',
    });

    const contactCards = [
        {
            icon: MapPin,
            label: "Our Location",
            lines: [
                contactInfo?.address || "Kuala Lumpur City Centre,",
                "50088 Kuala Lumpur, Malaysia",
            ],
            color: "bg-indigo-50 text-indigo-600",
        },
        {
            icon: Phone,
            label: "Phone",
            lines: [
                contactInfo?.phone || "+60 3 1234 5678",
                contactInfo?.hours || "Mon–Sat, 9am–6pm",
            ],
            color: "bg-emerald-50 text-emerald-600",
        },
        {
            icon: Mail,
            label: "Email",
            lines: [
                contactInfo?.email || "support@truebymalaysia.com",
                "We reply within 24 hours",
            ],
            color: "bg-sky-50 text-sky-600",
        },
        {
            icon: Clock,
            label: "Business Hours",
            lines: [
                contactInfo?.hours || "Mon–Fri: 9:00am – 6:00pm",
                "Sat: 10:00am – 2:00pm",
            ],
            color: "bg-violet-50 text-violet-600",
        },
    ];

    const mapSrc =
        contactInfo?.map_embed ||
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.751352458897!2d101.7093247!3d3.159495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc37d12d669c1f%3A0x9e3afdd17c8a9056!2sPetronas%20Twin%20Towers!5e0!3m2!1sen!2smy!4v1711867123456!5m2!1sen!2smy";

    return (
        <CustomerLayout>
            <Head>
                <title>{page?.title || "Contact Us"}</title>
                <meta
                    name="description"
                    content="Get in touch with us for any inquiries, support, or feedback."
                />
            </Head>

            <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
                {/* Background blobs */}
                <div className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center">
                    <div className="h-72 w-[36rem] rounded-full bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 opacity-30 blur-3xl" />
                </div>
                <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 right-0 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

                <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
                    {/* Hero heading */}
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                            <MessageCircle size={12} />
                            Get in Touch
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
                            We'd love to hear from you
                        </h1>
                        <p className="max-w-xl mx-auto text-lg text-slate-500">
                            Whether you have a question about our products,
                            shipping, or anything else — our team is ready to
                            help.
                        </p>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14 max-w-7xl mx-auto">
                        {contactCards.map(
                            ({ icon: Icon, label, lines, color }) => (
                                <div
                                    key={label}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    <div
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}
                                    >
                                        <Icon size={18} />
                                    </div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5">
                                        {label}
                                    </p>
                                    {lines.map((line, i) => (
                                        <p
                                            key={i}
                                            className={
                                                i === 0
                                                    ? "text-sm font-semibold text-slate-800"
                                                    : "text-xs text-slate-400 mt-0.5"
                                            }
                                        >
                                            {line}
                                        </p>
                                    ))}
                                </div>
                            ),
                        )}
                    </div>

                    {/* Main Grid: Form + Map */}
                    <div className="rounded-3xl max-w-7xl mx-auto border border-slate-100 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.10)] overflow-hidden mb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {/* Form */}
                            <div className="p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-slate-100">
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                                    Send a Message
                                </h2>
                                <p className="text-sm text-slate-400 mb-8">
                                    We'll get back to you within 24 hours.
                                </p>

                                <form
                                    className="space-y-5"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (!validate()) return;
                                        post(route('pages.contact.submit'), {
                                            preserveScroll: true,
                                            onSuccess: () => reset(),
                                        });
                                    }}
                                >
                                    {/* Honeypot — bots fill this, humans never see it */}
                                    <input
                                        className="spam-trap opacity-0 absolute -z-50"
                                        type="text"
                                        name="_hp"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        aria-hidden="true"
                                        value={honeypot}
                                        onChange={(e) => {
                                            setHoneypot(e.target.value);
                                            setData('_hp', e.target.value);
                                        }}
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label
                                                htmlFor="first_name"
                                                className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                                            >
                                                First Name
                                            </label>
                                            <input
                                                type="text"
                                                id="first_name"
                                                value={data.first_name}
                                                onChange={(e) => setData('first_name', e.target.value)}
                                                placeholder="John"
                                                className={`w-full bg-slate-50 border ${errors.first_name ? 'border-red-500' : 'border-slate-200'} text-slate-800 placeholder-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all`}
                                            />
                                            {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label
                                                htmlFor="last_name"
                                                className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                                            >
                                                Last Name
                                            </label>
                                            <input
                                                type="text"
                                                id="last_name"
                                                value={data.last_name}
                                                onChange={(e) => setData('last_name', e.target.value)}
                                                placeholder="Doe"
                                                className={`w-full bg-slate-50 border ${errors.last_name ? 'border-red-500' : 'border-slate-200'} text-slate-800 placeholder-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all`}
                                            />
                                            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor="email"
                                            className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                                        >
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="john@example.com"
                                            className={`w-full bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'} text-slate-800 placeholder-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all`}
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor="subject"
                                            className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                                        >
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            value={data.subject}
                                            onChange={(e) => setData('subject', e.target.value)}
                                            placeholder="How can we help?"
                                            className={`w-full bg-slate-50 border ${errors.subject ? 'border-red-500' : 'border-slate-200'} text-slate-800 placeholder-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all`}
                                        />
                                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor="message"
                                            className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                                        >
                                            Message
                                        </label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="Tell us everything..."
                                            className={`w-full bg-slate-50 border ${errors.message ? 'border-red-500' : 'border-slate-200'} text-slate-800 placeholder-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-y`}
                                        />
                                        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-black text-white font-semibold px-7 py-3 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
                                    >
                                        <Send size={15} />
                                        {processing ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            </div>

                            {/* Map */}
                            <div className="h-[400px] lg:h-auto min-h-[400px]">
                                <iframe
                                    src={mapSrc}
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, display: "block" }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Office Location Map"
                                />
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="max-w-7xl mx-auto mb-6">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                                Frequently Asked Questions
                            </h2>
                            <p className="text-slate-500 text-sm">
                                Can't find the answer? Reach out to our support
                                team.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {faqs.map((faq, index) => {
                                const isOpen = openFaq === index;
                                return (
                                    <div
                                        key={index}
                                        className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                                            isOpen
                                                ? "border-indigo-200 shadow-indigo-50"
                                                : "border-slate-100 hover:border-slate-200"
                                        }`}
                                    >
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="w-full flex items-center justify-between px-6 py-5 text-left focus:outline-none"
                                        >
                                            <span
                                                className={`text-sm font-semibold pr-4 transition-colors ${isOpen ? "text-indigo-600" : "text-slate-700"}`}
                                            >
                                                {faq.question}
                                            </span>
                                            <span
                                                className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${isOpen ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-400"}`}
                                            >
                                                {isOpen ? (
                                                    <Minus size={14} />
                                                ) : (
                                                    <Plus size={14} />
                                                )}
                                            </span>
                                        </button>

                                        <div
                                            className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}
                                        >
                                            <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                                                {faq.answer}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <CtaSection />
                </div>
            </div>
        </CustomerLayout>
    );
}
