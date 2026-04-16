import React from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import { Link } from "@inertiajs/react";
import { Edit, FileText, Globe } from "lucide-react";

type LegalPage = {
    id: number;
    title: string;
    slug: string;
    is_published: boolean;
    show_in_header: boolean;
    show_in_footer: boolean;
    updated_at: string;
};

interface Props {
    pages: LegalPage[];
}

const PAGE_ICONS: Record<string, React.ReactNode> = {
    "privacy-policy": <FileText size={20} className="text-[#2DE3A7]" />,
    "terms-conditions": <FileText size={20} className="text-[#2DE3A7]" />,
    "refund-policy": <FileText size={20} className="text-[#2DE3A7]" />,
};

export default function LegalPagesIndex({ pages }: Props) {
    return (
        <Master
            title="Legal Pages"
            head={<Header title="Legal Pages" showUserMenu={true} />}
        >
            <div className="p-4 md:p-6 space-y-6 max-w-8xl mx-auto">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Legal Pages
                    </h1>
                    <p className="text-sm md:text-base text-gray-400 mt-1">
                        Manage your store's legal documents and choose whether
                        each one appears in header/footer navigation.
                    </p>
                </div>

                <div className="grid gap-4">
                    {pages.map((page) => (
                        <div
                            key={page.id}
                            className="bg-[#0E1614] rounded-xl border border-[#1E2826] p-4 md:p-5 flex items-center gap-4"
                        >
                            <div className="w-10 h-10 rounded-lg bg-[#0F1A18] flex items-center justify-center shrink-0">
                                {PAGE_ICONS[page.slug] ?? (
                                    <Globe
                                        size={20}
                                        className="text-[#2DE3A7]"
                                    />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-white">
                                        {page.title}
                                    </h3>
                                    <span
                                        className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                                            page.is_published
                                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                                : "bg-gray-500/10 text-gray-300 border-gray-500/30"
                                        }`}
                                    >
                                        {page.is_published
                                            ? "Published"
                                            : "Draft"}
                                    </span>
                                    {page.show_in_header && (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded border bg-sky-500/10 text-sky-300 border-sky-500/30">
                                            Header
                                        </span>
                                    )}
                                    {page.show_in_footer && (
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded border bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
                                            Footer
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    /{page.slug}
                                </p>
                            </div>

                            <Link
                                href={route("admin.legal-pages.edit", page.id)}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm transition-colors shrink-0"
                            >
                                <Edit size={15} />
                                Edit
                            </Link>
                        </div>
                    ))}
                </div>

                <p className="text-xs text-gray-600">
                    Legal pages are fixed and cannot be removed, but you can
                    control visibility and navigation placement.
                </p>
            </div>
        </Master>
    );
}
