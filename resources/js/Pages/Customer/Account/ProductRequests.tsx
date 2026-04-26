import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import { NewProductRequest, PaginatedData } from "@/types";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import {
    ClipboardList,
    ExternalLink,
    PackageSearch,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const STATUS_CONFIG = {
    pending: {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 ring-amber-600/20",
        dot: "bg-amber-400",
    },
    reviewing: {
        label: "Under Review",
        className: "bg-sky-50 text-sky-700 ring-sky-600/20",
        dot: "bg-sky-400",
    },
    approved: {
        label: "Approved",
        className: "bg-brand-success/10 text-brand-success ring-brand-success/20",
        dot: "bg-brand-success",
    },
    rejected: {
        label: "Rejected",
        className: "bg-red-50 text-red-700 ring-red-600/20",
        dot: "bg-red-400",
    },
} as const;

function StatusBadge({ status }: { status: NewProductRequest["status"] }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${cfg.className}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    );
}

export default function ProductRequests({
    productRequests,
}: {
    productRequests: PaginatedData<NewProductRequest>;
}) {
    const { data, links, meta } = productRequests as any;

    return (
        <CustomerAccountLayout title="Product Requests">
            <div className="space-y-6">
                {/* Header action */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {meta?.total ?? data.length} request
                        {(meta?.total ?? data.length) !== 1 ? "s" : ""} submitted
                    </p>
                    <Link
                        href={route("new-product-requests.create")}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0C1311] px-4 py-2.5 text-sm font-semibold text-[#2DE3A7] shadow-sm transition hover:bg-[#0C1311]/90"
                    >
                        <PackageSearch className="h-4 w-4" />
                        Request a Product
                    </Link>
                </div>

                {data.length > 0 ? (
                    <div className="space-y-3">
                        {data.map((req: NewProductRequest) => (
                            <div
                                key={req.id}
                                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:border-gray-200 hover:shadow-md sm:p-5"
                            >
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0C1311]/5 text-[#0C1311]">
                                            <ClipboardList className="h-5 w-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 leading-snug">
                                                {req.product_name}
                                            </p>
                                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                                                {req.category && (
                                                    <span>
                                                        Category: {req.category}
                                                    </span>
                                                )}
                                                <span>Qty: {req.quantity}</span>
                                                {req.budget && (
                                                    <span>
                                                        Budget: ৳
                                                        {Number(
                                                            req.budget
                                                        ).toLocaleString()}
                                                    </span>
                                                )}
                                                <span>
                                                    {format(
                                                        new Date(req.created_at),
                                                        "dd MMM yyyy"
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <StatusBadge status={req.status} />
                                </div>

                                {req.description && (
                                    <p className="mt-3 text-sm text-gray-500 line-clamp-2 pl-14">
                                        {req.description}
                                    </p>
                                )}

                                {req.admin_notes && (
                                    <div className="mt-3 ml-14 rounded-xl bg-[#2DE3A7]/8 border border-[#2DE3A7]/20 px-3 py-2.5">
                                        <p className="text-xs font-semibold text-[#0C1311] mb-0.5">
                                            Admin Note
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {req.admin_notes}
                                        </p>
                                    </div>
                                )}

                                {req.reference_url && (
                                    <div className="mt-3 pl-14">
                                        <a
                                            href={req.reference_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs text-[#0C1311] underline underline-offset-2 hover:text-[#2DE3A7] transition-colors"
                                        >
                                            <ExternalLink className="h-3 w-3" />
                                            View Reference
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0C1311]/5 mb-4">
                            <PackageSearch className="h-8 w-8 text-[#0C1311]/40" />
                        </div>
                        <p className="text-base font-semibold text-gray-700">
                            No product requests yet
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            Can't find what you're looking for? Request it!
                        </p>
                        <Link
                            href={route("new-product-requests.create")}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0C1311] px-5 py-2.5 text-sm font-semibold text-[#2DE3A7] transition hover:bg-[#0C1311]/90"
                        >
                            <PackageSearch className="h-4 w-4" />
                            Request a Product
                        </Link>
                    </div>
                )}

                {/* Pagination */}
                {links && links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 pt-2">
                        {links.map((link: any, i: number) => {
                            if (link.label.includes("Previous"))
                                return (
                                    <Link
                                        key={i}
                                        href={link.url ?? "#"}
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm transition ${link.url ? "hover:bg-gray-100 text-gray-700" : "opacity-30 cursor-not-allowed pointer-events-none text-gray-400"}`}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Link>
                                );
                            if (link.label.includes("Next"))
                                return (
                                    <Link
                                        key={i}
                                        href={link.url ?? "#"}
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm transition ${link.url ? "hover:bg-gray-100 text-gray-700" : "opacity-30 cursor-not-allowed pointer-events-none text-gray-400"}`}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                );
                            return (
                                <Link
                                    key={i}
                                    href={link.url ?? "#"}
                                    className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-medium transition ${link.active ? "bg-[#0C1311] text-[#2DE3A7]" : link.url ? "hover:bg-gray-100 text-gray-700" : "opacity-30 cursor-not-allowed pointer-events-none text-gray-400"}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </CustomerAccountLayout>
    );
}
