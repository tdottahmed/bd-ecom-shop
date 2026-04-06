import React from "react";
import { Head, router, Link } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Pagination from "@/Components/Ui/Pagination";
import { Trash2, Eye } from "lucide-react";

type ContactMessage = {
    id: number;
    first_name: string;
    last_name?: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
};

interface Props {
    messages: any;
}

export default function ContactMessageIndex({ messages }: Props) {

    const remove = (id: number) => {
        if (!confirm("Remove this message?")) return;
        router.delete(route("admin.contact-messages.destroy", id), {
            preserveScroll: true,
        });
    };

    return (
        <Master title="Contact Messages" head={<Header title="Contact Messages" showUserMenu={true} />}>
            <Head title="Contact Messages" />

            <div className="p-4 md:p-6 space-y-5 max-w-8xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Contact Messages
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Manage user inquiries submitted through the contact page.
                        </p>
                    </div>
                </div>

                <div className="bg-[#0E1614] rounded-xl border border-[#1E2826] overflow-hidden">
                    <div className="overflow-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#0F1A18] text-gray-300">
                                <tr>
                                    <th className="text-left px-4 py-3">Name</th>
                                    <th className="text-left px-4 py-3">Email</th>
                                    <th className="text-left px-4 py-3">Subject</th>
                                    <th className="text-left px-4 py-3">Message</th>
                                    <th className="text-left px-4 py-3">Date</th>
                                    <th className="text-right px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1E2826]">
                                {messages.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                                            No messages found.
                                        </td>
                                    </tr>
                                ) : (
                                    messages.data.map((item: ContactMessage) => (
                                        <tr key={item.id} className="text-gray-200">
                                            <td className="px-4 py-3 font-medium capitalize">
                                                {item.first_name} {item.last_name || ""}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.email}
                                            </td>
                                            <td className="px-4 py-3 text-emerald-400 font-medium">
                                                {item.subject}
                                            </td>
                                            <td className="px-4 py-3 max-w-xs truncate text-gray-400">
                                                {item.message}
                                            </td>
                                            <td className="px-4 py-3 text-gray-400">
                                                {new Date(item.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-2">
                                                    <Link
                                                        href={route('admin.contact-messages.show', item.id)}
                                                        className="inline-flex items-center px-3 py-2 rounded-lg bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600/20"
                                                    >
                                                        <Eye size={14} />
                                                    </Link>
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
                    <Pagination data={messages} />
                </div>
            </div>
        </Master>
    );
}
