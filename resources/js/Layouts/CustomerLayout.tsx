import React, { useState, ReactNode, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import { ShoppingBag, ArrowUp, MessageCircle } from "lucide-react";
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
    const cartItemCount = getCartCount();

    const { url, props } = usePage();
    const isCheckoutPage = url.includes("/checkout");
    const seo = (props as any)?.seo || {};
    const { messengerLink, whatsappLink } = (props as any) || {};

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

    // Scroll listener for "Scroll to Top"
    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down 400px
            setShowScrollTop(window.scrollY > 400); 
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Check on mount
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
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

                {/* WhatsApp / Messenger Support Button */}
                {(messengerLink || whatsappLink) && !isCheckoutPage && (
                    <a
                        href={messengerLink || whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="pointer-events-auto group relative flex items-center justify-center bg-white text-zinc-900 p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300 hover:bg-zinc-50 hover:-translate-y-1 hover:shadow-2xl active:scale-95"
                        aria-label="Chat with us"
                    >
                        {/* Elegant Hover Tooltip */}
                        <span className="absolute right-full mr-4 whitespace-nowrap rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none shadow-lg">
                            Chat with us
                            <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-4 border-l-4 border-r-0 border-solid border-y-transparent border-l-zinc-900"></span>
                        </span>
                        
                        <MessageCircle size={26} strokeWidth={1.5} className="text-zinc-700 group-hover:text-black transition-colors" />
                        
                        {/* Pulsing Status Dot */}
                        <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-[2.5px] border-white drop-shadow-sm"></span>
                        </span>
                    </a>
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
