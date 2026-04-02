import CustomerLayout from "@/Layouts/CustomerLayout";
import { BlogPost } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate, getAssetUrl } from "@/Utils/helpers";

interface Props {
    post: BlogPost;
    related: BlogPost[];
}

export default function BlogShow({ post, related }: Props) {
    return (
        <CustomerLayout>
            <Head title={post.title} />

            <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100">
                <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                    <Link
                        href={route("blog.index")}
                        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#0C1311]"
                    >
                        <ChevronLeft size={16} />
                        Back to blog
                    </Link>

                    <header className="mb-6">
                        <p className="mb-3 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            <CalendarDays size={12} />
                            {post.published_at
                                ? formatDate(post.published_at)
                                : "Draft"}
                        </p>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                            {post.title}
                        </h1>
                        {post.excerpt && (
                            <p className="mt-4 text-lg leading-relaxed text-slate-600">
                                {post.excerpt}
                            </p>
                        )}
                    </header>

                    <div className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <img
                            src={getAssetUrl(post.cover_image ?? null)}
                            alt={post.title}
                            className="h-72 w-full object-cover sm:h-[26rem]"
                        />
                    </div>

                    <div
                        className="prose prose-slate prose-lg max-w-none rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
                        dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                    />
                </article>

                {related.length > 0 && (
                    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
                        <h2 className="mb-5 text-2xl font-bold text-slate-900">
                            More articles
                        </h2>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route("blog.show", item.slug)}
                                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="h-44 overflow-hidden">
                                        <img
                                            src={getAssetUrl(item.cover_image ?? null)}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
                                            {item.title}
                                        </h3>
                                        <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                                            {item.excerpt ||
                                                "Explore this article for more details."}
                                        </p>
                                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#0C1311] group-hover:text-[#2DE3A7]">
                                            Read more
                                            <ChevronRight size={15} />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </CustomerLayout>
    );
}

