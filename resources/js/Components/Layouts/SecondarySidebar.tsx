import React from "react";
import {
    BadgePercent,
    FileText,
    Globe,
    Users,
    Truck,
    Calculator,
    Target,
    LogOutIcon,
    X,
    ArrowLeft,
    Layers,
    Tag,
    Search,
} from "lucide-react";
import { useForm, Link, usePage } from "@inertiajs/react";

interface SecondarySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    mobile?: boolean;
}

interface MenuItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    route?: string;
    urlPattern?: string;
}

export const secondaryMenuItems: MenuItem[] = [
    {
        key: "categories",
        label: "Categories",
        icon: <Layers size={18} />,
        route: "admin.categories.index",
        urlPattern: "/admin/categories",
    },
    {
        key: "brands",
        label: "Brands",
        icon: <Tag size={18} />,
        route: "admin.brands.index",
        urlPattern: "/admin/brands",
    },
    {
        key: "discounts",
        label: "Discounts",
        icon: <BadgePercent size={18} />,
        route: "admin.discounts.index",
        urlPattern: "/admin/discounts",
    },
    {
        key: "website",
        label: "Website",
        icon: <Globe size={18} />,
        route: "admin.website.index",
        urlPattern: "/admin/website",
    },
    {
        key: "users",
        label: "Users",
        icon: <Users size={18} />,
        route: "admin.users.index",
        urlPattern: "/admin/users",
    },
    {
        key: "gateway",
        label: "Payment Gateways",
        icon: <Truck size={18} />,
        route: "admin.payment-gateways.index",
        urlPattern: "/admin/payment-gateways",
    },
    {
        key: "courier",
        label: "Courier",
        icon: <Truck size={18} />,
        route: "admin.courier.index",
        urlPattern: "/admin/courier",
    },

    {
        key: "marketing",
        label: "Marketing",
        icon: <Target size={18} />,
        route: "admin.marketing.index",
        urlPattern: "/admin/marketing",
    },
    {
        key: "seo",
        label: "SEO",
        icon: <Search size={18} />,
        route: "admin.seo.index",
        urlPattern: "/admin/seo",
    },
    {
        key: "pages",
        label: "Pages",
        icon: <FileText size={18} />,
        route: "admin.pages.index",
        urlPattern: "/admin/pages",
    },
];

const MenuLink = ({
    item,
    onClick,
    isActive,
}: {
    item: MenuItem;
    onClick?: () => void;
    isActive: boolean;
}) =>
    item.route && item.route !== "#" ? (
        <Link
            href={route(item.route)}
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                isActive
                    ? "bg-[#0F1A18] text-[#2DE3A7]"
                    : "text-gray-300 hover:bg-[#151F1D] hover:text-white"
            }`}
        >
            {item.icon}
            <span> {item.label} </span>
        </Link>
    ) : (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                onClick?.();
            }}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                isActive
                    ? "bg-[#0F1A18] text-[#2DE3A7]"
                    : "text-gray-300 hover:bg-[#151F1D] hover:text-white"
            }`}
        >
            {item.icon}
            <span> {item.label} </span>
        </a>
    );

const SecondarySidebar: React.FC<SecondarySidebarProps> = ({
    isOpen,
    onClose,
    mobile = false,
}) => {
    const { post } = useForm();
    const { url } = usePage();

    const handleLogout = () => {
        post(route("logout"));
    };

    const isMenuItemActive = (item: MenuItem): boolean => {
        if (!item.urlPattern) return false;
        return url.startsWith(item.urlPattern);
    };

    /* MOBILE SIDEBAR */
    if (mobile) {
        return (
            <div className="bg-[#0E1614] p-6 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold"> Menu </h3>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-[#151F1D]"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="space-y-2">
                    {secondaryMenuItems.map((item) => (
                        <MenuLink
                            key={item.key}
                            item={item}
                            onClick={onClose}
                            isActive={isMenuItemActive(item)}
                        />
                    ))}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-600/10 transition-all w-full text-left"
                    >
                        <LogOutIcon size={18} />
                        <span> Logout </span>
                    </button>
                </nav>
            </div>
        );
    }

    return (
        <aside className="w-64 bg-[#0E1614] border-r border-gray-800 flex flex-col">
            <div className="p-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold">
                            {" "}
                            Paikari World{" "}
                        </h2>
                        <p className="text-sm text-gray-400"> pw@gmail.com</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-[#151F1D] text-gray-400 hover:text-white transition-colors"
                        title="Close menu"
                    >
                        <ArrowLeft size={20} />
                    </button>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {secondaryMenuItems.map((item) => (
                    <MenuLink
                        key={item.key}
                        item={item}
                        isActive={isMenuItemActive(item)}
                    />
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 rounded-lg text-red-400 hover:bg-red-600/10 transition-all w-full text-left"
                >
                    <LogOutIcon size={18} />
                    <span> Logout </span>
                </button>
            </div>
        </aside>
    );
};

export default SecondarySidebar;
