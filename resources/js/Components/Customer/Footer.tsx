import { Link, usePage } from "@inertiajs/react";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const { siteLogo, siteDescription, seo }: any = usePage().props;
    const siteName = seo?.siteName || "Paikari World";

    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
            <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center space-y-8">
                    {/* Logo & Description Section */}
                    <div className="max-w-md">
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
                            <p className="text-gray-500 text-sm leading-relaxed px-4">
                                {siteDescription}
                            </p>
                        )}
                    </div>

                    {/* Divider for Mobile */}
                    <div className="w-full h-px bg-gray-100 md:hidden"> </div>

                    {/* Bottom Info Section */}
                    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-2 text-sm text-gray-500 border-t border-gray-50 md:border-none">
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 order-2 md:order-1">
                            <span>
                                & copy; {currentYear} {siteName}. All rights
                                reserved.
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
