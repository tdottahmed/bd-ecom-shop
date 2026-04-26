import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import DateRangeFilter from "@/Components/Reports/DateRangeFilter";
import KpiCard from "@/Components/Reports/KpiCard";
import { ChartTooltip, CHART_COLORS, GRID_COLOR, AXIS_COLOR } from "@/Components/Reports/ChartTooltip";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { RotateCcw, DollarSign, AlertTriangle, Package } from "lucide-react";

interface DailyRow   { date: string; returns: number; value: number }
interface ProductRow { name: string; quantity: number; value: number }
interface RefundRow  { id: number; customer: string; phone: string; total: number; items: number; date: string }

interface Props {
    filters: { preset: string; start_date?: string; end_date?: string };
    kpis: { total_returned: number; total_value: number; return_rate: number; all_orders: number };
    charts: { daily_refunds: DailyRow[] };
    top_returned_products: ProductRow[];
    refund_list: RefundRow[];
}

const fmt = (n: number) => n.toLocaleString("en-US");

export default function Refunds({ filters, kpis, charts, top_returned_products, refund_list }: Props) {
    return (
        <Master title="Refunds & Returns" head={<Header title="Refunds & Returns" showUserMenu />}>
            <div className="space-y-6">
                <DateRangeFilter routeName="admin.reports.refunds" filters={filters} />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard label="Returned Orders"  value={fmt(kpis.total_returned)} Icon={RotateCcw}     accent="red" />
                    <KpiCard label="Return Value"     value={`৳ ${fmt(kpis.total_value)}`} Icon={DollarSign} accent="red" />
                    <KpiCard label="Return Rate"      value={`${kpis.return_rate}%`}   Icon={AlertTriangle} accent="amber" />
                    <KpiCard label="Total Orders"     value={fmt(kpis.all_orders)}     Icon={Package}       accent="gray" />
                </div>

                {/* Daily returns trend */}
                <Card padding="none" className="p-5">
                    <p className="text-sm font-semibold text-white mb-4">Returns Over Time</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={charts.daily_refunds}>
                            <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                            <XAxis dataKey="date" tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                            <YAxis yAxisId="l" tick={{ fill: AXIS_COLOR, fontSize: 11 }} allowDecimals={false} />
                            <YAxis yAxisId="r" orientation="right" tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                            <Tooltip content={<ChartTooltip />} />
                            <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: AXIS_COLOR }} />
                            <Line yAxisId="l" type="monotone" dataKey="returns" name="Returns"
                                stroke={CHART_COLORS.red} strokeWidth={2} dot={{ r: 3 }} />
                            <Line yAxisId="r" type="monotone" dataKey="value" name="Value (৳)"
                                stroke={CHART_COLORS.amber} strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Most returned products */}
                    <Card padding="none" className="overflow-hidden">
                        <div className="p-4 border-b border-[#1E2826]">
                            <p className="text-sm font-semibold text-white">Most Returned Products</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-[#1E2826]">
                                        <th className="text-left px-4 py-3">Product</th>
                                        <th className="text-right px-4 py-3">Qty</th>
                                        <th className="text-right px-4 py-3">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {top_returned_products.length === 0
                                        ? <tr><td colSpan={3} className="text-center py-8 text-gray-500">No returns in this period</td></tr>
                                        : top_returned_products.map((p, i) => (
                                            <tr key={i} className="border-b border-[#1E2826]/50 hover:bg-[#0F1A18]">
                                                <td className="px-4 py-3 text-gray-200 truncate max-w-[200px]">{p.name}</td>
                                                <td className="px-4 py-3 text-right text-red-400 font-medium">{p.quantity}</td>
                                                <td className="px-4 py-3 text-right text-gray-400 text-xs">৳ {fmt(p.value)}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Card>

                    {/* Refund orders */}
                    <Card padding="none" className="overflow-hidden">
                        <div className="p-4 border-b border-[#1E2826]">
                            <p className="text-sm font-semibold text-white">Returned Orders</p>
                        </div>
                        <div className="overflow-x-auto max-h-[280px] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-[#0E1614]">
                                    <tr className="text-xs text-gray-500 uppercase tracking-wide border-b border-[#1E2826]">
                                        <th className="text-left px-4 py-3">Order</th>
                                        <th className="text-left px-4 py-3">Customer</th>
                                        <th className="text-right px-4 py-3">Total</th>
                                        <th className="text-right px-4 py-3">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {refund_list.length === 0
                                        ? <tr><td colSpan={4} className="text-center py-8 text-gray-500">No returns in this period</td></tr>
                                        : refund_list.map((r) => (
                                            <tr key={r.id} className="border-b border-[#1E2826]/50 hover:bg-[#0F1A18]">
                                                <td className="px-4 py-3 text-[#2DE3A7] text-xs font-mono">#{r.id}</td>
                                                <td className="px-4 py-3">
                                                    <p className="text-gray-200 text-xs truncate">{r.customer}</p>
                                                    <p className="text-gray-500 text-[10px]">{r.phone}</p>
                                                </td>
                                                <td className="px-4 py-3 text-right text-red-400 font-medium">৳ {fmt(r.total)}</td>
                                                <td className="px-4 py-3 text-right text-gray-500 text-xs">{r.date}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </Master>
    );
}
