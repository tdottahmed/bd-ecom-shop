import CustomerLayout from "@/Layouts/CustomerLayout";
import Pagination from "@/Components/Ui/Pagination";
import { BlogPost, PaginatedData } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { CalendarDays, ChevronRight, Flame } from "lucide-react";
import { formatDate, getAssetUrl } from "@/Utils/helpers";
import CtaSection from "@/Components/Customer/CtaSection";

interface Props {
    posts: PaginatedData<BlogPost>;
    featured: BlogPost[];
}

export default function BlogIndex({ posts, featured }: Props) {
    return (
        <CustomerLayout>
            <Head title="Journal & Insights" />

            <div className="relative min-h-screen bg-brand-ivory text-slate-900 overflow-hidden font-sans selection:bg-brand-primary selection:text-white pb-20">
                {/* Stunning Ambient Background */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden flex justify-center">
                    <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-brand-primary/20 via-brand-tint/10 to-transparent opacity-40 blur-[80px] mix-blend-multiply" />
                    <div className="absolute top-[10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-brand-success/15 via-teal-100 to-transparent opacity-40 blur-[100px] mix-blend-multiply" />
                    <div className="absolute bottom-[-10%] left-[20%] h-[700px] w-[700px] rounded-full bg-gradient-to-tr from-brand-bg/50 via-brand-tint/10 to-transparent opacity-50 blur-[120px] mix-blend-multiply" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
                    {/* Hero Header */}
                    <div className="mb-20 text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 border border-white/80 shadow-sm backdrop-blur-md mb-8 transition-transform hover:scale-105">
                            <Flame size={18} className="text-brand-primary" />
                            <span className="text-xs font-bold tracking-widest text-slate-800 uppercase">Journal & Insights</span>
                        </div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl mb-6 drop-shadow-sm leading-tight">
                            Stories that <br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-tint">inspire and educate.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Discover our latest thoughts, styling insights, product guides, and behind-the-scenes stories from the team.
                        </p>
                    </div>

                    {/* Featured Section (Glassmorphism) */}
                    {featured.length > 0 && (
                        <div className="mb-24 grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {featured.map((post, idx) => (
                                <Link
                                    key={post.id}
                                    href={route("blog.show", post.slug)}
                                    className={`group relative flex flex-col justify-end overflow-hidden rounded-[2.5rem] bg-white/40 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] ${
                                        idx === 0
                                            ? "lg:col-span-8 h-[450px] sm:h-[550px]"
                                            : "lg:col-span-4 h-[450px] sm:h-[550px]"
                                    }`}
                                >
                                    <div className="absolute inset-0 overflow-hidden">
                                        <img
                                            src={getAssetUrl(post.cover_image ?? null)}
                                            alt={post.title}
                                            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/95 via-slate-900/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
                                    </div>
                                    <div className="relative z-10 p-8 sm:p-10 flex flex-col h-full justify-end">
                                        <div className="transform transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                            <p className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white border border-white/10 shadow-sm">
                                                <CalendarDays size={14} />
                                                {post.published_at
                                                    ? formatDate(post.published_at)
                                                    : "Draft"}
                                            </p>
                                            <h2 className={`font-bold text-white leading-tight mb-3 transition-colors group-hover:text-brand-tint ${idx === 0 ? "text-3xl sm:text-5xl" : "text-2xl sm:text-3xl line-clamp-3"}`}>
                                                {post.title}
                                            </h2>
                                            {post.excerpt && (
                                                <p className="mb-8 line-clamp-2 text-sm sm:text-base text-slate-200 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
                                                    {post.excerpt}
                                                </p>
                                            )}
                                            <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-white text-slate-900 transition-all duration-500 group-hover:bg-brand-primary group-hover:text-white group-hover:-rotate-45 shadow-lg">
                                                <ChevronRight size={22} />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Main Grid Section */}
                    <div className="mx-auto mt-16 max-w-2xl border-t border-slate-200/80 pt-16 sm:mt-20 lg:mx-0 lg:max-w-none">
                        <div className="mb-12 flex items-center justify-between">
                            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl px-2">Latest Posts</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
                            {posts.data.length === 0 ? (
                                <p className="col-span-full py-12 text-center text-lg text-slate-500">
                                    No entries found. Stay tuned for updates!
                                </p>
                            ) : (
                                posts.data.map((post) => (
                                    <article key={post.id} className="group flex max-w-xl flex-col items-start justify-between">
                                        <Link href={route("blog.show", post.slug)} className="w-full relative block overflow-hidden rounded-[2rem] bg-white shadow-sm border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:ring-offset-2">
                                            <div className="aspect-[16/10] w-full overflow-hidden sm:aspect-[2/1] lg:aspect-[3/2] bg-slate-50 border-b border-slate-100">
                                                <img
                                                    src={getAssetUrl(post.cover_image ?? null)}
                                                    alt={post.title}
                                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-slate-900/5 pointer-events-none" />
                                            </div>
                                        </Link>
                                        <div className="max-w-xl pr-4 mt-8 w-full px-2">
                                            <div className="flex items-center gap-x-4 text-xs">
                                                <time dateTime={post.published_at ?? ""} className="text-slate-500 font-semibold inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full">
                                                    <CalendarDays size={14} className="text-brand-primary" />
                                                    {post.published_at ? formatDate(post.published_at) : "Draft"}
                                                </time>
                                            </div>
                                            <div className="group relative mt-5">
                                                <h3 className="text-xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-brand-primary">
                                                    <Link href={route("blog.show", post.slug)} className="focus:outline-none">
                                                        <span className="absolute inset-0" />
                                                        {post.title}
                                                    </Link>
                                                </h3>
                                                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                                                    {post.excerpt || "Dive into this article to discover more insights and details."}
                                                </p>
                                            </div>
                                            <div className="mt-6 flex items-center">
                                                <Link
                                                    href={route("blog.show", post.slug)}
                                                    className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 transition-colors hover:text-brand-primary focus:outline-none"
                                                >
                                                    Read article
                                                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                                                </Link>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>

                        {posts.data.length > 0 && (
                            <div className="mt-20 flex justify-center border-t border-slate-200/80 pt-12">
                                <div className="rounded-2xl bg-white focus-within:ring-2 focus-within:ring-brand-primary/40 shadow-sm border border-slate-100 px-6 py-2 transition-shadow hover:shadow-md">
                                    <Pagination data={posts} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* CTA Section */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
                    <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-white/50 relative">
                        <CtaSection />
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
