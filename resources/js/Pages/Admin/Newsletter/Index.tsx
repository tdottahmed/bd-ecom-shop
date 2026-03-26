import React, { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Pagination from "@/Components/Ui/Pagination";
import { useDebounce } from "@/Hooks/useDebounce";
import { RefreshCw, Trash2 } from "lucide-react";

type Subscription = {
    id: number;
    email: string;
    status: "active" | "unsubscribed";
    subscribed_at?: string | null;
    created_at: string;
};

interface Props {
    subscriptions: any;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function NewsletterIndex({ subscriptions, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const debouncedSearch = useDebounce(search, 400);

    useEffect(() => {
        if (debouncedSearch !== (filters.search || "")) {
            router.get(
                route("admin.newsletter-subscriptions.index"),
                {
                    search: debouncedSearch || undefined,
                    status: filters.status || "all",
                },
                { preserveState: true, preserveScroll: true },
            );
        }
    }, [debouncedSearch]);

    const setStatus = (status: string) => {
        router.get(
            route("admin.newsletter-subscriptions.index"),
            {
                search: filters.search || undefined,
                status: status === "all" ? undefined : status,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const toggleStatus = (id: number) => {
        router.post(
            route("admin.newsletter-subscriptions.toggle-status", id),
            {},
            { preserveScroll: true },
        );
    };

    const remove = (id: number) => {
        if (!confirm("Remove this subscription?")) return;
        router.delete(route("admin.newsletter-subscriptions.destroy", id), {
            preserveScroll: true,
        });
    };

    return (
        <Master title="Newsletter Subscriptions" head={<Header title="Newsletter" showUserMenu={true} />}>
            <Head title="Newsletter Subscriptions" />

            <div className="p-4 md:p-6 space-y-5 max-w-8xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Newsletter Subscriptions
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Manage subscriber emails from footer and home newsletter forms.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                            id="newsletter_search"
                            name="newsletter_search"
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search email..."
                            className="px-3 py-2 rounded-lg bg-[#0F1A18] border border-[#1E2826] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                        />
                        <select
                            value={filters.status || "all"}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-3 py-2 rounded-lg bg-[#0F1A18] border border-[#1E2826] text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                        >
                            <option value="all">All status</option>
                            <option value="active">Active</option>
                            <option value="unsubscribed">Unsubscribed</option>
                        </select>
                    </div>
                </div>

                <div className="bg-[#0E1614] rounded-xl border border-[#1E2826] overflow-hidden">
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#0F1A18] text-gray-300">
                                <tr>
                                    <th className="text-left px-4 py-3">Email</th>
                                    <th className="text-left px-4 py-3">Status</th>
                                    <th className="text-left px-4 py-3">Joined</th>
                                    <th className="text-right px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1E2826]">
                                {subscriptions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center text-gray-400">
                                            No subscriptions found.
                                        </td>
                                    </tr>
                                ) : (
                                    subscriptions.data.map((item: Subscription) => (
                                        <tr key={item.id} className="text-gray-200">
                                            <td className="px-4 py-3 font-medium">{item.email}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`text-xs px-2 py-1 rounded border ${
                                                        item.status === "active"
                                                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                                            : "bg-gray-500/10 text-gray-300 border-gray-500/30"
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">
                                                {new Date(item.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleStatus(item.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
                                                    >
                                                        <RefreshCw size={14} />
                                                        Toggle
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => remove(item.id)}
                                                        className="inline-flex items-center px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination data={subscriptions} />
                </div>
            </div>
        </Master>
    );
}

