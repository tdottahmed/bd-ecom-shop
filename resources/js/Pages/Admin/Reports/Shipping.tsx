import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import DateRangeFilter from "@/Components/Reports/DateRangeFilter";
import KpiCard from "@/Components/Reports/KpiCard";
import {
    ChartTooltip,
    CHART_COLORS,
    GRID_COLOR,
    AXIS_COLOR,
} from "@/Components/Reports/ChartTooltip";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import {
    Truck,
    DollarSign,
    CreditCard,
    Banknote,
    Package,
    TrendingUp,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    Copy,
    Check,
} from "lucide-react";
import { Order, PaginatedData } from "@/types";

interface CourierRow {
    name: string;
    orders: number;
    revenue: number;
}
interface SplitRow {
    name: string;
    value: number;
    [key: string]: unknown;
}

interface Props {
    filters: {
        preset: string;
        start_date?: string;
        end_date?: string;
        courier?: string;
    };
    kpis: {
        total_orders: number;
        total_delivery: number;
        cod_orders: number;
        prepaid_orders: number;
        avg_delivery: number;
        cod_pct: number;
    };
    charts: { by_courier: CourierRow[]; payment_split: SplitRow[] };
    courier_orders: PaginatedData<Order>;
}

const fmt = (n: number) => n.toLocaleString("en-US");

const STATUSES = [
    "pending",
    "unreachable",
    "preparing",
    "shipping",
    "completed",
    "cancelled",
    "returned",
];

const STATUS_STYLES: Record<string, string> = {
    pending:     "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    unreachable: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    preparing:   "bg-blue-500/10  text-blue-400  border-blue-500/20",
    shipping:    "bg-purple-500/10 text-purple-400 border-purple-500/20",
    completed:   "bg-green-500/10 text-green-400  border-green-500/20",
    cancelled:   "bg-red-500/10   text-red-400    border-red-500/20",
    returned:    "bg-gray-500/10  text-gray-400   border-gray-500/20",
};

const COURIER_STYLES: Record<string, string> = {
    steadfast: "bg-blue-500/10  text-blue-400  border-blue-500/20",
    pathao:    "bg-green-500/10 text-green-400 border-green-500/20",
    carrybee:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
    manual:    "bg-gray-500/10  text-gray-400  border-gray-500/20",
};

const COURIER_OPTIONS = [
    { value: "all",       label: "All Orders" },
    { value: "steadfast", label: "Steadfast" },
    { value: "pathao",    label: "Pathao" },
    { value: "carrybee",  label: "CarryBee" },
    { value: "manual",    label: "Manual / None" },
];

function StatusBadge({ status }: { status: string }) {
    const cls =
        STATUS_STYLES[status] ??
        "bg-gray-500/10 text-gray-400 border-gray-500/20";
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${cls}`}
        >
            {status}
        </span>
    );
}

function CourierBadge({ courier }: { courier: string | null | undefined }) {
    const key = courier ?? "manual";
    const cls =
        COURIER_STYLES[key] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20";
    return (
        <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${cls}`}
        >
            {courier ? courier.charAt(0).toUpperCase() + courier.slice(1) : "Manual"}
        </span>
    );
}

function CopyBtn({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button
            onClick={() => {
                navigator.clipboard.writeText(value);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            }}
            className="text-gray-600 hover:text-gray-400 transition-colors"
            title="Copy"
        >
            {copied ? (
                <Check className="w-3 h-3 text-green-400" />
            ) : (
                <Copy className="w-3 h-3" />
            )}
        </button>
    );
}

