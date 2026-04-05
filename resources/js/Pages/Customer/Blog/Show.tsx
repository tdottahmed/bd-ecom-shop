import CustomerLayout from "@/Layouts/CustomerLayout";
import { BlogPost } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { CalendarDays, ChevronRight, ArrowLeft } from "lucide-react";
import { formatDate, getAssetUrl } from "@/Utils/helpers";
import CtaSection from "@/Components/Customer/CtaSection";

interface Props {
    post: BlogPost;
    related: BlogPost[];
}

export default function BlogShow({ post, related }: Props) {
    return (
        <CustomerLayout>
            <Head title={post.title} />

            <div className="relative min-h-screen bg-[#fafcff] pb-24 selection:bg-[#2DE3A7] selection:text-white font-sans">
                {/* Immersive Cover Image Hero */}
                <div className="relative w-full h-[65vh] min-h-[500px] overflow-hidden bg-slate-900">
                    <img
                        src={getAssetUrl(post.cover_image ?? null)}
                        alt={post.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

                    {/* Header Content placed over image */}
                    <div className="absolute inset-x-0 bottom-0 z-10 mx-auto max-w-4xl px-4 pb-32 sm:px-6 lg:px-8">
                        <Link
                            href={route("blog.index")}
                            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
                        >
                            <ArrowLeft size={16} />
                            Back to journal
                        </Link>

                        <header>
                            <div className="mb-6 flex flex-wrap items-center gap-4">
                                <p className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 text-xs font-bold tracking-wide text-white border border-white/10 shadow-sm uppercase">
                                    <CalendarDays size={14} />
                                    {post.published_at
                                        ? formatDate(post.published_at)
                                        : "Draft"}
                                </p>
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl drop-shadow-lg leading-tight lg:leading-[1.1]">
                                {post.title}
                            </h1>
                            {post.excerpt && (
                                <p className="mt-6 text-xl leading-relaxed text-slate-200 max-w-3xl drop-shadow-md">
                                    {post.excerpt}
                                </p>
                            )}
                        </header>
                    </div>
                </div>

                {/* Floating Article Body */}
                <article className="relative z-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-24">
                    <div
                        className="prose prose-slate prose-lg md:prose-xl max-w-none rounded-[2.5rem] bg-white p-8 sm:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-slate-100 prose-headings:font-bold prose-headings:tracking-tight prose-a:text-emerald-600 hover:prose-a:text-emerald-500 prose-img:rounded-3xl prose-img:shadow-xl prose-img:ring-1 prose-img:ring-slate-100"
                        dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
                    />
                </article>

                {/* Related Articles mapped to match Index layout */}
                {related.length > 0 && (
                    <section className="mx-auto max-w-7xl px-4 mt-32 sm:px-6 lg:px-8">
                        <div className="mb-12 flex items-center justify-between border-b border-slate-200/80 pb-6">
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Continue reading
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-3">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    href={route("blog.show", item.slug)}
                                    className="group relative flex flex-col items-start overflow-hidden rounded-[2rem] bg-white shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                                >
                                    <div className="aspect-[16/10] w-full overflow-hidden bg-slate-50 border-b border-slate-100 relative">
                                        <img
                                            src={getAssetUrl(
                                                item.cover_image ?? null,
                                            )}
                                            alt={item.title}
                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 rounded-t-[2rem] ring-1 ring-inset ring-slate-900/5 pointer-events-none" />
                                    </div>
                                    <div className="p-8 w-full flex-grow flex flex-col">
                                        <h3 className="text-2xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-emerald-600 line-clamp-2">
                                            {item.title}
                                        </h3>
                                        <p className="mt-4 line-clamp-2 text-sm sm:text-base leading-relaxed text-slate-600 flex-grow">
                                            {item.excerpt ||
                                                "Explore this article for more details."}
                                        </p>
                                        <div className="mt-8 flex items-center text-sm font-bold text-slate-900 transition-colors group-hover:text-emerald-500">
                                            Read article
                                            <ChevronRight
                                                size={18}
                                                className="ml-1 transition-transform group-hover:translate-x-1"
                                            />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <CtaSection />
            </div>
        </CustomerLayout>
    );
}
