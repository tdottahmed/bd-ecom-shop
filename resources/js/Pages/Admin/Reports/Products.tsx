import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import DateRangeFilter from "@/Components/Reports/DateRangeFilter";
import KpiCard from "@/Components/Reports/KpiCard";
import { ChartTooltip, CHART_COLORS, GRID_COLOR, AXIS_COLOR } from "@/Components/Reports/ChartTooltip";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ShoppingBag, DollarSign, Package, ShoppingCart } from "lucide-react";

interface ProductRow { name: string; revenue: number; quantity: number; orders: number }
interface CatRow     { name: string; revenue: number; qty: number }

interface Props {
    filters: { preset: string; start_date?: string; end_date?: string };
    kpis: { total_sold: number; total_revenue: number; unique_products: number; total_orders: number };
    charts: { top_by_revenue: ProductRow[]; by_category: CatRow[] };
    top_products: ProductRow[];
}

const fmt = (n: number) => n.toLocaleString("en-US");

export default function Products({ filters, kpis, charts, top_products }: Props) {
    return (
        <Master title="Product Performance" head={<Header title="Product Performance" showUserMenu />}>
            <div className="space-y-6">
                <DateRangeFilter routeName="admin.reports.products" filters={filters} />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Items Sold"      value={fmt(kpis.total_sold)}       Icon={ShoppingBag}  accent="green" />
                    <KpiCard label="Product Revenue" value={`৳ ${fmt(kpis.total_revenue)}`} Icon={DollarSign} accent="blue" />
                    <KpiCard label="Products Sold"   value={fmt(kpis.unique_products)}  Icon={Package}      accent="purple" />
                    <KpiCard label="Orders"          value={fmt(kpis.total_orders)}     Icon={ShoppingCart} accent="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top by revenue */}
                    <Card padding="none" className="p-5">
                        <p className="text-sm font-semibold text-white mb-4">Top Products by Revenue</p>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={charts.top_by_revenue} layout="vertical" barSize={14}>
                                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
                                <XAxis type="number" tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                                <YAxis dataKey="name" type="category" width={110}
                                    tick={{ fill: AXIS_COLOR, fontSize: 10 }}
                                    tickFormatter={(v) => v.length > 14 ? v.slice(0, 13) + "…" : v} />
                                <Tooltip content={<ChartTooltip formatter={(v) => `৳ ${Number(v).toLocaleString()}`} />} />
                                <Bar dataKey="revenue" name="Revenue" fill={CHART_COLORS.green} radius={[0, 3, 3, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* By category */}
                    <Card padding="none" className="p-5">
                        <p className="text-sm font-semibold text-white mb-4">Revenue by Category</p>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={charts.by_category} layout="vertical" barSize={14}>
                                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
                                <XAxis type="number" tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                                <YAxis dataKey="name" type="category" width={110}
                                    tick={{ fill: AXIS_COLOR, fontSize: 10 }}
                                    tickFormatter={(v) => v.length > 14 ? v.slice(0, 13) + "…" : v} />
                                <Tooltip content={<ChartTooltip formatter={(v) => `৳ ${Number(v).toLocaleString()}`} />} />
                                <Bar dataKey="revenue" name="Revenue" fill={CHART_COLORS.blue} radius={[0, 3, 3, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </div>

                {/* Top products table */}
                <Card padding="none" className="overflow-hidden">
                    <div className="p-4 border-b border-[#1E2826]">
                        <p className="text-sm font-semibold text-white">Top Products</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-[#1E2826]">
                                    <th className="text-left px-4 py-3">#</th>
                                    <th className="text-left px-4 py-3">Product</th>
                                    <th className="text-right px-4 py-3">Revenue</th>
                                    <th className="text-right px-4 py-3">Qty</th>
                                    <th className="text-right px-4 py-3">Orders</th>
                                </tr>
                            </thead>
                            <tbody>
                                {top_products.length === 0 && (
                                    <tr><td colSpan={5} className="text-center py-8 text-gray-500">No sales data for this period</td></tr>
                                )}
                                {top_products.map((row, i) => (
                                    <tr key={i} className="border-b border-[#1E2826]/50 hover:bg-[#0F1A18] transition-colors">
                                        <td className="px-4 py-3 text-gray-500 text-xs">{i + 1}</td>
                                        <td className="px-4 py-3 text-gray-200 max-w-xs truncate">{row.name}</td>
                                        <td className="px-4 py-3 text-right text-[#2DE3A7] font-medium">৳ {fmt(row.revenue)}</td>
                                        <td className="px-4 py-3 text-right text-gray-300">{fmt(row.quantity)}</td>
                                        <td className="px-4 py-3 text-right text-gray-400">{row.orders}</td>
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
