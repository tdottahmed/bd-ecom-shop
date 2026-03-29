import React, { useState, ReactNode } from "react";
import { Head, usePage } from "@inertiajs/react";
import { ShoppingBag } from "lucide-react";
import Header from "@/Components/Customer/Header";
import CartSidebar from "@/Components/Customer/CartSidebar";
import NavigationSidebar from "@/Components/Customer/NavigationSidebar";
import Preloader from "@/Components/Utility/Preloader";
import Footer from "@/Components/Customer/Footer";

import { useCartStore } from "@/Stores/useCartStore";

import { Toaster } from "sonner";

interface CustomerLayoutProps {
    children: ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({ children }) => {
    const { setIsOpen, getCartCount } = useCartStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartItemCount = getCartCount();

    const { url, props } = usePage();
    const isCheckoutPage = url.includes("/checkout");
    const seo = (props as any)?.seo || {};
    const baseUrl =
        typeof window !== "undefined"
            ? window.location.origin
            : (import.meta as any).env?.VITE_APP_URL || "";

    React.useEffect(() => {
        const handleOpenCart = () => {
            if (window.innerWidth >= 768) {
                setIsOpen(true);
            }
        };
        window.addEventListener("open-cart", handleOpenCart);
        return () => window.removeEventListener("open-cart", handleOpenCart);
    }, [setIsOpen]);

    return (
        <div className="min-h-screen bg-gray-50 font-inter antialiased">
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

            <main> {children} </main>

            {/* Floating Cart Button for Mobile */}
            {cartItemCount > 0 && !isCheckoutPage && (
                <div className="fixed bottom-6 right-6 z-40 md:hidden">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="bg-[#1A1B2E] text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 hover:bg-[#2D2E45] transition-colors"
                    >
                        <div className="relative">
                            <ShoppingBag size={20} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </div>
                        <span className="font-bold text-sm"> View Cart </span>
                    </button>
                </div>
            )}

            <Footer />

            <CartSidebar />
        </div>
    );
};

export default CustomerLayout;
