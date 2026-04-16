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
import { Truck, DollarSign, CreditCard, Banknote, Package, TrendingUp } from "lucide-react";

interface CourierRow { name: string; orders: number; revenue: number }
interface SplitRow   { name: string; value: number; [key: string]: unknown }

interface Props {
    filters: { preset: string; start_date?: string; end_date?: string };
    kpis: { total_orders: number; total_delivery: number; cod_orders: number; prepaid_orders: number; avg_delivery: number; cod_pct: number };
    charts: { by_courier: CourierRow[]; payment_split: SplitRow[] };
}

const fmt = (n: number) => n.toLocaleString("en-US");

export default function Shipping({ filters, kpis, charts }: Props) {
    return (
        <Master title="Shipping & Delivery" head={<Header title="Shipping & Delivery" showUserMenu />}>
            <div className="space-y-6">
                <DateRangeFilter routeName="admin.reports.shipping" filters={filters} />

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                    <KpiCard label="Total Orders"     value={fmt(kpis.total_orders)}    Icon={Package}    accent="green" />
                    <KpiCard label="Delivery Revenue" value={`৳ ${fmt(kpis.total_delivery)}`} Icon={DollarSign} accent="blue" />
                    <KpiCard label="COD Orders"       value={fmt(kpis.cod_orders)}      Icon={Banknote}   accent="amber" />
                    <KpiCard label="Prepaid Orders"   value={fmt(kpis.prepaid_orders)}  Icon={CreditCard} accent="purple" />
                    <KpiCard label="Avg Delivery Fee" value={`৳ ${fmt(kpis.avg_delivery)}`} Icon={Truck} accent="gray" />
                    <KpiCard label="COD Share"        value={`${kpis.cod_pct}%`}        Icon={TrendingUp} accent="amber" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* By courier */}
                    <Card padding="none" className="p-5">
                        <p className="text-sm font-semibold text-white mb-4">Orders by Courier</p>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={charts.by_courier} barSize={22}>
                                <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} />
                                <XAxis dataKey="name" tick={{ fill: AXIS_COLOR, fontSize: 11 }} />
                                <YAxis tick={{ fill: AXIS_COLOR, fontSize: 11 }} allowDecimals={false} />
                                <Tooltip content={<ChartTooltip />} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: 11, color: AXIS_COLOR }} />
                                <Bar dataKey="orders"  name="Orders"  fill={CHART_COLORS.green} radius={[3, 3, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* COD vs Prepaid */}
                    <Card padding="none" className="p-5">
                        <p className="text-sm font-semibold text-white mb-4">Payment Method Split</p>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie data={charts.payment_split} dataKey="value" nameKey="name"
                                    cx="50%" cy="50%" outerRadius={100} paddingAngle={4}>
                                    <Cell fill={CHART_COLORS.amber} />
                                    <Cell fill={CHART_COLORS.blue} />
                                </Pie>
                                <Tooltip content={<ChartTooltip />} />
                                <Legend iconSize={8} wrapperStyle={{ fontSize: 12, color: AXIS_COLOR }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </div>
        </Master>
    );
}
