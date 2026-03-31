import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { ChevronRight, Home, FileText, ArrowUpRight } from "lucide-react";

interface Page {
    title: string;
    slug: string;
    content?: string | null;
}

const LAST_UPDATED = "31 March 2026";
const EFFECTIVE_DATE = "1 April 2026";

const sections = [
    { id: "acceptance",      num: "01", label: "Acceptance of Terms" },
    { id: "use-of-site",     num: "02", label: "Use of Our Platform" },
    { id: "products",        num: "03", label: "Products & Pricing" },
    { id: "orders",          num: "04", label: "Orders & Payment" },
    { id: "shipping",        num: "05", label: "Shipping & Delivery" },
    { id: "returns",         num: "06", label: "Returns & Refunds" },
    { id: "ip",              num: "07", label: "Intellectual Property" },
    { id: "liability",       num: "08", label: "Limitation of Liability" },
    { id: "privacy",         num: "09", label: "Privacy" },
    { id: "governing-law",   num: "10", label: "Governing Law" },
    { id: "changes",         num: "11", label: "Changes to Terms" },
    { id: "contact",         num: "12", label: "Contact Us" },
];

const highlights = [
    "By placing an order, you agree to these terms in full.",
    "All prices are in Malaysian Ringgit (MYR) and include applicable taxes.",
    "We offer a 14-day return window for unopened, unused items.",
    "Orders are fulfilled via Cash on Delivery (COD) — no upfront payment required.",
];

