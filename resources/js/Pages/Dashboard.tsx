import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { formatPrice } from "@/Utils/helpers";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
    TrendingUp, DollarSign, ShoppingBag, Clock,
    CheckCircle, XCircle, ArrowUpRight, Calendar,
} from "lucide-react";

interface RecentOrder {
    id: number;
    customer_name: string;
    customer_phone: string;
    total: number;
    status: string;
    created_at: string;
}

interface DashboardProps {
    metrics: {
        total_sell: number;
        profit: number;
        completed_sell: number;
        completed_profit: number;
        total_orders: number;
        completed_orders: number;
        canceled_orders: number;
        pending_orders: number;
        avg_order_value: number;
    };
    charts: {
        sales_trend: { date: string; sales: number; profit: number }[];
        order_status: { name: string; value: number }[];
    };
    recent_orders: RecentOrder[];
    filters: {
        date_range: string;
        start_date: string | null;
        end_date: string | null;
    };
}

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
    pending:    { label: "Pending",    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    processing: { label: "Processing", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    shipped:    { label: "Shipped",    cls: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    completed:  { label: "Completed",  cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    cancelled:  { label: "Cancelled",  cls: "bg-red-500/10 text-red-400 border-red-500/20" },
};

const StatusBadge = ({ status }: { status: string }) => {
    const cfg = STATUS_CONFIG[status.toLowerCase()] ?? { label: status, cls: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.cls}`}>
            {cfg.label}
        </span>
    );
};

const PIE_COLORS: Record<string, string> = {
    Completed:  "#2DE3A7",
    Cancelled:  "#f87171",
    Pending:    "#fbbf24",
    Processing: "#60a5fa",
    Shipped:    "#c084fc",
};

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
    label: string;
    value: string | number;
    sub?: string;
    icon: React.ReactNode;
    accent: string;
}

const KpiCard = ({ label, value, sub, icon, accent }: KpiCardProps) => (
    <div className="bg-[#0b1818] border border-[#1E2826] rounded-2xl p-5 flex items-start gap-4">
        <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${accent}`}>
            {icon}
        </div>
        <div className="min-w-0">
            <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">{label}</p>
            <p className="text-white text-2xl font-bold mt-0.5 truncate">{value}</p>
            {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
        </div>
    </div>
);

// ─── Stat Pill ────────────────────────────────────────────────────────────────

const StatPill = ({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) => (
    <div className="bg-[#0b1818] border border-[#1E2826] rounded-xl px-4 py-3 flex items-center gap-3">
        <span className={`shrink-0 ${color}`}>{icon}</span>
        <div>
            <p className="text-white text-lg font-semibold">{value}</p>
            <p className="text-gray-500 text-xs">{label}</p>
        </div>
    </div>
);

// ─── Chart tooltip ────────────────────────────────────────────────────────────

const tooltipStyle = {
    contentStyle: { backgroundColor: "#0b1818", borderColor: "#1E2826", color: "#fff", fontSize: "12px", borderRadius: "8px" },
    itemStyle: { color: "#fff" },
};

// ─── Date range options ───────────────────────────────────────────────────────

const DATE_OPTIONS = [
    { value: "today",         label: "Today" },
    { value: "yesterday",     label: "Yesterday" },
    { value: "last_week",     label: "Last 7 days" },
    { value: "last_month",    label: "Last 30 days" },
    { value: "last_6_months", label: "Last 6 months" },
    { value: "last_year",     label: "Last year" },
    { value: "all",           label: "All time" },
    { value: "custom",        label: "Custom range" },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Dashboard({ metrics, charts, recent_orders, filters }: DashboardProps) {
    const [dateRange, setDateRange]       = useState(filters?.date_range ?? "all");
    const [startDate, setStartDate]       = useState(filters?.start_date ?? "");
    const [endDate, setEndDate]           = useState(filters?.end_date ?? "");
    const [showCustom, setShowCustom]     = useState(filters?.date_range === "custom");

    const navigate = (params: Record<string, string>) =>
        router.get(route("admin.dashboard"), params, { preserveState: true, preserveScroll: true });

    const handleRangeChange = (range: string) => {
        setDateRange(range);
        if (range === "custom") { setShowCustom(true); return; }
        setShowCustom(false);
        navigate({ date_range: range });
    };

    const applyCustom = () => {
        if (startDate && endDate) navigate({ date_range: "custom", start_date: startDate, end_date: endDate });
    };

    const profitMargin = metrics.total_sell > 0
        ? ((metrics.profit / metrics.total_sell) * 100).toFixed(1)
        : "0";

    const completionRate = metrics.total_orders > 0
        ? ((metrics.completed_orders / metrics.total_orders) * 100).toFixed(1)
        : "0";

    return (
        <Master title="Dashboard" head={<Header title="Dashboard" showUserMenu={true} />}>
            <div className="p-4 md:p-6 space-y-6">

                {/* ── Filter Bar ── */}
                <div className="bg-[#0b1818] border border-[#1E2826] rounded-2xl px-4 py-3 space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="shrink-0 text-gray-500 text-xs font-medium uppercase tracking-widest">
                            Period
                        </span>

                        {/* Pill group — scrollable on mobile */}
                        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
                            {DATE_OPTIONS.filter((o) => o.value !== "custom").map((o) => (
                                <button
                                    key={o.value}
                                    type="button"
                                    onClick={() => handleRangeChange(o.value)}
                                    className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                                        dateRange === o.value && !showCustom
                                            ? "bg-[#2DE3A7] text-black shadow-[0_0_12px_rgba(45,227,167,0.25)]"
                                            : "bg-[#0C1311] text-gray-400 border border-[#1E2826] hover:text-white hover:border-[#2DE3A7]/40"
                                    }`}
                                >
                                    {o.label}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => handleRangeChange("custom")}
                                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 ${
                                    showCustom
                                        ? "bg-[#2DE3A7] text-black shadow-[0_0_12px_rgba(45,227,167,0.25)]"
                                        : "bg-[#0C1311] text-gray-400 border border-[#1E2826] hover:text-white hover:border-[#2DE3A7]/40"
                                }`}
                            >
                                <Calendar size={11} />
                                Custom
                            </button>
                        </div>
                    </div>

                    {/* Custom date row — slides in */}
                    {showCustom && (
                        <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-[#1E2826]">
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 text-xs">From</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-[#0C1311] border border-[#1E2826] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#2DE3A7]/60 [color-scheme:dark]"
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 text-xs">To</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-[#0C1311] border border-[#1E2826] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#2DE3A7]/60 [color-scheme:dark]"
                                />
                            </div>
                            <button
                                onClick={applyCustom}
                                disabled={!startDate || !endDate}
                                className="px-4 py-2 bg-[#2DE3A7] hover:bg-[#24c490] disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-semibold rounded-lg transition-colors"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>

                {/* ── KPI Cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <KpiCard
                        label="Total Revenue"
                        value={formatPrice(metrics.total_sell)}
                        sub={`Avg ${formatPrice(metrics.avg_order_value)} / order`}
                        icon={<TrendingUp size={20} className="text-[#2DE3A7]" />}
                        accent="bg-[#2DE3A7]/10"
                    />
                    <KpiCard
                        label="Net Profit"
                        value={formatPrice(metrics.profit)}
                        sub={`${profitMargin}% margin`}
                        icon={<DollarSign size={20} className="text-blue-400" />}
                        accent="bg-blue-500/10"
                    />
                    <KpiCard
                        label="Total Orders"
                        value={metrics.total_orders.toLocaleString()}
                        sub={`${completionRate}% completion rate`}
                        icon={<ShoppingBag size={20} className="text-purple-400" />}
                        accent="bg-purple-500/10"
                    />
                    <KpiCard
                        label="Pending Orders"
                        value={metrics.pending_orders.toLocaleString()}
                        sub="Awaiting action"
                        icon={<Clock size={20} className="text-amber-400" />}
                        accent="bg-amber-500/10"
                    />
                </div>

                {/* ── Secondary Stats ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatPill
                        label="Completed Orders"
                        value={metrics.completed_orders.toLocaleString()}
                        icon={<CheckCircle size={18} />}
                        color="text-emerald-400"
                    />
                    <StatPill
                        label="Cancelled Orders"
                        value={metrics.canceled_orders.toLocaleString()}
                        icon={<XCircle size={18} />}
                        color="text-red-400"
                    />
                    <StatPill
                        label="Completed Revenue"
                        value={formatPrice(metrics.completed_sell)}
                        icon={<TrendingUp size={18} />}
                        color="text-[#2DE3A7]"
                    />
                    <StatPill
                        label="Completed Profit"
                        value={formatPrice(metrics.completed_profit)}
                        icon={<DollarSign size={18} />}
                        color="text-blue-400"
                    />
                </div>

                {/* ── Charts ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Sales & Profit Trend */}
                    <div className="lg:col-span-2 bg-[#0b1818] border border-[#1E2826] rounded-2xl p-5">
                        <h3 className="text-white text-base font-semibold mb-4">Sales & Profit Trend</h3>
                        <div className="h-64 md:h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={charts.sales_trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="gSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2DE3A7" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#2DE3A7" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.25} />
                                            <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2826" vertical={false} />
                                    <XAxis
                                        dataKey="date" stroke="#4b5563" tick={{ fontSize: 11 }}
                                        tickFormatter={(v) => v.split("-").slice(1).join("/")}
                                    />
                                    <YAxis stroke="#4b5563" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                                    <Tooltip {...tooltipStyle} formatter={(v: number) => formatPrice(v)} />
                                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                                    <Area type="monotone" dataKey="sales"  name="Sales"  stroke="#2DE3A7" strokeWidth={2} fillOpacity={1} fill="url(#gSales)" />
                                    <Area type="monotone" dataKey="profit" name="Profit" stroke="#60a5fa" strokeWidth={2} fillOpacity={1} fill="url(#gProfit)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Status Donut */}
                    <div className="bg-[#0b1818] border border-[#1E2826] rounded-2xl p-5">
                        <h3 className="text-white text-base font-semibold mb-4">Order Status</h3>
                        <div className="h-64 md:h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.order_status}
                                        cx="50%" cy="45%"
                                        innerRadius={55} outerRadius={85}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {charts.order_status.map((entry, i) => (
                                            <Cell
                                                key={i}
                                                fill={PIE_COLORS[entry.name] ?? "#6b7280"}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip {...tooltipStyle} />
                                    <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* ── Recent Orders ── */}
                <div className="bg-[#0b1818] border border-[#1E2826] rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2826]">
                        <h3 className="text-white text-base font-semibold">Recent Orders</h3>
                        <a
                            href={route("admin.orders.index")}
                            className="text-[#2DE3A7] text-xs font-medium flex items-center gap-1 hover:opacity-80"
                        >
                            View all <ArrowUpRight size={14} />
                        </a>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#1E2826]">
                                    {["Order", "Customer", "Phone", "Total", "Status", "Date"].map((h) => (
                                        <th key={h} className="text-left text-gray-500 text-xs font-medium uppercase tracking-wide px-5 py-3">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1E2826]">
                                {recent_orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center text-gray-500 py-8">No orders yet</td>
                                    </tr>
                                ) : recent_orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-[#0f1e1c] transition-colors">
                                        <td className="px-5 py-3.5">
                                            <a
                                                href={route("admin.orders.show", order.id)}
                                                className="text-[#2DE3A7] font-medium hover:underline"
                                            >
                                                #{order.id}
                                            </a>
                                        </td>
                                        <td className="px-5 py-3.5 text-white font-medium">{order.customer_name}</td>
                                        <td className="px-5 py-3.5 text-gray-400">{order.customer_phone}</td>
                                        <td className="px-5 py-3.5 text-white font-semibold">{formatPrice(order.total)}</td>
                                        <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                                        <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">
                                            {new Date(order.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </Master>
    );
}
