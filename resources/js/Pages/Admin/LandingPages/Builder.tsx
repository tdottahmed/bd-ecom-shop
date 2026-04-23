import { useState, useCallback } from "react";
import { useForm } from "@inertiajs/react";
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor,
    useSensor, useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
    SortableContext, sortableKeyboardCoordinates,
    verticalListSortingStrategy, arrayMove,
} from "@dnd-kit/sortable";
import { Globe, GlobeLock, Save, ExternalLink, CheckSquare } from "lucide-react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";

import type { LandingPage, Product, Category, Section, SectionType, HeroLayout, PanelTab } from "./builder/types";
import { DEFAULT_DESIGN, HERO_LAYOUTS, FONT_OPTIONS, SECTION_DEFAULTS, PANEL_TABS } from "./builder/constants";
import { uid, toSlug, normalizeSection } from "./builder/helpers";
import { Field, Input, Textarea, StyledSelect, ColorInput, Divider } from "./builder/ui";
import { SectionCard } from "./builder/SectionCard";
import { AddSectionPicker } from "./builder/AddSectionPicker";
import { HeroImageUpload } from "./builder/HeroImageUpload";

// ─── Types ────────────────────────────────────────────────────────────────────

type PageFormData = {
    page_title: string; slug: string; meta_description: string;
    product_id: string; category_id: string;
    hero_headline: string; hero_subheadline: string; hero_badge: string;
    hero_image: File | null; hero_cta_text: string; hero_cta_url: string;
    hero_layout: HeroLayout; hero_bg_color: string; hero_text_color: string;
    accent_color: string; global_bg_color: string; global_font_family: string;
    sections: string; is_published: boolean;
};

// ─── Builder ──────────────────────────────────────────────────────────────────

