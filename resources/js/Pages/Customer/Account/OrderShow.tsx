import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import { Order } from "@/types";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import { Check, ChevronRight, FileText, Package, Truck } from "lucide-react";
import { getAssetUrl } from "@/Utils/helpers";

interface Props {
    order: Order;
}

const PIPELINE_STEPS = [
    { key: "pending", label: "Confirmed", description: "We received your order" },
    { key: "preparing", label: "Preparing", description: "Getting your items ready" },
    { key: "shipping", label: "On the way", description: "Handed to courier" },
    { key: "completed", label: "Delivered", description: "Order completed" },
] as const;

function statusStepIndex(status: string): number {
    const map: Record<string, number> = {
        pending: 0,
        preparing: 1,
        shipping: 2,
        completed: 3,
    };
    return map[status] ?? 0;
}

function statusBadgeClass(status: string): string {
    switch (status) {
        case "completed":
            return "bg-emerald-50 text-emerald-800 ring-emerald-600/20";
        case "shipping":
            return "bg-sky-50 text-sky-800 ring-sky-600/20";
        case "preparing":
            return "bg-amber-50 text-amber-800 ring-amber-600/20";
        case "cancelled":
        case "returned":
            return "bg-red-50 text-red-800 ring-red-600/20";
        case "unreachable":
            return "bg-orange-50 text-orange-900 ring-orange-600/20";
        default:
            return "bg-gray-50 text-gray-700 ring-gray-500/10";
    }
}

