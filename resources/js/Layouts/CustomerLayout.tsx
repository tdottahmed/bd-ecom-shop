import React, { useState, ReactNode, useEffect, useRef } from "react";
import { Head, usePage, router } from "@inertiajs/react";
import Lenis from "lenis";
import { ArrowUp, Phone, ShoppingBag } from "lucide-react";
import Header from "@/Components/Customer/Header";
import CartSidebar from "@/Components/Customer/CartSidebar";
import NavigationSidebar from "@/Components/Customer/NavigationSidebar";
import Footer from "@/Components/Customer/Footer";
import { useCartStore } from "@/Stores/useCartStore";
import { Toaster, toast } from "sonner";

interface CustomerLayoutProps {
    children: ReactNode;
}

function hasMeaningfulErrors(errors: unknown): boolean {
    if (!errors || typeof errors !== "object") return false;

    // Inertia/Laravel can return either:
    // - { field: "message" }
    // - { default: { field: "message" }, someBag: { ... } }
    const values = Object.values(errors as Record<string, unknown>);

    // Plain field errors
    const hasDirect = values.some((v) => typeof v === "string" && v.trim().length > 0);
    if (hasDirect) return true;

    // Bagged errors
    return values.some((bag) => {
        if (!bag || typeof bag !== "object") return false;
        return Object.values(bag as Record<string, unknown>).some(
            (v) => typeof v === "string" && v.trim().length > 0
        );
    });
}

// Circumference for r=15.9 circle (≈ 99.9)
const RING_R = 15.9;
const RING_CIRCUM = 2 * Math.PI * RING_R;

/**
 * Scroll-to-top button — visibility is controlled via React state (changes
 * infrequently), but the SVG ring progress is updated via direct DOM ref on
 * every Lenis tick, so no React re-render happens per frame.
 */
