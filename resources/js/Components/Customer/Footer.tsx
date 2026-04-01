import { Link, router, usePage } from "@inertiajs/react";
import axios from "axios";
import {
    Facebook,
    Instagram,
    Youtube,
    Video,
    LogIn,
    LogOut,
    LayoutDashboard,
} from "lucide-react";
import { useState } from "react";
import { useAntiSpam } from "@/Hooks/useAntiSpam";

type FooterPage = {
    title: string;
    slug: string;
};

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { siteLogo, siteDescription, seo, footer, auth, footerPages }: any =
        usePage().props;
    const siteName = seo?.siteName || "Paikari World";
    const isAuthenticated = !!auth?.user;
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
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#0F1A18] text-[#2DE3A7] hover:bg-[#2DE3A7] hover:text-black transition-all duration-300 shadow-sm group"
                aria-label={label}
            >
                <Icon
                    size={20}
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
        <footer className="bg-white border-t border-gray-100 pt-12 pb-6 mt-auto">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
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
                                <span className="font-bold text-gray-900 text-2xl uppercase tracking-wider">
                                    {siteName}
                                </span>
                            )}
                        </Link>

                        <p className="max-w-sm text-sm leading-relaxed text-gray-500">
                            {siteDescription ||
                                "Your one-stop destination for premium products and authentic shopping experience."}
                        </p>
                        <p className="max-w-sm text-xs uppercase tracking-[0.14em] text-emerald-700/80">
                            Trusted quality. Genuine products. Fast delivery.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Quick Links
                        </h3>
                        <div className="grid grid-cols-1 gap-y-2 text-sm">
                            <Link
                                href={route("brands.index")}
                                className="block text-gray-600 hover:text-[#059669] transition-colors"
                            >
                                Brands
                            </Link>
                            <Link
                                href={route("pages.about")}
                                className="block text-gray-600 hover:text-[#059669] transition-colors"
                            >
                                About Us
                            </Link>
                            <Link
                                href={route("pages.contact")}
                                className="block text-gray-600 hover:text-[#059669] transition-colors"
                            >
                                Contact Us
                            </Link>
                            <Link
                                href={route("pages.privacy-policy")}
                                className="block text-gray-600 hover:text-[#059669] transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href={route("pages.faq")}
                                className="block text-gray-600 hover:text-[#059669] transition-colors"
                            >
                                FAQ
                            </Link>
                            <Link
                                href={route("pages.terms")}
                                className="block text-gray-600 hover:text-[#059669] transition-colors"
                            >
                                Terms & Conditions
                            </Link>
                            {customPages.map((page) => (
                                <Link
                                    key={page.slug}
                                    href={route("pages.show", page.slug)}
                                    className="block text-gray-600 hover:text-[#059669] transition-colors"
                                >
                                    {page.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Social + Newsletter */}
                    <div className="flex flex-col space-y-6">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Stay Connected
                        </h3>
                        <div className="flex items-center gap-3">
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
                                icon={Video}
                                label="TikTok"
                            />
                        </div>

                        <form
                            onSubmit={submitSubscription}
                            className="space-y-2"
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
                                className="text-sm font-semibold text-gray-800"
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
                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                    disabled={subscribeState === "loading"}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={
                                        subscribeState === "loading" ||
                                        !email.trim()
                                    }
                                    className="px-4 py-2.5 rounded-lg bg-[#0F1A18] text-[#2DE3A7] font-semibold hover:bg-[#132321] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                                >
                                    Join
                                </button>
                            </div>
                            {subscribeMessage && (
                                <p
                                    className={`text-xs ${
                                        subscribeState === "error"
                                            ? "text-rose-600"
                                            : "text-emerald-600"
                                    }`}
                                >
                                    {subscribeMessage}
                                </p>
                            )}
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs sm:text-sm text-gray-500 order-2 md:order-1">
                        &copy; {currentYear}{" "}
                        <span className="font-semibold text-gray-900">
                            {siteName}
                        </span>
                        . All rights reserved.
                    </p>

                    <div className="order-1 md:order-2 flex items-center gap-5">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <Link
                                    href={route("admin.dashboard")}
                                    className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-emerald-700 transition-colors"
                                >
                                    <LayoutDashboard size={14} />
                                    Admin Panel
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => router.post(route("logout"))}
                                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    <LogOut size={14} />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href={route("admin.login")}
                                className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-emerald-700 transition-colors"
                            >
                                <LogIn size={14} />
                                Staff Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}
