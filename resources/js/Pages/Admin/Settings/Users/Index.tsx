import { useState, useEffect } from "react";
import { Head, router, Link } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Pagination from "@/Components/Ui/Pagination";
import { useDebounce } from "@/Hooks/useDebounce";
import {
    Users,
    Search,
    Trash2,
    Eye,
    CheckCircle2,
    XCircle,
    TrendingUp,
    UserCheck,
    Globe,
    UserX,
    ShieldCheck,
    Phone,
    MapPin,
    CalendarDays,
    ShoppingBag,
    X,
    Mail,
} from "lucide-react";
import { PaginatedData } from "@/types";

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
}

interface Stats {
    total: number;
    verified: number;
    unverified: number;
    social: number;
    this_month: number;
}

interface Props {
    users: PaginatedData<AdminUser>;
    filters: { search?: string; filter?: string };
    stats: Stats;
}

const FILTERS = [
    { key: "",           label: "All Users" },
    { key: "verified",   label: "Verified" },
    { key: "unverified", label: "Unverified" },
    { key: "social",     label: "Social Login" },
] as const;

function initials(name: string) {
    return name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit", month: "short", year: "numeric",
    });
}

// ── User Detail Drawer ──────────────────────────────────────────────────────
function UserDrawer({ user, onClose }: { user: AdminUser; onClose: () => void }) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <>
            <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
            <aside className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0E1614] border-l border-[#1E2826] z-50 flex flex-col shadow-2xl overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2826]">
                    <h2 className="text-lg font-semibold text-white">User Details</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#151F1D] text-gray-400 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Profile card */}
                <div className="px-6 py-6 border-b border-[#1E2826]">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2DE3A7] to-[#1aad80] flex items-center justify-center text-[#0E1614] font-bold text-xl shrink-0 shadow-lg shadow-[#2DE3A7]/20">
                            {initials(user.name)}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xl font-bold text-white truncate">{user.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
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
                    </div>

                    {/* Info rows */}
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
                                <span className="text-gray-300">{user.address}</span>
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

                {/* Quick stats */}
                <div className="px-6 py-4 border-b border-[#1E2826]">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Overview</p>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-[#151F1D] rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-[#2DE3A7]">{user.orders_count}</div>
                            <div className="text-xs text-gray-400 mt-0.5 flex items-center justify-center gap-1">
                                <ShoppingBag size={10} /> Total Orders
                            </div>
                        </div>
                        <div className="bg-[#151F1D] rounded-xl p-3 text-center">
                            <div className="text-2xl font-bold text-white">{formatDate(user.created_at).split(" ")[2]}</div>
                            <div className="text-xs text-gray-400 mt-0.5 flex items-center justify-center gap-1">
                                <CalendarDays size={10} /> Member Since
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 mt-auto">
                    <Link
                        href={route("admin.users.show", user.id)}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#2DE3A7]/10 hover:bg-[#2DE3A7]/20 text-[#2DE3A7] font-semibold text-sm transition-colors border border-[#2DE3A7]/20 mb-3"
                    >
                        <Eye size={15} /> View Full Profile
                    </Link>
                    <button
                        onClick={() => {
                            if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return;
                            router.delete(route("admin.users.destroy", user.id), { onSuccess: onClose });
                        }}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-red-400 hover:bg-red-600/10 font-semibold text-sm transition-colors border border-red-500/20"
                    >
                        <Trash2 size={15} /> Delete User
                    </button>
                </div>
            </aside>
        </>
    );
}

