import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import DateRangeFilter from "@/Components/Reports/DateRangeFilter";
import KpiCard from "@/Components/Reports/KpiCard";
import { ChartTooltip, CHART_COLORS, GRID_COLOR, AXIS_COLOR } from "@/Components/Reports/ChartTooltip";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MapPin, Package, Globe, TrendingUp } from "lucide-react";

interface LocationRow { location: string; orders: number; revenue: number; pct: number }

interface Props {
    filters: { preset: string; start_date?: string; end_date?: string };
    kpis: { total_orders: number; unique_locations: number; top_location: string; top_pct: number };
    charts: { by_location: LocationRow[] };
    location_table: LocationRow[];
}

const fmt = (n: number) => n.toLocaleString("en-US");

export default function Geography({ filters, kpis, charts, location_table }: Props) {
    return (
        <Master title="Geography" head={<Header title="Geography Report" showUserMenu />}>
            <div className="space-y-6">
                <DateRangeFilter routeName="admin.reports.geography" filters={filters} />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Total Orders"     value={fmt(kpis.total_orders)}      Icon={Package}    accent="green" />
                    <KpiCard label="Locations"        value={fmt(kpis.unique_locations)}  Icon={Globe}      accent="blue" />
                    <KpiCard label="Top Location"     value={kpis.top_location}           Icon={MapPin}     accent="amber" />
                    <KpiCard label="Top Location Share" value={`${kpis.top_pct}%`}        Icon={TrendingUp} accent="purple" />
                </div>

                {/* Top locations chart */}
                <Card padding="none" className="p-5">
                    <p className="text-sm font-semibold text-white mb-4">Top 10 Locations by Orders</p>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={charts.by_location} layout="vertical" barSize={14}>
                            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
                            <XAxis type="number" tick={{ fill: AXIS_COLOR, fontSize: 11 }} allowDecimals={false} />
                            <YAxis dataKey="location" type="category" width={120}
                                tick={{ fill: AXIS_COLOR, fontSize: 10 }}
                                tickFormatter={(v) => v.length > 16 ? v.slice(0, 15) + "…" : v} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="orders" name="Orders" fill={CHART_COLORS.green} radius={[0, 3, 3, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Full location table */}
                <Card padding="none" className="overflow-hidden">
                    <div className="p-4 border-b border-[#1E2826]">
                        <p className="text-sm font-semibold text-white">All Locations</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-[#1E2826]">
                                    <th className="text-left px-4 py-3">#</th>
                                    <th className="text-left px-4 py-3">Location</th>
                                    <th className="text-right px-4 py-3">Orders</th>
                                    <th className="text-right px-4 py-3">Revenue</th>
                                    <th className="text-right px-4 py-3">Share</th>
                                </tr>
                            </thead>
                            <tbody>
                                {location_table.length === 0 && (
                                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No orders for this period</td></tr>
                                )}
                                {location_table.map((row, i) => (
                                    <tr key={i} className="border-b border-[#1E2826]/50 hover:bg-[#0F1A18]">
                                        <td className="px-4 py-3 text-gray-500 text-xs">{i + 1}</td>
                                        <td className="px-4 py-3 flex items-center gap-2">
                                            <MapPin size={12} className="text-gray-600 shrink-0" />
                                            <span className="text-gray-200">{row.location}</span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-white font-medium">{fmt(row.orders)}</td>
                                        <td className="px-4 py-3 text-right text-[#2DE3A7] font-medium">৳ {fmt(row.revenue)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-16 bg-[#1E2826] rounded-full h-1.5 overflow-hidden">
                                                    <div className="h-full bg-[#2DE3A7] rounded-full"
                                                        style={{ width: `${Math.min(row.pct, 100)}%` }} />
                                                </div>
                                                <span className="text-gray-400 text-xs w-8 text-right">{row.pct}%</span>
                                            </div>
                                        </td>
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
