import React from "react";
import { Home, ShoppingBag, Package, Grid } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { useActiveRoute } from "@/Utils/routeHelpers";

interface PrimarySidebarProps {
    onMoreClick?: () => void;
}

const primaryMenuItems = [
    {
        key: "dashboard",
        label: "Dashboard",
        icon: <Home size={20} />,
        route: "admin.dashboard",
        urlPattern: "/admin",
    },
    {
        key: "products",
        label: "Products",
        icon: <ShoppingBag size={20} />,
        route: "admin.products.index",
        urlPattern: "/admin/products",
    },
    {
        key: "orders",
        label: "Orders",
        icon: <Package size={20} />,
        route: "admin.orders.index",
        urlPattern: "/admin/orders",
    },
    {
        key: "more",
        label: "More",
        icon: <Grid size={20} />,
        route: null,
        urlPattern: null,
    },
];

const PrimarySidebar: React.FC<PrimarySidebarProps> = ({ onMoreClick }) => {
    const activeRoute = useActiveRoute();
    const { siteFavicon } = usePage().props as any;

    const handleItemClick = (item: (typeof primaryMenuItems)[0]) => {
        if (item.key === "more" && onMoreClick) {
            onMoreClick();
        }
    };

    const isActive = (item: (typeof primaryMenuItems)[0]) => {
        if (item.key === "dashboard") {
            return (
                activeRoute === "dashboard" ||
                activeRoute === "admin" ||
                activeRoute === ""
            );
        }

        if (item.key === "more") {
            const mainKeys = ["dashboard", "products", "orders"];
            return !mainKeys.includes(activeRoute);
        }

        return activeRoute === item.key;
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

            <nav className="flex-1 space-y-4">
                {primaryMenuItems.map((item) => (
                    <div key={item.key}>
                        {item.route ? (
                            <Link
                                href={route(item.route)}
                                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                                    isActive(item)
                                        ? "bg-[#0F1A18] text-[#2DE3A7]"
                                        : "text-gray-300 hover:bg-[#151F1D] hover:text-white"
                                }`}
                            >
                                {item.icon}
                                <span className="text-xs mt-1">
                                    {item.label}
                                </span>
                            </Link>
                        ) : (
                            <button
                                onClick={() => handleItemClick(item)}
                                className={`flex flex-col items-center p-3 rounded-lg transition-all w-full ${
                                    isActive(item)
                                        ? "bg-[#0F1A18] text-[#2DE3A7]"
                                        : "text-gray-300 hover:bg-[#151F1D] hover:text-white"
                                }`}
                            >
                                {item.icon}
                                <span className="text-xs mt-1">
                                    {item.label}
                                </span>
                            </button>
                        )}
                    </div>
                ))}
            </nav>

            <div className="mt-4">
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-xs">
                    PW
                </div>
            </div>
        </aside>
    );
};

export default PrimarySidebar;
