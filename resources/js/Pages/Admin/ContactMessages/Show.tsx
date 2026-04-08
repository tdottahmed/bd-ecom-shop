import React, { useMemo, useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import {
    ArrowLeft,
    User,
    Mail,
    Calendar,
    MessageSquare,
    Trash2,
    Reply,
} from "lucide-react";

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
    const [isReplyOpen, setIsReplyOpen] = useState(false);

    const defaultSubject = useMemo(() => {
        const base = message.subject?.trim() || "Your message";
        return base.toLowerCase().startsWith("re:") ? base : `Re: ${base}`;
    }, [message.subject]);

    const { data, setData, post, processing, errors, reset } = useForm({
        subject: defaultSubject,
        message: "",
    });

    const remove = () => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        router.delete(route("admin.contact-messages.destroy", message.id));
    };

    const openReply = () => {
        setIsReplyOpen(true);
        setData("subject", defaultSubject);
    };

    const closeReply = () => {
        setIsReplyOpen(false);
        reset("message");
    };

    const sendReply = () => {
        post(route("admin.contact-messages.reply", message.id), {
            preserveScroll: true,
            onSuccess: () => closeReply(),
        });
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

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={openReply}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1E2826] hover:bg-[#2A3532] border border-[#2DE3A7]/20 hover:border-[#2DE3A7]/35 rounded-lg transition-colors font-semibold text-sm text-gray-200"
                        >
                            <Reply size={16} className="text-[#2DE3A7]" />
                            Reply
                        </button>
                        <button
                            onClick={remove}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/10 text-red-500 hover:bg-red-600/20 rounded-lg transition-colors font-medium text-sm"
                        >
                            <Trash2 size={16} />
                            Delete
                        </button>
                    </div>
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

            {isReplyOpen && (
                <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={closeReply}
                    />
                    <div className="relative w-full md:max-w-2xl bg-[#0E1614] border border-[#1E2826] rounded-t-2xl md:rounded-2xl shadow-[0_18px_60px_rgba(0,0,0,0.6)] overflow-hidden">
                        <div className="p-4 md:p-5 border-b border-[#1E2826] flex items-center justify-between">
                            <div className="min-w-0">
                                <div className="text-base font-semibold text-white">
                                    Reply to {message.email}
                                </div>
                                <div className="text-xs text-gray-400 mt-0.5 truncate">
                                    Original subject: {message.subject}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeReply}
                                className="px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#151F1D] transition-colors text-sm"
                            >
                                Close
                            </button>
                        </div>

                        <div className="p-4 md:p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-2">
                                    Subject
                                </label>
                                <input
                                    value={data.subject}
                                    onChange={(e) =>
                                        setData("subject", e.target.value)
                                    }
                                    className="w-full bg-[#151F1D] border border-[#2A3633] focus:border-[#2DE3A7]/50 focus:ring-2 focus:ring-[#2DE3A7]/20 rounded-xl px-4 py-3 text-sm text-white outline-none"
                                    placeholder="Subject"
                                />
                                {errors.subject && (
                                    <div className="text-xs text-red-400 mt-1">
                                        {errors.subject}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    value={data.message}
                                    onChange={(e) =>
                                        setData("message", e.target.value)
                                    }
                                    className="w-full min-h-[160px] bg-[#151F1D] border border-[#2A3633] focus:border-[#2DE3A7]/50 focus:ring-2 focus:ring-[#2DE3A7]/20 rounded-xl px-4 py-3 text-sm text-white outline-none"
                                    placeholder="Write your reply…"
                                />
                                {errors.message && (
                                    <div className="text-xs text-red-400 mt-1">
                                        {errors.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="p-4 md:p-5 border-t border-[#1E2826] flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
                            <div className="text-xs text-gray-400">
                                This will be sent via queue.
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={closeReply}
                                    className="px-4 py-2.5 rounded-xl bg-[#1E2826] hover:bg-[#2A3532] border border-[#2A3633] text-gray-200 text-sm font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={sendReply}
                                    disabled={processing}
                                    className="px-4 py-2.5 rounded-xl bg-[#2DE3A7] text-[#0C1311] hover:bg-[#26c28f] disabled:opacity-60 text-sm font-extrabold transition-colors"
                                >
                                    {processing ? "Queueing…" : "Send Reply"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Master>
    );
}