// ── Main Page ───────────────────────────────────────────────────────────────
export default function UsersIndex({ users, filters = {}, stats }: Props) {
    const [search, setSearch] = useState(filters.search ?? "");
    const [activeFilter, setActiveFilter] = useState(filters.filter ?? "");
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const debouncedSearch = useDebounce(search, 400);

    useEffect(() => {
        router.get(
            route("admin.users.index"),
            { search: debouncedSearch || undefined, filter: activeFilter || undefined },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    }, [debouncedSearch, activeFilter]);

    const handleDelete = (user: AdminUser) => {
        if (!confirm(`Delete "${user.name}"? This cannot be undone.`)) return;
        router.delete(route("admin.users.destroy", user.id), { preserveScroll: true });
    };

    const statCards = [
        { label: "Total Users",    value: stats.total,      icon: <Users size={18} />,       color: "text-[#2DE3A7]",  bg: "bg-[#2DE3A7]/10"  },
        { label: "Verified",       value: stats.verified,   icon: <UserCheck size={18} />,   color: "text-emerald-400", bg: "bg-emerald-500/10" },
        { label: "Unverified",     value: stats.unverified, icon: <UserX size={18} />,       color: "text-amber-400",  bg: "bg-amber-500/10"   },
        { label: "This Month",     value: stats.this_month, icon: <TrendingUp size={18} />,  color: "text-blue-400",   bg: "bg-blue-500/10"    },
        { label: "Social Login",   value: stats.social,     icon: <Globe size={18} />,       color: "text-purple-400", bg: "bg-purple-500/10"  },
    ];

    return (
        <Master title="Users" head={<Header title="Users" showUserMenu={true} />}>
            <Head title="Users" />

            <div className="p-4 md:p-6 space-y-5 max-w-8xl mx-auto">

                {/* Page title */}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">User Management</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        {users.total.toLocaleString()} registered customer{users.total !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {statCards.map((s) => (
                        <div key={s.label} className="bg-[#0E1614] rounded-xl border border-[#1E2826] p-4 flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center ${s.color} shrink-0`}>
                                {s.icon}
                            </div>
                            <div>
                                <div className={`text-xl font-bold ${s.color}`}>{s.value.toLocaleString()}</div>
                                <div className="text-xs text-gray-500">{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="bg-[#0E1614] rounded-xl border border-[#1E2826] p-3 flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name, email or phone…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-[#151F1D] border border-[#1E2826] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#2DE3A7]/40 transition-colors"
                        />
                    </div>

                    {/* Filter pills */}
                    <div className="flex gap-1.5 flex-wrap">
                        {FILTERS.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    activeFilter === f.key
                                        ? "bg-[#2DE3A7] text-[#0E1614]"
                                        : "bg-[#151F1D] text-gray-400 hover:text-white border border-[#1E2826]"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-[#0E1614] rounded-xl border border-[#1E2826] overflow-hidden">
                    {users.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-[#151F1D] flex items-center justify-center mb-4">
                                <Users size={24} className="text-gray-600" />
                            </div>
                            <p className="text-gray-400 font-medium">No users found</p>
                            <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filter</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead className="bg-[#0F1A18] border-b border-[#1E2826]">
                                    <tr>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden md:table-cell">Phone</th>
                                        <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Orders</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Joined</th>
                                        <th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="text-right px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1E2826]">
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="hover:bg-[#0F1A18] transition-colors cursor-pointer group"
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            {/* User */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2DE3A7] to-[#1aad80] flex items-center justify-center text-[#0E1614] font-bold text-xs shrink-0">
                                                        {initials(user.name)}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-white truncate max-w-[160px]">{user.name}</p>
                                                        <p className="text-xs text-gray-500 truncate max-w-[160px]">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Phone */}
                                            <td className="px-4 py-3 text-gray-400 hidden md:table-cell">
                                                {user.phone ?? <span className="text-gray-700">—</span>}
                                            </td>

                                            {/* Orders */}
                                            <td className="px-4 py-3 text-center hidden sm:table-cell">
                                                <span className={`inline-flex items-center justify-center w-8 h-6 rounded-lg text-xs font-bold ${
                                                    user.orders_count > 0
                                                        ? "bg-[#2DE3A7]/10 text-[#2DE3A7]"
                                                        : "bg-[#151F1D] text-gray-600"
                                                }`}>
                                                    {user.orders_count}
                                                </span>
                                            </td>

                                            {/* Joined */}
                                            <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                                                {formatDate(user.created_at)}
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    {user.email_verified_at ? (
                                                        <CheckCircle2 size={15} className="text-emerald-400" aria-label="Verified" />
                                                    ) : (
                                                        <XCircle size={15} className="text-amber-400" aria-label="Unverified" />
                                                    )}
                                                    {user.social_provider && (
                                                        <Globe size={13} className="text-blue-400" aria-label={user.social_provider} />
                                                    )}
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setSelectedUser(user)}
                                                        className="p-1.5 rounded-lg hover:bg-[#151F1D] text-gray-400 hover:text-[#2DE3A7] transition-colors"
                                                        title="View details"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user)}
                                                        className="p-1.5 rounded-lg hover:bg-red-600/10 text-gray-400 hover:text-red-400 transition-colors"
                                                        title="Delete user"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <Pagination data={users} />
            </div>

            {/* Detail drawer */}
            {selectedUser && (
                <UserDrawer user={selectedUser} onClose={() => setSelectedUser(null)} />
            )}
        </Master>
    );
}
