import React, { useState, ReactNode, useEffect, useRef } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import Lenis from "lenis";
import { ShoppingBag, ArrowUp, MessageCircle, HeadphonesIcon, Phone } from "lucide-react";
import Header from "@/Components/Customer/Header";
import CartSidebar from "@/Components/Customer/CartSidebar";
import NavigationSidebar from "@/Components/Customer/NavigationSidebar";
import Footer from "@/Components/Customer/Footer";

import { useCartStore } from "@/Stores/useCartStore";

import { Toaster } from "sonner";

interface CustomerLayoutProps {
    children: ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
    const { setIsOpen, getCartCount } = useCartStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const cartItemCount = getCartCount();
    const lenisRef = useRef<Lenis | null>(null);
    const supportRef = useRef<HTMLDivElement | null>(null);

    const { url, props } = usePage();
    const isCheckoutPage = url.includes("/checkout");
    const seo = (props as any)?.seo || {};
    const authUser = (props as any)?.auth?.user;
    // Use the primitive ID as the effect dependency — the full authUser object gets a
    // new reference on every Inertia re-render (including after cart actions), which
    // would re-fire the sync effect on every cart change if we depended on the object.
    const authUserId = authUser?.id as number | undefined;
    const customerAuthEnabled = Boolean((props as any)?.customerAuthEnabled);
    const { messengerLink, whatsappLink } = (props as any) || {};
    const hasMessenger = Boolean(messengerLink);
    const hasWhatsApp = Boolean(whatsappLink);

    const baseUrl =
        typeof window !== "undefined"
            ? window.location.origin
            : (import.meta as any).env?.VITE_APP_URL || "";

