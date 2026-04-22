import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import { Order } from "@/types";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import {
    ShoppingBag,
    Clock,
    ShoppingCart,
    ChevronRight,
    Package,
    ClipboardList,
} from "lucide-react";

const ORDER_STATUS_CONFIG: Record<
    string,
    { label: string; className: string }
> = {
    completed: {
        label: "Completed",
        className: "bg-brand-success/10 text-brand-success ring-brand-success/20",
    },
    shipping: {
        label: "Shipping",
        className: "bg-sky-50 text-sky-700 ring-sky-600/20",
    },
    preparing: {
        label: "Preparing",
        className: "bg-brand-accent/10 text-brand-accent ring-brand-accent/20",
    },
    cancelled: {
        label: "Cancelled",
        className: "bg-red-50 text-red-700 ring-red-600/20",
    },
    returned: {
        label: "Returned",
        className: "bg-red-50 text-red-700 ring-red-600/20",
    },
    pending: {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 ring-amber-600/20",
    },
};

function OrderStatusBadge({ status }: { status: string }) {
    const cfg = ORDER_STATUS_CONFIG[status] ?? {
        label: status,
        className: "bg-gray-50 text-gray-700 ring-gray-500/10",
    };
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${cfg.className}`}
        >
            {cfg.label}
        </span>
    );
}

export default function Dashboard({
    stats,
    recentOrders,
}: {
    stats: { totalOrders: number; pendingOrders: number; cartItems: number };
    recentOrders: Order[];
}) {
    const statCards = [
        {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: ShoppingBag,
            href: route("account.orders"),
            accent: false,
        },
        {
            label: "Pending Orders",
            value: stats.pendingOrders,
            icon: Clock,
            href: route("account.orders"),
            accent: stats.pendingOrders > 0,
        },
        {
            label: "Saved Cart Items",
            value: stats.cartItems,
            icon: ShoppingCart,
            href: route("account.cart"),
            accent: false,
        },
    ];

    return (
        <CustomerAccountLayout title="Dashboard">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {statCards.map(({ label, value, icon: Icon, href, accent }) => (
                    <Link
                        key={label}
                        href={href}
                        className={`group relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-md ${
                            accent
                                ? "border-[#2DE3A7]/30 bg-gradient-to-br from-[#0C1311] to-[#0C1311]/90 text-white"
                                : "border-gray-100 bg-gray-50/70 hover:border-gray-200"
                        }`}
                    >
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${
                                accent
                                    ? "bg-[#2DE3A7]/15"
                                    : "bg-[#0C1311]/8"
                            }`}
                        >
                            <Icon
                                className={`h-5 w-5 ${accent ? "text-[#2DE3A7]" : "text-[#0C1311]"}`}
                            />
                        </div>
                        <p
                            className={`text-3xl font-extrabold tracking-tight ${accent ? "text-white" : "text-[#0C1311]"}`}
                        >
                            {value}
                        </p>
                        <p
                            className={`mt-1 text-sm font-medium ${accent ? "text-[#2DE3A7]/80" : "text-gray-500"}`}
                        >
                            {label}
                        </p>
                        {accent && (
                            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[#2DE3A7]/5" />
                        )}
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                    href={route("account.orders")}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm transition hover:border-gray-200 hover:shadow-md group"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0C1311]/5">
                        <Package className="h-5 w-5 text-[#0C1311]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                            View All Orders
                        </p>
                        <p className="text-xs text-gray-500">
                            Track & manage your orders
                        </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#0C1311] transition-colors" />
                </Link>
                <Link
                    href={route("account.product-requests")}
                    className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm transition hover:border-gray-200 hover:shadow-md group"
                >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2DE3A7]/10">
                        <ClipboardList className="h-5 w-5 text-[#0C1311]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                            Product Requests
                        </p>
                        <p className="text-xs text-gray-500">
                            Track your requested products
                        </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-[#0C1311] transition-colors" />
                </Link>
            </div>

            {/* Recent Orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-gray-900">
                        Recent Orders
                    </h2>
                    <Link
                        href={route("account.orders")}
                        className="text-xs font-semibold text-[#0C1311] hover:text-[#2DE3A7] transition-colors"
                    >
                        View all
                    </Link>
                </div>

                {recentOrders.length > 0 ? (
                    <div className="space-y-3">
                        {recentOrders.map((order) => (
                            <Link
                                key={order.id}
                                href={route("account.orders.show", order.id)}
                                className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm transition hover:border-gray-200 hover:shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0C1311]/5">
                                        <Package className="h-5 w-5 text-[#0C1311]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            Order #{order.id}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {format(
                                                new Date(order.created_at),
                                                "dd MMM yyyy"
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-[#0C1311]">
                                            ৳{Number(order.total).toLocaleString()}
                                        </p>
                                    </div>
                                    <OrderStatusBadge status={order.status} />
                                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-[#0C1311] transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0C1311]/5 mb-3">
                            <ShoppingBag className="h-7 w-7 text-[#0C1311]/30" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">
                            No orders yet
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                            Your orders will appear here once placed.
                        </p>
                        <Link
                            href={route("products.index")}
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0C1311] px-4 py-2 text-sm font-semibold text-[#2DE3A7] transition hover:bg-[#0C1311]/90"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </CustomerAccountLayout>
    );
}
