import { useState, useMemo } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import KpiCard from "@/Components/Reports/KpiCard";
import { ChartTooltip, AXIS_COLOR } from "@/Components/Reports/ChartTooltip";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Package, AlertTriangle, XCircle, CheckCircle, DollarSign, Search, ExternalLink } from "lucide-react";
import { Link } from "@inertiajs/react";
import { getAssetUrl } from "@/Utils/helpers";

interface Product {
    id: number;
    name: string;
    category: string;
    stock: number;
    price: number;
    value: number;
    image: string | null;
}

interface DistItem { label: string; value: number; color: string }

interface Props {
    kpis: {
        total: number; in_stock: number; low_stock: number;
        out_of_stock: number; total_value: number; threshold: number;
    };
    distribution: DistItem[];
    products: Product[];
    threshold: number;
}

const fmt = (n: number) => n.toLocaleString("en-US");

type StockFilter = "all" | "in_stock" | "low" | "out";

function stockMeta(stock: number, threshold: number) {
    if (stock <= 0)         return { label: "Out of stock", color: "text-red-400",   bg: "bg-red-500/10",   border: "border-red-500/20",   dot: "#EF4444" };
    if (stock <= threshold) return { label: "Low stock",    color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "#F59E0B" };
    return                         { label: "In stock",     color: "text-[#2DE3A7]", bg: "bg-[#2DE3A7]/10", border: "border-[#2DE3A7]/20", dot: "#2DE3A7" };
}

export default function Inventory({ kpis, distribution, products, threshold }: Props) {
    const [filter, setFilter]   = useState<StockFilter>("all");
    const [search, setSearch]   = useState("");

    const filtered = useMemo(() => {
        let list = products;
        if (filter === "out")      list = list.filter(p => p.stock <= 0);
        else if (filter === "low") list = list.filter(p => p.stock > 0 && p.stock <= threshold);
        else if (filter === "in_stock") list = list.filter(p => p.stock > threshold);
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }
        return list;
    }, [products, filter, search, threshold]);

    const tabs: { key: StockFilter; label: string; count: number; color: string }[] = [
        { key: "all",      label: "All",          count: kpis.total,        color: "text-gray-300" },
        { key: "out",      label: "Out of stock",  count: kpis.out_of_stock, color: "text-red-400" },
        { key: "low",      label: "Low stock",     count: kpis.low_stock,    color: "text-amber-400" },
        { key: "in_stock", label: "In stock",      count: kpis.in_stock,     color: "text-[#2DE3A7]" },
    ];

    return (
        <Master title="Inventory" head={<Header title="Inventory Report" showUserMenu />}>
            <div className="space-y-6">

                {/* ── KPIs ── */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <KpiCard label="Total Products"  value={fmt(kpis.total)}        Icon={Package}       accent="gray" />
                    <KpiCard label="In Stock"        value={fmt(kpis.in_stock)}     Icon={CheckCircle}   accent="green" />
                    <KpiCard label="Low Stock"       value={fmt(kpis.low_stock)}    Icon={AlertTriangle} accent="amber"
                             sub={`≤ ${kpis.threshold} units`} />
                    <KpiCard label="Out of Stock"    value={fmt(kpis.out_of_stock)} Icon={XCircle}       accent="red" />
                    <KpiCard label="Inventory Value" value={`৳ ${fmt(kpis.total_value)}`} Icon={DollarSign} accent="blue" />
                </div>

                {/* ── Distribution donut ── */}
                <Card padding="none" className="p-5">
                    <p className="text-sm font-semibold text-white mb-4">Stock Distribution</p>
                    <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                            <Pie
                                data={distribution.map(d => ({ name: d.label, value: d.value }))}
                                dataKey="value" cx="50%" cy="50%"
                                innerRadius={50} outerRadius={75} paddingAngle={4}
                            >
                                {distribution.map((d, i) => <Cell key={i} fill={d.color} />)}
                            </Pie>
                            <Tooltip content={<ChartTooltip />} />
                            <Legend iconSize={8} wrapperStyle={{ fontSize: 12, color: AXIS_COLOR }} />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                {/* ── Product grid ── */}
                <Card padding="none" className="overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-[#1E2826] flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Filter tabs */}
                        <div className="flex items-center gap-1 flex-wrap">
                            {tabs.map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => setFilter(t.key)}
                                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all font-medium ${
                                        filter === t.key
                                            ? "bg-[#0F1A18] border-[#2DE3A7]/30 " + t.color
                                            : "border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"
                                    }`}
                                >
                                    {t.label}
                                    <span className={`ml-1.5 ${filter === t.key ? t.color : "text-gray-600"}`}>
                                        {t.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative sm:ml-auto sm:w-56">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search products…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full bg-[#0C1311] border border-gray-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2DE3A7]/40"
                            />
                        </div>
                    </div>

                    {/* Grid */}
                    {filtered.length === 0 ? (
                        <div className="py-16 text-center text-gray-500 text-sm">
                            No products match your filter
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 divide-y divide-[#1E2826] sm:divide-y-0">
                            {filtered.map(p => {
                                const meta = stockMeta(p.stock, threshold);
                                return (
                                    <div
                                        key={p.id}
                                        className="flex items-center gap-3 p-4 border-b border-r border-[#1E2826] hover:bg-[#0F1A18] transition-colors group"
                                    >
                                        {/* Thumbnail */}
                                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#1E2826] shrink-0 border border-[#2a3830]">
                                            {p.image ? (
                                                <img
                                                    src={getAssetUrl(p.image)}
                                                    alt={p.name}
                                                    className="w-full h-full object-cover"
                                                    onError={e => { (e.target as HTMLImageElement).src = "/placeholder.png"; }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <Package size={20} className="text-gray-700" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-1">
                                                <p className="text-xs font-medium text-gray-200 truncate leading-snug">
                                                    {p.name}
                                                </p>
                                                <Link
                                                    href={route("admin.product.edit", p.id)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-0.5 text-gray-500 hover:text-[#2DE3A7]"
                                                >
                                                    <ExternalLink size={11} />
                                                </Link>
                                            </div>
                                            <p className="text-[10px] text-gray-600 mt-0.5 truncate">{p.category}</p>

                                            <div className="flex items-center justify-between mt-2">
                                                {/* Stock badge */}
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${meta.bg} ${meta.border} ${meta.color}`}>
                                                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: meta.dot }} />
                                                    {p.stock <= 0 ? "0" : p.stock}
                                                </span>
                                                {/* Price */}
                                                <span className="text-[10px] text-gray-500">৳ {fmt(p.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Footer count */}
                    <div className="px-4 py-3 border-t border-[#1E2826] text-xs text-gray-600">
                        Showing {filtered.length} of {kpis.total} products
                    </div>
                </Card>
            </div>
        </Master>
    );
}
