import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Pagination from "@/Components/Ui/Pagination";
import Master from "@/Layouts/Master";
import { BlogPost, PaginatedData } from "@/types";
import { Link, router } from "@inertiajs/react";
import { Edit, Plus, Trash2 } from "lucide-react";
import { formatDate } from "@/Utils/helpers";
import { useState } from "react";

interface Props {
    posts: PaginatedData<BlogPost>;
}

export default function BlogsIndex({ posts }: Props) {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const removePost = (post: BlogPost) => {
        if (!confirm(`Delete "${post.title}"?`)) return;

        setDeletingId(post.id);
        router.delete(route("admin.blogs.destroy", post.id), {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        });
    };

    return (
        <Master title="Blog">
            <div className="mx-auto max-w-8xl space-y-6 p-4 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white md:text-3xl">
                            Blog posts
                        </h1>
                        <p className="mt-1 text-sm text-gray-400">
                            Create inspiring posts for your storefront and SEO.
                        </p>
                    </div>
                    <Link href={route("admin.blogs.create")}>
                        <PrimaryButton className="inline-flex items-center gap-2">
                            <Plus size={16} />
                            New post
                        </PrimaryButton>
                    </Link>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#1E2826] bg-[#0E1614]">
                    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.data.length === 0 ? (
                            <div className="col-span-full rounded-xl border border-dashed border-[#1E2826] p-10 text-center text-gray-400">
                                No blog posts yet.
                            </div>
                        ) : (
                            posts.data.map((post) => (
                                <article
                                    key={post.id}
                                    className="rounded-xl border border-[#1E2826] bg-[#0C1311] p-4 transition hover:border-[#2DE3A7]/40"
                                >
                                    <p className="mb-2 text-xs text-gray-500">
                                        {post.published_at
                                            ? `Published ${formatDate(post.published_at)}`
                                            : "Not published"}
                                    </p>
                                    <h3 className="line-clamp-2 text-lg font-semibold text-white">
                                        {post.title}
                                    </h3>
                                    <p className="mt-2 line-clamp-3 text-sm text-gray-400">
                                        {post.excerpt || "No excerpt provided."}
                                    </p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                post.is_published
                                                    ? "bg-emerald-500/15 text-emerald-300"
                                                    : "bg-gray-600/20 text-gray-300"
                                            }`}
                                        >
                                            {post.is_published
                                                ? "Published"
                                                : "Draft"}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={route(
                                                    "admin.blogs.edit",
                                                    post.id
                                                )}
                                                className="rounded-lg bg-emerald-600 p-2 text-white transition hover:bg-emerald-700"
                                            >
                                                <Edit size={15} />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => removePost(post)}
                                                disabled={deletingId === post.id}
                                                className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700 disabled:opacity-50"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>

                    <div className="border-t border-[#1E2826]">
                        <Pagination data={posts} />
                    </div>
                </div>
            </div>
        </Master>
    );
}

