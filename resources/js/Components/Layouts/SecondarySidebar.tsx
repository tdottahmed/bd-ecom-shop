import React from "react";
import {
    BadgePercent,
    FileText,
    Globe,
    Users,
    Truck,
    Target,
    LogOutIcon,
    X,
    ArrowLeft,
    Layers,
    Tag,
    Search,
    Sparkles,
    Mail,
    LogIn,
    NotebookPen,
    MessageCircle,
    UserCog,
    ExternalLink,
    ShieldCheck,
    Bell,
    ShoppingBag,
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
        key: "home_settings",
        label: "Home Settings",
        icon: <Sparkles size={18} />,
        route: "admin.home-settings.index",
        urlPattern: "/admin/home-settings",
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
        key: "social_login",
        label: "Social Login",
        icon: <LogIn size={18} />,
        route: "admin.social-login.index",
        urlPattern: "/admin/social-login",
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
    {
        key: "blogs",
        label: "Blog",
        icon: <NotebookPen size={18} />,
        route: "admin.blogs.index",
        urlPattern: "/admin/blogs",
    },
    {
        key: "newsletter_subscriptions",
        label: "Newsletter",
        icon: <Mail size={18} />,
        route: "admin.newsletter-subscriptions.index",
        urlPattern: "/admin/newsletter-subscriptions",
    },
    {
        key: "contact_messages",
        label: "Contact Msgs",
        icon: <MessageCircle size={18} />,
        route: "admin.contact-messages.index",
        urlPattern: "/admin/contact-messages",
    },
    {
        key: "product_requests",
        label: "Product Requests",
        icon: <Bell size={18} />,
        route: "admin.product-requests.index",
        urlPattern: "/admin/product-requests",
    },
    {
        key: "new_product_requests",
        label: "New Product Requests",
        icon: <ShoppingBag size={18} />,
        route: "admin.new-product-requests.index",
        urlPattern: "/admin/new-product-requests",
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
    const { url, props } = usePage();
    const authUser = (props as any)?.auth?.user;

    const handleLogout = () => {
        post(route("logout"));
    };

    const isMenuItemActive = (item: MenuItem): boolean => {
        if (!item.urlPattern) return false;
        return url.startsWith(item.urlPattern);
    };

    const initials = (authUser?.name || "A")
        .split(" ")
        .slice(0, 2)
        .map((w: string) => w[0]?.toUpperCase() ?? "")
        .join("");

    /* MOBILE SIDEBAR */
    if (mobile) {
        return (
            <div className="bg-[#0E1614] max-h-[80vh] overflow-y-auto">
                {/* Mobile user card */}
                <div className="px-4 pt-4 pb-3 border-b border-gray-800/60">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2DE3A7] to-[#1aad80] flex items-center justify-center text-[#0E1614] font-bold text-xs shrink-0">
                                {initials}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-white truncate leading-tight">
                                    {authUser?.name || "Admin"}
                                </p>
                                <span className="inline-flex items-center gap-1 text-[10px] text-[#2DE3A7] font-medium">
                                    <ShieldCheck size={9} />
                                    Administrator
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-[#151F1D] text-gray-400"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Link
                            href={route("profile.edit")}
                            onClick={onClose}
                            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#151F1D] hover:bg-[#1a2b28] text-gray-300 hover:text-white text-xs font-medium transition-colors"
                        >
                            <UserCog size={12} />
                            Profile
                        </Link>
                        <a
                            href={route("home")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#151F1D] hover:bg-[#1a2b28] text-gray-300 hover:text-white text-xs font-medium transition-colors"
                        >
                            <ExternalLink size={12} />
                            View Store
                        </a>
                    </div>
                </div>

                <nav className="p-3 space-y-1">
                    {secondaryMenuItems.map((item) => (
                        <MenuLink
                            key={item.key}
                            item={item}
                            onClick={onClose}
                            isActive={isMenuItemActive(item)}
                        />
                    ))}
                    <div className="border-t border-gray-800 mt-1 pt-1">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-all w-full text-left text-sm font-medium"
                        >
                            <LogOutIcon size={16} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </nav>
            </div>
        );
    }

    return (
        <aside className="w-64 bg-[#0E1614] border-r border-gray-800 flex flex-col">
            {/* ── User profile card ── */}
            <div className="p-4 border-b border-gray-800/60">
                {/* Top row: close button */}
                <div className="flex justify-end mb-3">
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-[#151F1D] text-gray-500 hover:text-white transition-colors"
                        title="Close menu"
                    >
                        <ArrowLeft size={18} />
                    </button>
                </div>

                {/* Avatar + info */}
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2DE3A7] to-[#1aad80] flex items-center justify-center text-[#0E1614] font-bold text-sm shrink-0 shadow-lg shadow-[#2DE3A7]/20">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate leading-tight">
                            {authUser?.name || "Admin"}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                            {authUser?.email || ""}
                        </p>
                    </div>
                </div>

                {/* Role badge */}
                <div className="flex items-center gap-1.5 mb-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2DE3A7]/10 border border-[#2DE3A7]/20 text-[#2DE3A7] text-[10px] font-semibold tracking-wide">
                        <ShieldCheck size={10} />
                        Administrator
                    </span>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-2">
                    <Link
                        href={route("profile.edit")}
                        className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#151F1D] hover:bg-[#1a2b28] text-gray-300 hover:text-white text-xs font-medium transition-colors"
                    >
                        <UserCog size={13} />
                        Profile
                    </Link>
                    <a
                        href={route("home")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-[#151F1D] hover:bg-[#1a2b28] text-gray-300 hover:text-white text-xs font-medium transition-colors"
                    >
                        <ExternalLink size={13} />
                        View Store
                    </a>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-600/10 hover:text-red-300 transition-all w-full text-left text-sm font-medium"
                >
                    <LogOutIcon size={16} />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default SecondarySidebar;
