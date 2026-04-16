import Header from "@/Components/Layouts/Header";
import MobileBottomNav from "@/Components/Layouts/MobileBottomNav";
import PrimarySidebar from "@/Components/Layouts/PrimarySidebar";
import SecondarySidebar, {
    secondaryMenuItems,
    productsMenuItems,
    pagesMenuItems,
    type SecondaryPanel,
} from "@/Components/Layouts/SecondarySidebar";
import { Head, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";

interface LayoutProps {
    children: React.ReactNode;
    head?: React.ReactNode;
    title?: string;
}

const Master: React.FC<LayoutProps> = ({ children, head, title }) => {
    const { props, url } = usePage();
    const { flash, errors } = props as any;

    const pathOnly = url.split("?")[0];

    const shouldOpenForProducts = productsMenuItems.some(
        (item) => item.urlPattern && pathOnly.startsWith(item.urlPattern)
    );
    const shouldOpenForPages = pagesMenuItems.some(
        (item) => item.urlPattern && pathOnly.startsWith(item.urlPattern)
    );
    const shouldOpenForReports = pathOnly.startsWith("/admin/reports");
    const shouldOpenForSettings = secondaryMenuItems.some(
        (item) => item.urlPattern && pathOnly.startsWith(item.urlPattern)
    );

    const [isSecondarySidebarOpen, setIsSecondarySidebarOpen] = useState(false);
    const [secondaryPanel, setSecondaryPanel] = useState<SecondaryPanel>("products");

    useEffect(() => {
        if (typeof window === "undefined" || window.innerWidth < 768) {
            return;
        }
        if (shouldOpenForReports) {
            setSecondaryPanel("reports");
            setIsSecondarySidebarOpen(true);
        } else if (shouldOpenForProducts) {
            setSecondaryPanel("products");
            setIsSecondarySidebarOpen(true);
        } else if (shouldOpenForPages) {
            setSecondaryPanel("pages");
            setIsSecondarySidebarOpen(true);
        } else if (shouldOpenForSettings) {
            setSecondaryPanel("menu");
            setIsSecondarySidebarOpen(true);
        }
    }, [
        pathOnly,
        shouldOpenForProducts,
        shouldOpenForPages,
        shouldOpenForReports,
        shouldOpenForSettings,
    ]);

    const handleProductsClick = () => {
        if (isSecondarySidebarOpen && secondaryPanel === "products") {
            setIsSecondarySidebarOpen(false);
        } else {
            setSecondaryPanel("products");
            setIsSecondarySidebarOpen(true);
        }
    };

    const handlePagesClick = () => {
        if (isSecondarySidebarOpen && secondaryPanel === "pages") {
            setIsSecondarySidebarOpen(false);
        } else {
            setSecondaryPanel("pages");
            setIsSecondarySidebarOpen(true);
        }
    };

    const handleSettingsClick = () => {
        if (isSecondarySidebarOpen && secondaryPanel === "menu") {
            setIsSecondarySidebarOpen(false);
        } else {
            setSecondaryPanel("menu");
            setIsSecondarySidebarOpen(true);
        }
    };

    const handleReportsClick = () => {
        if (isSecondarySidebarOpen && secondaryPanel === "reports") {
            setIsSecondarySidebarOpen(false);
        } else {
            setSecondaryPanel("reports");
            setIsSecondarySidebarOpen(true);
        }
    };

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (Object.keys(errors).length > 0) {
            toast.error(
                "There are errors in the form. Please check the fields."
            );
        }
    }, [flash, errors]);

    return (
        <div className="flex min-h-screen bg-[#0C1311] text-gray-100">
            <Head title={title} />
            <Toaster position="top-right" richColors />

            <div className="hidden md:flex flex-1">
                <PrimarySidebar
                    onProductsClick={handleProductsClick}
                    onPagesClick={handlePagesClick}
                    onSettingsClick={handleSettingsClick}
                    onReportsClick={handleReportsClick}
                    isSecondaryOpen={isSecondarySidebarOpen}
                    secondaryPanel={secondaryPanel}
                />

                {/* Secondary sidebar with smooth slide-in animation */}
                <div
                    className={`overflow-hidden shrink-0 transition-[width] duration-200 ease-in-out ${
                        isSecondarySidebarOpen ? "w-64" : "w-0"
                    }`}
                >
                    <div className="w-64 h-full">
                        <SecondarySidebar
                            isOpen={isSecondarySidebarOpen}
                            panel={secondaryPanel}
                            onClose={() => setIsSecondarySidebarOpen(false)}
                        />
                    </div>
                </div>

                <div className="flex-1 flex flex-col min-w-0">
                    {head ? head : <Header showUserMenu={true} />}
                    <main className="flex-1 overflow-auto p-6">
                        {" "}
                        {children}{" "}
                    </main>
                </div>
            </div>

            <div className="flex flex-1 flex-col md:hidden">
                {head ? head : <Header showUserMenu={true} />}

                <main className="flex-1 overflow-auto p-4 pb-20">
                    {children}
                </main>

                <MobileBottomNav
                    isSecondaryOpen={isSecondarySidebarOpen}
                    secondaryPanel={secondaryPanel}
                    onProductsPress={handleProductsClick}
                    onReportsPress={handleReportsClick}
                    onSettingsPress={handleSettingsClick}
                />
            </div>

            {/* Mobile Overlay */}
            {isSecondarySidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsSecondarySidebarOpen(false)}
                />
            )}

            {/* Mobile Secondary Sidebar */}
            <div
                className={`
                    fixed bottom-0 left-0 right-0 z-50 
                    transform transition-transform duration-300 ease-in-out
                    bg-[#0E1614] border-t border-gray-800
                    ${
                        isSecondarySidebarOpen
                            ? "translate-y-0"
                            : "translate-y-full"
                    }
                    md:hidden
                `}
            >
                <SecondarySidebar
                    isOpen={isSecondarySidebarOpen}
                    panel={secondaryPanel}
                    onClose={() => setIsSecondarySidebarOpen(false)}
                    mobile
                />
            </div>
        </div>
    );
};

export default Master;