export default function OrderShow({ order }: Props) {
    const terminal =
        order.status === "cancelled" ||
        order.status === "returned" ||
        order.status === "unreachable";
    const activeIdx = terminal ? -1 : statusStepIndex(order.status);

    return (
        <CustomerAccountLayout title={`Order #${order.id}`}>
            <div className="no-print mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <Link
                    href={route("account.orders")}
                    className="font-medium text-[#0C1311] hover:text-[#2DE3A7]"
                >
                    Orders
                </Link>
                <ChevronRight className="h-4 w-4 shrink-0" />
                <span>Order #{order.id}</span>
            </div>

            <div className="no-print mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        Placed{" "}
                        {format(new Date(order.created_at), "MMMM d, yyyy · h:mm a")}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusBadgeClass(order.status)}`}
                        >
                            {order.status.replace(/_/g, " ")}
                        </span>
                        {order.payment_method && (
                            <span className="text-xs font-medium text-gray-500">
                                Payment: {order.payment_method}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={route("account.orders.invoice", order.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0C1311] px-4 py-2.5 text-sm font-semibold text-[#2DE3A7] shadow-sm transition hover:bg-[#152520]"
                    >
                        <FileText className="h-4 w-4" />
                        View invoice
                    </Link>
                    <a
                        href={route("account.orders.invoice.pdf", order.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50"
                    >
                        Download PDF
                    </a>
                </div>
            </div>

            {terminal && (
                <div
                    className={`mb-8 rounded-2xl border px-4 py-3 text-sm font-medium ${
                        order.status === "cancelled" || order.status === "returned"
                            ? "border-red-100 bg-red-50 text-red-900"
                            : "border-orange-100 bg-orange-50 text-orange-950"
                    }`}
                >
                    {order.status === "cancelled" && "This order was cancelled."}
                    {order.status === "returned" && "This order was returned."}
                    {order.status === "unreachable" &&
                        "Delivery could not be completed (unreachable). Contact support if you need help."}
                </div>
            )}

            <section className="mb-10">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#0C1311]">
                    <Truck className="h-5 w-5 text-[#2DE3A7]" />
                    Tracking
                </h2>
                {!terminal && (
                    <ol className="relative space-y-0 border-l-2 border-gray-100 pl-6 sm:pl-8">
                        {PIPELINE_STEPS.map((step, i) => {
                            const done = i < activeIdx;
                            const current = i === activeIdx;
                            return (
                                <li key={step.key} className="relative pb-8 last:pb-0">
                                    <span
                                        className={`absolute -left-[1.4rem] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 sm:-left-[1.65rem] ${
                                            done
                                                ? "border-[#2DE3A7] bg-[#2DE3A7] text-[#0C1311]"
                                                : current
                                                  ? "border-[#2DE3A7] bg-white text-[#0C1311]"
                                                  : "border-gray-200 bg-white text-gray-300"
                                        }`}
                                    >
                                        {done ? (
                                            <Check className="h-4 w-4" strokeWidth={3} />
                                        ) : (
                                            <span className="text-xs font-bold">{i + 1}</span>
                                        )}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {step.label}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {step.description}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                )}
                {(order.courier ||
                    order.tracking_code ||
                    order.consignment_id) && (
                    <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50/80 p-4 sm:p-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Courier details
                        </p>
                        <dl className="mt-3 space-y-2 text-sm">
                            {order.courier && (
                                <div className="flex flex-wrap gap-2">
                                    <dt className="font-medium text-gray-600">Courier</dt>
                                    <dd className="capitalize text-gray-900">
                                        {order.courier}
                                    </dd>
                                </div>
                            )}
                            {order.tracking_code && (
                                <div className="flex flex-wrap gap-2">
                                    <dt className="font-medium text-gray-600">
                                        Tracking code
                                    </dt>
                                    <dd className="font-mono text-gray-900">
                                        {order.tracking_code}
                                    </dd>
                                </div>
                            )}
                            {order.consignment_id && (
                                <div className="flex flex-wrap gap-2">
                                    <dt className="font-medium text-gray-600">
                                        Consignment ID
                                    </dt>
                                    <dd className="font-mono text-gray-900">
                                        {order.consignment_id}
                                    </dd>
                                </div>
                            )}
                        </dl>
                        <p className="mt-3 text-xs text-gray-500">
                            Use the tracking or consignment reference on your courier’s
                            website or app for live parcel status.
                        </p>
                    </div>
                )}
                {!terminal &&
                    !order.courier &&
                    !order.tracking_code &&
                    !order.consignment_id &&
                    order.status !== "completed" && (
                        <p className="text-sm text-gray-500">
                            Courier details will appear here once your order is shipped.
                        </p>
                    )}
            </section>

            <section>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#0C1311]">
                    <Package className="h-5 w-5 text-[#2DE3A7]" />
                    Items
                </h2>
                <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
                    {order.items?.map((item) => (
                        <li
                            key={item.id}
                            className="flex gap-4 p-4 first:rounded-t-2xl last:rounded-b-2xl"
                        >
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                {item.product?.images?.[0] ? (
                                    <img
                                        src={getAssetUrl(item.product.images[0])}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : null}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-medium text-gray-900">
                                    {item.product?.name ?? "Product"}
                                </p>
                                {item.variation_ids &&
                                    item.variation_ids.length > 0 &&
                                    item.product?.product_variations && (
                                        <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                                            {item.variation_ids.map((vid) => {
                                                const v =
                                                    item.product?.product_variations?.find(
                                                        (x) => x.id === vid
                                                    );
                                                if (!v) return null;
                                                return (
                                                    <div key={vid}>
                                                        <span className="font-medium">
                                                            {v.product_attribute?.name ??
                                                                "Option"}
                                                            :
                                                        </span>{" "}
                                                        {v.value}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                <p className="mt-1 text-sm text-gray-500">
                                    Qty {item.quantity} × ৳{item.price}
                                </p>
                            </div>
                            <p className="shrink-0 font-semibold text-gray-900">
                                ৳{item.price * item.quantity}
                            </p>
                        </li>
                    ))}
                </ul>

                <div className="mt-6 space-y-2 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>৳{order.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Delivery</span>
                        <span>৳{order.delivery_cost}</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-[#0C1311]">
                        <span>Total</span>
                        <span>৳{order.total}</span>
                    </div>
                </div>
            </section>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                }
            `}</style>
        </CustomerAccountLayout>
    );
}
