import { AlignLeft, AlignCenter, AlignRight, Palette } from "lucide-react";
import { LAYOUT_STYLES } from "./constants";
import type { SectionDesign, PaddingSize, TextAlign } from "./types";
import { Field, StyledSelect, ColorInput } from "./ui";

interface Props {
    design: SectionDesign;
    onChange: (d: SectionDesign) => void;
}

export function SectionDesignPanel({ design, onChange }: Props) {
    return (
        <div className="px-4 pt-3 pb-4 bg-[#060f0e] border-t border-[#1E2826] space-y-4">
            <p className="text-[#2DE3A7]/50 text-[9px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
                <Palette size={10} /> Section Styling
            </p>

            <Field label="Layout Style">
                <div className="grid grid-cols-3 gap-2 mt-1">
                    {LAYOUT_STYLES.map(ls => (
                        <button key={ls.value} type="button"
                            onClick={() => onChange({ ...design, layout_style: ls.value })}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border-2 transition-all ${design.layout_style === ls.value ? "border-[#2DE3A7] bg-[#2DE3A7]/5" : "border-[#1E2826] hover:border-[#2DE3A7]/30 hover:bg-[#1E2826]"}`}>
                            <div className="w-full h-9 rounded-lg overflow-hidden">
                                {ls.preview}
                            </div>
                            <span className={`text-[9px] font-semibold leading-tight ${design.layout_style === ls.value ? "text-[#2DE3A7]" : "text-gray-500"}`}>
                                {ls.label}
                            </span>
                        </button>
                    ))}
                </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Background">
                    <ColorInput value={design.bg_color} onChange={v => onChange({ ...design, bg_color: v })} placeholder="transparent" />
                </Field>
                <Field label="Text Color">
                    <ColorInput value={design.text_color} onChange={v => onChange({ ...design, text_color: v })} placeholder="inherit" />
                </Field>
            </div>

            <div className="flex items-end gap-4">
                <div className="flex-1">
                    <Field label="Padding">
                        <StyledSelect value={design.padding} onChange={v => onChange({ ...design, padding: v as PaddingSize })}>
                            <option value="sm">Small (compact)</option>
                            <option value="md">Medium (normal)</option>
                            <option value="lg">Large (spacious)</option>
                        </StyledSelect>
                    </Field>
                </div>
                <Field label="Alignment">
                    <div className="flex gap-1">
                        {(["left", "center", "right"] as TextAlign[]).map(a => (
                            <button key={a} type="button" onClick={() => onChange({ ...design, align: a })}
                                className={`p-2 rounded-lg transition-colors border ${design.align === a ? "bg-[#2DE3A7] text-black border-[#2DE3A7]" : "text-gray-500 hover:text-white border-[#1E2826] hover:bg-[#1E2826]"}`}>
                                {a === "left"   && <AlignLeft   size={13} />}
                                {a === "center" && <AlignCenter size={13} />}
                                {a === "right"  && <AlignRight  size={13} />}
                            </button>
                        ))}
                    </div>
                </Field>
            </div>
        </div>
    );
}
