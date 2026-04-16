import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import DateRangeFilter from "@/Components/Reports/DateRangeFilter";
import KpiCard from "@/Components/Reports/KpiCard";
import { ChartTooltip, CHART_COLORS, GRID_COLOR, AXIS_COLOR } from "@/Components/Reports/ChartTooltip";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DollarSign, TrendingUp, ShoppingCart, BarChart3, CheckCircle } from "lucide-react";

interface DailyRow { date: string; revenue: number; profit: number; orders: number }

interface Props {
    filters: { preset: string; start_date?: string; end_date?: string };
    kpis: { revenue: number; profit: number; completed_revenue: number; orders: number; aov: number };
    charts: { daily: DailyRow[] };
}

const fmt = (n: number) => `৳ ${n.toLocaleString("en-US")}`;

export default function Sales({ filters, kpis, charts }: Props) {
    return (
        <Master title="Sales Performance" head={<Header title="Sales Performance" showUserMenu />}>
            <div className="space-y-6">
                <DateRangeFilter routeName="admin.reports.sales" filters={filters} />

                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <KpiCard label="Total Revenue"       value={fmt(kpis.revenue)}           Icon={DollarSign}  accent="green" />
                    <KpiCard label="Gross Profit"        value={fmt(kpis.profit)}            Icon={TrendingUp}  accent="blue" />
                    <KpiCard label="Completed Revenue"   value={fmt(kpis.completed_revenue)} Icon={CheckCircle} accent="purple" />
                    <KpiCard label="Active Orders"       value={kpis.orders.toLocaleString()} Icon={ShoppingCart} accent="amber" />
                    <KpiCard label="Avg Order Value"     value={fmt(kpis.aov)}               Icon={BarChart3}   accent="gray" />
                </div>

                {/* Revenue vs Profit trend */}
                <Card padding="none" className="p-5">
                    <p className="text-sm font-semibold text-white mb-4">Revenue vs Profit</p>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={charts.daily}>
                            <defs>
                                <linearGradient id="revG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor={CHART_COLORS.green} stopOpacity={0.25} />
                                    <stop offset="95%" stopColor={CHART_COLORS.green} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="profG" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%"  stopColor={CHART_COLORS.blue} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={CHART_COLORS.blue} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                            <XAxis dataKey="date" tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                            <YAxis tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                            <Tooltip content={<ChartTooltip formatter={(v) => `৳ ${Number(v).toLocaleString()}`} />} />
                            <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: AXIS_COLOR }} />
                            <Area type="monotone" dataKey="revenue" name="Revenue"
                                stroke={CHART_COLORS.green} fill="url(#revG)"  strokeWidth={2} dot={false} />
                            <Area type="monotone" dataKey="profit"  name="Profit"
                                stroke={CHART_COLORS.blue}  fill="url(#profG)" strokeWidth={2} dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </Card>

                {/* Daily orders bar */}
                <Card padding="none" className="p-5">
                    <p className="text-sm font-semibold text-white mb-4">Daily Orders</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={charts.daily} barSize={16}>
                            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                            <XAxis dataKey="date" tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                            <YAxis tick={{ fill: AXIS_COLOR, fontSize: 11 }} allowDecimals={false} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="orders" name="Orders" fill={CHART_COLORS.green} radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Daily breakdown table */}
                <Card padding="none" className="overflow-hidden">
                    <div className="p-4 border-b border-[#1E2826]">
                        <p className="text-sm font-semibold text-white">Daily Breakdown</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-[#1E2826]">
                                    <th className="text-left px-4 py-3">Date</th>
                                    <th className="text-right px-4 py-3">Revenue</th>
                                    <th className="text-right px-4 py-3">Profit</th>
                                    <th className="text-right px-4 py-3">Orders</th>
                                </tr>
                            </thead>
                            <tbody>
                                {charts.daily.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-8 text-gray-500">No data for this period</td></tr>
                                )}
                                {charts.daily.map((row, i) => (
                                    <tr key={i} className={`border-b border-[#1E2826]/50 hover:bg-[#0F1A18] transition-colors ${i % 2 === 0 ? "" : "bg-[#0E1614]/50"}`}>
                                        <td className="px-4 py-3 text-gray-300">{row.date}</td>
                                        <td className="px-4 py-3 text-right text-[#2DE3A7] font-medium">৳ {row.revenue.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right text-blue-400 font-medium">৳ {row.profit.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right text-gray-300">{row.orders}</td>
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