export default function Builder({
    products, categories, page,
}: {
    products: Product[];
    categories: Category[];
    page: LandingPage | null;
}) {
    const isEdit = !!page;

    const initMode = page?.category_id ? "category" : page?.product_id ? "product" : "none";
    const [pageMode, setPageMode] = useState<"product" | "category" | "none">(initMode);
    const [activeTab, setActiveTab] = useState<PanelTab>("page");
    const [heroPreview, setHeroPreview] = useState<string | null>(
        page?.hero_image ? `/storage/${page.hero_image}` : null
    );

    const { data, setData, post, put, processing, errors } = useForm<PageFormData>({
        page_title:         page?.page_title ?? "",
        slug:               page?.slug ?? "",
        meta_description:   page?.meta_description ?? "",
        product_id:         page?.product_id?.toString() ?? "",
        category_id:        page?.category_id?.toString() ?? "",
        hero_headline:      page?.hero_headline ?? "",
        hero_subheadline:   page?.hero_subheadline ?? "",
        hero_badge:         page?.hero_badge ?? "",
        hero_image:         null,
        hero_cta_text:      page?.hero_cta_text ?? "Order Now",
        hero_cta_url:       page?.hero_cta_url ?? "",
        hero_layout:        page?.hero_layout ?? "split-right",
        hero_bg_color:      page?.hero_bg_color ?? "",
        hero_text_color:    page?.hero_text_color ?? "",
        accent_color:       page?.accent_color ?? "#2DE3A7",
        global_bg_color:    page?.global_bg_color ?? "",
        global_font_family: page?.global_font_family ?? "",
        sections:           page?.sections ? JSON.stringify(page.sections.map(normalizeSection)) : "[]",
        is_published:       page?.is_published ?? false,
    });

    const [sections, setSections] = useState<Section[]>(
        page?.sections ? page.sections.map(normalizeSection) : []
    );

    // ── DnD sensors — require 8px movement to start drag so clicks still work ──
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    // ── Section state helpers ──────────────────────────────────────────────────

    const syncSections = useCallback((next: Section[]) => {
        setSections(next);
        setData("sections", JSON.stringify(next));
    }, [setData]);

    const addSection = (type: SectionType) =>
        syncSections([...sections, { id: uid(), type, data: { ...SECTION_DEFAULTS[type] }, design: { ...DEFAULT_DESIGN } }]);

    const removeSection = (id: string) =>
        syncSections(sections.filter(s => s.id !== id));

    const duplicateSection = (id: string) => {
        const idx = sections.findIndex(s => s.id === id);
        if (idx === -1) return;
        const src = sections[idx];
        const copy: Section = { ...src, id: uid(), data: JSON.parse(JSON.stringify(src.data)), design: { ...src.design } };
        const next = [...sections];
        next.splice(idx + 1, 0, copy);
        syncSections(next);
    };

    const moveSection = (id: string, dir: "up" | "down") => {
        const idx = sections.findIndex(s => s.id === id);
        const next = [...sections];
        if (dir === "up"   && idx > 0)             [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        if (dir === "down" && idx < next.length - 1) [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        syncSections(next);
    };

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIdx = sections.findIndex(s => s.id === active.id);
            const newIdx = sections.findIndex(s => s.id === over.id);
            syncSections(arrayMove(sections, oldIdx, newIdx));
        }
    }, [sections, syncSections]);

    const updateSectionData   = (id: string, newData: any)          => syncSections(sections.map(s => s.id === id ? { ...s, data: newData }   : s));
    const updateSectionDesign = (id: string, design: Section["design"]) => syncSections(sections.map(s => s.id === id ? { ...s, design }       : s));

    // ── Hero image ─────────────────────────────────────────────────────────────

    const handleHeroImage = (file: File) => {
        setData("hero_image", file);
        setHeroPreview(URL.createObjectURL(file));
    };

    // ── Gallery image upload ───────────────────────────────────────────────────

    const uploadImage = useCallback(async (file: File): Promise<string> => {
        const fd = new FormData();
        fd.append("image", file);
        const xsrf = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/)?.[1] ?? "";
        const res = await fetch(route("admin.landing-pages.upload-image"), {
            method: "POST",
            headers: { "X-XSRF-TOKEN": decodeURIComponent(xsrf) },
            body: fd,
        });
        const json = await res.json();
        return json.url;
    }, []);

    // ── Form submit ────────────────────────────────────────────────────────────

    const handleSubmit = () => {
        if (isEdit) put(route("admin.landing-pages.update", page!.id), { forceFormData: true });
        else        post(route("admin.landing-pages.store"), { forceFormData: true });
    };

    const err = (field: keyof typeof errors) =>
        errors[field] ? <p className="text-red-400 text-xs mt-1">{errors[field]}</p> : null;

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <Master
            title={isEdit ? "Edit Landing Page" : "New Landing Page"}
            head={<Header title={isEdit ? "Edit Landing Page" : "New Landing Page"} showUserMenu />}
        >
            <div className="p-4 md:p-5">

                {/* Action bar */}
                <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
                    <div className="flex items-center gap-3">
                        <span className="text-gray-600 text-xs">
                            {sections.length} section{sections.length !== 1 ? "s" : ""}
                        </span>
                        {isEdit && (
                            <a href={`/lp/${page!.slug}`} target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#2DE3A7] transition-colors border border-[#1E2826] hover:border-[#2DE3A7]/30 px-2.5 py-1.5 rounded-lg">
                                <ExternalLink size={12} /> Preview Page
                            </a>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <div onClick={() => setData("is_published", !data.is_published)}
                                className={`relative w-9 h-5 rounded-full transition-colors ${data.is_published ? "bg-[#2DE3A7]" : "bg-[#1E2826]"}`}>
                                <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${data.is_published ? "translate-x-4" : ""}`} />
                            </div>
                            <span className="text-gray-400 text-sm flex items-center gap-1">
                                {data.is_published
                                    ? <><Globe size={12} className="text-[#2DE3A7]" /> Published</>
                                    : <><GlobeLock size={12} /> Draft</>}
                            </span>
                        </label>
                        <button type="button" onClick={handleSubmit} disabled={processing}
                            className="inline-flex items-center gap-2 bg-[#2DE3A7] hover:bg-[#24c490] disabled:opacity-50 text-black text-sm font-bold px-5 py-2 rounded-xl transition-colors shadow-lg shadow-[#2DE3A7]/10">
                            <Save size={14} />
                            {processing ? "Saving…" : isEdit ? "Update Page" : "Create Page"}
                        </button>
                    </div>
                </div>

                {/* Two-column layout */}
                <div className="flex gap-5 items-start">

                    {/* Left panel (sticky) */}
                    <div className="w-[340px] flex-shrink-0 sticky top-4 max-h-[calc(100vh-6rem)] flex flex-col bg-[#0b1818] border border-[#1E2826] rounded-2xl overflow-hidden">

                        {/* Tab navigation */}
                        <div className="flex border-b border-[#1E2826] bg-[#060f0e] flex-shrink-0">
                            {PANEL_TABS.map(tab => (
                                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-semibold transition-colors ${activeTab === tab.id ? "text-[#2DE3A7] border-b-2 border-[#2DE3A7] -mb-px" : "text-gray-500 hover:text-gray-300"}`}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Scrollable tab content */}
                        <div className="flex-1 overflow-y-auto">

                            {/* Tab: Page Settings */}
                            {activeTab === "page" && (
                                <div className="p-4 space-y-4">
                                    <Field label="Page Title">
                                        <Input value={data.page_title}
                                            onChange={e => {
                                                setData("page_title", e.target.value);
                                                if (!isEdit) setData("slug", toSlug(e.target.value));
                                            }}
                                            placeholder="My Amazing Product" />
                                        {err("page_title")}
                                    </Field>
                                    <Field label="Slug" hint="URL: /lp/your-slug">
                                        <Input value={data.slug} onChange={e => setData("slug", toSlug(e.target.value))} placeholder="my-amazing-product" />
                                        {err("slug")}
                                    </Field>

                                    <Divider />

                                    <Field label="Page Type" hint="What this landing page showcases">
                                        <div className="flex rounded-xl border border-[#1E2826] overflow-hidden mt-1">
                                            {(["product", "category", "none"] as const).map((mode, i) => (
                                                <button key={mode} type="button"
                                                    onClick={() => {
                                                        setPageMode(mode);
                                                        if (mode !== "product")  setData("product_id",  "");
                                                        if (mode !== "category") setData("category_id", "");
                                                    }}
                                                    className={`flex-1 py-2 text-xs font-semibold transition-colors capitalize ${i > 0 ? "border-l border-[#1E2826]" : ""} ${pageMode === mode ? "bg-[#2DE3A7] text-black" : "text-gray-500 hover:text-white hover:bg-[#1E2826]"}`}>
                                                    {mode === "none" ? "No product" : mode}
                                                </button>
                                            ))}
                                        </div>
                                    </Field>

                                    {pageMode === "product" && (
                                        <Field label="Linked Product">
                                            <StyledSelect value={data.product_id} onChange={v => setData("product_id", v)}>
                                                <option value="">— Select product —</option>
                                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </StyledSelect>
                                        </Field>
                                    )}

                                    {pageMode === "category" && (
                                        <div className="space-y-3">
                                            <Field label="Linked Category">
                                                <StyledSelect value={data.category_id} onChange={v => setData("category_id", v)}>
                                                    <option value="">— Select category —</option>
                                                    {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                                                </StyledSelect>
                                            </Field>
                                            <div className="bg-[#2DE3A7]/5 border border-[#2DE3A7]/20 rounded-xl p-3 text-xs text-[#2DE3A7]/80 leading-relaxed">
                                                All in-stock products from this category will be displayed in a shoppable grid.
                                            </div>
                                        </div>
                                    )}

                                    <Divider />

                                    <Field label="Meta Description" hint="SEO snippet — up to 160 characters">
                                        <Textarea value={data.meta_description} onChange={e => setData("meta_description", e.target.value)} rows={3}
                                            placeholder="Brief description for search engines…" />
                                    </Field>
                                </div>
                            )}

                            {/* Tab: Hero Section */}
                            {activeTab === "hero" && (
                                <div className="p-4 space-y-4">
                                    <Field label="Hero Layout">
                                        <div className="grid grid-cols-2 gap-2 mt-1">
                                            {HERO_LAYOUTS.map(layout => (
                                                <button key={layout.value} type="button"
                                                    onClick={() => setData("hero_layout", layout.value)}
                                                    className={`flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all ${data.hero_layout === layout.value ? "border-[#2DE3A7] bg-[#2DE3A7]/5" : "border-[#1E2826] hover:border-[#2DE3A7]/30 hover:bg-[#1E2826]"}`}>
                                                    <div className="w-full h-12 rounded-lg overflow-hidden">
                                                        {layout.preview}
                                                    </div>
                                                    <span className={`text-[10px] font-semibold ${data.hero_layout === layout.value ? "text-[#2DE3A7]" : "text-gray-500"}`}>
                                                        {layout.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </Field>

                                    <Divider />

                                    <Field label='Badge Text' hint='e.g. "🔥 Limited Offer"'>
                                        <Input value={data.hero_badge} onChange={e => setData("hero_badge", e.target.value)} placeholder="🔥 Limited Offer" />
                                    </Field>
                                    <Field label="Headline *">
                                        <Textarea value={data.hero_headline} onChange={e => setData("hero_headline", e.target.value)} rows={2} placeholder="Your powerful product headline" />
                                        {err("hero_headline")}
                                    </Field>
                                    <Field label="Subheadline">
                                        <Textarea value={data.hero_subheadline} onChange={e => setData("hero_subheadline", e.target.value)} rows={2} />
                                    </Field>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="CTA Button Text">
                                            <Input value={data.hero_cta_text} onChange={e => setData("hero_cta_text", e.target.value)} />
                                        </Field>
                                        <Field label="CTA URL">
                                            <Input value={data.hero_cta_url} onChange={e => setData("hero_cta_url", e.target.value)} placeholder="/checkout" />
                                        </Field>
                                    </div>

                                    <Divider />

                                    <Field label="Hero Background Color">
                                        <ColorInput value={data.hero_bg_color} onChange={v => setData("hero_bg_color", v)} placeholder="#1a1a2e or transparent" />
                                    </Field>
                                    <Field label="Hero Text Color">
                                        <ColorInput value={data.hero_text_color} onChange={v => setData("hero_text_color", v)} placeholder="#ffffff or inherit" />
                                    </Field>

                                    <Divider />

                                    <Field label="Hero Image">
                                        <HeroImageUpload current={heroPreview} onChange={handleHeroImage} />
                                    </Field>
                                </div>
                            )}

                            {/* Tab: Design */}
                            {activeTab === "design" && (
                                <div className="p-4 space-y-4">
                                    <div className="bg-[#060f0e] border border-[#1E2826] rounded-xl p-3 text-xs text-gray-500 leading-relaxed">
                                        These settings apply globally across the entire page.
                                    </div>

                                    <Field label="Accent Color" hint="Used for buttons, highlights, and links">
                                        <ColorInput value={data.accent_color} onChange={v => setData("accent_color", v)} placeholder="#2DE3A7" />
                                    </Field>

                                    <Field label="Page Background Color">
                                        <ColorInput value={data.global_bg_color} onChange={v => setData("global_bg_color", v)} placeholder="#0a0f0e or transparent" />
                                        {data.global_bg_color && (
                                            <div className="mt-1.5 rounded-lg border border-[#1E2826] h-5" style={{ background: data.global_bg_color }} />
                                        )}
                                    </Field>

                                    <Field label="Font Family">
                                        <StyledSelect value={data.global_font_family} onChange={v => setData("global_font_family", v)}>
                                            {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                                        </StyledSelect>
                                        {data.global_font_family && (
                                            <p className="text-gray-500 text-xs mt-1.5 px-1" style={{ fontFamily: data.global_font_family }}>
                                                The quick brown fox jumps over the lazy dog
                                            </p>
                                        )}
                                    </Field>

                                    <Divider />

                                    <div className="space-y-2">
                                        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">Color Preview</p>
                                        <div className="rounded-xl border border-[#1E2826] overflow-hidden">
                                            <div className="h-10 flex items-center px-4" style={{ background: data.global_bg_color || "#0b1818" }}>
                                                <span className="text-xs font-bold" style={{ color: data.accent_color || "#2DE3A7", fontFamily: data.global_font_family || "inherit" }}>
                                                    Headline Text
                                                </span>
                                            </div>
                                            <div className="h-8 flex items-center px-4 bg-[#060f0e]">
                                                <span className="inline-block px-3 py-0.5 rounded-lg text-black text-[10px] font-bold" style={{ background: data.accent_color || "#2DE3A7" }}>
                                                    CTA Button
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>{/* end scrollable tab content */}
                    </div>

                    {/* Right canvas: Content sections */}
                    <div className="flex-1 min-w-0 space-y-3">
                        {sections.length === 0 && (
                            <div className="bg-[#0b1818] border border-dashed border-[#1E2826] rounded-2xl py-14 flex flex-col items-center gap-3 text-gray-600">
                                <CheckSquare size={32} className="opacity-20" />
                                <p className="text-sm text-center">
                                    No content sections yet.<br />Click "Add Section" below to start building.
                                </p>
                            </div>
                        )}

                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sections.map(s => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                {sections.map((section, i) => (
                                    <SectionCard
                                        key={section.id}
                                        section={section}
                                        index={i}
                                        total={sections.length}
                                        onMove={moveSection}
                                        onRemove={removeSection}
                                        onDuplicate={duplicateSection}
                                        onUpdateData={updateSectionData}
                                        onUpdateDesign={updateSectionDesign}
                                        uploadImage={uploadImage}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>

                        <AddSectionPicker onAdd={addSection} />
                    </div>

                </div>
            </div>
        </Master>
    );
}
