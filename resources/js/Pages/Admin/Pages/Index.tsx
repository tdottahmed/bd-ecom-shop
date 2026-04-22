import React, { useState } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link, router } from "@inertiajs/react";
import { Edit, Plus, Trash2 } from "lucide-react";

type Page = {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    show_in_header: boolean;
    show_in_footer: boolean;
    updated_at: string;
};

interface Props {
    pages: Page[];
}

export default function PagesIndex({ pages }: Props) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (!confirm("Delete this page?")) return;
        setDeletingId(id);
        router.delete(route("admin.pages.destroy", id), {
            onFinish: () => setDeletingId(null),
        });
    };

    return (
        <Master
            title="Pages"
            head={<Header title="Pages" showUserMenu={true} />}
        >
            <div className="p-4 md:p-6 space-y-6 max-w-8xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Pages
                        </h1>
                        <p className="text-sm md:text-base text-gray-400 mt-1">
                            Manage custom CMS pages and choose where each page appears in navigation.
                        </p>
                    </div>

                    <Link
                        href={route("admin.pages.create")}
                        className="w-full md:w-auto"
                    >
                        <PrimaryButton className="w-full md:w-auto flex items-center justify-center gap-2">
                            <Plus size={18} />
                            <span>Add Page</span>
                        </PrimaryButton>
                    </Link>
                </div>

                <div className="bg-[#0E1614] rounded-xl border border-[#1E2826] overflow-hidden">
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#0F1A18] text-gray-300">
                                <tr>
                                    <th className="text-left px-4 py-3 whitespace-nowrap">
                                        Title
                                    </th>
                                    <th className="text-left px-4 py-3 whitespace-nowrap">
                                        Slug
                                    </th>
                                    <th className="text-left px-4 py-3 whitespace-nowrap">
                                        Status
                                    </th>
                                    <th className="text-left px-4 py-3 whitespace-nowrap">
                                        Menu placement
                                    </th>
                                    <th className="text-right px-4 py-3 whitespace-nowrap">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1E2826]">
                                {pages.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-10 text-center text-gray-400"
                                        >
                                            No pages yet.
                                        </td>
                                    </tr>
                                ) : (
                                    pages.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="text-gray-200"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-white">
                                                    {p.title}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">
                                                {p.slug}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`text-xs font-semibold px-2 py-1 rounded border ${
                                                        p.is_published
                                                            ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                                            : "bg-gray-500/10 text-gray-300 border-gray-500/30"
                                                    }`}
                                                >
                                                    {p.is_published
                                                        ? "Published"
                                                        : "Draft"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {p.show_in_header && (
                                                        <span className="text-[11px] font-semibold px-2 py-1 rounded border bg-sky-500/10 text-sky-300 border-sky-500/30">
                                                            Header
                                                        </span>
                                                    )}
                                                    {p.show_in_footer && (
                                                        <span className="text-[11px] font-semibold px-2 py-1 rounded border bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
                                                            Footer
                                                        </span>
                                                    )}
                                                    {!p.show_in_header &&
                                                        !p.show_in_footer && (
                                                            <span className="text-[11px] font-semibold px-2 py-1 rounded border bg-gray-500/10 text-gray-300 border-gray-500/30">
                                                                Not linked
                                                            </span>
                                                        )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route(
                                                            "admin.pages.edit",
                                                            p.id,
                                                        )}
                                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                                                    >
                                                        <Edit size={16} />
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(p.id)
                                                        }
                                                        disabled={
                                                            deletingId === p.id
                                                        }
                                                        className="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Master>
    );
}
