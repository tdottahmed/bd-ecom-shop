import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useState } from "react";
import { useAntiSpam } from "@/Hooks/useAntiSpam";
import { resolvePageHref } from "@/Utils/pageLink";

type FooterPage = {
    title: string;
    slug: string;
};

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const {
        siteLogo,
        siteDescription,
        seo,
        footer,
        footerPages,
        blogEnabled,
    }: any = usePage().props;
    const siteName = seo?.siteName || "Paikari World";
    const [email, setEmail] = useState("");
    const [subscribeState, setSubscribeState] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [subscribeMessage, setSubscribeMessage] = useState("");
    const { honeypot, setHoneypot, validate } = useAntiSpam(2);
    const customPages: FooterPage[] = Array.isArray(footerPages)
        ? footerPages
        : [];

    // Helper to render social icon
    const SocialLink = ({ href, icon: Icon, label }: any) => {
        if (!href) return null;
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all duration-300 group shadow-sm"
                aria-label={label}
            >
                <Icon
                    size={18}
                    className="group-hover:scale-110 transition-transform"
                />
            </a>
        );
    };

    const submitSubscription = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || subscribeState === "loading") return;
        if (!validate()) return; // silent bot rejection

        try {
            setSubscribeState("loading");
            setSubscribeMessage("");

            await axios.post(route("newsletter.subscribe"), {
                email: email.trim(),
                _hp: honeypot,
            });

            setSubscribeState("success");
            setSubscribeMessage("Thanks! You are subscribed.");
            setEmail("");
        } catch {
            setSubscribeState("error");
            setSubscribeMessage("Could not subscribe. Please try again.");
        }
    };

    return (
        <footer className="bg-brand-ivory  mt-auto">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
                <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-14">
                    {/* Column 1: Logo + Brand Awareness */}
                    <div className="flex flex-col space-y-5">
                        <Link href="/" className="inline-block">
                            {siteLogo ? (
                                <img
                                    src={`/storage/${siteLogo}`}
                                    alt={siteName}
                                    className="h-10 sm:h-12 w-auto"
                                />
                            ) : (
                                <span className="font-bold text-brand-dark text-2xl uppercase tracking-wider">
                                    {siteName}
                                </span>
                            )}
                        </Link>

                        <p className="max-w-sm text-sm leading-relaxed text-gray-500">
                            {siteDescription ||
                                "Your one-stop destination for premium products and authentic shopping experience."}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs">
                            {[
                                "Trusted Quality",
                                "Genuine Products",
                                "Fast Delivery",
                            ].map((badge) => (
                                <span
                                    key={badge}
                                    className="px-2.5 py-1 rounded-full bg-brand-bg border border-brand-primary/20 text-brand-primary font-medium tracking-wide"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-brand-primary uppercase tracking-widest">
                            Quick Links
                        </h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                            <Link
                                href={route("brands.index")}
                                className="text-gray-600 hover:text-brand-primary transition-colors"
                            >
                                Brands
                            </Link>
                            {blogEnabled && (
                                <Link
                                    href={route("blog.index")}
                                    className="text-gray-600 hover:text-brand-primary transition-colors"
                                >
                                    Blog
                                </Link>
                            )}
                            <Link
                                href={route("pages.faq")}
                                className="text-gray-600 hover:text-brand-primary transition-colors"
                            >
                                FAQ
                            </Link>
                            <Link
                                href={route("pages.contact")}
                                className="text-gray-600 hover:text-brand-primary transition-colors"
                            >
                                Contact Us
                            </Link>
                            <Link
                                href={route("new-product-requests.create")}
                                className="text-gray-600 hover:text-brand-primary transition-colors"
                            >
                                Request a Product
                            </Link>
                            <Link
                                href={route("pages.privacy-policy")}
                                className="text-gray-600 hover:text-brand-primary transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href={route("pages.terms")}
                                className="text-gray-600 hover:text-brand-primary transition-colors"
                            >
                                Terms & Conditions
                            </Link>
                            {customPages.map((page) => (
                                <Link
                                    key={page.slug}
                                    href={resolvePageHref(page)}
                                    className="text-gray-600 hover:text-brand-primary transition-colors"
                                >
                                    {page.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Social + Newsletter */}
                    <div className="flex flex-col space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-4">
                                Stay Connected
                            </h3>
                            <div className="flex items-center gap-2.5">
                                <SocialLink
                                    href={footer?.facebook}
                                    icon={Facebook}
                                    label="Facebook"
                                />
                                <SocialLink
                                    href={footer?.instagram}
                                    icon={Instagram}
                                    label="Instagram"
                                />
                                <SocialLink
                                    href={footer?.youtube}
                                    icon={Youtube}
                                    label="YouTube"
                                />
                                <SocialLink
                                    href={footer?.tiktok}
                                    icon={() => (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-5 h-5"
                                        >
                                            <path d="M16.5 3c.4 2.1 1.9 3.6 4 4v3.1c-1.5 0-3-.5-4-1.3v6.5c0 3.3-2.7 6-6 6s-6-2.7-6-6 2.7-6 6-6c.3 0 .7 0 1 .1v3.2c-.3-.1-.6-.2-1-.2-1.6 0-2.9 1.3-2.9 2.9S8.9 18 10.5 18s2.9-1.3 2.9-2.9V3h3.1z" />
                                        </svg>
                                    )}
                                    label="TikTok"
                                />
                            </div>
                        </div>

                        <form
                            onSubmit={submitSubscription}
                            className="space-y-3"
                        >
                            {/* Honeypot — bots fill this, humans never see it */}
                            <input
                                className="spam-trap"
                                type="text"
                                name="_hp"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                value={honeypot}
                                onChange={(e) => setHoneypot(e.target.value)}
                            />
                            <label
                                htmlFor="footer_newsletter_email"
                                className="block text-sm font-semibold text-brand-dark"
                            >
                                Subscribe for updates
                            </label>
                            <div className="flex gap-2">
                                <input
                                    id="footer_newsletter_email"
                                    name="footer_newsletter_email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    className="w-full px-3 py-2.5 rounded-lg bg-white border border-gray-200 text-brand-dark placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/50 transition-all"
                                    disabled={subscribeState === "loading"}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={
                                        subscribeState === "loading" ||
                                        !email.trim()
                                    }
                                    className="px-4 py-2.5 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary/85 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                                >
                                    Join
                                </button>
                            </div>
                            {subscribeMessage && (
                                <p
                                    className={`text-xs ${
                                        subscribeState === "error"
                                            ? "text-brand-primary"
                                            : "text-brand-success"
                                    }`}
                                >
                                    {subscribeMessage}
                                </p>
                            )}
                        </form>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-gray-500 order-2 md:order-1">
                        &copy; {currentYear}{" "}
                        <span className="font-semibold text-brand-dark">
                            {siteName}
                        </span>
                        . All rights reserved.
                    </p>
                    <p className="text-xs text-gray-400 order-1 md:order-2 tracking-wide uppercase">
                        Crafted with care in Malaysia
                    </p>
                </div>
            </div>
        </footer>
    );
}
