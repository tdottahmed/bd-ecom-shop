import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import { Link, router } from "@inertiajs/react";
import { Plus, ExternalLink, Pencil, Trash2, Globe, GlobeLock, Tag, Package } from "lucide-react";

interface LandingPage {
    id: number;
    slug: string;
    page_title: string;
    is_published: boolean;
    created_at: string;
    product:  { id: number; name: string } | null;
    category: { id: number; title: string } | null;
}

export default function Index({ pages }: { pages: LandingPage[] }) {
    const togglePublish = (id: number) =>
        router.post(route("admin.landing-pages.toggle-publish", id), {}, { preserveScroll: true });

    const destroy = (id: number) => {
        if (confirm("Delete this landing page?"))
            router.delete(route("admin.landing-pages.destroy", id), { preserveScroll: true });
    };

    return (
        <Master title="Landing Pages" head={<Header title="Landing Pages" showUserMenu />}>
            <div className="p-4 md:p-6 space-y-5">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                    <p className="text-gray-400 text-sm">{pages.length} page{pages.length !== 1 ? "s" : ""}</p>
                    <Link
                        href={route("admin.landing-pages.create")}
                        className="inline-flex items-center gap-2 bg-[#2DE3A7] hover:bg-[#24c490] text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={16} /> New Landing Page
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-[#0b1818] border border-[#1E2826] rounded-2xl overflow-hidden">
                    {pages.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <Globe size={40} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm">No landing pages yet. Create your first one.</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#1E2826]">
                                    {["Page", "Product", "URL", "Status", "Created", ""].map((h) => (
                                        <th key={h} className="text-left text-gray-500 text-xs font-medium uppercase tracking-wide px-5 py-3">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1E2826]">
                                {pages.map((page) => (
                                    <tr key={page.id} className="hover:bg-[#0f1e1c] transition-colors">
                                        <td className="px-5 py-4">
                                            <p className="text-white font-medium">{page.page_title}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            {page.category ? (
                                                <span className="inline-flex items-center gap-1.5 text-violet-400 text-xs font-medium">
                                                    <Tag size={11} /> {page.category.title}
                                                </span>
                                            ) : page.product ? (
                                                <span className="inline-flex items-center gap-1.5 text-gray-400 text-xs">
                                                    <Package size={11} /> {page.product.name}
                                                </span>
                                            ) : (
                                                <span className="text-gray-600 italic text-xs">None</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4">
                                            <a
                                                href={`/lp/${page.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[#2DE3A7] text-xs font-mono flex items-center gap-1 hover:underline"
                                            >
                                                /lp/{page.slug} <ExternalLink size={11} />
                                            </a>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button
                                                onClick={() => togglePublish(page.id)}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                                                    page.is_published
                                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                                        : "bg-gray-500/10 text-gray-400 border-gray-500/20 hover:bg-gray-500/20"
                                                }`}
                                            >
                                                {page.is_published
                                                    ? <><Globe size={11} /> Published</>
                                                    : <><GlobeLock size={11} /> Draft</>
                                                }
                                            </button>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 text-xs">
                                            {new Date(page.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2 justify-end">
                                                <Link
                                                    href={route("admin.landing-pages.edit", page.id)}
                                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1E2826] rounded-lg transition-colors"
                                                >
                                                    <Pencil size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => destroy(page.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </Master>
    );
}
