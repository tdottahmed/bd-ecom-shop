import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
    GripVertical, ChevronUp, ChevronDown, Trash2, Copy, Palette,
    ChevronDown as Collapse,
} from "lucide-react";
import { SECTION_META } from "./constants";
import { SectionDesignPanel } from "./SectionDesignPanel";
import {
    DescriptionEditor, FeaturesEditor, GalleryEditor, VideoEditor,
    ReviewsEditor, SpecsEditor, FaqEditor, CtaEditor, TrustBadgesEditor,
    CountdownEditor, PricingEditor, ComparisonEditor,
} from "./SectionEditors";
import type { Section, SectionType, SectionDesign } from "./types";

interface Props {
    section: Section;
    index: number;
    total: number;
    onMove: (id: string, dir: "up" | "down") => void;
    onRemove: (id: string) => void;
    onDuplicate: (id: string) => void;
    onUpdateData: (id: string, data: any) => void;
    onUpdateDesign: (id: string, design: SectionDesign) => void;
    uploadImage: (f: File) => Promise<string>;
}

export function SectionCard({
    section, index, total,
    onMove, onRemove, onDuplicate, onUpdateData, onUpdateDesign, uploadImage,
}: Props) {
    const [open, setOpen] = useState(true);
    const [designOpen, setDesignOpen] = useState(false);

    const {
        attributes, listeners, setNodeRef,
        transform, transition, isDragging,
    } = useSortable({ id: section.id });

    const meta = SECTION_META[section.type];

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const editors: Record<SectionType, React.ReactNode> = {
        description:  <DescriptionEditor  data={section.data} onChange={d => onUpdateData(section.id, d)} />,
        features:     <FeaturesEditor     data={section.data} onChange={d => onUpdateData(section.id, d)} />,
        gallery:      <GalleryEditor      data={section.data} onChange={d => onUpdateData(section.id, d)} uploadImage={uploadImage} />,
        video:        <VideoEditor        data={section.data} onChange={d => onUpdateData(section.id, d)} />,
        reviews:      <ReviewsEditor      data={section.data} onChange={d => onUpdateData(section.id, d)} />,
        specs:        <SpecsEditor        data={section.data} onChange={d => onUpdateData(section.id, d)} />,
        faq:          <FaqEditor          data={section.data} onChange={d => onUpdateData(section.id, d)} />,
        cta:          <CtaEditor          data={section.data} onChange={d => onUpdateData(section.id, d)} />,
        trust_badges: <TrustBadgesEditor  data={section.data} onChange={d => onUpdateData(section.id, d)} />,
        countdown:    <CountdownEditor    data={section.data} onChange={d => onUpdateData(section.id, d)} />,
        pricing:      <PricingEditor      data={section.data} onChange={d => onUpdateData(section.id, d)} />,
        comparison:   <ComparisonEditor   data={section.data} onChange={d => onUpdateData(section.id, d)} />,
    };

    const hasCustomDesign =
        section.design.bg_color ||
        section.design.text_color ||
        section.design.padding !== "md" ||
        section.design.align !== "left" ||
        section.design.layout_style !== "default";

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`bg-[#0b1818] border rounded-2xl overflow-hidden transition-shadow ${
                isDragging
                    ? "border-[#2DE3A7]/40 shadow-xl shadow-[#2DE3A7]/5 opacity-75 z-10 relative"
                    : "border-[#1E2826]"
            }`}
        >
            {/* Header */}
            <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#1E2826]">
                {/* Drag handle — only this element initiates the drag */}
                <button
                    type="button"
                    className="touch-none cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 shrink-0 transition-colors"
                    title="Drag to reorder"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical size={13} />
                </button>

                <span className={`shrink-0 p-1.5 rounded-lg ${meta.bg} ${meta.color}`}>{meta.icon}</span>
                <span className="text-white text-xs font-semibold flex-1 truncate">{meta.label}</span>
                {hasCustomDesign && <span className="w-1.5 h-1.5 rounded-full bg-[#2DE3A7] shrink-0" title="Has custom design" />}

                <div className="flex items-center gap-0.5">
                    <button type="button" onClick={() => onMove(section.id, "up")} disabled={index === 0}
                        className="p-1.5 text-gray-600 hover:text-white hover:bg-[#1E2826] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <ChevronUp size={12} />
                    </button>
                    <button type="button" onClick={() => onMove(section.id, "down")} disabled={index === total - 1}
                        className="p-1.5 text-gray-600 hover:text-white hover:bg-[#1E2826] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                        <ChevronDown size={12} />
                    </button>
                    <button type="button" onClick={() => onDuplicate(section.id)}
                        className="p-1.5 text-gray-600 hover:text-[#2DE3A7] hover:bg-[#1E2826] rounded-lg transition-colors" title="Duplicate">
                        <Copy size={12} />
                    </button>
                    <button type="button" onClick={() => setDesignOpen(!designOpen)}
                        className={`p-1.5 rounded-lg transition-colors ${designOpen ? "text-[#2DE3A7] bg-[#2DE3A7]/10" : "text-gray-600 hover:text-[#2DE3A7] hover:bg-[#1E2826]"}`}
                        title="Section design">
                        <Palette size={12} />
                    </button>
                    <button type="button" onClick={() => onRemove(section.id)}
                        className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove">
                        <Trash2 size={12} />
                    </button>
                    <button type="button" onClick={() => setOpen(!open)}
                        className="p-1.5 text-gray-500 hover:text-white hover:bg-[#1E2826] rounded-lg transition-colors ml-1">
                        <Collapse size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                    </button>
                </div>
            </div>

            {open && <div className="p-4">{editors[section.type]}</div>}

            {designOpen && (
                <SectionDesignPanel
                    design={section.design}
                    onChange={d => onUpdateDesign(section.id, d)}
                />
            )}
        </div>
    );
}
