import React from "react";
import {
    Home,
    ShoppingBag,
    Package,
    Settings,
    FileText,
    BarChart3,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useActiveRoute } from "@/Utils/routeHelpers";
import type { SecondaryPanel } from "@/Components/Layouts/SecondarySidebar";

interface PrimarySidebarProps {
    onProductsClick?: () => void;
    onPagesClick?: () => void;
    onSettingsClick?: () => void;
    onReportsClick?: () => void;
    isSecondaryOpen?: boolean;
    secondaryPanel?: SecondaryPanel;
}

// Routes that belong to each panel — used for active state detection
const PRODUCTS_ROUTES = [
    "products",
    "categories",
    "brands",
    "discounts",
    "product-requests",
];
const PAGES_ROUTES = [
    "landing-pages",
    "blogs",
    "newsletter-subscriptions",
    "contact-messages",
];
const SETTINGS_ROUTES = [
    "website",
    "home-settings",
    "users",
    "payment-gateways",
    "courier",
    "social-login",
    "marketing",
    "seo",
];

const primaryMenuItems = [
    {
        key: "dashboard",
        label: "Dashboard",
        icon: <Home size={20} />,
        route: "admin.dashboard",
    },
    {
        key: "products",
        label: "Products",
        icon: <ShoppingBag size={20} />,
        route: null, // opens products panel
    },
    {
        key: "orders",
        label: "Orders",
        icon: <Package size={20} />,
        route: "admin.orders.index",
    },
    {
        key: "content",
        label: "Content",
        icon: <FileText size={20} />,
        route: null, // opens pages panel
    },
    {
        key: "reports",
        label: "Reports",
        icon: <BarChart3 size={20} />,
        route: null, // opens reports panel
    },
    {
        key: "settings",
        label: "Settings",
        icon: <Settings size={20} />,
        route: null, // opens settings panel
    },
];

const PrimarySidebar: React.FC<PrimarySidebarProps> = ({
    onProductsClick,
    onPagesClick,
    onSettingsClick,
    onReportsClick,
    isSecondaryOpen = false,
    secondaryPanel,
}) => {
    const activeRoute = useActiveRoute();
    const { siteFavicon } = usePage().props as any;

    const handleItemClick = (item: (typeof primaryMenuItems)[0]) => {
        if (item.key === "products") onProductsClick?.();
        if (item.key === "content") onPagesClick?.();
        if (item.key === "reports") onReportsClick?.();
        if (item.key === "settings") onSettingsClick?.();
    };

    const isActive = (item: (typeof primaryMenuItems)[0]): boolean => {
        if (item.key === "dashboard") {
            return (
                activeRoute === "dashboard" ||
                activeRoute === "admin" ||
                activeRoute === ""
            );
        }
        if (item.key === "products") {
            return (
                PRODUCTS_ROUTES.includes(activeRoute) ||
                (isSecondaryOpen && secondaryPanel === "products")
            );
        }
        if (item.key === "orders") {
            return activeRoute === "orders";
        }
        if (item.key === "content") {
            return (
                PAGES_ROUTES.includes(activeRoute) ||
                (isSecondaryOpen && secondaryPanel === "pages")
            );
        }
        if (item.key === "reports") {
            return (
                activeRoute === "reports" ||
                (isSecondaryOpen && secondaryPanel === "reports")
            );
        }
        if (item.key === "settings") {
            return (
                SETTINGS_ROUTES.includes(activeRoute) ||
                (isSecondaryOpen && secondaryPanel === "menu")
            );
        }
        return false;
    };

    const isPanelConnected = (item: (typeof primaryMenuItems)[0]): boolean => {
        if (!isSecondaryOpen) return false;
        if (item.key === "products" && secondaryPanel === "products") return true;
        if (item.key === "content" && secondaryPanel === "pages") return true;
        if (item.key === "reports" && secondaryPanel === "reports") return true;
        if (item.key === "settings" && secondaryPanel === "menu") return true;
        return false;
    };

    return (
        <aside className="w-20 bg-[#0E1614] border-r border-gray-800 flex flex-col items-center py-6 focus:outline-none z-50">
            <div className="mb-8 w-full flex justify-center">
                {siteFavicon ? (
                    <img
                        src={`/storage/${siteFavicon}`}
                        alt="Nix-Store"
                        className="w-10 h-10 rounded-lg object-contain bg-white/10"
                    />
                ) : (
                    <div className="w-10 h-10 bg-[#2DE3A7] rounded-lg flex flex-col items-center justify-center text-black font-extrabold text-[10px] leading-tight text-center px-0.5">
                        <span>Nix-</span>
                        <span>Store</span>
                    </div>
                )}
            </div>

            <nav className="flex-1 space-y-4 w-full px-2">
                {primaryMenuItems.map((item) => {
                    const active = isActive(item);
                    const connected = isPanelConnected(item);
                    const itemClass = `relative flex flex-col items-center p-3 rounded-lg transition-all w-full ${
                        active
                            ? "bg-[#0F1A18] text-[#2DE3A7]"
                            : "text-gray-300 hover:bg-[#151F1D] hover:text-white"
                    }`;

                    const content = (
                        <>
                            {item.icon}
                            <span className="text-xs mt-1">{item.label}</span>
                            {/* Right-edge connector when this item's secondary panel is open */}
                            {connected && (
                                <span className="absolute right-0 top-1/4 h-1/2 w-0.5 rounded-full bg-[#2DE3A7]" />
                            )}
                        </>
                    );

                    return (
                        <div key={item.key}>
                            {item.route ? (
                                <Link
                                    href={route(item.route)}
                                    className={itemClass}
                                >
                                    {content}
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => handleItemClick(item)}
                                    className={itemClass}
                                >
                                    {content}
                                </button>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
};

export default PrimarySidebar;
