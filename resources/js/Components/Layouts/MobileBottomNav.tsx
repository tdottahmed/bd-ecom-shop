import React from "react";
import { Home, ShoppingBag, Package, Settings, BarChart3 } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useActiveRoute } from "@/Utils/routeHelpers";
import type { SecondaryPanel } from "@/Components/Layouts/SecondarySidebar";

interface MobileBottomNavProps {
    isSecondaryOpen: boolean;
    secondaryPanel: SecondaryPanel;
    onProductsPress: () => void;
    onReportsPress: () => void;
    onSettingsPress: () => void;
}

const PRODUCTS_ROUTES = [
    "products",
    "categories",
    "brands",
    "discounts",
    "product-requests",
];

const mobileMenuItems = [
    {
        key: "dashboard",
        label: "Home",
        icon: <Home size={20} />,
        route: "admin.dashboard",
    },
    {
        key: "products",
        label: "Products",
        icon: <ShoppingBag size={20} />,
        route: null as string | null,
    },
    {
        key: "orders",
        label: "Orders",
        icon: <Package size={20} />,
        route: "admin.orders.index",
    },
    {
        key: "reports",
        label: "Reports",
        icon: <BarChart3 size={20} />,
        route: null as string | null,
    },
    {
        key: "settings",
        label: "Settings",
        icon: <Settings size={20} />,
        route: null as string | null,
    },
];

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    isSecondaryOpen,
    secondaryPanel,
    onProductsPress,
    onReportsPress,
    onSettingsPress,
}) => {
    const activeRoute = useActiveRoute();

    const isActive = (item: (typeof mobileMenuItems)[0]): boolean => {
        if (item.key === "dashboard") {
            return activeRoute === "dashboard" || activeRoute === "";
        }
        if (item.key === "orders") {
            return activeRoute === "orders";
        }
        return false;
    };

    const productsBtnActive =
        PRODUCTS_ROUTES.includes(activeRoute) ||
        (isSecondaryOpen && secondaryPanel === "products");

    const reportsBtnActive =
        activeRoute === "reports" ||
        (isSecondaryOpen && secondaryPanel === "reports");

    const settingsBtnActive =
        isSecondaryOpen && secondaryPanel === "menu";

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0E1614] border-t border-gray-800 z-30 md:hidden">
            <div className="flex justify-around items-center max-w-lg mx-auto">
                {mobileMenuItems.map((item) => {
                    if (item.key === "products") {
                        return (
                            <button
                                key={item.key}
                                type="button"
                                className={`flex flex-col items-center py-2.5 px-2 flex-1 min-w-0 transition-all ${
                                    productsBtnActive
                                        ? "text-[#2DE3A7]"
                                        : "text-gray-300"
                                }`}
                                onClick={onProductsPress}
                            >
                                {item.icon}
                                <span className="text-[10px] mt-1 truncate w-full text-center">
                                    {item.label}
                                </span>
                            </button>
                        );
                    }

                    if (item.key === "reports") {
                        return (
                            <button
                                key={item.key}
                                type="button"
                                className={`flex flex-col items-center py-2.5 px-2 flex-1 min-w-0 transition-all ${
                                    reportsBtnActive
                                        ? "text-[#2DE3A7]"
                                        : "text-gray-300"
                                }`}
                                onClick={onReportsPress}
                            >
                                {item.icon}
                                <span className="text-[10px] mt-1 truncate w-full text-center">
                                    {item.label}
                                </span>
                            </button>
                        );
                    }

                    if (item.key === "settings") {
                        return (
                            <button
                                key={item.key}
                                type="button"
                                className={`flex flex-col items-center py-2.5 px-2 flex-1 min-w-0 transition-all ${
                                    settingsBtnActive
                                        ? "text-[#2DE3A7]"
                                        : "text-gray-300"
                                }`}
                                onClick={onSettingsPress}
                            >
                                {item.icon}
                                <span className="text-[10px] mt-1 truncate w-full text-center">
                                    {item.label}
                                </span>
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={item.key}
                            href={route(item.route as string)}
                            className={`flex flex-col items-center py-2.5 px-2 flex-1 min-w-0 transition-all ${
                                isActive(item)
                                    ? "text-[#2DE3A7]"
                                    : "text-gray-300"
                            }`}
                        >
                            {item.icon}
                            <span className="text-[10px] mt-1 truncate w-full text-center">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
