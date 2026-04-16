import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import DateRangeFilter from "@/Components/Reports/DateRangeFilter";
import KpiCard from "@/Components/Reports/KpiCard";
import { ChartTooltip, CHART_COLORS, GRID_COLOR, AXIS_COLOR, PIE_COLORS } from "@/Components/Reports/ChartTooltip";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
    TrendingUp, ShoppingCart, DollarSign, BarChart3,
    CheckCircle, XCircle, Clock,
} from "lucide-react";

interface Props {
    filters: { preset: string; start_date?: string; end_date?: string };
    kpis: {
        revenue: number; profit: number; orders: number; aov: number;
        completed: number; cancelled: number; pending: number;
    };
    charts: {
        revenue_trend: { date: string; revenue: number }[];
        order_status: { name: string; value: number }[];
    };
}

const fmt = (n: number) => n.toLocaleString("en-US");

export default function Overview({ filters, kpis, charts }: Props) {
    return (
        <Master title="Reports Overview" head={<Header title="Reports Overview" showUserMenu />}>
            <div className="space-y-6">
                <DateRangeFilter routeName="admin.reports.index" filters={filters} />

                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Total Revenue"    value={`৳ ${fmt(kpis.revenue)}`}   Icon={DollarSign}   accent="green" />
                    <KpiCard label="Gross Profit"     value={`৳ ${fmt(kpis.profit)}`}    Icon={TrendingUp}   accent="blue" />
                    <KpiCard label="Total Orders"     value={fmt(kpis.orders)}           Icon={ShoppingCart} accent="purple" />
                    <KpiCard label="Avg Order Value"  value={`৳ ${fmt(kpis.aov)}`}       Icon={BarChart3}    accent="amber" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <KpiCard label="Completed" value={fmt(kpis.completed)} Icon={CheckCircle} accent="green" />
                    <KpiCard label="Pending"   value={fmt(kpis.pending)}   Icon={Clock}       accent="amber" />
                    <KpiCard label="Cancelled" value={fmt(kpis.cancelled)} Icon={XCircle}     accent="red" />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Trend */}
                    <Card padding="none" className="lg:col-span-2 p-5">
                        <p className="text-sm font-semibold text-white mb-4">Revenue Trend</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={charts.revenue_trend}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor={CHART_COLORS.green} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                                <XAxis dataKey="date" tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                                <YAxis tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                                <Tooltip content={<ChartTooltip formatter={(v) => `৳ ${Number(v).toLocaleString()}`} />} />
                                <Area type="monotone" dataKey="revenue" name="Revenue"
                                    stroke={CHART_COLORS.green} fill="url(#revGrad)" strokeWidth={2} dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Order Status Donut */}
                    <Card padding="none" className="p-5">
                        <p className="text-sm font-semibold text-white mb-4">Order Status</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie data={charts.order_status} dataKey="value" nameKey="name"
                                    cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                                    {charts.order_status.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<ChartTooltip />} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: AXIS_COLOR }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </Master>
    );
}
