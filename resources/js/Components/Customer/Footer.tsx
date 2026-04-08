import { Link, usePage } from "@inertiajs/react";
import axios from "axios";
import { Facebook, Instagram, Youtube, Video } from "lucide-react";
import { useState } from "react";
import { useAntiSpam } from "@/Hooks/useAntiSpam";

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
        auth,
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
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 border border-white/10 text-white/60 hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all duration-300 group"
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
        <footer className="bg-brand-dark mt-auto">
            {/* Top accent bar */}
            <div className="h-1 w-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-success" />

            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
                <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-14">
                    {/* Column 1: Logo + Brand Awareness */}
                    <div className="flex flex-col space-y-5">
                        <Link href="/" className="inline-block">
                            {siteLogo ? (
                                <img
                                    src={`/storage/${siteLogo}`}
                                    alt={siteName}
                                    className="h-10 sm:h-12 w-auto brightness-0 invert"
                                />
                            ) : (
                                <span className="font-bold text-white text-2xl uppercase tracking-wider">
                                    {siteName}
                                </span>
                            )}
                        </Link>

                        <p className="max-w-sm text-sm leading-relaxed text-white/60">
                            {siteDescription ||
                                "Your one-stop destination for premium products and authentic shopping experience."}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs">
                            {["Trusted Quality", "Genuine Products", "Fast Delivery"].map((badge) => (
                                <span
                                    key={badge}
                                    className="px-2.5 py-1 rounded-full border border-brand-success/30 text-brand-success font-medium tracking-wide"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-brand-tint uppercase tracking-widest">
                            Quick Links
                        </h3>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                            <Link
                                href={route("brands.index")}
                                className="text-white/60 hover:text-brand-primary transition-colors"
                            >
                                Brands
                            </Link>
                            {blogEnabled && (
                                <Link
                                    href={route("blog.index")}
                                    className="text-white/60 hover:text-brand-primary transition-colors"
                                >
                                    Blog
                                </Link>
                            )}
                            <Link
                                href={route("pages.about")}
                                className="text-white/60 hover:text-brand-primary transition-colors"
                            >
                                About Us
                            </Link>
                            <Link
                                href={route("pages.faq")}
                                className="text-white/60 hover:text-brand-primary transition-colors"
                            >
                                FAQ
                            </Link>
                            <Link
                                href={route("pages.contact")}
                                className="text-white/60 hover:text-brand-primary transition-colors"
                            >
                                Contact Us
                            </Link>
                            <Link
                                href={route("pages.privacy-policy")}
                                className="text-white/60 hover:text-brand-primary transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href={route("pages.terms")}
                                className="text-white/60 hover:text-brand-primary transition-colors"
                            >
                                Terms & Conditions
                            </Link>
                            {customPages.map((page) => (
                                <Link
                                    key={page.slug}
                                    href={route("pages.show", page.slug)}
                                    className="text-white/60 hover:text-brand-primary transition-colors"
                                >
                                    {page.title}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Column 3: Social + Newsletter */}
                    <div className="flex flex-col space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-brand-tint uppercase tracking-widest mb-4">
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
                                    icon={Video}
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
                                className="block text-sm font-semibold text-white"
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
                                    className="w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/60 transition-all"
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
                                            ? "text-brand-tint"
                                            : "text-brand-success"
                                    }`}
                                >
                                    {subscribeMessage}
                                </p>
                            )}
                        </form>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs sm:text-sm text-white/40 order-2 md:order-1">
                        &copy; {currentYear}{" "}
                        <span className="font-semibold text-white/70">
                            {siteName}
                        </span>
                        . All rights reserved.
                    </p>
                    <p className="text-xs text-white/30 order-1 md:order-2 tracking-wide uppercase">
                        Crafted with care in Malaysia
                    </p>
                </div>
            </div>
        </footer>
    );
}
