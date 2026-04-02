import CustomerLayout from "@/Layouts/CustomerLayout";
import Pagination from "@/Components/Ui/Pagination";
import { BlogPost, PaginatedData } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { CalendarDays, ChevronRight } from "lucide-react";
import { formatDate, getAssetUrl } from "@/Utils/helpers";
import CtaSection from "@/Components/Customer/CtaSection";

interface Props {
    posts: PaginatedData<BlogPost>;
    featured: BlogPost[];
}

export default function BlogIndex({ posts, featured }: Props) {
    return (
        <CustomerLayout>
            <Head title="Blog" />

            <div className="relative min-h-screen max-w-8xl mx-auto bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
                <div className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center">
                    <div className="h-72 w-[36rem] rounded-full bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 opacity-35 blur-3xl" />
                </div>

                <section className="relative mx-auto max-w-full px-4 pb-8 pt-10 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                            The Blog
                        </h1>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-500">
                            Stories, styling insights, and product guides from
                            our team.
                        </p>
                    </div>

                    {featured.length > 0 && (
                        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
                            {featured.map((post, idx) => (
                                <Link
                                    key={post.id}
                                    href={route("blog.show", post.slug)}
                                    className={`group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${
                                        idx === 0
                                            ? "lg:col-span-2 lg:row-span-2"
                                            : ""
                                    }`}
                                >
                                    <div
                                        className={`${idx === 0 ? "h-72" : "h-44"} overflow-hidden`}
                                    >
                                        <img
                                            src={getAssetUrl(
                                                post.cover_image ?? null,
                                            )}
                                            alt={post.title}
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-5">
                                        <p className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-gray-500">
                                            <CalendarDays size={12} />
                                            {post.published_at
                                                ? formatDate(post.published_at)
                                                : "Draft"}
                                        </p>
                                        <h2 className="line-clamp-2 text-xl font-bold text-gray-900">
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                                                {post.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="rounded-3xl border border-slate-100 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.14)]">
                        <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 lg:grid-cols-3 lg:p-8">
                            {posts.data.length === 0 ? (
                                <p className="col-span-full py-12 text-center text-gray-500">
                                    No blog posts published yet.
                                </p>
                            ) : (
                                posts.data.map((post) => (
                                    <article
                                        key={post.id}
                                        className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <Link
                                            href={route("blog.show", post.slug)}
                                        >
                                            <div className="h-48 overflow-hidden">
                                                <img
                                                    src={getAssetUrl(
                                                        post.cover_image ??
                                                            null,
                                                    )}
                                                    alt={post.title}
                                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                                />
                                            </div>
                                        </Link>
                                        <div className="p-4">
                                            <p className="mb-2 inline-flex items-center gap-1 text-xs text-gray-500">
                                                <CalendarDays size={12} />
                                                {post.published_at
                                                    ? formatDate(
                                                          post.published_at,
                                                      )
                                                    : "Draft"}
                                            </p>
                                            <h3 className="line-clamp-2 text-lg font-bold text-gray-900">
                                                {post.title}
                                            </h3>
                                            <p className="mt-2 line-clamp-3 text-sm text-gray-600">
                                                {post.excerpt ||
                                                    "Read this post to learn more."}
                                            </p>
                                            <Link
                                                href={route(
                                                    "blog.show",
                                                    post.slug,
                                                )}
                                                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0C1311] transition hover:text-[#2DE3A7]"
                                            >
                                                Read article
                                                <ChevronRight size={15} />
                                            </Link>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>

                        <div className="overflow-hidden rounded-b-3xl border-t border-gray-100">
                            <Pagination data={posts} />
                        </div>
                    </div>
                </section>
                <div className="max-w-8xl mx-auto">
                        <CtaSection />
                </div>
            </div>
        </CustomerLayout>
    );
}
