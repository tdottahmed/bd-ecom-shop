import { useState } from "react";
import { Plus } from "lucide-react";
import { SECTION_META } from "./constants";
import type { SectionType } from "./types";

interface Props {
    onAdd: (type: SectionType) => void;
}

export function AddSectionPicker({ onAdd }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1E2826] hover:border-[#2DE3A7]/50 text-gray-600 hover:text-[#2DE3A7] rounded-2xl py-5 text-sm font-medium transition-all duration-200"
            >
                <Plus size={16} /> Add Section
            </button>

            {open && (
                <div className="absolute left-0 right-0 mt-2 bg-[#0b1818] border border-[#1E2826] rounded-2xl p-4 z-20 shadow-2xl">
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold mb-3">Choose a section type</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {(Object.entries(SECTION_META) as [SectionType, typeof SECTION_META[SectionType]][]).map(([type, meta]) => (
                            <button key={type} type="button"
                                onClick={() => { onAdd(type); setOpen(false); }}
                                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1E2826] transition-colors group text-left">
                                <span className={`shrink-0 p-2 rounded-lg ${meta.bg} ${meta.color} group-hover:scale-105 transition-transform`}>
                                    {meta.icon}
                                </span>
                                <div>
                                    <p className="text-white text-xs font-semibold leading-tight">{meta.label}</p>
                                    <p className="text-gray-600 text-[10px] leading-tight mt-0.5">{meta.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