    useEffect(() => {
        const handleOpenCart = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            }
        };
        window.addEventListener("open-cart", handleOpenCart);
        return () => window.removeEventListener("open-cart", handleOpenCart);
    }, [setIsOpen]);

    useEffect(() => {
        if (!customerAuthEnabled || !authUserId || typeof window === "undefined") {
            return;
        }

        try {
            const raw = window.localStorage.getItem("cart-storage");
            if (!raw) return;

            const parsed = JSON.parse(raw) as {
                state?: { cart?: Record<string, unknown> };
            };
            const cart = parsed?.state?.cart;
            if (!cart || typeof cart !== "object") return;
            const items = Object.values(
                cart as Record<string, string | number | boolean | null | object>
            );

            // Prevent repeated sync calls when nothing changed.
            const signature = JSON.stringify(items);
            const syncStorageKey = `customer-cart-sync:${authUserId}`;
            const lastSignature = window.sessionStorage.getItem(syncStorageKey);
            if (lastSignature === signature) {
                return;
            }
            window.sessionStorage.setItem(syncStorageKey, signature);

            router.post(
                route("account.cart.sync"),
                { items: items as any },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onError: () => {
                        window.sessionStorage.removeItem(syncStorageKey);
                    },
                }
            );
        } catch {
            // ignore invalid local storage payloads
        }
    }, [authUserId, customerAuthEnabled]);

    // Lenis smooth scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });
        lenisRef.current = lenis;

        lenis.on("scroll", ({ scroll }: { scroll: number }) => {
            setShowScrollTop(scroll > 400);
        });

        let rafId: number;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        // Scroll to top instantly on Inertia page navigation
        const stopNavigate = router.on("navigate", () => {
            lenis.scrollTo(0, { immediate: true });
        });

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            lenisRef.current = null;
            stopNavigate();
        };
    }, []);

    // Close support popover on outside click / ESC
    useEffect(() => {
        if (!isSupportOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsSupportOpen(false);
        };

        const onPointerDown = (e: PointerEvent) => {
            const el = supportRef.current;
            if (!el) return;
            const target = e.target as Node | null;
            if (target && el.contains(target)) return;
            setIsSupportOpen(false);
        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("pointerdown", onPointerDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("pointerdown", onPointerDown);
        };
    }, [isSupportOpen]);

    const scrollToTop = () => {
        lenisRef.current?.scrollTo(0, { duration: 1.2 });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-inter antialiased flex flex-col justify-between relative">
            <Head>
                <title>{seo?.defaultTitle || "Home"}</title>
                {seo?.defaultDescription && (
                    <meta
                        name="description"
                        content={seo.defaultDescription}
                    />
                )}
                {seo?.defaultKeywords && (
                    <meta name="keywords" content={seo.defaultKeywords} />
                )}
                <meta name="robots" content={seo?.robots || "index,follow"} />

                {seo?.siteName && (
                    <meta property="og:site_name" content={seo.siteName} />
                )}
                <meta property="og:type" content="website" />
                <meta
                    property="og:url"
                    content={`${baseUrl}${url || "/"}`}
                />
                {seo?.defaultTitle && (
                    <meta property="og:title" content={seo.defaultTitle} />
                )}
                {seo?.defaultDescription && (
                    <meta
                        property="og:description"
                        content={seo.defaultDescription}
                    />
                )}
                {seo?.ogImage && (
                    <meta
                        property="og:image"
                        content={`${baseUrl}/storage/${seo.ogImage.replace(
                            /^\//,
                            "",
                        )}`}
                    />
                )}

                {seo?.googleSiteVerification && (
                    <meta
                        name="google-site-verification"
                        content={seo.googleSiteVerification}
                    />
                )}

                <meta name="twitter:card" content="summary_large_image" />
                {seo?.defaultTitle && (
                    <meta name="twitter:title" content={seo.defaultTitle} />
                )}
                {seo?.defaultDescription && (
                    <meta
                        name="twitter:description"
                        content={seo.defaultDescription}
                    />
                )}
                {seo?.ogImage && (
                    <meta
                        name="twitter:image"
                        content={`${baseUrl}/storage/${seo.ogImage.replace(
                            /^\//,
                            "",
                        )}`}
                    />
                )}

                <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
                <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
            </Head>
            <Toaster position="top-center" richColors />

            <Header onMenuClick={() => setIsMenuOpen(true)} />

            <NavigationSidebar
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
            />

            <main className="flex-grow"> {children} </main>

            {/* Floating Action Buttons Stacked Container */}
            <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
                
                {/* Scroll to Top Button */}
                <button
                    onClick={scrollToTop}
                    className={`pointer-events-auto flex items-center justify-center bg-white/90 backdrop-blur-md text-zinc-600 p-3.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:text-zinc-900 hover:bg-white hover:-translate-y-1 hover:shadow-xl active:scale-95 ${
                        showScrollTop ? "translate-y-0 opacity-100 visible" : "translate-y-8 opacity-0 invisible"
                    }`}
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={22} strokeWidth={2} />
                </button>

                {/* Customer Support */}
                {!isCheckoutPage && (hasMessenger || hasWhatsApp) && (
                    <div
                        ref={supportRef}
                        className="pointer-events-auto relative"
                    >
                        {hasMessenger && hasWhatsApp ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setIsSupportOpen(!isSupportOpen)}
                                    className="group flex items-center justify-center bg-white text-zinc-900 p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300 hover:bg-zinc-50 hover:-translate-y-1 hover:shadow-2xl active:scale-95"
                                    aria-label="Support"
                                    aria-expanded={isSupportOpen}
                                    aria-haspopup="true"
                                >
                                    {/* Elegant Hover Tooltip */}
                                    <span className="absolute right-full mr-4 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none shadow-lg">
                                        Support
                                        <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-4 border-l-4 border-r-0 border-solid border-y-transparent border-l-zinc-900"></span>
                                    </span>

                                    <HeadphonesIcon
                                        size={24}
                                        strokeWidth={1.7}
                                        className="text-zinc-700 group-hover:text-black transition-colors"
                                    />

                                    {/* Pulsing Status Dot */}
                                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-[2.5px] border-white drop-shadow-sm" />
                                    </span>
                                </button>

                                {isSupportOpen && (
                                    <div
                                        className="absolute bottom-full mb-3 right-0 w-52 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden"
                                        role="dialog"
                                        aria-label="Choose chat method"
                                    >
                                        <div className="px-4 py-2 text-xs font-semibold text-gray-600">
                                            Contact us
                                        </div>
                                        <div className="p-3 pt-0 grid grid-cols-2 gap-2">
                                            {hasWhatsApp && (
                                                <a
                                                    href={whatsappLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => setIsSupportOpen(false)}
                                                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-3 transition hover:bg-emerald-50"
                                                    aria-label="Chat on WhatsApp"
                                                >
                                                    <WhatsAppIcon className="h-5 w-5 text-emerald-700" />
                                                    <span className="text-[11px] font-bold text-emerald-800">
                                                        WhatsApp
                                                    </span>
                                                </a>
                                            )}
                                            {hasMessenger && (
                                                <a
                                                    href={messengerLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={() => setIsSupportOpen(false)}
                                                    className="flex flex-col items-center justify-center gap-1 rounded-xl border border-blue-100 bg-blue-50/40 px-3 py-3 transition hover:bg-blue-50"
                                                    aria-label="Chat on Messenger"
                                                >
                                                    <MessageCircle
                                                        size={20}
                                                        strokeWidth={1.7}
                                                        className="text-blue-700"
                                                    />
                                                    <span className="text-[11px] font-bold text-blue-800">
                                                        Messenger
                                                    </span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <a
                                href={whatsappLink || messengerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-center bg-white text-zinc-900 p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300 hover:bg-zinc-50 hover:-translate-y-1 hover:shadow-2xl active:scale-95 pointer-events-auto"
                                aria-label={
                                    hasWhatsApp ? "Chat on WhatsApp" : "Chat on Messenger"
                                }
                            >
                                {/* Tooltip */}
                                <span className="absolute right-full mr-4 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none shadow-lg">
                                    {hasWhatsApp ? "WhatsApp" : "Messenger"}
                                    <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-4 border-l-4 border-r-0 border-solid border-y-transparent border-l-zinc-900"></span>
                                </span>

                                {hasWhatsApp ? (
                                    <WhatsAppIcon className="h-[26px] w-[26px] text-emerald-700 group-hover:text-emerald-800 transition-colors" />
                                ) : (
                                    <MessageCircle
                                        size={26}
                                        strokeWidth={1.5}
                                        className="text-zinc-700 group-hover:text-black transition-colors"
                                    />
                                )}

                                {/* Pulsing Status Dot */}
                                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-[2.5px] border-white drop-shadow-sm" />
                                </span>
                            </a>
                        )}
                    </div>
                )}

                {/* Floating Mobile Cart Button */}
                {cartItemCount > 0 && !isCheckoutPage && (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="md:hidden pointer-events-auto bg-zinc-900 text-white px-6 py-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center gap-3 hover:bg-black transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-95"
                    >
                        <div className="relative">
                            <ShoppingBag size={22} strokeWidth={1.5} />
                            <span className="absolute -top-2.5 -right-3 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-900 shadow-sm">
                                {cartItemCount}
                            </span>
                        </div>
                        <span className="font-bold text-sm tracking-wide">Cart</span>
                    </button>
                )}
            </div>

            <Footer />

            <CartSidebar />
        </div>
    );
};

export default CustomerLayout;

function WhatsAppIcon({ className = "" }: { className?: string }) {
    return <Phone className={className} aria-hidden="true" />;
    /*
    return (
        <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden="true"
        >
            <path
                d="M16 3.5C8.8 3.5 3 9.3 3 16.5c0 2.4.7 4.7 1.9 6.6L4 28.5l5.6-.9c1.8 1 3.9 1.5 6.4 1.5 7.2 0 13-5.8 13-13s-5.8-13.6-13-13.6Z"
                fill="currentColor"
                opacity="0.12"
            />
            <path
                d="M23.8 20.7c-.2-.3-1.2-.9-1.6-1.1-.4-.2-.7-.3-1 .1-.3.4-.8 1-.9 1.1-.2.1-.4.2-.7 0-1.2-.6-2.1-1.1-3-2-.7-.8-.8-1.3-.6-1.6.2-.3.3-.5.5-.7.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6-.1-.2-.9-2-1.2-2.7-.3-.7-.6-.6-.9-.6h-.8c-.3 0-.8.1-1.2.6-.4.5-1.6 1.5-1.6 3.6s1.6 4.1 1.8 4.3c.2.2 3.1 4.8 7.6 6.6 1.1.5 2 .7 2.7.9.9.2 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.7.3-.8.3-1.4.2-1.6Z"
                fill="currentColor"
            />
        </svg>
    );
    */
}
