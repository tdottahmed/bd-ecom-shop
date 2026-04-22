import React, { useState } from "react";
import { router } from "@inertiajs/react";
import { Calendar, ChevronDown } from "lucide-react";

interface Filters {
    preset: string;
    start_date?: string | null;
    end_date?: string | null;
}

interface DateRangeFilterProps {
    routeName: string;
    filters: Filters;
}

const PRESETS = [
    { key: "today",          label: "Today" },
    { key: "yesterday",      label: "Yesterday" },
    { key: "last_7_days",    label: "7 days" },
    { key: "last_30_days",   label: "30 days" },
    { key: "last_3_months",  label: "3 months" },
    { key: "last_12_months", label: "12 months" },
    { key: "custom",         label: "Custom" },
];

export default function DateRangeFilter({ routeName, filters }: DateRangeFilterProps) {
    const [showCustom, setShowCustom] = useState(filters.preset === "custom");
    const [startDate, setStartDate] = useState(filters.start_date ?? "");
    const [endDate, setEndDate] = useState(filters.end_date ?? "");

    const applyPreset = (key: string) => {
        if (key === "custom") {
            setShowCustom(true);
            return;
        }
        setShowCustom(false);
        router.get(route(routeName), { date_range: key }, { preserveState: false });
    };

    const applyCustom = () => {
        if (!startDate || !endDate) return;
        router.get(
            route(routeName),
            { date_range: "custom", start_date: startDate, end_date: endDate },
            { preserveState: false }
        );
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            {/* Preset pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
                <Calendar size={14} className="text-gray-500 shrink-0" />
                {PRESETS.map((p) => {
                    const active = filters.preset === p.key;
                    return (
                        <button
                            key={p.key}
                            onClick={() => applyPreset(p.key)}
                            className={`px-3 py-1 text-xs rounded-full border transition-all ${
                                active
                                    ? "bg-[#2DE3A7]/10 border-[#2DE3A7]/40 text-[#2DE3A7]"
                                    : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                            }`}
                        >
                            {p.label}
                        </button>
                    );
                })}
            </div>

            {/* Custom date inputs */}
            {showCustom && (
                <div className="flex items-center gap-2">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-[#0E1614] border border-gray-700 text-gray-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#2DE3A7]"
                    />
                    <span className="text-gray-500 text-xs">—</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-[#0E1614] border border-gray-700 text-gray-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#2DE3A7]"
                    />
                    <button
                        onClick={applyCustom}
                        disabled={!startDate || !endDate}
                        className="px-3 py-1.5 text-xs bg-[#2DE3A7] text-black font-semibold rounded-lg disabled:opacity-40 hover:bg-[#25c994] transition-colors"
                    >
                        Apply
                    </button>
                </div>
            )}
        </div>
    );
}
