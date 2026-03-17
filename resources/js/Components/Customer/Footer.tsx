import { Link, usePage } from "@inertiajs/react";
import { Facebook, Instagram, Youtube, Video } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { siteLogo, siteDescription, seo, footer, categories, brands }: any =
        usePage().props;
    const siteName = seo?.siteName || "Paikari World";

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
                <Icon size={20} className="group-hover:scale-110 transition-transform" />
            </a>
        );
    };

    return (
        <footer className="bg-white border-t border-gray-100 pt-12 pb-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Content: Two Columns on md+ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-12">
                    {/* Column 1: Brand Info */}
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
                            {siteDescription || "Your one-stop destination for premium products and authentic shopping experience."}
                        </p>
                    </div>

                    {/* Column 2: Social Connect */}
                    <div className="flex flex-col space-y-6 md:items-end">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Stay Connected
                        </h3>
                        <div className="flex items-center gap-3">
                            <SocialLink href={footer?.facebook} icon={Facebook} label="Facebook" />
                            <SocialLink href={footer?.instagram} icon={Instagram} label="Instagram" />
                            <SocialLink href={footer?.youtube} icon={Youtube} label="YouTube" />
                            <SocialLink href={footer?.tiktok} icon={Video} label="TikTok" />
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs sm:text-sm text-gray-500 order-2 md:order-1">
                        &copy; {currentYear} <span className="font-semibold text-gray-900">{siteName}</span>. All rights reserved.
                    </p>

                    <div className="flex items-center gap-1.5 order-1 md:order-2 text-xs sm:text-sm text-gray-500">
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
        </footer>
    );
}