function ScrollToTopButton({
    visible,
    ringRef,
    onClick,
}: {
    visible: boolean;
    ringRef: React.RefObject<SVGCircleElement>;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`pointer-events-auto relative flex items-center justify-center w-12 h-12 bg-white/90 backdrop-blur-md text-zinc-600 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:text-zinc-900 hover:bg-white hover:-translate-y-1 hover:shadow-xl active:scale-95 ${
                visible
                    ? "translate-y-0 opacity-100 visible"
                    : "translate-y-8 opacity-0 invisible"
            }`}
            aria-label="Scroll to top"
        >
            <svg
                className="absolute inset-0 -rotate-90 w-full h-full"
                viewBox="0 0 36 36"
                aria-hidden="true"
            >
                {/* Track */}
                <circle cx="18" cy="18" r={RING_R} fill="none" stroke="#e5e7eb" strokeWidth="2" />
                {/* Progress arc — updated imperatively */}
                <circle
                    ref={ringRef}
                    cx="18"
                    cy="18"
                    r={RING_R}
                    fill="none"
                    stroke="#E11D6D"
                    strokeWidth="2"
                    strokeDasharray={`${RING_CIRCUM}`}
                    strokeDashoffset={`${RING_CIRCUM}`}
                    strokeLinecap="round"
                />
            </svg>
            <ArrowUp size={18} strokeWidth={2.5} className="relative z-10" />
        </button>
    );
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
    const { setIsOpen, getCartCount } = useCartStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const cartItemCount = getCartCount();

    // Refs updated on every Lenis tick — no React re-render per frame
    const lenisRef = useRef<Lenis | null>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<SVGCircleElement>(null);
    const showScrollTopRef = useRef(false);
    const supportRef = useRef<HTMLDivElement | null>(null);

    const { url, props } = usePage();
    const isCheckoutPage = url.includes("/checkout");
    const seo = (props as any)?.seo || {};
    const authUser = (props as any)?.auth?.user;
    const authUserId = authUser?.id as number | undefined;
    const customerAuthEnabled = Boolean((props as any)?.customerAuthEnabled);
    const { messengerLink, whatsappLink } = (props as any) || {};
    const hasMessenger = Boolean(messengerLink);
    const hasWhatsApp = Boolean(whatsappLink);
    const { flash, errors } = props as any;

    const baseUrl =
        typeof window !== "undefined"
            ? window.location.origin
            : (import.meta as any).env?.VITE_APP_URL || "";

    useEffect(() => {
        const handleOpenCart = () => {
            if (window.innerWidth >= 768) setIsOpen(true);
        };
        window.addEventListener("open-cart", handleOpenCart);
        return () => window.removeEventListener("open-cart", handleOpenCart);
    }, [setIsOpen]);

    // Inertia flash + validation errors → toasts (customer-facing)
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (hasMeaningfulErrors(errors)) {
            toast.error("There are errors in the form. Please check the fields.");
        }
    }, [flash, errors]);

    useEffect(() => {
        if (!customerAuthEnabled || !authUserId || typeof window === "undefined") return;

        try {
            const raw = window.localStorage.getItem("cart-storage");
            if (!raw) return;
            const parsed = JSON.parse(raw) as { state?: { cart?: Record<string, unknown> } };
            const cart = parsed?.state?.cart;
            if (!cart || typeof cart !== "object") return;
            const items = Object.values(
                cart as Record<string, string | number | boolean | null | object>,
            );
            const signature = JSON.stringify(items);
            const syncStorageKey = `customer-cart-sync:${authUserId}`;
            const lastSignature = window.sessionStorage.getItem(syncStorageKey);
            if (lastSignature === signature) return;
            window.sessionStorage.setItem(syncStorageKey, signature);
            router.post(route("account.cart.sync"), { items: items as any }, {
                preserveScroll: true,
                preserveState: true,
                onError: () => window.sessionStorage.removeItem(syncStorageKey),
            });
        } catch {
            // ignore invalid local-storage payloads
        }
    }, [authUserId, customerAuthEnabled]);

    // Lenis smooth scroll — all scroll-driven DOM updates happen imperatively
    // so React never re-renders the layout on every animation frame.
    useEffect(() => {
        const lenis = new Lenis({
            lerp: 0.085,
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.8,
            infinite: false,
            orientation: "vertical",
            gestureOrientation: "vertical",
        } as any);
        lenisRef.current = lenis;

        lenis.on("scroll", ({ scroll, progress }: { scroll: number; progress: number }) => {
            // — Progress bar: use scaleX (compositor-only, no reflow) —
            if (progressBarRef.current) {
                progressBarRef.current.style.transform = `scaleX(${progress})`;
            }

            // — Ring arc: update stroke-dashoffset directly —
            if (ringRef.current) {
                ringRef.current.style.strokeDashoffset = String(
                    RING_CIRCUM * (1 - progress),
                );
            }

            // — Scroll-to-top visibility: only setState on threshold crossing —
            const shouldShow = scroll > 400;
            if (shouldShow !== showScrollTopRef.current) {
                showScrollTopRef.current = shouldShow;
                setShowScrollTop(shouldShow);
            }
        });

        let rafId: number;
        const raf = (time: number) => {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

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
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setIsSupportOpen(false); };
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
        lenisRef.current?.scrollTo(0, {
            duration: 1.4,
            easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
    };

    return (
        <div className="min-h-screen bg-brand-ivory font-inter antialiased flex flex-col justify-between relative">
            <Head>
                <title>{seo?.defaultTitle || "Home"}</title>
                {seo?.defaultDescription && <meta name="description" content={seo.defaultDescription} />}
                {seo?.defaultKeywords && <meta name="keywords" content={seo.defaultKeywords} />}
                <meta name="robots" content={seo?.robots || "index,follow"} />
                {seo?.siteName && <meta property="og:site_name" content={seo.siteName} />}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${baseUrl}${url || "/"}`} />
                {seo?.defaultTitle && <meta property="og:title" content={seo.defaultTitle} />}
                {seo?.defaultDescription && <meta property="og:description" content={seo.defaultDescription} />}
                {seo?.ogImage && (
                    <meta property="og:image" content={`${baseUrl}/storage/${seo.ogImage.replace(/^\//, "")}`} />
                )}
                {seo?.googleSiteVerification && (
                    <meta name="google-site-verification" content={seo.googleSiteVerification} />
                )}
                <meta name="twitter:card" content="summary_large_image" />
                {seo?.defaultTitle && <meta name="twitter:title" content={seo.defaultTitle} />}
                {seo?.defaultDescription && <meta name="twitter:description" content={seo.defaultDescription} />}
                {seo?.ogImage && (
                    <meta name="twitter:image" content={`${baseUrl}/storage/${seo.ogImage.replace(/^\//, "")}`} />
                )}
                <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />
                <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
            </Head>

            <Toaster position="top-center" richColors />

            {/*
              Scroll progress bar.
              Uses transform: scaleX (compositor-only) instead of width, so it
              never triggers layout recalculation. Updated imperatively via ref.
            */}
            <div
                ref={progressBarRef}
                className="fixed top-0 left-0 z-[60] h-[2.5px] w-full origin-left pointer-events-none bg-gradient-to-r from-brand-primary via-brand-tint to-brand-accent"
                style={{ transform: "scaleX(0)" }}
                aria-hidden="true"
            />

            <Header onMenuClick={() => setIsMenuOpen(true)} />

            <NavigationSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <main className="flex-grow">{children}</main>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">

                <ScrollToTopButton
                    visible={showScrollTop}
                    ringRef={ringRef}
                    onClick={scrollToTop}
                />

                {/* Customer Support */}
                {!isCheckoutPage && (hasMessenger || hasWhatsApp) && (
                    <div ref={supportRef} className="pointer-events-auto relative">
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
                                    <span className="absolute right-full mr-4 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none shadow-lg">
                                        Support
                                        <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-4 border-l-4 border-r-0 border-solid border-y-transparent border-l-zinc-900" />
                                    </span>
                                    <Phone size={24} strokeWidth={1.7} className="text-zinc-700 group-hover:text-black transition-colors" />
                                    <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-success opacity-75" />
                                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-success border-[2.5px] border-white drop-shadow-sm" />
                                    </span>
                                </button>

                                {isSupportOpen && (
                                    <div
                                        className="absolute bottom-full mb-3 right-0 w-52 rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden"
                                        role="dialog"
                                        aria-label="Choose chat method"
                                    >
                                        <div className="px-4 py-2 text-xs font-semibold text-gray-600">Contact us</div>
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
                                                    <span className="text-[11px] font-bold text-emerald-800">WhatsApp</span>
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
                                                    <MessengerIcon className="h-5 w-5" />
                                                    <span className="text-[11px] font-bold text-blue-800">Messenger</span>
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
                                aria-label={hasWhatsApp ? "Chat on WhatsApp" : "Chat on Messenger"}
                            >
                                <span className="absolute right-full mr-4 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none shadow-lg">
                                    {hasWhatsApp ? "WhatsApp" : "Messenger"}
                                    <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-4 border-l-4 border-r-0 border-solid border-y-transparent border-l-zinc-900" />
                                </span>
                                {hasWhatsApp ? (
                                    <WhatsAppIcon className="h-[26px] w-[26px] text-emerald-700 group-hover:text-emerald-800 transition-colors" />
                                ) : (
                                    <MessengerIcon className="h-[26px] w-[26px]" />
                                )}
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
                        className="md:hidden pointer-events-auto bg-brand-primary text-white px-6 py-4 rounded-full shadow-[0_8px_30px_rgba(225,29,109,0.35)] flex items-center gap-3 hover:bg-brand-primary/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-95"
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
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

function MessengerIcon({ className = "" }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="url(#messenger-gradient)" aria-hidden="true">
            <defs>
                <linearGradient id="messenger-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0099ff" />
                    <stop offset="100%" stopColor="#a033ff" />
                </linearGradient>
            </defs>
            <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
        </svg>
    );
}
