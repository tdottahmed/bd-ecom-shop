import React from "react";
import {
    Home,
    ShoppingBag,
    Package,
    Settings,
    FileText,
    BarChart3,
    type LucideProps,
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

// Store the icon component (not JSX) so we can render at different sizes
const primaryMenuItems: {
    key: string;
    label: string;
    Icon: React.FC<LucideProps>;
    route: string | null;
}[] = [
    { key: "dashboard", label: "Dashboard", Icon: Home, route: "admin.dashboard" },
    { key: "products", label: "Products", Icon: ShoppingBag, route: null },
    { key: "orders", label: "Orders", Icon: Package, route: "admin.orders.index" },
    { key: "content", label: "Content", Icon: FileText, route: null },
    { key: "reports", label: "Reports", Icon: BarChart3, route: null },
    { key: "settings", label: "Settings", Icon: Settings, route: null },
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

    const Logo = () => (
        <>
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
        </>
    );

    return (
        <>
            {/* ─────────────────────────────────────────
                DESKTOP: vertical sidebar (md+)
            ───────────────────────────────────────── */}
            <aside className="hidden md:flex w-20 bg-[#0E1614] border-r border-gray-800 flex-col items-center py-6 z-50 shrink-0">
                <div className="mb-8 w-full flex justify-center">
                    <Logo />
                </div>

                <nav className="flex-1 space-y-4 w-full px-2">
                    {primaryMenuItems.map((item) => {
                        const active = isActive(item);
                        const connected = isPanelConnected(item);
                        const cls = `relative flex flex-col items-center p-3 rounded-lg transition-all w-full ${
                            active
                                ? "bg-[#0F1A18] text-[#2DE3A7]"
                                : "text-gray-300 hover:bg-[#151F1D] hover:text-white"
                        }`;

                        const content = (
                            <>
                                <item.Icon size={20} />
                                <span className="text-xs mt-1">{item.label}</span>
                                {connected && (
                                    <span className="absolute right-0 top-1/4 h-1/2 w-0.5 rounded-full bg-[#2DE3A7]" />
                                )}
                            </>
                        );

                        return (
                            <div key={item.key}>
                                {item.route ? (
                                    <Link href={route(item.route)} className={cls}>
                                        {content}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleItemClick(item)}
                                        className={cls}
                                    >
                                        {content}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* ─────────────────────────────────────────
                MOBILE: fixed bottom navigation (<md)
            ───────────────────────────────────────── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#0E1614] border-t border-gray-800 z-30">
                <div className="flex items-center">
                    {primaryMenuItems.map((item) => {
                        const active = isActive(item);
                        const cls = `flex flex-col items-center justify-center py-2 px-1 flex-1 min-w-0 transition-colors ${
                            active ? "text-[#2DE3A7]" : "text-gray-400"
                        }`;

                        const content = (
                            <>
                                <item.Icon size={19} />
                                <span className="text-[9px] mt-0.5 truncate w-full text-center leading-none">
                                    {item.label}
                                </span>
                            </>
                        );

                        return (
                            <React.Fragment key={item.key}>
                                {item.route ? (
                                    <Link href={route(item.route)} className={cls}>
                                        {content}
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => handleItemClick(item)}
                                        className={cls}
                                    >
                                        {content}
                                    </button>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default PrimarySidebar;
