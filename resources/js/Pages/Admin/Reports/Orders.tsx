import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import DateRangeFilter from "@/Components/Reports/DateRangeFilter";
import KpiCard from "@/Components/Reports/KpiCard";
import { ChartTooltip, CHART_COLORS, GRID_COLOR, AXIS_COLOR, PIE_COLORS } from "@/Components/Reports/ChartTooltip";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from "recharts";
import { Package, CheckCircle, XCircle, Clock, RotateCcw, AlertTriangle } from "lucide-react";

interface StatusRow { name: string; value: number; pct: number; [key: string]: unknown }
interface DailyRow  { date: string; orders: number; completed: number; cancelled: number }

interface Props {
    filters: { preset: string; start_date?: string; end_date?: string };
    kpis: { total: number; completed: number; cancelled: number; pending: number; returned: number; cancel_rate: number };
    charts: { status_data: StatusRow[]; daily_data: DailyRow[] };
}

export default function Orders({ filters, kpis, charts }: Props) {
    return (
        <Master title="Orders" head={<Header title="Orders Report" showUserMenu />}>
            <div className="space-y-6">
                <DateRangeFilter routeName="admin.reports.orders" filters={filters} />

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                    <KpiCard label="Total Orders" value={kpis.total.toLocaleString()}     Icon={Package}       accent="green" />
                    <KpiCard label="Completed"    value={kpis.completed.toLocaleString()} Icon={CheckCircle}   accent="green" />
                    <KpiCard label="Pending"      value={kpis.pending.toLocaleString()}   Icon={Clock}         accent="amber" />
                    <KpiCard label="Cancelled"    value={kpis.cancelled.toLocaleString()} Icon={XCircle}       accent="red" />
                    <KpiCard label="Returned"     value={kpis.returned.toLocaleString()}  Icon={RotateCcw}     accent="purple" />
                    <KpiCard label="Cancel Rate"  value={`${kpis.cancel_rate}%`}          Icon={AlertTriangle} accent="red" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Daily volume */}
                    <Card padding="none" className="lg:col-span-2 p-5">
                        <p className="text-sm font-semibold text-white mb-4">Daily Order Volume</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={charts.daily_data} barSize={10}>
                                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                                <XAxis dataKey="date" tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                                <YAxis tick={{ fill: AXIS_COLOR, fontSize: 11 }} allowDecimals={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: AXIS_COLOR }} />
                                <Bar dataKey="completed" name="Completed" stackId="a" fill={CHART_COLORS.green}  radius={[0, 0, 0, 0]} />
                                <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill={CHART_COLORS.red}    radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Status donut */}
                    <Card padding="none" className="p-5">
                        <p className="text-sm font-semibold text-white mb-4">Status Distribution</p>
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie data={charts.status_data} dataKey="value" nameKey="name"
                                    cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                                    {charts.status_data.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<ChartTooltip formatter={(v, n) => `${v} (${charts.status_data.find(s => s.name === n)?.pct ?? 0}%)`} />} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: AXIS_COLOR }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Status breakdown table */}
                <Card padding="none" className="overflow-hidden">
                    <div className="p-4 border-b border-[#1E2826]">
                        <p className="text-sm font-semibold text-white">Status Breakdown</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-[#1E2826]">
                                    <th className="text-left px-4 py-3">Status</th>
                                    <th className="text-right px-4 py-3">Orders</th>
                                    <th className="text-right px-4 py-3">Share</th>
                                </tr>
                            </thead>
                            <tbody>
                                {charts.status_data.map((row, i) => (
                                    <tr key={i} className="border-b border-[#1E2826]/50 hover:bg-[#0F1A18]">
                                        <td className="px-4 py-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                                            <span className="text-gray-300">{row.name}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-white font-medium">{row.value.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right text-gray-400">{row.pct}%</td>
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
