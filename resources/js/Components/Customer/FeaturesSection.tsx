import React from "react";
import { Truck, ShieldCheck, Clock, Headphones } from "lucide-react";

type FeatureItem = {
    icon?: string | null;
    title?: string | null;
    description?: string | null;
    tone?: string | null;
};

const ICONS: Record<string, any> = {
    Truck,
    ShieldCheck,
    Clock,
    Headphones,
};

const TONES: Record<
    string,
    { bgColor: string; iconColor: string }
> = {
    indigo: { bgColor: "bg-indigo-50", iconColor: "text-indigo-600" },
    emerald: { bgColor: "bg-emerald-50", iconColor: "text-emerald-600" },
    amber: { bgColor: "bg-amber-50", iconColor: "text-amber-600" },
    rose: { bgColor: "bg-rose-50", iconColor: "text-rose-600" },
    slate: { bgColor: "bg-slate-50", iconColor: "text-slate-600" },
};

const DEFAULT_ITEMS: FeatureItem[] = [
    {
        icon: "Truck",
        title: "Free Shipping",
        description: "On all orders over RM 100",
        tone: "indigo",
    },
    {
        icon: "ShieldCheck",
        title: "Secure Payment",
        description: "100% secure payment",
        tone: "emerald",
    },
    {
        icon: "Clock",
        title: "24/7 Support",
        description: "Dedicated support",
        tone: "amber",
    },
    {
        icon: "Headphones",
        title: "Money-Back",
        description: "30 days guarantee",
        tone: "rose",
    },
];

const FeaturesSection: React.FC<{
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    items?: FeatureItem[];
}> = ({
    enabled = true,
    title = "Why shop with us",
    subtitle = "Fast delivery, secure payments, and great support.",
    items = DEFAULT_ITEMS,
}) => {
    if (!enabled) return null;

    const safeItems = (Array.isArray(items) ? items : DEFAULT_ITEMS).slice(
        0,
        8,
    );

    return (
        <section>
            <div className="mb-5 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-2 text-slate-600">{subtitle}</p>
                )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {safeItems.map((feature, index) => {
                    const Icon =
                        (feature.icon && ICONS[feature.icon]) || Truck;
                    const tone = (feature.tone ?? "slate").toLowerCase();
                    const colors = TONES[tone] ?? TONES.slate;

                    return (
                        <div
                            key={index}
                            className="group flex flex-col sm:flex-row items-center p-4 sm:p-5 lg:p-6 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out hover:-translate-y-1 text-center sm:text-left"
                        >
                            <div
                                className={`flex-shrink-0 w-12 h-12 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center ${colors.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                            >
                                <Icon
                                    className={`w-6 h-6 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${colors.iconColor}`}
                                />
                            </div>
                            <div className="mt-3 sm:mt-0 sm:ml-4 flex-1">
                                <h3 className="text-sm font-semibold text-slate-800 lg:text-base leading-tight">
                                    {feature.title || "Feature"}
                                </h3>
                                <p className="text-[11px] sm:text-xs lg:text-sm text-slate-500 mt-1 md:mt-1.5 leading-snug">
                                    {feature.description || ""}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FeaturesSection;