function DefaultContent() {
    return (
        <div className="space-y-14">

            <section id="acceptance">
                <SectionHeader num="01" title="Acceptance of Terms" />
                <div className="prose-body">
                    <p>
                        Welcome to True by Malaysia. These Terms & Conditions ("Terms") govern your access to
                        and use of our website located at <strong>truebymalaysia.com</strong> (the "Platform")
                        and all services, products, and content made available through it.
                    </p>
                    <p>
                        By browsing our Platform, creating an account, or placing an order, you confirm that
                        you have read, understood, and agree to be bound by these Terms. If you do not agree
                        to any part of these Terms, please discontinue use of our Platform immediately.
                    </p>
                    <p>
                        These Terms apply to all users, including visitors, customers, and any other party who
                        accesses or uses the Platform.
                    </p>
                </div>
            </section>

            <section id="use-of-site">
                <SectionHeader num="02" title="Use of Our Platform" />
                <div className="prose-body">
                    <p>
                        You agree to use our Platform only for lawful purposes and in a manner that does not
                        infringe the rights of others or restrict their use of the Platform. Specifically, you
                        agree not to:
                    </p>
                    <ul>
                        <li>Use the Platform in any way that violates applicable local, national, or international laws or regulations.</li>
                        <li>Engage in any conduct that is fraudulent, deceptive, or misleading.</li>
                        <li>Attempt to gain unauthorised access to any part of the Platform, its servers, or databases.</li>
                        <li>Transmit unsolicited or unauthorised advertising, promotional material, or spam.</li>
                        <li>Use automated tools to scrape, crawl, or extract data from the Platform without prior written consent.</li>
                        <li>Interfere with or disrupt the integrity or performance of the Platform.</li>
                    </ul>
                    <p>
                        We reserve the right to suspend or terminate access for any user who violates these terms,
                        at our sole discretion and without prior notice.
                    </p>
                </div>
            </section>

            <section id="products">
                <SectionHeader num="03" title="Products & Pricing" />
                <div className="prose-body">
                    <p>
                        We take care to ensure that all product descriptions, images, and specifications on the
                        Platform are accurate and up to date. However, we do not warrant that product descriptions
                        or other content is entirely error-free.
                    </p>
                    <p>
                        All prices displayed on the Platform are in <strong>Malaysian Ringgit (MYR)</strong> and
                        include applicable taxes unless otherwise stated. Prices are subject to change without
                        prior notice. The price applicable to your order will be the price displayed at the time
                        you place the order.
                    </p>
                    <p>
                        We reserve the right to modify or discontinue any product at any time without notice.
                        We shall not be liable to you or any third party for any modification, suspension, or
                        discontinuation of a product.
                    </p>
                    <p>
                        In the case of a pricing error, we will contact you before processing your order. You
                        will have the option to proceed at the correct price or cancel your order without charge.
                    </p>
                </div>
            </section>

            <section id="orders">
                <SectionHeader num="04" title="Orders & Payment" />
                <div className="prose-body">
                    <p>
                        When you place an order through our Platform, you are making an offer to purchase the
                        selected products at the stated price. An order is confirmed only after our team has
                        reviewed and accepted it — typically via a confirmation call or message.
                    </p>
                    <p>
                        We currently operate exclusively on a <strong>Cash on Delivery (COD)</strong> basis.
                        Payment is collected upon delivery of your order. No upfront payment is required at the
                        time of placing an order.
                    </p>
                    <p>
                        We reserve the right to refuse or cancel any order at our discretion, including in cases
                        of suspected fraud, incorrect product information, or unavailability of stock.
                    </p>
                    <p>
                        By placing an order, you confirm that all information provided — including your name,
                        phone number, and delivery address — is accurate and complete.
                    </p>
                </div>
            </section>

            <section id="shipping">
                <SectionHeader num="05" title="Shipping & Delivery" />
                <div className="prose-body">
                    <p>
                        We aim to dispatch all confirmed orders within <strong>1–2 business days</strong>.
                        Estimated delivery times vary depending on your location and courier availability, but
                        typically range from <strong>2–5 business days</strong> from the date of dispatch.
                    </p>
                    <p>
                        Delivery charges, if applicable, are calculated at checkout based on your selected
                        delivery area and will be presented clearly before you confirm your order.
                    </p>
                    <p>
                        While we make every effort to meet estimated delivery windows, we cannot guarantee
                        specific delivery dates. Delays may occur due to circumstances beyond our control,
                        including public holidays, adverse weather, or courier disruptions.
                    </p>
                    <p>
                        Risk of loss and title for purchased items passes to you upon delivery. If you have not
                        received your order within the estimated window, please contact our support team and we
                        will investigate promptly.
                    </p>
                    <p>
                        Currently, we only deliver within <strong>Malaysia</strong>. We do not offer
                        international shipping at this time.
                    </p>
                </div>
            </section>

            <section id="returns">
                <SectionHeader num="06" title="Returns & Refunds" />
                <div className="prose-body">
                    <p>
                        We want you to be completely satisfied with your purchase. If you are not happy with
                        your order for any reason, you may request a return within <strong>14 days</strong> of
                        receiving your item, subject to the conditions below.
                    </p>
                    <p><strong>Eligible for return:</strong></p>
                    <ul>
                        <li>Items that are unopened, unused, and in their original packaging.</li>
                        <li>Items received in a damaged or defective condition.</li>
                        <li>Items that are materially different from their description on the Platform.</li>
                    </ul>
                    <p><strong>Not eligible for return:</strong></p>
                    <ul>
                        <li>Items that have been opened, used, or altered.</li>
                        <li>Perishable goods, personal care products, or items marked as non-returnable on the product page.</li>
                        <li>Items returned after the 14-day window.</li>
                    </ul>
                    <p>
                        To initiate a return, please contact our customer support team with your order number
                        and a description of the issue. We will review your request and provide further
                        instructions. Approved refunds will be processed within <strong>5–7 business days</strong>.
                    </p>
                </div>
            </section>

            <section id="ip">
                <SectionHeader num="07" title="Intellectual Property" />
                <div className="prose-body">
                    <p>
                        All content on this Platform — including but not limited to text, graphics, logos,
                        product images, button icons, audio clips, digital downloads, data compilations, and
                        software — is the property of True by Malaysia or its content suppliers and is
                        protected by applicable intellectual property laws.
                    </p>
                    <p>
                        You are granted a limited, non-exclusive, non-transferable licence to access and use
                        the Platform for personal, non-commercial purposes. This licence does not permit you to:
                    </p>
                    <ul>
                        <li>Reproduce, distribute, or publicly display any content from the Platform without our prior written consent.</li>
                        <li>Modify or create derivative works based on Platform content.</li>
                        <li>Use any content for commercial purposes without our express written authorisation.</li>
                    </ul>
                    <p>
                        Any unauthorised use of the Platform's content may give rise to a claim for damages
                        and/or be a criminal offence.
                    </p>
                </div>
            </section>

            <section id="liability">
                <SectionHeader num="08" title="Limitation of Liability" />
                <div className="prose-body">
                    <p>
                        To the fullest extent permitted by applicable law, True by Malaysia and its directors,
                        employees, agents, and affiliates shall not be liable for any indirect, incidental,
                        special, consequential, or punitive damages arising from your use of the Platform or
                        purchase of our products.
                    </p>
                    <p>
                        Our total liability to you in connection with any claim arising out of or related to
                        these Terms or the products purchased shall not exceed the total amount paid by you
                        for the specific order giving rise to the claim.
                    </p>
                    <p>
                        Nothing in these Terms shall limit or exclude our liability for death or personal injury
                        caused by our negligence, fraud, or any other matter that cannot be excluded by law.
                    </p>
                </div>
            </section>

            <section id="privacy">
                <SectionHeader num="09" title="Privacy" />
                <div className="prose-body">
                    <p>
                        Your privacy matters to us. The collection, use, and protection of your personal
                        information is governed by our{" "}
                        <Link href="/privacy-policy" className="text-violet-600 underline underline-offset-2 hover:text-violet-800 transition-colors">
                            Privacy Policy
                        </Link>
                        , which is incorporated into these Terms by reference.
                    </p>
                    <p>
                        By using our Platform, you consent to the collection and use of your information as
                        described in our Privacy Policy. We encourage you to review the Privacy Policy carefully
                        before providing any personal information.
                    </p>
                </div>
            </section>

            <section id="governing-law">
                <SectionHeader num="10" title="Governing Law" />
                <div className="prose-body">
                    <p>
                        These Terms shall be governed by and construed in accordance with the laws of
                        <strong> Malaysia</strong>, without regard to its conflict of law provisions.
                    </p>
                    <p>
                        Any dispute arising out of or in connection with these Terms, including any question
                        regarding their existence, validity, or termination, shall be subject to the exclusive
                        jurisdiction of the courts of Malaysia.
                    </p>
                    <p>
                        If any provision of these Terms is found to be unenforceable or invalid, that provision
                        shall be limited or eliminated to the minimum extent necessary so that these Terms shall
                        otherwise remain in full force and effect.
                    </p>
                </div>
            </section>

            <section id="changes">
                <SectionHeader num="11" title="Changes to Terms" />
                <div className="prose-body">
                    <p>
                        We reserve the right to revise these Terms at any time. When we make material changes,
                        we will update the "Last Updated" date at the top of this page and, where appropriate,
                        notify you by email or a prominent notice on the Platform.
                    </p>
                    <p>
                        Your continued use of the Platform after any changes to these Terms constitutes your
                        acceptance of the revised Terms. We encourage you to review this page periodically to
                        stay informed.
                    </p>
                </div>
            </section>

            <section id="contact">
                <SectionHeader num="12" title="Contact Us" />
                <div className="prose-body">
                    <p>
                        If you have any questions, concerns, or feedback regarding these Terms & Conditions,
                        please do not hesitate to get in touch with us:
                    </p>
                    <ul>
                        <li>
                            <strong>Email:</strong>{" "}
                            <a href="mailto:support@truebymalaysia.com" className="text-violet-600 underline underline-offset-2 hover:text-violet-800 transition-colors">
                                support@truebymalaysia.com
                            </a>
                        </li>
                        <li>
                            <strong>Phone:</strong> +60 3 1234 5678
                        </li>
                        <li>
                            <strong>Address:</strong> Kuala Lumpur City Centre, 50088 Kuala Lumpur, Malaysia
                        </li>
                        <li>
                            <strong>Support hours:</strong> Monday–Friday, 9:00am – 6:00pm (MYT)
                        </li>
                    </ul>
                    <p>
                        Alternatively, you may use our{" "}
                        <Link href="/contact-us" className="text-violet-600 underline underline-offset-2 hover:text-violet-800 transition-colors">
                            contact form
                        </Link>{" "}
                        and we will respond within 2 business days.
                    </p>
                </div>
            </section>

        </div>
    );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
    return (
        <div className="flex items-baseline gap-4 mb-5 pb-4 border-b border-slate-100">
            <span className="text-xs font-black text-slate-200 tabular-nums tracking-widest shrink-0 select-none">
                {num}
            </span>
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        </div>
    );
}

