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
    const [status, setStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [message, setMessage] = useState("");

    if (!enabled) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            setStatus("loading");
            setMessage("");

            const response = await fetch(route("newsletter.subscribe"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    "X-CSRF-TOKEN":
                        (
                            document.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement | null
                        )?.content || "",
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            if (!response.ok) {
                throw new Error("Subscription failed.");
            }

            setStatus("success");
            setMessage("You're officially on the list!");
            setTimeout(() => {
                setStatus("idle");
                setEmail("");
                setMessage("");
            }, 3500);
        } catch {
            setStatus("error");
            setMessage("Could not subscribe right now. Please try again.");
        }
    };

    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-[0_20px_50px_rgba(15,23,42,0.2)] px-4 py-5 sm:px-6 sm:py-6 group">
            {/* Compact glow accents */}
            <div className="pointer-events-none absolute -top-24 -left-20 h-48 w-48 rounded-full bg-indigo-500/25 blur-3xl transition-opacity duration-500 group-hover:opacity-90" />
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl transition-opacity duration-500 group-hover:opacity-90" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
                {/* Left: compact content */}
                <div className="flex items-start gap-3 min-w-0 lg:w-1/2">
                    <div className="h-11 w-11 shrink-0 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold leading-tight">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-slate-300 line-clamp-2">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Right: compact form/status */}
                <div className="lg:w-1/2">
                    <div className="w-full relative h-[50px]">
                        {status === "success" || status === "error" ? (
                            <div
                                className={`absolute inset-0 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold px-4 animate-[fadeInDown_0.4s_ease-out] ${
                                    status === "error"
                                        ? "bg-rose-500/20 border border-rose-500/50 text-rose-300"
                                        : "bg-emerald-500/20 border border-emerald-500/50 text-emerald-300"
                                }`}
                            >
                                {status === "success" && (
                                    <Sparkles className="w-4 h-4" />
                                )}
                                <span
                                    className={
                                        status === "error"
                                            ? "text-rose-300"
                                            : undefined
                                    }
                                >
                                    {message}
                                </span>
                            </div>
                        ) : (
                            <form
                                onSubmit={handleSubmit}
                                className="absolute inset-0 w-full animate-[fadeInUp_0.4s_ease-out]"
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
                                        className="w-full h-full pl-4 pr-[115px] rounded-xl border border-white/15 bg-white/10 backdrop-blur-xl text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400/60 focus:bg-white/15 transition-all duration-300 text-sm"
                                        required
                                        disabled={status === "loading"}
                                    />
                                    <button
                                        type="submit"
                                        className={`absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg font-semibold text-xs tracking-wide flex items-center justify-center gap-1.5 transition-all duration-300 ${
                                            status === "loading"
                                                ? "bg-indigo-500/50 text-white cursor-not-allowed"
                                                : "bg-white text-slate-900 hover:bg-slate-100 active:scale-[0.98] shadow"
                                        }`}
                                        disabled={status === "loading" || !email.trim()}
                                    >
                                        {status === "loading" ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <>
                                                <span className="uppercase">Subscribe</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    <p className="mt-2 text-[11px] text-slate-400">
                        No spam. Unsubscribe anytime.
                    </p>
                </div>
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
