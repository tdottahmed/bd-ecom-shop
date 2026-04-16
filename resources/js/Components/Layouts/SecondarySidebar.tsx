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
    BarChart3,
    TrendingUp,
    Package,
    ShoppingBag,
    Warehouse,
    CreditCard,
    Undo2,
    Receipt,
    ShoppingCart,
    MapPin,
    Scale,
    LayoutTemplate,
    CircleHelp,
} from "lucide-react";
import { useForm, Link, usePage } from "@inertiajs/react";

export type SecondaryPanel = "menu" | "reports" | "products" | "pages";

interface SecondarySidebarProps {
    isOpen: boolean;
    onClose: () => void;
    mobile?: boolean;
    panel?: SecondaryPanel;
}

interface MenuItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    route?: string;
    urlPattern?: string;
    /** `exact` = path must equal urlPattern (after stripping query). Default: prefix match. */
    match?: "exact" | "prefix";
}

export const productsMenuItems: MenuItem[] = [
    {
        key: "all_products",
        label: "All Products",
        icon: <ShoppingBag size={18} />,
        route: "admin.products.index",
        urlPattern: "/admin/products",
    },
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
        label: "Qty Discounts",
        icon: <BadgePercent size={18} />,
        route: "admin.discounts.index",
        urlPattern: "/admin/discounts",
    },
    {
        key: "product_requests",
        label: "Product Requests",
        icon: <Bell size={18} />,
        route: "admin.product-requests.index",
        urlPattern: "/admin/product-requests",
    },
];

export const pagesMenuItems: MenuItem[] = [
    {
        key: "landing_pages",
        label: "Landing Pages",
        icon: <FileText size={18} />,
        route: "admin.landing-pages.index",
        urlPattern: "/admin/landing-pages",
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
        label: "Contact Messages",
        icon: <MessageCircle size={18} />,
        route: "admin.contact-messages.index",
        urlPattern: "/admin/contact-messages",
    },
    {
        key: "legal_pages",
        label: "Legal Pages",
        icon: <Scale size={18} />,
        route: "admin.legal-pages.index",
        urlPattern: "/admin/legal-pages",
    },
    {
        key: "custom_pages",
        label: "Custom Pages",
        icon: <LayoutTemplate size={18} />,
        route: "admin.pages.index",
        urlPattern: "/admin/pages",
    },
    {
        key: "home_page_builder",
        label: "Home Page",
        icon: <Sparkles size={18} />,
        route: "admin.home-settings.index",
        urlPattern: "/admin/home-settings",
    },
    {
        key: "content_settings",
        label: "Others Contents",
        icon: <FileText size={18} />,
        route: "admin.content-settings.index",
        urlPattern: "/admin/content-settings",
    },
    {
        key: "faq_manager",
        label: "FAQ Manager",
        icon: <CircleHelp size={18} />,
        route: "admin.faq.index",
        urlPattern: "/admin/faq",
    },
];

export const secondaryMenuItems: MenuItem[] = [
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
        icon: <CreditCard size={18} />,
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
];

export const reportsMenuItems: MenuItem[] = [
    {
        key: "reports_overview",
        label: "Overview",
        icon: <BarChart3 size={18} />,
        route: "admin.reports.index",
        urlPattern: "/admin/reports",
        match: "exact",
    },
    {
        key: "reports_sales",
        label: "Sales performance",
        icon: <TrendingUp size={18} />,
        route: "admin.reports.sales",
        urlPattern: "/admin/reports/sales",
    },
    {
        key: "reports_orders",
        label: "Orders",
        icon: <Package size={18} />,
        route: "admin.reports.orders",
        urlPattern: "/admin/reports/orders",
    },
    {
        key: "reports_products",
        label: "Products",
        icon: <ShoppingBag size={18} />,
        route: "admin.reports.products",
        urlPattern: "/admin/reports/products",
    },
    {
        key: "reports_inventory",
        label: "Inventory",
        icon: <Warehouse size={18} />,
        route: "admin.reports.inventory",
        urlPattern: "/admin/reports/inventory",
    },
    {
        key: "reports_customers",
        label: "Customers",
        icon: <Users size={18} />,
        route: "admin.reports.customers",
        urlPattern: "/admin/reports/customers",
    },
    {
        key: "reports_shipping",
        label: "Shipping & delivery",
        icon: <Truck size={18} />,
        route: "admin.reports.shipping",
        urlPattern: "/admin/reports/shipping",
    },
    {
        key: "reports_refunds",
        label: "Refunds & returns",
        icon: <Undo2 size={18} />,
        route: "admin.reports.refunds",
        urlPattern: "/admin/reports/refunds",
    },
    {
        key: "reports_geography",
        label: "Geography",
        icon: <MapPin size={18} />,
        route: "admin.reports.geography",
        urlPattern: "/admin/reports/geography",
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
    panel = "menu",
}) => {
    const { post } = useForm();
    const { url, props } = usePage();
    const authUser = (props as any)?.auth?.user;

    const pathOnly = url.split("?")[0];

    const handleLogout = () => {
        post(route("logout"));
    };

    const items =
        panel === "reports"
            ? reportsMenuItems
            : panel === "products"
              ? productsMenuItems
              : panel === "pages"
                ? pagesMenuItems
                : secondaryMenuItems;

    const isMenuItemActive = (item: MenuItem): boolean => {
        if (!item.urlPattern) return false;
        if (item.match === "exact") {
            return (
                pathOnly === item.urlPattern ||
                pathOnly === `${item.urlPattern}/`
            );
        }
        return pathOnly.startsWith(item.urlPattern);
    };

    const panelTitle =
        panel === "reports"
            ? "Reports"
            : panel === "products"
              ? "Products"
              : panel === "pages"
                ? "Content"
                : "Settings";

    const panelSubtitle =
        panel === "reports"
            ? "Sales, inventory, and store analytics"
            : panel === "products"
              ? "Catalog, categories & promotions"
              : panel === "pages"
                ? "Pages, blogs & communications"
                : "Store configuration & tools";

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
                </div>

                <div className="px-4 pb-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                        {panelTitle}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                        {panelSubtitle}
                    </p>
                </div>

                <nav className="p-3 space-y-1">
                    {items.map((item) => (
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
            </div>

            <div className="px-4 pt-2 pb-1 border-b border-gray-800/40">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    {panelTitle}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{panelSubtitle}</p>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {items.map((item) => (
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