export default function TermsConditions({ page }: { page?: Page | null }) {
    const [activeSection, setActiveSection] = useState<string>("acceptance");
    const contentRef = useRef<HTMLDivElement>(null);
    const hasContent = !!page?.content;

    useEffect(() => {
        if (hasContent) return;
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: "-20% 0px -70% 0px" }
        );
        const targets = contentRef.current?.querySelectorAll("section[id]") ?? [];
        targets.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [hasContent]);

    const pageTitle = page?.title || "Terms & Conditions";

    return (
        <CustomerLayout>
            <Head title={pageTitle} />

            {/* Inline styles for prose-body since we're not using Tailwind prose plugin here */}
            <style>{`
                .prose-body p {
                    color: #475569;
                    font-size: 0.9375rem;
                    line-height: 1.8;
                    margin-bottom: 1rem;
                }
                .prose-body ul {
                    list-style: none;
                    padding: 0;
                    margin: 0.75rem 0 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .prose-body ul li {
                    color: #475569;
                    font-size: 0.9375rem;
                    line-height: 1.7;
                    padding-left: 1.25rem;
                    position: relative;
                }
                .prose-body ul li::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0.65em;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: #7c3aed;
                    opacity: 0.6;
                }
                .prose-body strong {
                    color: #1e293b;
                    font-weight: 600;
                }
                .prose-body a {
                    color: #7c3aed;
                }
            `}</style>

            <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
                {/* Background accent */}
                <div className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center">
                    <div className="h-72 w-[40rem] rounded-full bg-gradient-to-r from-violet-400 via-indigo-300 to-sky-300 opacity-20 blur-3xl" />
                </div>
                <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-80 rounded-full bg-violet-100/40 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-8">
                        <Link href="/" className="flex items-center gap-1 hover:text-slate-700 transition-colors">
                            <Home size={12} /> Home
                        </Link>
                        <ChevronRight size={12} className="text-slate-300" />
                        <span className="text-slate-600 font-medium">Terms & Conditions</span>
                    </nav>

                    {/* Page Header */}
                    <div className="mb-10">
                        <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
                            <FileText size={12} /> Legal
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
                            {pageTitle}
                        </h1>
                        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400">
                            <span>
                                Last updated: <span className="font-medium text-slate-600">{LAST_UPDATED}</span>
                            </span>
                            <span className="w-px h-3 bg-slate-200" />
                            <span>
                                Effective: <span className="font-medium text-slate-600">{EFFECTIVE_DATE}</span>
                            </span>
                            <span className="w-px h-3 bg-slate-200" />
                            <span>Jurisdiction: <span className="font-medium text-slate-600">Malaysia</span></span>
                        </div>
                    </div>

                    {/* Key Highlights summary — only shown for default content */}
                    {!hasContent && (
                        <div className="bg-violet-50 border border-violet-100 rounded-2xl p-6 sm:p-8 mb-12">
                            <p className="text-xs font-semibold text-violet-500 uppercase tracking-widest mb-4">
                                Key Highlights
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3">
                                {highlights.map((h, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <span className="mt-1 w-4 h-4 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                            {i + 1}
                                        </span>
                                        <p className="text-sm text-slate-600 leading-relaxed">{h}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Two-column layout */}
                    <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12 items-start">

                        {/* Sticky sidebar */}
                        {!hasContent && (
                            <aside className="hidden lg:block">
                                <div className="sticky top-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                    <div className="px-5 py-4 border-b border-slate-100">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                                            Contents
                                        </p>
                                    </div>
                                    <nav className="p-3">
                                        {sections.map((s) => (
                                            <a
                                                key={s.id}
                                                href={`#${s.id}`}
                                                onClick={() => setActiveSection(s.id)}
                                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all ${
                                                    activeSection === s.id
                                                        ? "bg-violet-50 text-violet-700 font-semibold"
                                                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                                                }`}
                                            >
                                                <span className={`tabular-nums font-mono text-[10px] shrink-0 ${activeSection === s.id ? "text-violet-400" : "text-slate-300"}`}>
                                                    {s.num}
                                                </span>
                                                {s.label}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </aside>
                        )}

                        {/* Main content */}
                        <div ref={contentRef} className={hasContent ? "lg:col-span-2" : ""}>
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 sm:p-12">
                                {hasContent ? (
                                    <div
                                        className="prose prose-slate max-w-none"
                                        dangerouslySetInnerHTML={{ __html: page!.content! }}
                                    />
                                ) : (
                                    <DefaultContent />
                                )}
                            </div>

                            {/* Bottom note + links */}
                            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
                                <p className="text-xs text-slate-400 text-center sm:text-left">
                                    These terms were last reviewed and updated on {LAST_UPDATED}.
                                </p>
                                <div className="flex items-center gap-4">
                                    <Link href="/privacy-policy" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
                                        Privacy Policy <ArrowUpRight size={11} />
                                    </Link>
                                    <Link href="/contact-us" className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors">
                                        Contact Us <ArrowUpRight size={11} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
