import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { ChevronRight, Home, Shield } from "lucide-react";

interface Page {
    title: string;
    slug: string;
    content?: string | null;
}

const sections = [
    { id: "introduction", label: "Introduction" },
    { id: "data-collection", label: "Data We Collect" },
    { id: "how-we-use", label: "How We Use Data" },
    { id: "cookies", label: "Cookies" },
    { id: "third-parties", label: "Third Parties" },
    { id: "your-rights", label: "Your Rights" },
    { id: "contact", label: "Contact Us" },
];

function DefaultContent() {
    return (
        <div className="prose prose-slate max-w-none">
            <section id="introduction">
                <h2>Introduction</h2>
                <p>
                    Welcome to True by Malaysia (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;). We are committed to protecting your
                    personal information and your right to privacy. This Privacy Policy explains how we collect,
                    use, and share information about you when you use our website and services.
                </p>
                <p>
                    By accessing or using our platform, you agree to the terms described in this policy. If you
                    do not agree, please discontinue use of our services.
                </p>
            </section>

            <section id="data-collection">
                <h2>Data We Collect</h2>
                <p>We may collect the following types of information:</p>
                <ul>
                    <li>
                        <strong>Personal identification information</strong> — name, email address, phone number,
                        and shipping address provided during checkout or account registration.
                    </li>
                    <li>
                        <strong>Order and transaction data</strong> — purchase history, payment method type (we do
                        not store full card numbers), and delivery details.
                    </li>
                    <li>
                        <strong>Device and usage data</strong> — IP address, browser type, pages visited, and
                        referring URLs, collected automatically when you visit our site.
                    </li>
                    <li>
                        <strong>Communications</strong> — messages you send us via contact forms or email.
                    </li>
                </ul>
            </section>

            <section id="how-we-use">
                <h2>How We Use Your Data</h2>
                <p>We use the information we collect to:</p>
                <ul>
                    <li>Process and fulfill your orders and provide order tracking updates.</li>
                    <li>Respond to your inquiries and provide customer support.</li>
                    <li>Send transactional emails (order confirmations, shipping notifications).</li>
                    <li>Improve our website, products, and services based on usage patterns.</li>
                    <li>Prevent fraud and maintain the security of our platform.</li>
                    <li>Comply with legal obligations.</li>
                </ul>
                <p>
                    We do not sell your personal data to third parties. We may share data with trusted service
                    providers (e.g., courier partners, payment processors) solely to fulfill your orders.
                </p>
            </section>

            <section id="cookies">
                <h2>Cookies</h2>
                <p>
                    Our website uses cookies — small text files placed on your device — to improve your
                    experience. Cookies help us remember your preferences, maintain your shopping cart session,
                    and analyze site traffic.
                </p>
                <p>
                    You can control or disable cookies through your browser settings. Disabling cookies may
                    limit some features of the site, such as the shopping cart.
                </p>
            </section>

            <section id="third-parties">
                <h2>Third-Party Services</h2>
                <p>
                    We work with third-party services to operate our platform, including courier services
                    (Steadfast, Pathao, RedX) and analytics providers. These parties only receive information
                    necessary to perform their functions and are bound by their own privacy policies.
                </p>
                <p>
                    Our site may contain links to third-party websites. We are not responsible for the privacy
                    practices of those sites and encourage you to review their policies separately.
                </p>
            </section>

            <section id="your-rights">
                <h2>Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                    <li>Access the personal data we hold about you.</li>
                    <li>Request correction of inaccurate data.</li>
                    <li>Request deletion of your data, subject to legal obligations.</li>
                    <li>Opt out of marketing communications at any time.</li>
                </ul>
                <p>
                    To exercise any of these rights, please contact us at the details provided below.
                </p>
            </section>

            <section id="contact">
                <h2>Contact Us</h2>
                <p>
                    If you have questions or concerns about this Privacy Policy or how we handle your data,
                    please reach out to us:
                </p>
                <ul>
                    <li>
                        <strong>Email:</strong>{" "}
                        <a href="mailto:support@truebymalaysia.com">support@truebymalaysia.com</a>
                    </li>
                    <li>
                        <strong>Address:</strong> Kuala Lumpur City Centre, 50088 Kuala Lumpur, Malaysia
                    </li>
                </ul>
                <p>
                    We aim to respond to all privacy-related inquiries within 5 business days.
                </p>
            </section>
        </div>
    );
}

export default function PrivacyPolicy({ page }: { page?: Page | null }) {
    const [activeSection, setActiveSection] = useState<string>("introduction");

    const pageTitle = page?.title || "Privacy Policy";
    const hasContent = !!page?.content;

    return (
        <CustomerLayout>
            <Head title={pageTitle} />

            <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
                {/* Background blob */}
                <div className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center">
                    <div className="h-72 w-[36rem] rounded-full bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 opacity-20 blur-3xl" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-8">
                        <Link
                            href="/"
                            className="flex items-center gap-1 hover:text-slate-700 transition-colors"
                        >
                            <Home size={12} /> Home
                        </Link>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-slate-600 font-medium">Privacy Policy</span>
                    </nav>

                    {/* Page Header */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                            <Shield size={12} /> Legal
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-3">
                            {pageTitle}
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Last updated: March 2026
                        </p>
                    </div>

                    {/* Two-column layout: sidebar + content */}
                    <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-12 items-start">
                        {/* Sticky sidebar — only show for default content */}
                        {!hasContent && (
                            <aside className="hidden lg:block">
                                <div className="sticky top-8 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">
                                        Quick Navigation
                                    </p>
                                    <nav className="space-y-1">
                                        {sections.map((section) => (
                                            <a
                                                key={section.id}
                                                href={`#${section.id}`}
                                                onClick={() => setActiveSection(section.id)}
                                                className={`block text-sm px-3 py-2 rounded-lg transition-colors ${
                                                    activeSection === section.id
                                                        ? "bg-indigo-50 text-indigo-600 font-medium"
                                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                                }`}
                                            >
                                                {section.label}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </aside>
                        )}

                        {/* Main content */}
                        <div className={hasContent ? "lg:col-span-2" : ""}>
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-10">
                                {hasContent ? (
                                    <div
                                        className="prose prose-slate max-w-none"
                                        dangerouslySetInnerHTML={{ __html: page!.content! }}
                                    />
                                ) : (
                                    <DefaultContent />
                                )}
                            </div>

                            {/* Footer note */}
                            <p className="text-center text-xs text-slate-400 mt-6">
                                If you have questions about this policy, please{" "}
                                <Link href="/contact-us" className="text-indigo-500 hover:underline">
                                    contact us
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
