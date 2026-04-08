import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import { Order, PaginatedData } from "@/types";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import { ChevronRight, FileText, Package } from "lucide-react";

function statusBadgeClass(status: string): string {
    switch (status) {
        case "completed":
            return "bg-brand-success/10 text-brand-success ring-brand-success/20";
        case "shipping":
            return "bg-sky-50 text-sky-800 ring-sky-600/20";
        case "preparing":
            return "bg-brand-accent/10 text-brand-accent ring-brand-accent/20";
        case "cancelled":
        case "returned":
            return "bg-red-50 text-red-800 ring-red-600/20";
        case "unreachable":
            return "bg-orange-50 text-orange-900 ring-orange-600/20";
        default:
            return "bg-gray-50 text-gray-700 ring-gray-500/10";
    }
}

export default function Orders({ orders }: { orders: PaginatedData<Order> }) {
    return (
        <CustomerAccountLayout title="Orders">
            <div className="space-y-4">
                {orders.data.length > 0 ? (
                    orders.data.map((order) => (
                        <div
                            key={order.id}
                            className="group rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-gray-200 hover:shadow-md sm:p-5"
                        >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0C1311]/5 text-[#0C1311]">
                                        <Package className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            Order #{order.id}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {format(
                                                new Date(order.created_at),
                                                "MMM d, yyyy"
                                            )}
                                        </p>
                                        <span
                                            className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${statusBadgeClass(order.status)}`}
                                        >
                                            {order.status.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-stretch gap-2 sm:items-end">
                                    <p className="text-lg font-bold text-[#0C1311] sm:text-right">
                                        ৳{order.total}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        <Link
                                            href={route(
                                                "account.orders.show",
                                                order.id
                                            )}
                                            className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#0C1311] px-3 py-2 text-xs font-semibold text-[#2DE3A7] transition hover:bg-[#152520] sm:text-sm"
                                        >
                                            Details & tracking
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </Link>
                                        <Link
                                            href={route(
                                                "account.orders.invoice",
                                                order.id
                                            )}
                                            className="inline-flex items-center justify-center gap-1 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-50 sm:text-sm"
                                        >
                                            <FileText className="h-3.5 w-3.5" />
                                            Invoice
                                        </Link>
                                        <a
                                            href={route(
                                                "account.orders.invoice.pdf",
                                                order.id
                                            )}
                                            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800 transition hover:bg-gray-50 sm:text-sm"
                                        >
                                            PDF
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No orders found.</p>
                )}
            </div>

            {orders.last_page > 1 && (
                <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-100 pt-6 sm:flex-row">
                    {orders.prev_page_url ? (
                        <Link
                            href={orders.prev_page_url}
                            preserveScroll
                            className="text-sm font-semibold text-[#0C1311] hover:text-[#2DE3A7]"
                        >
                            ← Previous
                        </Link>
                    ) : (
                        <span className="text-sm text-gray-400">← Previous</span>
                    )}
                    <span className="text-sm text-gray-500">
                        Page {orders.current_page} of {orders.last_page}
                    </span>
                    {orders.next_page_url ? (
                        <Link
                            href={orders.next_page_url}
                            preserveScroll
                            className="text-sm font-semibold text-[#0C1311] hover:text-[#2DE3A7]"
                        >
                            Next →
                        </Link>
                    ) : (
                        <span className="text-sm text-gray-400">Next →</span>
                    )}
                </div>
            )}
        </CustomerAccountLayout>
    );
}
