import { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Pagination from "@/Components/Ui/Pagination";
import { useDebounce } from "@/Hooks/useDebounce";
import {
    Search,
    Trash2,
    ChevronDown,
    Package,
    Calendar,
    Mail,
    Phone,
    Link as LinkIcon,
    ShoppingCart,
    DollarSign,
    FileText,
    Tag,
    User,
    StickyNote,
    CheckCircle,
    Clock,
    XCircle,
    Eye,
} from "lucide-react";

type NewProductRequest = {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string | null;
    product_name: string;
    category: string | null;
    description: string;
    reference_url: string | null;
    quantity: number;
    budget: string | null;
    admin_notes: string | null;
    status: "pending" | "reviewing" | "approved" | "rejected";
    created_at: string;
};

interface Counts {
    all: number;
    pending: number;
    reviewing: number;
    approved: number;
    rejected: number;
}

interface Props {
    requests: any;
    counts: Counts;
    filters: { status: string; search: string };
}

const STATUS_CONFIG = {
    pending:   { label: "Pending",   color: "bg-amber-100 text-amber-700 border-amber-200",   icon: Clock },
    reviewing: { label: "Reviewing", color: "bg-blue-100 text-blue-700 border-blue-200",       icon: Eye },
    approved:  { label: "Approved",  color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: CheckCircle },
    rejected:  { label: "Rejected",  color: "bg-red-100 text-red-700 border-red-200",           icon: XCircle },
} as const;

function StatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }) {
    const cfg = STATUS_CONFIG[status];
    const Icon = cfg.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.color}`}>
            <Icon size={11} />
            {cfg.label}
        </span>
    );
}

function RequestCard({
    req,
    onStatusUpdate,
    onDelete,
}: {
    req: NewProductRequest;
    onStatusUpdate: (id: number, status: string, notes: string) => void;
    onDelete: (id: number) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [editingStatus, setEditingStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(req.status);
    const [adminNotes, setAdminNotes] = useState(req.admin_notes ?? "");
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleUpdate = () => {
        onStatusUpdate(req.id, selectedStatus, adminNotes);
        setEditingStatus(false);
    };

    return (
        <div className="bg-[#101A18] border border-[#1E2826] rounded-2xl overflow-hidden hover:border-[#2DE3A7]/20 transition-all">
            {/* Card Header */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-white font-semibold text-base truncate">{req.product_name}</h3>
                        {req.category && (
                            <span className="inline-flex items-center gap-1 text-xs text-[#2DE3A7] bg-[#2DE3A7]/10 border border-[#2DE3A7]/20 px-2 py-0.5 rounded-full">
                                <Tag size={10} />
                                {req.category}
                            </span>
                        )}
                        <StatusBadge status={req.status} />
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <User size={11} className="text-[#2DE3A7]" />
                            {req.customer_name}
                        </span>
                        <span className="flex items-center gap-1">
                            <Mail size={11} className="text-[#2DE3A7]" />
                            {req.customer_email}
                        </span>
                        {req.customer_phone && (
                            <span className="flex items-center gap-1">
                                <Phone size={11} className="text-[#2DE3A7]" />
                                {req.customer_phone}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(req.created_at).toLocaleDateString("en-MY", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <div className="flex gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                            <ShoppingCart size={12} className="text-[#2DE3A7]" />
                            Qty: {req.quantity}
                        </span>
                        {req.budget && (
                            <span className="flex items-center gap-1">
                                <DollarSign size={12} className="text-[#2DE3A7]" />
                                RM {parseFloat(req.budget).toFixed(2)}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="ml-2 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E2826] transition-all"
                        title="View details"
                    >
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="border-t border-[#1E2826] p-5 space-y-5">
                    {/* Description */}
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <FileText size={11} /> Description
                        </p>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{req.description}</p>
                    </div>

                    {/* Reference URL */}
                    {req.reference_url && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <LinkIcon size={11} /> Reference Link
                            </p>
                            <a
                                href={req.reference_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#2DE3A7] hover:underline break-all"
                            >
                                {req.reference_url}
                            </a>
                        </div>
                    )}

                    {/* Admin Notes (existing) */}
                    {req.admin_notes && !editingStatus && (
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                <StickyNote size={11} /> Admin Notes
                            </p>
                            <p className="text-sm text-gray-300 whitespace-pre-wrap">{req.admin_notes}</p>
                        </div>
                    )}

                    {/* Status Update Form */}
                    {editingStatus ? (
                        <div className="bg-[#0E1614] border border-[#2DE3A7]/20 rounded-xl p-4 space-y-4">
                            <p className="text-xs font-semibold text-[#2DE3A7] uppercase tracking-widest">Update Request</p>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Status</label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value as any)}
                                    className="w-full bg-[#101A18] border border-[#1E2826] text-white rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2DE3A7] transition-colors"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="reviewing">Reviewing</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1.5">Admin Notes</label>
                                <textarea
                                    rows={3}
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    placeholder="Add internal notes about this request..."
                                    className="w-full bg-[#101A18] border border-[#1E2826] text-white placeholder-gray-600 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2DE3A7] transition-colors resize-none"
                                />
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleUpdate}
                                    className="px-4 py-2 bg-[#2DE3A7] text-[#0E1614] font-semibold text-xs rounded-lg hover:bg-[#2DE3A7]/90 transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => { setEditingStatus(false); setSelectedStatus(req.status); setAdminNotes(req.admin_notes ?? ""); }}
                                    className="px-4 py-2 bg-[#1E2826] text-gray-300 text-xs rounded-lg hover:bg-[#2A3530] transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setEditingStatus(true)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#2DE3A7]/10 text-[#2DE3A7] border border-[#2DE3A7]/20 text-xs font-semibold rounded-lg hover:bg-[#2DE3A7]/20 transition-colors"
                            >
                                <CheckCircle size={13} />
                                Update Status
                            </button>

                            {!confirmDelete ? (
                                <button
                                    onClick={() => setConfirmDelete(true)}
                                    className="flex items-center gap-1.5 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold rounded-lg hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 size={13} />
                                    Delete
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-400">Are you sure?</span>
                                    <button
                                        onClick={() => onDelete(req.id)}
                                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Yes, delete
                                    </button>
                                    <button
                                        onClick={() => setConfirmDelete(false)}
                                        className="px-3 py-1.5 bg-[#1E2826] text-gray-300 text-xs rounded-lg hover:bg-[#2A3530] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function NewProductRequestsIndex({ requests, counts, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const debouncedSearch = useDebounce(search, 400);
    const activeStatus = filters.status || "all";

    useEffect(() => {
        if (debouncedSearch !== (filters.search || "")) {
            router.get(
                route("admin.new-product-requests.index"),
                { search: debouncedSearch || undefined, status: filters.status || undefined },
                { preserveState: true, preserveScroll: true }
            );
        }
    }, [debouncedSearch]);

    const setStatus = (status: string) => {
        router.get(
            route("admin.new-product-requests.index"),
            { search: filters.search || undefined, status: status === "all" ? undefined : status },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleStatusUpdate = (id: number, status: string, admin_notes: string) => {
        router.patch(
            route("admin.new-product-requests.update-status", id),
            { status, admin_notes },
            { preserveScroll: true }
        );
    };

    const handleDelete = (id: number) => {
        router.delete(
            route("admin.new-product-requests.destroy", id),
            { preserveScroll: true }
        );
    };

    const tabs = [
        { key: "all",       label: "All",       count: counts.all },
        { key: "pending",   label: "Pending",   count: counts.pending },
        { key: "reviewing", label: "Reviewing", count: counts.reviewing },
        { key: "approved",  label: "Approved",  count: counts.approved },
        { key: "rejected",  label: "Rejected",  count: counts.rejected },
    ];

    return (
        <Master>
            <Head title="New Product Requests" />
            <Header title="New Product Requests" />

            <div className="p-4 lg:p-6 space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: "Total",     count: counts.all,       color: "text-white" },
                        { label: "Pending",   count: counts.pending,   color: "text-amber-400" },
                        { label: "Approved",  count: counts.approved,  color: "text-emerald-400" },
                        { label: "Rejected",  count: counts.rejected,  color: "text-red-400" },
                    ].map(({ label, count, color }) => (
                        <div key={label} className="bg-[#101A18] border border-[#1E2826] rounded-xl p-4 text-center">
                            <p className={`text-2xl font-bold ${color}`}>{count}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Filter Bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, email or product..."
                            className="w-full bg-[#101A18] border border-[#1E2826] text-white placeholder-gray-600 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#2DE3A7] transition-colors"
                        />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
                        {tabs.map(({ key, label, count }) => (
                            <button
                                key={key}
                                onClick={() => setStatus(key)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                                    activeStatus === key
                                        ? "bg-[#2DE3A7] text-[#0E1614]"
                                        : "bg-[#101A18] border border-[#1E2826] text-gray-400 hover:text-white hover:border-[#2DE3A7]/30"
                                }`}
                            >
                                {label}
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    activeStatus === key ? "bg-[#0E1614]/20" : "bg-[#1E2826]"
                                }`}>
                                    {count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Request List */}
                {requests.data.length === 0 ? (
                    <div className="text-center py-20 bg-[#101A18] border border-[#1E2826] rounded-2xl">
                        <Package size={40} className="text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-400 font-medium">No requests found</p>
                        <p className="text-gray-600 text-sm mt-1">
                            {filters.search
                                ? "Try a different search term"
                                : "New product requests will appear here"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {requests.data.map((req: NewProductRequest) => (
                            <RequestCard
                                key={req.id}
                                req={req}
                                onStatusUpdate={handleStatusUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {requests.last_page > 1 && (
                    <div className="flex justify-center pt-2">
                        <Pagination data={requests} />
                    </div>
                )}
            </div>
        </Master>
    );
}
