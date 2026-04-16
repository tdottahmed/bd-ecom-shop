import React from "react";
import { Home, ShoppingBag, Package, Grid, BarChart3 } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useActiveRoute } from "@/Utils/routeHelpers";
import type { SecondaryPanel } from "@/Components/Layouts/SecondarySidebar";

interface MobileBottomNavProps {
    isSecondaryOpen: boolean;
    secondaryPanel: SecondaryPanel;
    onMorePress: () => void;
    onReportsPress: () => void;
}

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
        route: "admin.products.index",
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
    { key: "more", label: "More", icon: <Grid size={20} />, route: null },
];

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    isSecondaryOpen,
    secondaryPanel,
    onMorePress,
    onReportsPress,
}) => {
    const activeRoute = useActiveRoute();

    const mainKeys = [
        "dashboard",
        "products",
        "orders",
        "reports",
        "landing-pages",
    ];

    const isActive = (item: (typeof mobileMenuItems)[0]) => {
        if (item.key === "dashboard") {
            return activeRoute === "dashboard" || activeRoute === "";
        }
        if (item.key === "reports" || item.key === "more") {
            return false;
        }
        return activeRoute === item.key;
    };

    const onReportsPage = activeRoute === "reports";
    const reportsBtnActive =
        onReportsPage || (isSecondaryOpen && secondaryPanel === "reports");

    const onMoreSection = !mainKeys.includes(activeRoute);
    const moreBtnActive =
        onMoreSection || (isSecondaryOpen && secondaryPanel === "menu");

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0E1614] border-t border-gray-800 z-30 md:hidden">
            <div className="flex justify-around items-center max-w-lg mx-auto">
                {mobileMenuItems.map((item) => {
                    const isReports = item.key === "reports";
                    const isMore = item.key === "more";

                    if (isReports) {
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

                    if (isMore) {
                        return (
                            <button
                                key={item.key}
                                type="button"
                                className={`flex flex-col items-center py-2.5 px-2 flex-1 min-w-0 transition-all ${
                                    moreBtnActive
                                        ? "text-[#2DE3A7]"
                                        : "text-gray-300"
                                }`}
                                onClick={onMorePress}
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
