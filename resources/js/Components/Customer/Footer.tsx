import { Link, router, usePage } from "@inertiajs/react";
import {
    Facebook,
    Instagram,
    Youtube,
    Video,
    LogIn,
    LogOut,
} from "lucide-react";
import { useState } from "react";

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

        try {
            setSubscribeState("loading");
            setSubscribeMessage("");

            const response = await fetch(route("newsletter.subscribe"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN":
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement | null
                        )?.content || "",
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            if (!response.ok) {
                throw new Error("Subscription failed");
            }

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-14 mb-12">
                    <div className="flex flex-col space-y-6">
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

                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                            {siteDescription ||
                                "Your one-stop destination for premium products and authentic shopping experience."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Quick Links
                        </h3>
                        <div className="space-y-2 text-sm">
                            <Link
                                href={route("home")}
                                className="block text-gray-600 hover:text-[#059669] transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                href={route("products.index")}
                                className="block text-gray-600 hover:text-[#059669] transition-colors"
                            >
                                Products
                            </Link>
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
                        </div>
                    </div>

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
                                    href={route("dashboard")}
                                    className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-emerald-700 transition-colors"
                                >
                                    <LogOut size={14} />
                                    Dashboard
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => router.post(route("logout"))}
                                    className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                href={route("login")}
                                className="inline-flex items-center gap-1.5 text-sm text-gray-700 hover:text-emerald-700 transition-colors"
                            >
                                <LogIn size={14} />
                                Staff Login
                            </Link>
                        )}

                        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500">
                            <span>Developed by</span>
                            <a
                                href="https://nixsoftware.net"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-gray-900 hover:text-[#2DE3A7] transition-colors"
                            >
                                NixSoftware
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