export default function Shipping({ filters, kpis, charts, courier_orders }: Props) {
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [syncingId,  setSyncingId]  = useState<number | null>(null);
    const [syncLabels, setSyncLabels] = useState<Record<number, string>>({});

    const activeCourier = filters.courier ?? "all";

    const handleCourierFilter = (value: string) => {
        router.get(
            route("admin.reports.shipping"),
            {
                date_range:  filters.preset,
                start_date:  filters.start_date,
                end_date:    filters.end_date,
                courier:     value === "all" ? undefined : value,
            },
            { preserveScroll: true }
        );
    };

    const updateStatus = (orderId: number, newStatus: string) => {
        setUpdatingId(orderId);
        router.post(
            route("admin.orders.update-status", orderId),
            { status: newStatus },
            {
                preserveScroll: true,
                onFinish: () => setUpdatingId(null),
            }
        );
    };

    const syncStatus = async (order: Order) => {
        setSyncingId(order.id);
        try {
            const token =
                (document.head.querySelector(
                    'meta[name="csrf-token"]'
                ) as HTMLMetaElement | null)?.content ?? "";

            const res = await fetch(
                route("admin.orders.sync-status", order.id),
                {
                    method: "POST",
                    headers: {
                        "X-CSRF-TOKEN": token,
                        Accept: "application/json",
                    },
                }
            );
            const data = await res.json();

            if (data.delivery_status) {
                setSyncLabels((prev) => ({
                    ...prev,
                    [order.id]: data.delivery_status,
                }));
            }
            if (data.updated) {
                router.reload({ only: ["courier_orders"] });
            }
        } catch {
            // silently fail
        } finally {
            setSyncingId(null);
        }
    };

    return (
        <Master
            title="Shipping & Delivery"
            head={<Header title="Shipping & Delivery" showUserMenu />}
        >
            <div className="space-y-6">
                <DateRangeFilter
                    routeName="admin.reports.shipping"
                    filters={filters}
                />

                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                    <KpiCard label="Total Orders"     value={fmt(kpis.total_orders)}                  Icon={Package}    accent="green"  />
                    <KpiCard label="Delivery Revenue" value={`৳ ${fmt(kpis.total_delivery)}`}         Icon={DollarSign} accent="blue"   />
                    <KpiCard label="COD Orders"       value={fmt(kpis.cod_orders)}                    Icon={Banknote}   accent="amber"  />
                    <KpiCard label="Prepaid Orders"   value={fmt(kpis.prepaid_orders)}                Icon={CreditCard} accent="purple" />
                    <KpiCard label="Avg Delivery Fee" value={`৳ ${fmt(kpis.avg_delivery)}`}           Icon={Truck}      accent="gray"   />
                    <KpiCard label="COD Share"        value={`${kpis.cod_pct}%`}                      Icon={TrendingUp} accent="amber"  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card padding="none" className="p-5">
                        <p className="text-sm font-semibold text-white mb-4">
                            Orders by Courier
                        </p>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={charts.by_courier} barSize={22}>
                                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                                <XAxis dataKey="name" tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                                <YAxis tick={{ fill: AXIS_COLOR, fontSize: 11 }} allowDecimals={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: AXIS_COLOR }} />
                                <Bar dataKey="orders" name="Orders" fill={CHART_COLORS.green} radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    <Card padding="none" className="p-5">
                        <p className="text-sm font-semibold text-white mb-4">
                            Payment Method Split
                        </p>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={charts.payment_split}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    paddingAngle={4}
                                >
                                    <Cell fill={CHART_COLORS.amber} />
                                    <Cell fill={CHART_COLORS.blue} />
                                </Pie>
                                <Tooltip content={<ChartTooltip />} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: 12, color: AXIS_COLOR }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* ── Courier Orders Table ───────────────────────────────────── */}
                <Card padding="none" className="overflow-hidden">
                    {/* Table header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#1E2826]">
                        <div className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-[#2DE3A7]" />
                            <p className="text-sm font-semibold text-white">
                                Courier Orders
                            </p>
                            <span className="text-xs text-gray-500">
                                ({courier_orders.total} total)
                            </span>
                        </div>

                        {/* Courier filter tabs */}
                        <div className="flex flex-wrap gap-1">
                            {COURIER_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleCourierFilter(opt.value)}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                                        activeCourier === opt.value
                                            ? "bg-[#2DE3A7] text-[#0C1311]"
                                            : "bg-[#0E1614] border border-[#1E2826] text-gray-400 hover:text-white"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        {courier_orders.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-gray-500 gap-2">
                                <Package className="w-8 h-8 opacity-30" />
                                <p className="text-sm">No orders found for this filter.</p>
                            </div>
                        ) : (
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#1E2826] bg-[#0E1614]">
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium whitespace-nowrap">#</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium whitespace-nowrap">Customer</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium whitespace-nowrap">Courier</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium whitespace-nowrap">Consignment / Tracking</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium whitespace-nowrap">COD Amount</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium whitespace-nowrap">Delivery Fee</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium whitespace-nowrap">Payment</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium whitespace-nowrap">Status</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium whitespace-nowrap">Date</th>
                                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium whitespace-nowrap">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1E2826]">
                                    {courier_orders.data.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-[#0E1614] transition-colors group"
                                        >
                                            {/* Order ID */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <Link
                                                    href={route("admin.orders.show", order.id)}
                                                    className="text-[#2DE3A7] hover:underline font-mono text-xs font-semibold"
                                                >
                                                    #{order.id}
                                                </Link>
                                            </td>

                                            {/* Customer */}
                                            <td className="px-4 py-3">
                                                <p className="text-white text-xs font-medium truncate max-w-[130px]">
                                                    {order.customer_name ?? "—"}
                                                </p>
                                                <p className="text-gray-500 text-[11px] font-mono">
                                                    {order.customer_phone}
                                                </p>
                                            </td>

                                            {/* Courier badge */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <CourierBadge courier={order.courier} />
                                            </td>

                                            {/* Consignment / Tracking */}
                                            <td className="px-4 py-3">
                                                {order.consignment_id ? (
                                                    <div className="space-y-0.5">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[10px] text-gray-600 uppercase tracking-wide">
                                                                CID
                                                            </span>
                                                            <span className="text-xs text-gray-300 font-mono">
                                                                {order.consignment_id}
                                                            </span>
                                                            <CopyBtn value={order.consignment_id} />
                                                        </div>
                                                        {order.tracking_code && (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-[10px] text-gray-600 uppercase tracking-wide">
                                                                    TRK
                                                                </span>
                                                                <span className="text-xs text-[#2DE3A7] font-mono font-semibold">
                                                                    {order.tracking_code}
                                                                </span>
                                                                <CopyBtn value={order.tracking_code} />
                                                            </div>
                                                        )}
                                                        {syncLabels[order.id] && (
                                                            <span className="text-[10px] text-purple-400 italic">
                                                                Steadfast: {syncLabels[order.id]}
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-600 text-xs italic">
                                                        No consignment
                                                    </span>
                                                )}
                                            </td>

                                            {/* COD Amount */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-white text-xs font-semibold">
                                                    ৳{fmt(order.total)}
                                                </span>
                                            </td>

                                            {/* Delivery Fee */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-gray-400 text-xs">
                                                    ৳{fmt(order.delivery_cost)}
                                                </span>
                                            </td>

                                            {/* Payment method */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-xs text-gray-400 uppercase">
                                                    {order.payment_method ?? "—"}
                                                </span>
                                            </td>

                                            {/* Status with inline update */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <StatusBadge status={order.status} />
                                                    <select
                                                        value={order.status}
                                                        disabled={updatingId === order.id}
                                                        onChange={(e) =>
                                                            updateStatus(order.id, e.target.value)
                                                        }
                                                        className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-[11px] bg-[#1E2826] border border-[#2A3633] text-gray-300 rounded px-1.5 py-0.5 cursor-pointer focus:outline-none focus:border-[#2DE3A7]/50 disabled:cursor-not-allowed"
                                                    >
                                                        {STATUSES.map((s) => (
                                                            <option key={s} value={s}>
                                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {updatingId === order.id && (
                                                        <RefreshCw className="w-3 h-3 animate-spin text-gray-400" />
                                                    )}
                                                </div>
                                            </td>

                                            {/* Date */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="text-gray-500 text-xs">
                                                    {new Date(order.created_at).toLocaleDateString("en-GB", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    {order.courier === "steadfast" && order.consignment_id && (
                                                        <button
                                                            onClick={() => syncStatus(order)}
                                                            disabled={syncingId === order.id}
                                                            title="Sync status from Steadfast"
                                                            className="flex items-center gap-1 px-2 py-1 bg-blue-600/20 border border-blue-500/20 text-blue-400 rounded text-[11px] hover:bg-blue-600/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            <RefreshCw
                                                                className={`w-3 h-3 ${syncingId === order.id ? "animate-spin" : ""}`}
                                                            />
                                                            <span className="hidden sm:inline">Sync</span>
                                                        </button>
                                                    )}
                                                    <Link
                                                        href={route("admin.orders.show", order.id)}
                                                        title="View order"
                                                        className="flex items-center gap-1 px-2 py-1 bg-[#1E2826] border border-[#2A3633] text-gray-400 rounded text-[11px] hover:text-white transition-colors"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                        <span className="hidden sm:inline">View</span>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Pagination */}
                    {courier_orders.last_page > 1 && (
                        <div className="flex items-center justify-between px-5 py-3 border-t border-[#1E2826]">
                            <p className="text-xs text-gray-500">
                                Showing {courier_orders.from ?? 0}–{courier_orders.to ?? 0} of{" "}
                                {courier_orders.total}
                            </p>
                            <div className="flex items-center gap-1">
                                {courier_orders.prev_page_url && (
                                    <Link
                                        href={courier_orders.prev_page_url}
                                        preserveScroll
                                        className="flex items-center gap-1 px-3 py-1.5 bg-[#0E1614] border border-[#1E2826] text-gray-400 rounded text-xs hover:text-white hover:border-[#2DE3A7]/30 transition-colors"
                                    >
                                        <ChevronLeft className="w-3.5 h-3.5" />
                                        Prev
                                    </Link>
                                )}
                                <span className="px-3 py-1.5 text-xs text-gray-500">
                                    Page {courier_orders.current_page} / {courier_orders.last_page}
                                </span>
                                {courier_orders.next_page_url && (
                                    <Link
                                        href={courier_orders.next_page_url}
                                        preserveScroll
                                        className="flex items-center gap-1 px-3 py-1.5 bg-[#0E1614] border border-[#1E2826] text-gray-400 rounded text-xs hover:text-white hover:border-[#2DE3A7]/30 transition-colors"
                                    >
                                        Next
                                        <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </Master>
    );
}
