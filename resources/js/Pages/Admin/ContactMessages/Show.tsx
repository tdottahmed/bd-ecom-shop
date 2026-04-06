import React from "react";
import { Head, Link, router } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import { ArrowLeft, User, Mail, Calendar, MessageSquare, Trash2, Tag } from "lucide-react";

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
    message: ContactMessage;
}

export default function ContactMessageShow({ message }: Props) {
    const remove = () => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        router.delete(route("admin.contact-messages.destroy", message.id));
    };

    return (
        <Master title="Contact Message Details" head={<Header title="Contact Message" showUserMenu={true} />}>
            <Head title={`Message from ${message.first_name}`} />

            <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
                <div className="flex items-center justify-between">
                    <Link
                        href={route("admin.contact-messages.index")}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Messages</span>
                    </Link>

                    <button
                        onClick={remove}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 hover:bg-red-600/20 rounded-lg transition-colors font-medium text-sm"
                    >
                        <Trash2 size={16} />
                        Delete Message
                    </button>
                </div>

                <div className="bg-[#0E1614] border border-[#1E2826] rounded-xl overflow-hidden shadow-sm">
                    <div className="p-6 md:p-8 border-b border-[#1E2826] flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                                {message.subject}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                <span className="flex items-center gap-1.5">
                                    <User size={14} className="text-emerald-500" />
                                    {message.first_name} {message.last_name || ""}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Mail size={14} className="text-emerald-500" />
                                    <a href={`mailto:${message.email}`} className="hover:text-emerald-400 transition-colors">
                                        {message.email}
                                    </a>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-emerald-500" />
                                    {new Date(message.created_at).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8 bg-[#151F1D]">
                        <div className="flex items-start gap-4">
                            <div className="shrink-0 pt-1">
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#0F1A18] border border-[#1E2826] text-gray-400">
                                    <MessageSquare size={18} />
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">
                                    Message Body
                                </p>
                                <div className="text-gray-200 leading-relaxed whitespace-pre-wrap bg-[#0E1614] p-5 rounded-xl border border-[#1E2826]">
                                    {message.message}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Master>
    );
}
