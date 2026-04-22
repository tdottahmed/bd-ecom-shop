import React from "react";
import type { LucideProps } from "lucide-react";

interface KpiCardProps {
    label: string;
    value: string | number;
    sub?: string;
    Icon?: React.FC<LucideProps>;
    iconColor?: string;
    accent?: "green" | "blue" | "amber" | "red" | "purple" | "gray";
}

const ACCENT = {
    green:  { icon: "text-[#2DE3A7]", bg: "bg-[#2DE3A7]/10",  border: "border-[#2DE3A7]/20" },
    blue:   { icon: "text-blue-400",  bg: "bg-blue-500/10",    border: "border-blue-500/20" },
    amber:  { icon: "text-amber-400", bg: "bg-amber-500/10",   border: "border-amber-500/20" },
    red:    { icon: "text-red-400",   bg: "bg-red-500/10",     border: "border-red-500/20" },
    purple: { icon: "text-purple-400",bg: "bg-purple-500/10",  border: "border-purple-500/20" },
    gray:   { icon: "text-gray-400",  bg: "bg-gray-500/10",    border: "border-gray-700" },
};

export default function KpiCard({
    label,
    value,
    sub,
    Icon,
    accent = "green",
}: KpiCardProps) {
    const a = ACCENT[accent];

    return (
        <div className="bg-[#0E1614] border border-[#1E2826] rounded-xl p-4 flex items-start gap-3">
            {Icon && (
                <div className={`p-2 rounded-lg border shrink-0 ${a.bg} ${a.border}`}>
                    <Icon size={18} className={a.icon} />
                </div>
            )}
            <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide truncate">
                    {label}
                </p>
                <p className="text-xl font-bold text-white mt-0.5 truncate">{value}</p>
                {sub && <p className="text-xs text-gray-500 mt-0.5 truncate">{sub}</p>}
            </div>
        </div>
    );
}
