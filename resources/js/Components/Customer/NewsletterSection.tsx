import React, { useState } from "react";
import { Mail, ArrowRight, Sparkles, Loader2 } from "lucide-react";

type NewsletterSectionProps = {
    enabled?: boolean;
    title?: string;
    description?: string;
    placeholder?: string;
};

const NewsletterSection: React.FC<NewsletterSectionProps> = ({
    enabled = true,
    title = "Join the Inner Circle",
    description = "Subscribe for exclusive early access to major sales, new collection drops, and styling tips.",
    placeholder = "Enter your best email...",
}) => {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success">(
        "idle",
    );

    if (!enabled) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setStatus("loading");
        setTimeout(() => {
            setStatus("success");
            setTimeout(() => {
                setStatus("idle");
                setEmail("");
            }, 4000);
        }, 1500);
    };

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white shadow-2xl py-16 px-6 sm:px-12 md:py-24 text-center group isolation-auto">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 left-1/4 w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-60 -translate-y-1/2 transition-opacity duration-1000 group-hover:opacity-100 animate-[pulse_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-fuchsia-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-60 translate-y-1/2 transition-opacity duration-1000 group-hover:opacity-100" />

            {/* Subtle Grid Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHBhdGggZD0iTTAgMGgyeDRWMGgtNHptMCAwaDR2NEgwdi00eiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAxKSIvPjwvc3ZnPg==')] opacity-[0.2]" />

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                {/* Icon */}
                <div className="w-20 h-20 mb-10 relative">
                    <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-full h-full bg-slate-800/80 backdrop-blur-md rounded-[1.5rem] border border-white/10 shadow-xl flex items-center justify-center -rotate-6 transition-all duration-500 hover:rotate-6 hover:scale-110">
                        <Mail className="w-10 h-10 text-indigo-400" />
                    </div>
                </div>

                <h2 className="text-3xl md:text-5xl font-extrabold mb-5 tracking-tight">
                    {title}
                </h2>
                <p className="text-slate-300 text-base md:text-xl mb-12 max-w-lg mx-auto font-light leading-relaxed">
                    {description}
                </p>

                <div className="w-full max-w-md mx-auto relative h-[64px] transition-all duration-500">
                    {status === "success" ? (
                        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-400 font-bold px-6 text-lg animate-[fadeInDown_0.5s_ease-out]">
                            <Sparkles className="w-6 h-6" />
                            <span>You're officially on the list!</span>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="absolute inset-0 w-full animate-[fadeInUp_0.5s_ease-out]"
                        >
                            <div className="relative flex items-center h-full">
                                <input
                                    id="newsletter_email"
                                    name="newsletter_email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={placeholder}
                                    autoComplete="email"
                                    className="w-full h-full pl-6 pr-[120px] rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:bg-white/10 transition-all duration-300 shadow-inner"
                                    required
                                    disabled={status === "loading"}
                                />
                                <button
                                    type="submit"
                                    className={`absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-full font-bold text-sm tracking-wide flex items-center justify-center transition-all duration-300 ${
                                        status === "loading"
                                            ? "bg-indigo-500/50 text-white cursor-not-allowed"
                                            : "bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                                    }`}
                                    disabled={status === "loading" || !email.trim()}
                                >
                                    {status === "loading" ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <span className="hidden sm:inline-block mr-2 uppercase text-[12px]">
                                                Subscribe
                                            </span>
                                            <ArrowRight className="w-4 h-4 hidden sm:inline-block" />
                                            <span className="sm:hidden uppercase text-[12px]">
                                                Sub
                                            </span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                <p className="text-slate-400/80 text-xs md:text-sm mt-8 font-medium tracking-wide">
                    We guard your inbox passionately. Unsubscribe anytime.
                </p>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeInDown {
                    from { opacity: 0; transform: translateY(-15px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default NewsletterSection;
