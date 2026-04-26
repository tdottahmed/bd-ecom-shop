import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import DateRangeFilter from "@/Components/Reports/DateRangeFilter";
import KpiCard from "@/Components/Reports/KpiCard";
import { ChartTooltip, CHART_COLORS, GRID_COLOR, AXIS_COLOR } from "@/Components/Reports/ChartTooltip";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Users, UserPlus, RefreshCw, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

interface DayRow { date: string; customers: number; orders: number }
interface CustomerRow { name: string; phone: string; orders: number; revenue: number; aov: number }

interface Props {
    filters: { preset: string; start_date?: string; end_date?: string };
    kpis: { total: number; new: number; returning: number; return_rate: number; total_orders: number; avg_ltv: number };
    charts: { new_per_day: DayRow[] };
    top_customers: CustomerRow[];
}

const fmt = (n: number) => n.toLocaleString("en-US");

export default function Customers({ filters, kpis, charts, top_customers }: Props) {
    return (
        <Master title="Customers" head={<Header title="Customers Report" showUserMenu />}>
            <div className="space-y-6">
                <DateRangeFilter routeName="admin.reports.customers" filters={filters} />

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                    <KpiCard label="Unique Customers" value={fmt(kpis.total)}        Icon={Users}       accent="green" />
                    <KpiCard label="New Customers"    value={fmt(kpis.new)}          Icon={UserPlus}    accent="blue" />
                    <KpiCard label="Returning"        value={fmt(kpis.returning)}    Icon={RefreshCw}   accent="purple" />
                    <KpiCard label="Return Rate"      value={`${kpis.return_rate}%`} Icon={TrendingUp}  accent="amber" />
                    <KpiCard label="Total Orders"     value={fmt(kpis.total_orders)} Icon={ShoppingCart} accent="gray" />
                    <KpiCard label="Avg Lifetime Val" value={`৳ ${fmt(kpis.avg_ltv)}`} Icon={DollarSign} accent="green" />
                </div>

                {/* Customer activity trend */}
                <Card padding="none" className="p-5">
                    <p className="text-sm font-semibold text-white mb-4">Customer Activity</p>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={charts.new_per_day}>
                            <defs>
                                <linearGradient id="custG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor={CHART_COLORS.green} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="ordG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor={CHART_COLORS.blue} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                            <XAxis dataKey="date" tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                            <YAxis tick={{ fill: AXIS_COLOR, fontSize: 11 }} allowDecimals={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: AXIS_COLOR }} />
                            <Area type="monotone" dataKey="customers" name="Customers"
                                stroke={CHART_COLORS.green} fill="url(#custG)" strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="orders" name="Orders"
                                stroke={CHART_COLORS.blue}  fill="url(#ordG)"  strokeWidth={2} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* Top customers table */}
                <Card padding="none" className="overflow-hidden">
                    <div className="p-4 border-b border-[#1E2826]">
                        <p className="text-sm font-semibold text-white">Top Customers by Spend</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-[#1E2826]">
                                    <th className="text-left px-4 py-3">#</th>
                                    <th className="text-left px-4 py-3">Customer</th>
                                    <th className="text-left px-4 py-3">Phone</th>
                                    <th className="text-right px-4 py-3">Orders</th>
                                    <th className="text-right px-4 py-3">Revenue</th>
                                    <th className="text-right px-4 py-3">AOV</th>
                                </tr>
                            </thead>
                            <tbody>
                                {top_customers.length === 0 && (
                                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">No customers for this period</td></tr>
                                )}
                                {top_customers.map((c, i) => (
                                    <tr key={i} className="border-b border-[#1E2826]/50 hover:bg-[#0F1A18]">
                                        <td className="px-4 py-3 text-gray-500 text-xs">{i + 1}</td>
                                        <td className="px-4 py-3 text-gray-200">{c.name}</td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">{c.phone}</td>
                                        <td className="px-4 py-3 text-right text-gray-300">{c.orders}</td>
                                        <td className="px-4 py-3 text-right text-[#2DE3A7] font-medium">৳ {fmt(c.revenue)}</td>
                                        <td className="px-4 py-3 text-right text-gray-400">৳ {fmt(c.aov)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </Master>
    );
}
