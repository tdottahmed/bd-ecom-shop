import { Head, Link, router } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import {
    ArrowLeft, Mail, Phone, MapPin, CalendarDays,
    ShoppingBag, CheckCircle2, XCircle, Globe,
    ShieldCheck, Trash2, Package,
} from "lucide-react";
import { Order } from "@/types";

interface AdminUser {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    email_verified_at?: string | null;
    social_provider?: string | null;
    created_at: string;
    orders_count: number;
    orders?: Order[];
}

interface Props {
    user: AdminUser;
}

function initials(name: string) {
    return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

const STATUS_COLORS: Record<string, string> = {
    pending:    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    preparing:  "bg-blue-500/10 text-blue-400 border-blue-500/20",
    shipping:   "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    completed:  "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled:  "bg-red-500/10 text-red-400 border-red-500/20",
    returned:   "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function UserShow({ user }: Props) {
    const handleDelete = () => {
        if (!confirm(`Delete "${user.name}"? This cannot be undone.`)) return;
        router.delete(route("admin.users.destroy", user.id), {
            onSuccess: () => router.visit(route("admin.users.index")),
        });
    };

    return (
        <Master title={user.name} head={<Header title="Users" showUserMenu={true} />}>
            <Head title={`User — ${user.name}`} />

            <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">

                {/* Back + actions */}
                <div className="flex items-center justify-between">
                    <Link
                        href={route("admin.users.index")}
                        className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Users
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-600/10 border border-red-500/20 text-sm font-medium transition-colors"
                    >
                        <Trash2 size={14} /> Delete User
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    {/* ── Left column: profile ── */}
                    <div className="space-y-4">

                        {/* Profile card */}
                        <div className="bg-[#0E1614] rounded-xl border border-[#1E2826] p-5">
                            <div className="flex flex-col items-center text-center mb-5">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2DE3A7] to-[#1aad80] flex items-center justify-center text-[#0E1614] font-bold text-2xl mb-3 shadow-lg shadow-[#2DE3A7]/20">
                                    {initials(user.name)}
                                </div>
                                <h1 className="text-xl font-bold text-white">{user.name}</h1>
                                <div className="flex items-center gap-2 mt-2 flex-wrap justify-center">
                                    {user.email_verified_at ? (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                            <ShieldCheck size={9} /> Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                            <XCircle size={9} /> Unverified
                                        </span>
                                    )}
                                    {user.social_provider && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            <Globe size={9} /> {user.social_provider}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-7 h-7 rounded-lg bg-[#151F1D] flex items-center justify-center shrink-0">
                                        <Mail size={13} className="text-gray-400" />
                                    </div>
                                    <span className="text-gray-300 truncate">{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-7 h-7 rounded-lg bg-[#151F1D] flex items-center justify-center shrink-0">
                                            <Phone size={13} className="text-gray-400" />
                                        </div>
                                        <span className="text-gray-300">{user.phone}</span>
                                    </div>
                                )}
                                {user.address && (
                                    <div className="flex items-start gap-3 text-sm">
                                        <div className="w-7 h-7 rounded-lg bg-[#151F1D] flex items-center justify-center shrink-0 mt-0.5">
                                            <MapPin size={13} className="text-gray-400" />
                                        </div>
                                        <span className="text-gray-300 leading-relaxed">{user.address}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="w-7 h-7 rounded-lg bg-[#151F1D] flex items-center justify-center shrink-0">
                                        <CalendarDays size={13} className="text-gray-400" />
                                    </div>
                                    <span className="text-gray-400">Joined {formatDate(user.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-[#0E1614] rounded-xl border border-[#1E2826] p-5">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Overview</p>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-[#151F1D] rounded-xl p-3 text-center">
                                    <div className="text-2xl font-bold text-[#2DE3A7]">{user.orders_count}</div>
                                    <div className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
                                        <ShoppingBag size={10} /> Orders
                                    </div>
                                </div>
                                <div className="bg-[#151F1D] rounded-xl p-3 text-center">
                                    <div className="text-2xl font-bold text-white">
                                        {user.email_verified_at ? (
                                            <CheckCircle2 size={22} className="text-emerald-400 mx-auto" />
                                        ) : (
                                            <XCircle size={22} className="text-amber-400 mx-auto" />
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-0.5">Email</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Right column: orders ── */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#0E1614] rounded-xl border border-[#1E2826] overflow-hidden">
                            <div className="px-5 py-4 border-b border-[#1E2826] flex items-center justify-between">
                                <div>
                                    <h2 className="font-semibold text-white">Order History</h2>
                                    <p className="text-xs text-gray-500 mt-0.5">Last 10 orders</p>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-[#2DE3A7]/10 flex items-center justify-center">
                                    <Package size={15} className="text-[#2DE3A7]" />
                                </div>
                            </div>

                            {!user.orders || user.orders.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-[#151F1D] flex items-center justify-center mb-3">
                                        <ShoppingBag size={20} className="text-gray-600" />
                                    </div>
                                    <p className="text-gray-400 font-medium text-sm">No orders yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#1E2826]">
                                    {user.orders.map((order) => (
                                        <div key={order.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-[#0F1A18] transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[#151F1D] flex items-center justify-center shrink-0">
                                                    <ShoppingBag size={14} className="text-gray-400" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-white">#{order.id}</span>
                                                        {order.status && (
                                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[order.status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20"}`}>
                                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(order.created_at ?? "")}</p>
                                                </div>
                                            </div>
                                            <Link
                                                href={route("admin.orders.show", order.id)}
                                                className="text-xs text-[#2DE3A7] hover:text-[#2DE3A7]/80 font-medium transition-colors"
                                            >
                                                View →
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Master>
    );
}
