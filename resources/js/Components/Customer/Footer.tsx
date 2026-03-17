import { Link, usePage } from "@inertiajs/react";
import { Facebook, Instagram, Youtube, Video } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { siteLogo, siteDescription, seo, footer }: any = usePage().props;
    const siteName = seo?.siteName || "Paikari World";

    // Helper to render social icon
    const SocialLink = ({ href, icon: Icon, label }: any) => {
        if (!href) return null;
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-[#2DE3A7] hover:text-black transition-all duration-300 shadow-sm"
                aria-label={label}
            >
                <Icon size={20} />
            </a>
        );
    };

    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center space-y-8">
                    {/* Logo & Description Section */}
                    <div className="max-w-md pt-6">
                        <Link href="/" className="inline-block mb-4">
                            {siteLogo ? (
                                <img
                                    src={`/storage/${siteLogo}`}
                                    alt={siteName}
                                    className="h-10 sm:h-12 w-auto mx-auto"
                                />
                            ) : (
                                <span className="font-bold text-gray-900 text-2xl uppercase tracking-wider">
                                    {siteName}
                                </span>
                            )}
                        </Link>
                        {siteDescription && (
                            <p className="text-gray-500 text-sm leading-relaxed px-4 mb-6">
                                {siteDescription}
                            </p>
                        )}

                        {/* Social Links */}
                        <div className="flex items-center justify-center gap-4">
                            <SocialLink href={footer?.facebook} icon={Facebook} label="Facebook" />
                            <SocialLink href={footer?.instagram} icon={Instagram} label="Instagram" />
                            <SocialLink href={footer?.youtube} icon={Youtube} label="YouTube" />
                            <SocialLink href={footer?.tiktok} icon={Video} label="TikTok" />
                        </div>
                    </div>

                    {/* Divider for Mobile */}
                    <div className="w-full h-px bg-gray-100 md:hidden"> </div>

                    {/* Bottom Info Section */}
                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-4 pb-4 text-xs sm:text-sm text-gray-500 border-t border-gray-50 md:border-none">
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 order-2 md:order-1">
                            <span>
                                &copy; {currentYear} {siteName}. All rights reserved.
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 order-1 md:order-2">
                            <span>Developed by </span>
                            <a
                                href="https://nixsoftware.net"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-1"
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
