import React from "react";
import { Home, ShoppingBag, Package, Grid } from "lucide-react";
import { Link } from "@inertiajs/react";
import { useActiveRoute } from "@/Utils/routeHelpers";

interface MobileBottomNavProps {
    onSecondaryToggle: () => void;
}

const mobileMenuItems = [
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
        route: "admin.products.index",
    },
    {
        key: "orders",
        label: "Orders",
        icon: <Package size={20} />,
        route: "admin.orders.index",
    },
    { key: "more", label: "More", icon: <Grid size={20} />, route: null },
];

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
    onSecondaryToggle,
}) => {
    const activeRoute = useActiveRoute();

    const handleMoreClick = (e: React.MouseEvent) => {
        e.preventDefault();
        onSecondaryToggle();
    };

    const isActive = (item: (typeof mobileMenuItems)[0]) => {
        if (item.key === "dashboard") {
            return activeRoute === "dashboard" || activeRoute === "";
        }
        return activeRoute === item.key;
    };

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#0E1614] border-t border-gray-800 z-30 md:hidden">
            <div className="flex justify-around items-center">
                {mobileMenuItems.map((item) => {
                    const isMore = item.key === "more";

                    return (
                        isMore ? (
                            <button
                                key={item.key}
                                type="button"
                                className={`flex flex-col items-center py-3 px-4 flex-1 transition-all ${
                                    isActive(item)
                                        ? "text-[#2DE3A7]"
                                        : "text-gray-300"
                                }`}
                                onClick={handleMoreClick}
                            >
                                {item.icon}
                                <span className="text-xs mt-1">
                                    {" "}
                                    {item.label}{" "}
                                </span>
                            </button>
                        ) : (
                            <Link
                                key={item.key}
                                href={route(item.route as string)}
                                className={`flex flex-col items-center py-3 px-4 flex-1 transition-all ${
                                    isActive(item)
                                        ? "text-[#2DE3A7]"
                                        : "text-gray-300"
                                }`}
                            >
                                {item.icon}
                                <span className="text-xs mt-1">
                                    {" "}
                                    {item.label}{" "}
                                </span>
                            </Link>
                        )
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileBottomNav;
