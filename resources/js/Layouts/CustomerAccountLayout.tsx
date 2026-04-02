import React, { ReactNode } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    User,
    MapPin,
    LogOut,
    ChevronRight,
} from "lucide-react";
import CtaSection from "@/Components/Customer/CtaSection";

interface Props {
    title: string;
    children: ReactNode;
}

const links = [
    { label: "Dashboard", href: "account.dashboard", icon: LayoutDashboard },
    { label: "Orders", href: "account.orders", icon: Package },
    { label: "Saved Cart", href: "account.cart", icon: ShoppingCart },
    { label: "Profile", href: "account.profile", icon: User },
    { label: "Addresses", href: "account.addresses", icon: MapPin },
];

export default function CustomerAccountLayout({ title, children }: Props) {
    const { auth }: any = usePage().props;
    const user = auth?.user;

    // Get current route name to highlight active link
    // Assuming ziggy route() is available globally
    const currentRoute = typeof route !== "undefined" ? route().current() : "";

    return (
        <CustomerLayout>
            <Head title={title} />

            {/* Adding subtle background patterns for a premium feel */}
            <div className="min-h-screen bg-[#F4F6F8] relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-[#2DE3A7]/5 blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-[#0C1311]/5 blur-3xl" />

                <div className="relative max-w-8xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                    {/* Header / Breadcrumbs Area (Optional, keeping it clean) */}
                    <div className="mb-8 flex items-center gap-2 text-sm font-medium text-gray-500">
                        <Link
                            href="/"
                            className="hover:text-[#0C1311] transition-colors"
                        >
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-[#0C1311]">My Account</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* ---------------- SIDEBAR ---------------- */}
                        <aside className="lg:col-span-3 lg:col-start-1">
                            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/80 sticky top-28">
                                {/* User Summary Card */}
                                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                                    <div className="w-14 h-14 rounded-full bg-[#0C1311] text-[#2DE3A7] flex items-center justify-center text-xl font-bold shadow-md">
                                        {user?.name?.charAt(0) || "U"}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h2 className="text-lg font-bold text-gray-900 truncate">
                                            {user?.name || "Customer"}
                                        </h2>
                                        <p className="text-sm text-gray-500 truncate">
                                            {user?.email || "Welcome back"}
                                        </p>
                                    </div>
                                </div>

                                {/* Navigation Links - Scrollable row on mobile, stacked on desktop */}
                                <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                                    {links.map((item) => {
                                        const isActive =
                                            item.href === "account.orders"
                                                ? [
                                                      "account.orders",
                                                      "account.orders.show",
                                                      "account.orders.invoice",
                                                      "account.orders.invoice.pdf",
                                                  ].includes(
                                                      currentRoute ?? ""
                                                  )
                                                : currentRoute === item.href;
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={route(item.href)}
                                                className={`
                                                    group flex items-center flex-shrink-0 lg:flex-shrink w-auto lg:w-full gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300
                                                    ${
                                                        isActive
                                                            ? "bg-[#0C1311] text-[#2DE3A7] shadow-lg shadow-[#0C1311]/10 transform lg:scale-[1.02]"
                                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 lg:hover:translate-x-1"
                                                    }
                                                `}
                                            >
                                                <Icon
                                                    className={`w-5 h-5 ${isActive ? "text-[#2DE3A7]" : "text-gray-400 group-hover:text-[#0C1311] transition-colors"}`}
                                                />
                                                <span>{item.label}</span>

                                                {/* Optional: Add slight indicator icon on active */}
                                                {isActive && (
                                                    <ChevronRight className="w-4 h-4 ml-auto opacity-0 lg:opacity-100 text-[#2DE3A7]/50" />
                                                )}
                                            </Link>
                                        );
                                    })}

                                    {/* Logout Button */}
                                    <div className="hidden lg:block pt-8 mt-2 border-t border-gray-100">
                                        <Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-300 group lg:hover:translate-x-1"
                                        >
                                            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            <span>Log out</span>
                                        </Link>
                                    </div>
                                </nav>
                            </div>
                        </aside>

                        {/* ---------------- MAIN CONTENT ---------------- */}
                        <section className="lg:col-span-9 lg:col-start-4 relative">
                            {/* Inner fade-in-up animation wrapper */}
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both ease-out">
                                <div className="bg-white rounded-[2rem] p-6 lg:p-10 shadow-sm border border-gray-100/80 min-h-[600px] relative overflow-hidden">
                                    {/* Tiny decorative header accent */}
                                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#2DE3A7]/30 to-transparent" />

                                    <div className="mb-8 pb-6 border-b border-gray-100/60">
                                        <h1 className="text-3xl font-extrabold text-[#0C1311] tracking-tight">
                                            {title}
                                        </h1>
                                        <p className="mt-2 text-[15px] font-medium text-gray-500">
                                            Manage your {title.toLowerCase()}{" "}
                                            and account preferences.
                                        </p>
                                    </div>

                                    <div className="relative z-10">
                                        {children}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Add a global style tag strictly for hiding scrollbars on the mobile menu list */}
                <style>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
                <CtaSection />
            </div>
        </CustomerLayout>
    );
}
