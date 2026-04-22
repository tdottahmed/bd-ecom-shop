import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import { useForm } from "@inertiajs/react";
import { useState, useRef, useCallback } from "react";
import RichTextEditor from "@/Components/Ui/RichTextEditor";
import {
    Plus, Trash2, ChevronUp, ChevronDown, Save, Globe, GlobeLock,
    ExternalLink, Image as ImageIcon, X, GripVertical, ChevronDown as Collapse,
    AlignLeft, AlignCenter, AlignRight, Zap, LayoutGrid, Video, Star,
    Table, HelpCircle, Megaphone, Shield, Timer, Tag, GitCompare,
    Palette, Settings2, Layout, Type, Copy, CheckSquare,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionType =
    | "description" | "features" | "gallery" | "video" | "reviews"
    | "specs" | "faq" | "cta" | "trust_badges" | "countdown" | "pricing" | "comparison";

type HeroLayout = "split-right" | "split-left" | "centered" | "full-overlay";
type PaddingSize = "sm" | "md" | "lg";
type TextAlign = "left" | "center" | "right";

interface SectionDesign {
    bg_color: string;
    text_color: string;
    padding: PaddingSize;
    align: TextAlign;
}

interface Section {
    id: string;
    type: SectionType;
    data: Record<string, any>;
    design: SectionDesign;
}

interface Product  { id: number; name: string }
interface Category { id: number; title: string }

interface LandingPage {
    id: number;
    slug: string;
    page_title: string;
    meta_description: string;
    product_id: number | null;
    category_id: number | null;
    hero_headline: string;
    hero_subheadline: string;
    hero_badge: string;
    hero_image: string | null;
    hero_cta_text: string;
    hero_cta_url: string;
    hero_layout: HeroLayout;
    hero_bg_color: string;
    hero_text_color: string;
    accent_color: string;
    global_bg_color: string;
    global_font_family: string;
    sections: Section[];
    is_published: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_DESIGN: SectionDesign = {
    bg_color: "", text_color: "", padding: "md", align: "left",
};

const SECTION_DEFAULTS: Record<SectionType, Record<string, any>> = {
    description: { title: "About This Product", content: "" },
    features: {
        title: "Key Features",
        items: [{ emoji: "⚡", title: "Feature", description: "Describe it" }],
    },
    gallery: { title: "Product Gallery", images: [] },
    video: { title: "See It In Action", url: "", caption: "" },
    reviews: {
        title: "What Customers Say",
        items: [{ name: "Happy Customer", location: "", rating: 5, text: "Amazing product!" }],
    },
    specs: { title: "Specifications", rows: [{ label: "Material", value: "" }] },
    faq: {
        title: "Frequently Asked Questions",
        items: [{ question: "Is this product genuine?", answer: "" }],
    },
    cta: {
        headline: "Ready to Order?",
        subtext: "Limited stock available.",
        button_text: "Order Now",
        button_url: "",
        style: "solid",
    },
    trust_badges: {
        title: "Trusted & Secure",
        layout: "horizontal",
        badges: [
            { icon: "🔒", label: "Secure Payment" },
            { icon: "🚚", label: "Fast Delivery" },
            { icon: "✅", label: "Genuine Product" },
            { icon: "💯", label: "Money Back" },
        ],
    },
    countdown: {
        title: "Offer Ends In",
        end_date: "",
        subtext: "Don't miss out on this limited-time offer!",
    },
    pricing: {
        title: "Special Offer",
        currency: "RM",
        original_price: "",
        sale_price: "",
        badge: "🔥 Best Value",
        notes: ["Free shipping included", "30-day return policy", "100% genuine product"],
        button_text: "Buy Now",
        button_url: "",
    },
    comparison: {
        title: "Why Choose Us?",
        our_label: "Our Product",
        their_label: "Others",
        rows: [
            { feature: "Quality", ours: "✅ Premium", theirs: "❌ Standard" },
            { feature: "Support", ours: "✅ 24/7", theirs: "❌ Limited" },
            { feature: "Warranty", ours: "✅ 1 Year", theirs: "❌ None" },
        ],
    },
};

const SECTION_META: Record<SectionType, { label: string; icon: React.ReactNode; color: string; bg: string; description: string }> = {
    description:  { label: "Description",   icon: <AlignLeft size={15} />,   color: "text-blue-400",    bg: "bg-blue-500/10",    description: "Rich text content block" },
    features:     { label: "Features",      icon: <Zap size={15} />,          color: "text-yellow-400",  bg: "bg-yellow-500/10",  description: "Icon + title + text list" },
    gallery:      { label: "Gallery",       icon: <LayoutGrid size={15} />,   color: "text-purple-400",  bg: "bg-purple-500/10",  description: "Image grid / lightbox" },
    video:        { label: "Video",         icon: <Video size={15} />,         color: "text-red-400",     bg: "bg-red-500/10",     description: "YouTube / Vimeo embed" },
    reviews:      { label: "Reviews",       icon: <Star size={15} />,          color: "text-amber-400",   bg: "bg-amber-500/10",   description: "Customer testimonials" },
    specs:        { label: "Specs Table",   icon: <Table size={15} />,         color: "text-cyan-400",    bg: "bg-cyan-500/10",    description: "Key-value spec table" },
    faq:          { label: "FAQ",           icon: <HelpCircle size={15} />,   color: "text-green-400",   bg: "bg-green-500/10",   description: "Accordion Q&A" },
    cta:          { label: "CTA Block",     icon: <Megaphone size={15} />,    color: "text-pink-400",    bg: "bg-pink-500/10",    description: "Call-to-action banner" },
    trust_badges: { label: "Trust Badges", icon: <Shield size={15} />,        color: "text-emerald-400", bg: "bg-emerald-500/10", description: "Icons + trust signals" },
    countdown:    { label: "Countdown",     icon: <Timer size={15} />,         color: "text-orange-400",  bg: "bg-orange-500/10",  description: "Urgency countdown timer" },
    pricing:      { label: "Pricing Card",  icon: <Tag size={15} />,           color: "text-violet-400",  bg: "bg-violet-500/10",  description: "Price with discount display" },
    comparison:   { label: "Comparison",    icon: <GitCompare size={15} />,   color: "text-sky-400",     bg: "bg-sky-500/10",     description: "Feature comparison table" },
};

const HERO_LAYOUTS: { value: HeroLayout; label: string; preview: React.ReactNode }[] = [
    {
        value: "split-right",
        label: "Image Right",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="22" height="30" rx="2" fill="#1E2826" />
                <rect x="3" y="5" width="12" height="3" rx="1" fill="#2DE3A7" opacity="0.8" />
                <rect x="3" y="11" width="18" height="2" rx="1" fill="#374151" />
                <rect x="3" y="15" width="14" height="2" rx="1" fill="#374151" />
                <rect x="3" y="22" width="8" height="4" rx="1" fill="#2DE3A7" opacity="0.6" />
                <rect x="25" y="1" width="22" height="30" rx="2" fill="#1E2826" />
                <rect x="27" y="3" width="18" height="26" rx="2" fill="#374151" opacity="0.6" />
            </svg>
        ),
    },
    {
        value: "split-left",
        label: "Image Left",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="22" height="30" rx="2" fill="#1E2826" />
                <rect x="3" y="3" width="18" height="26" rx="2" fill="#374151" opacity="0.6" />
                <rect x="25" y="1" width="22" height="30" rx="2" fill="#1E2826" />
                <rect x="27" y="5" width="12" height="3" rx="1" fill="#2DE3A7" opacity="0.8" />
                <rect x="27" y="11" width="18" height="2" rx="1" fill="#374151" />
                <rect x="27" y="15" width="14" height="2" rx="1" fill="#374151" />
                <rect x="27" y="22" width="8" height="4" rx="1" fill="#2DE3A7" opacity="0.6" />
            </svg>
        ),
    },
    {
        value: "centered",
        label: "Centered",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="46" height="30" rx="2" fill="#1E2826" />
                <rect x="14" y="5" width="20" height="3" rx="1" fill="#2DE3A7" opacity="0.8" />
                <rect x="10" y="11" width="28" height="2" rx="1" fill="#374151" />
                <rect x="13" y="15" width="22" height="2" rx="1" fill="#374151" />
                <rect x="17" y="22" width="14" height="4" rx="1" fill="#2DE3A7" opacity="0.6" />
            </svg>
        ),
    },
    {
        value: "full-overlay",
        label: "Full Overlay",
        preview: (
            <svg viewBox="0 0 48 32" className="w-full h-full">
                <rect x="1" y="1" width="46" height="30" rx="2" fill="#374151" opacity="0.5" />
                <rect x="1" y="1" width="46" height="30" rx="2" fill="#000" opacity="0.4" />
                <rect x="12" y="5" width="24" height="3" rx="1" fill="white" opacity="0.9" />
                <rect x="8" y="11" width="32" height="2" rx="1" fill="white" opacity="0.5" />
                <rect x="15" y="22" width="18" height="4" rx="1" fill="#2DE3A7" opacity="0.8" />
            </svg>
        ),
    },
];

const FONT_OPTIONS = [
    { value: "", label: "Default (Inter)" },
    { value: "'Playfair Display', serif", label: "Playfair Display" },
    { value: "'Poppins', sans-serif", label: "Poppins" },
    { value: "'Montserrat', sans-serif", label: "Montserrat" },
    { value: "'Raleway', sans-serif", label: "Raleway" },
    { value: "'Lato', sans-serif", label: "Lato" },
    { value: "'Nunito', sans-serif", label: "Nunito" },
    { value: "'Merriweather', serif", label: "Merriweather" },
    { value: "'DM Sans', sans-serif", label: "DM Sans" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);
const toSlug = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const normalizeSection = (s: any): Section => ({
    ...s,
    design: { ...DEFAULT_DESIGN, ...(s.design ?? {}) },
});

// ─── Shared UI ────────────────────────────────────────────────────────────────

const baseCls = "w-full bg-[#0C1311] border border-[#1E2826] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#2DE3A7]/60 placeholder:text-gray-600";

const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
    <div className="space-y-1.5">
        <label className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest">{label}</label>
        {children}
        {hint && <p className="text-gray-600 text-xs">{hint}</p>}
    </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`${baseCls} ${props.className ?? ""}`} />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} rows={props.rows ?? 3} className={`${baseCls} resize-none ${props.className ?? ""}`} />
);

const StyledSelect = ({ value, onChange, children, className = "" }: {
    value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string;
}) => (
    <select value={value} onChange={e => onChange(e.target.value)} className={`${baseCls} ${className}`}>
        {children}
    </select>
);

const ColorInput = ({ value, onChange, placeholder = "#hex or transparent" }: {
    value: string; onChange: (v: string) => void; placeholder?: string;
}) => (
    <div className="flex items-center gap-2">
        <input
            type="color"
            value={value || "#0b1818"}
            onChange={e => onChange(e.target.value)}
            className="w-8 h-8 rounded-lg border border-[#1E2826] bg-[#0C1311] cursor-pointer p-0.5 flex-shrink-0"
        />
        <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="flex-1 text-xs" />
        {value && (
            <button type="button" onClick={() => onChange("")} className="text-gray-600 hover:text-gray-400 flex-shrink-0">
                <X size={12} />
            </button>
        )}
    </div>
);

const Btn = ({
    children, onClick, variant = "ghost", type = "button", disabled = false, className = "",
}: {
    children: React.ReactNode; onClick?: () => void;
    variant?: "ghost" | "danger" | "primary";
    type?: "button" | "submit"; disabled?: boolean; className?: string;
}) => {
    const v = {
        ghost: "text-gray-400 hover:text-white hover:bg-[#1E2826]",
        danger: "text-gray-400 hover:text-red-400 hover:bg-red-500/10",
        primary: "bg-[#2DE3A7] hover:bg-[#24c490] text-black font-semibold",
    }[variant];
    return (
        <button type={type} onClick={onClick} disabled={disabled}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 ${v} ${className}`}>
            {children}
        </button>
    );
};

const Divider = () => <div className="border-t border-[#1E2826]" />;

// ─── Section Design Panel ─────────────────────────────────────────────────────

function SectionDesignPanel({ design, onChange }: {
    design: SectionDesign;
    onChange: (d: SectionDesign) => void;
}) {
    return (
        <div className="px-4 pt-3 pb-4 bg-[#060f0e] border-t border-[#1E2826] space-y-3">
            <p className="text-[#2DE3A7]/50 text-[9px] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
                <Palette size={10} /> Section Styling
            </p>
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
                                {a === "left" && <AlignLeft size={13} />}
                                {a === "center" && <AlignCenter size={13} />}
                                {a === "right" && <AlignRight size={13} />}
                            </button>
                        ))}
                    </div>
                </Field>
            </div>
        </div>
    );
}

// ─── Section Editors ──────────────────────────────────────────────────────────

function DescriptionEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    return (
        <div className="space-y-3">
            <Field label="Section Title">
                <Input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
            </Field>
            <Field label="Content">
                <RichTextEditor value={data.content} onChange={v => onChange({ ...data, content: v })} />
            </Field>
        </div>
    );
}

function FeaturesEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    const update = (idx: number, field: string, value: string) => {
        const items = [...data.items];
        items[idx] = { ...items[idx], [field]: value };
        onChange({ ...data, items });
    };
    return (
        <div className="space-y-4">
            <Field label="Section Title">
                <Input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
            </Field>
            <div className="space-y-2">
                <div className="grid grid-cols-[36px_1fr_2fr_28px] gap-2">
                    <span className="text-gray-600 text-[10px] uppercase tracking-wide text-center pt-1">Icon</span>
                    <span className="text-gray-600 text-[10px] uppercase tracking-wide pt-1">Title</span>
                    <span className="text-gray-600 text-[10px] uppercase tracking-wide pt-1">Description</span>
                    <span />
                </div>
                {data.items.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-[36px_1fr_2fr_28px] gap-2 items-center">
                        <Input value={item.emoji} onChange={e => update(i, "emoji", e.target.value)} placeholder="⚡" className="text-center px-1" />
                        <Input value={item.title} onChange={e => update(i, "title", e.target.value)} placeholder="Feature name" />
                        <Input value={item.description} onChange={e => update(i, "description", e.target.value)} placeholder="Brief description" />
                        <button type="button" onClick={() => onChange({ ...data, items: data.items.filter((_: any, j: number) => j !== i) })}
                            className="p-1 text-gray-600 hover:text-red-400 transition-colors">
                            <X size={13} />
                        </button>
                    </div>
                ))}
            </div>
            <Btn onClick={() => onChange({ ...data, items: [...data.items, { emoji: "✨", title: "", description: "" }] })}>
                <Plus size={12} /> Add Feature
            </Btn>
        </div>
    );
}

function GalleryEditor({ data, onChange, uploadImage }: {
    data: any; onChange: (d: any) => void; uploadImage: (f: File) => Promise<string>;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFiles = async (files: FileList | null) => {
        if (!files) return;
        setUploading(true);
        const urls: string[] = [];
        for (const file of Array.from(files)) urls.push(await uploadImage(file));
        onChange({ ...data, images: [...data.images, ...urls] });
        setUploading(false);
    };

    return (
        <div className="space-y-4">
            <Field label="Section Title">
                <Input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
            </Field>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {data.images.map((url: string, i: number) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-[#0C1311] border border-[#1E2826] group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => onChange({ ...data, images: data.images.filter((_: any, j: number) => j !== i) })}
                            className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={11} />
                        </button>
                    </div>
                ))}
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="aspect-square rounded-xl border-2 border-dashed border-[#1E2826] hover:border-[#2DE3A7]/40 flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-gray-400 transition-colors disabled:opacity-50">
                    {uploading
                        ? <div className="w-4 h-4 border-2 border-[#2DE3A7] border-t-transparent rounded-full animate-spin" />
                        : <><ImageIcon size={16} /><span className="text-xs">Add</span></>}
                </button>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={e => handleFiles(e.target.files)} />
        </div>
    );
}

function VideoEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    return (
        <div className="space-y-3">
            <Field label="Section Title">
                <Input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
            </Field>
            <Field label="YouTube / Vimeo URL" hint="Paste the full video URL. YouTube and Vimeo are supported.">
                <Input value={data.url} onChange={e => onChange({ ...data, url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
            </Field>
            <Field label="Caption (optional)">
                <Input value={data.caption} onChange={e => onChange({ ...data, caption: e.target.value })} />
            </Field>
        </div>
    );
}

function ReviewsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    const update = (idx: number, field: string, value: any) => {
        const items = [...data.items];
        items[idx] = { ...items[idx], [field]: value };
        onChange({ ...data, items });
    };
    return (
        <div className="space-y-4">
            <Field label="Section Title">
                <Input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
            </Field>
            <div className="space-y-3">
                {data.items.map((item: any, i: number) => (
                    <div key={i} className="bg-[#080f0e] border border-[#1E2826] rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 text-xs font-medium">Review #{i + 1}</span>
                            <button type="button" onClick={() => onChange({ ...data, items: data.items.filter((_: any, j: number) => j !== i) })}
                                className="text-gray-600 hover:text-red-400 transition-colors"><X size={13} /></button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Customer Name">
                                <Input value={item.name} onChange={e => update(i, "name", e.target.value)} />
                            </Field>
                            <Field label="Location (optional)">
                                <Input value={item.location} onChange={e => update(i, "location", e.target.value)} />
                            </Field>
                        </div>
                        <Field label="Rating">
                            <div className="flex gap-1 mt-0.5">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button key={n} type="button" onClick={() => update(i, "rating", n)}
                                        className={`text-lg leading-none transition-colors ${n <= item.rating ? "text-amber-400" : "text-gray-700 hover:text-amber-300"}`}>★</button>
                                ))}
                            </div>
                        </Field>
                        <Field label="Review Text">
                            <Textarea value={item.text} onChange={e => update(i, "text", e.target.value)} rows={2} />
                        </Field>
                    </div>
                ))}
            </div>
            <Btn onClick={() => onChange({ ...data, items: [...data.items, { name: "", location: "", rating: 5, text: "" }] })}>
                <Plus size={12} /> Add Review
            </Btn>
        </div>
    );
}

function SpecsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    const update = (idx: number, field: string, value: string) => {
        const rows = [...data.rows];
        rows[idx] = { ...rows[idx], [field]: value };
        onChange({ ...data, rows });
    };
    return (
        <div className="space-y-4">
            <Field label="Section Title">
                <Input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
            </Field>
            <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_28px] gap-2">
                    <span className="text-gray-600 text-[10px] uppercase tracking-wide">Label</span>
                    <span className="text-gray-600 text-[10px] uppercase tracking-wide">Value</span>
                    <span />
                </div>
                {data.rows.map((row: any, i: number) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_28px] gap-2 items-center">
                        <Input value={row.label} onChange={e => update(i, "label", e.target.value)} placeholder="Label" />
                        <Input value={row.value} onChange={e => update(i, "value", e.target.value)} placeholder="Value" />
                        <button type="button" onClick={() => onChange({ ...data, rows: data.rows.filter((_: any, j: number) => j !== i) })}
                            className="p-1 text-gray-600 hover:text-red-400 transition-colors"><X size={13} /></button>
                    </div>
                ))}
            </div>
            <Btn onClick={() => onChange({ ...data, rows: [...data.rows, { label: "", value: "" }] })}>
                <Plus size={12} /> Add Row
            </Btn>
        </div>
    );
}

function FaqEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    const update = (idx: number, field: string, value: string) => {
        const items = [...data.items];
        items[idx] = { ...items[idx], [field]: value };
        onChange({ ...data, items });
    };
    return (
        <div className="space-y-4">
            <Field label="Section Title">
                <Input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
            </Field>
            <div className="space-y-3">
                {data.items.map((item: any, i: number) => (
                    <div key={i} className="bg-[#080f0e] border border-[#1E2826] rounded-xl p-3 space-y-2">
                        <div className="flex items-start gap-2">
                            <Input value={item.question} onChange={e => update(i, "question", e.target.value)} placeholder="Question" className="flex-1" />
                            <button type="button" onClick={() => onChange({ ...data, items: data.items.filter((_: any, j: number) => j !== i) })}
                                className="mt-0.5 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"><X size={13} /></button>
                        </div>
                        <Textarea value={item.answer} onChange={e => update(i, "answer", e.target.value)} placeholder="Answer" rows={2} />
                    </div>
                ))}
            </div>
            <Btn onClick={() => onChange({ ...data, items: [...data.items, { question: "", answer: "" }] })}>
                <Plus size={12} /> Add Question
            </Btn>
        </div>
    );
}

function CtaEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <Field label="Headline">
                    <Input value={data.headline} onChange={e => onChange({ ...data, headline: e.target.value })} />
                </Field>
                <Field label="Sub-text">
                    <Input value={data.subtext} onChange={e => onChange({ ...data, subtext: e.target.value })} />
                </Field>
                <Field label="Button Text">
                    <Input value={data.button_text} onChange={e => onChange({ ...data, button_text: e.target.value })} />
                </Field>
                <Field label="Button URL">
                    <Input value={data.button_url} onChange={e => onChange({ ...data, button_url: e.target.value })} placeholder="https://..." />
                </Field>
            </div>
            <Field label="Button Style">
                <div className="flex gap-2">
                    {(["solid", "outline", "gradient"] as const).map(s => (
                        <button key={s} type="button" onClick={() => onChange({ ...data, style: s })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize border transition-colors ${data.style === s ? "bg-[#2DE3A7] text-black border-[#2DE3A7]" : "border-[#1E2826] text-gray-400 hover:text-white hover:border-[#2DE3A7]/30"}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </Field>
        </div>
    );
}

function TrustBadgesEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    const update = (idx: number, field: string, value: string) => {
        const badges = [...data.badges];
        badges[idx] = { ...badges[idx], [field]: value };
        onChange({ ...data, badges });
    };
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
                <Field label="Section Title">
                    <Input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
                </Field>
                <Field label="Layout">
                    <StyledSelect value={data.layout} onChange={v => onChange({ ...data, layout: v })}>
                        <option value="horizontal">Horizontal (row)</option>
                        <option value="grid">Grid (2 columns)</option>
                    </StyledSelect>
                </Field>
            </div>
            <div className="space-y-2">
                <div className="grid grid-cols-[36px_1fr_28px] gap-2">
                    <span className="text-gray-600 text-[10px] uppercase tracking-wide text-center">Icon</span>
                    <span className="text-gray-600 text-[10px] uppercase tracking-wide">Label</span>
                    <span />
                </div>
                {data.badges.map((badge: any, i: number) => (
                    <div key={i} className="grid grid-cols-[36px_1fr_28px] gap-2 items-center">
                        <Input value={badge.icon} onChange={e => update(i, "icon", e.target.value)} placeholder="🔒" className="text-center px-1" />
                        <Input value={badge.label} onChange={e => update(i, "label", e.target.value)} placeholder="Trust signal" />
                        <button type="button" onClick={() => onChange({ ...data, badges: data.badges.filter((_: any, j: number) => j !== i) })}
                            className="p-1 text-gray-600 hover:text-red-400 transition-colors"><X size={13} /></button>
                    </div>
                ))}
            </div>
            <Btn onClick={() => onChange({ ...data, badges: [...data.badges, { icon: "⭐", label: "" }] })}>
                <Plus size={12} /> Add Badge
            </Btn>
        </div>
    );
}

function CountdownEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    return (
        <div className="space-y-3">
            <Field label="Section Title">
                <Input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
            </Field>
            <Field label="Countdown End Date & Time" hint="The timer counts down to this exact moment.">
                <Input type="datetime-local" value={data.end_date} onChange={e => onChange({ ...data, end_date: e.target.value })} />
            </Field>
            <Field label="Sub-text">
                <Input value={data.subtext} onChange={e => onChange({ ...data, subtext: e.target.value })} placeholder="Don't miss out!" />
            </Field>
        </div>
    );
}

function PricingEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    const updateNote = (idx: number, value: string) => {
        const notes = [...data.notes];
        notes[idx] = value;
        onChange({ ...data, notes });
    };
    return (
        <div className="space-y-4">
            <Field label="Section Title">
                <Input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
            </Field>
            <div className="grid grid-cols-3 gap-3">
                <Field label="Currency">
                    <Input value={data.currency} onChange={e => onChange({ ...data, currency: e.target.value })} placeholder="RM" />
                </Field>
                <Field label="Original Price">
                    <Input value={data.original_price} onChange={e => onChange({ ...data, original_price: e.target.value })} placeholder="199" />
                </Field>
                <Field label="Sale Price">
                    <Input value={data.sale_price} onChange={e => onChange({ ...data, sale_price: e.target.value })} placeholder="99" />
                </Field>
            </div>
            <Field label="Badge Text">
                <Input value={data.badge} onChange={e => onChange({ ...data, badge: e.target.value })} placeholder="🔥 Best Value" />
            </Field>
            <Field label="Bullet Points">
                <div className="space-y-2">
                    {data.notes.map((note: string, i: number) => (
                        <div key={i} className="flex gap-2 items-center">
                            <Input value={note} onChange={e => updateNote(i, e.target.value)} placeholder="Benefit or guarantee" className="flex-1" />
                            <button type="button" onClick={() => onChange({ ...data, notes: data.notes.filter((_: any, j: number) => j !== i) })}
                                className="p-1 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0"><X size={13} /></button>
                        </div>
                    ))}
                </div>
                <Btn onClick={() => onChange({ ...data, notes: [...data.notes, ""] })} className="mt-2">
                    <Plus size={12} /> Add Point
                </Btn>
            </Field>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Button Text">
                    <Input value={data.button_text} onChange={e => onChange({ ...data, button_text: e.target.value })} />
                </Field>
                <Field label="Button URL">
                    <Input value={data.button_url} onChange={e => onChange({ ...data, button_url: e.target.value })} placeholder="/checkout" />
                </Field>
            </div>
        </div>
    );
}

function ComparisonEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
    const updateRow = (idx: number, field: string, value: string) => {
        const rows = [...data.rows];
        rows[idx] = { ...rows[idx], [field]: value };
        onChange({ ...data, rows });
    };
    return (
        <div className="space-y-4">
            <Field label="Section Title">
                <Input value={data.title} onChange={e => onChange({ ...data, title: e.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
                <Field label="Our Column Label">
                    <Input value={data.our_label} onChange={e => onChange({ ...data, our_label: e.target.value })} />
                </Field>
                <Field label="Competitor Column Label">
                    <Input value={data.their_label} onChange={e => onChange({ ...data, their_label: e.target.value })} />
                </Field>
            </div>
            <div className="space-y-2">
                <div className="grid grid-cols-[1fr_1fr_1fr_28px] gap-2">
                    <span className="text-gray-600 text-[10px] uppercase tracking-wide">Feature</span>
                    <span className="text-gray-600 text-[10px] uppercase tracking-wide">Ours</span>
                    <span className="text-gray-600 text-[10px] uppercase tracking-wide">Theirs</span>
                    <span />
                </div>
                {data.rows.map((row: any, i: number) => (
                    <div key={i} className="grid grid-cols-[1fr_1fr_1fr_28px] gap-2 items-center">
                        <Input value={row.feature} onChange={e => updateRow(i, "feature", e.target.value)} placeholder="Feature" />
                        <Input value={row.ours} onChange={e => updateRow(i, "ours", e.target.value)} placeholder="✅ Our value" />
                        <Input value={row.theirs} onChange={e => updateRow(i, "theirs", e.target.value)} placeholder="❌ Their value" />
                        <button type="button" onClick={() => onChange({ ...data, rows: data.rows.filter((_: any, j: number) => j !== i) })}
                            className="p-1 text-gray-600 hover:text-red-400 transition-colors"><X size={13} /></button>
                    </div>
                ))}
            </div>
            <Btn onClick={() => onChange({ ...data, rows: [...data.rows, { feature: "", ours: "✅", theirs: "❌" }] })}>
                <Plus size={12} /> Add Row
            </Btn>
        </div>
    );
}

// ─── Section Card ──────────────────────────────────────────────────────────────

function SectionCard({
    section, index, total,
    onMove, onRemove, onDuplicate, onUpdateData, onUpdateDesign, uploadImage,
}: {
    section: Section; index: number; total: number;
    onMove: (id: string, dir: "up" | "down") => void;
    onRemove: (id: string) => void;
    onDuplicate: (id: string) => void;
    onUpdateData: (id: string, data: any) => void;
    onUpdateDesign: (id: string, design: SectionDesign) => void;
    uploadImage: (f: File) => Promise<string>;
}) {
    const [open, setOpen] = useState(true);
    const [designOpen, setDesignOpen] = useState(false);
    const meta = SECTION_META[section.type];

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

    const hasCustomDesign = section.design.bg_color || section.design.text_color || section.design.padding !== "md" || section.design.align !== "left";

    return (
        <div className="bg-[#0b1818] border border-[#1E2826] rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#1E2826]">
                <GripVertical size={13} className="text-gray-700 shrink-0" />
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
                        className={`p-1.5 rounded-lg transition-colors ${designOpen ? "text-[#2DE3A7] bg-[#2DE3A7]/10" : "text-gray-600 hover:text-[#2DE3A7] hover:bg-[#1E2826]"}`} title="Section design">
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
            {/* Editor body */}
            {open && <div className="p-4">{editors[section.type]}</div>}
            {/* Design panel */}
            {designOpen && (
                <SectionDesignPanel
                    design={section.design}
                    onChange={d => onUpdateDesign(section.id, d)}
                />
            )}
        </div>
    );
}

// ─── Add Section Picker ────────────────────────────────────────────────────────

function AddSectionPicker({ onAdd }: { onAdd: (type: SectionType) => void }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button type="button" onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1E2826] hover:border-[#2DE3A7]/50 text-gray-600 hover:text-[#2DE3A7] rounded-2xl py-5 text-sm font-medium transition-all duration-200">
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

// ─── Hero Image Upload ─────────────────────────────────────────────────────────

function HeroImageUpload({ current, onChange }: { current: string | null; onChange: (f: File) => void }) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <div>
            {current ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0C1311] border border-[#1E2826] group cursor-pointer" onClick={() => ref.current?.click()}>
                    <img src={current} alt="Hero" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                        <ImageIcon size={20} />
                        <span className="text-xs font-medium">Change Image</span>
                    </div>
                </div>
            ) : (
                <button type="button" onClick={() => ref.current?.click()}
                    className="w-full aspect-video border-2 border-dashed border-[#1E2826] hover:border-[#2DE3A7]/40 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-gray-400 transition-colors">
                    <ImageIcon size={22} />
                    <span className="text-xs font-medium">Upload Hero Image</span>
                    <span className="text-[10px] text-gray-700">Recommended: 1200 × 800px</span>
                </button>
            )}
            <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && onChange(e.target.files[0])} />
        </div>
    );
}

// ─── Left Panel Tabs ──────────────────────────────────────────────────────────

type PanelTab = "page" | "hero" | "design";

const PANEL_TABS: { id: PanelTab; label: string; icon: React.ReactNode }[] = [
    { id: "page",   label: "Page",   icon: <Settings2 size={14} /> },
    { id: "hero",   label: "Hero",   icon: <Layout size={14} /> },
    { id: "design", label: "Design", icon: <Type size={14} /> },
];

// ─── Main Builder ──────────────────────────────────────────────────────────────

export default function Builder({ products, categories, page }: { products: Product[]; categories: Category[]; page: LandingPage | null }) {
    const isEdit = !!page;

    const initMode = page?.category_id ? "category" : page?.product_id ? "product" : "none";
    const [pageMode, setPageMode] = useState<"product" | "category" | "none">(initMode);

    const { data, setData, post, put, processing, errors } = useForm<{
        page_title: string; slug: string; meta_description: string;
        product_id: string; category_id: string;
        hero_headline: string; hero_subheadline: string; hero_badge: string;
        hero_image: File | null; hero_cta_text: string; hero_cta_url: string;
        hero_layout: HeroLayout; hero_bg_color: string; hero_text_color: string;
        accent_color: string; global_bg_color: string; global_font_family: string;
        sections: string; is_published: boolean;
    }>({
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
    const [heroPreview, setHeroPreview] = useState<string | null>(
        page?.hero_image ? `/storage/${page.hero_image}` : null
    );
    const [activeTab, setActiveTab] = useState<PanelTab>("page");

    const syncSections = (next: Section[]) => {
        setSections(next);
        setData("sections", JSON.stringify(next));
    };

    const addSection = (type: SectionType) =>
        syncSections([...sections, { id: uid(), type, data: { ...SECTION_DEFAULTS[type] }, design: { ...DEFAULT_DESIGN } }]);

    const removeSection = (id: string) => syncSections(sections.filter(s => s.id !== id));

    const duplicateSection = (id: string) => {
        const idx = sections.findIndex(s => s.id === id);
        if (idx === -1) return;
        const original = sections[idx];
        const copy: Section = { ...original, id: uid(), data: JSON.parse(JSON.stringify(original.data)), design: { ...original.design } };
        const next = [...sections];
        next.splice(idx + 1, 0, copy);
        syncSections(next);
    };

    const moveSection = (id: string, dir: "up" | "down") => {
        const idx = sections.findIndex(s => s.id === id);
        const next = [...sections];
        if (dir === "up" && idx > 0)            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        if (dir === "down" && idx < next.length - 1) [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        syncSections(next);
    };

    const updateSectionData = (id: string, newData: any) =>
        syncSections(sections.map(s => s.id === id ? { ...s, data: newData } : s));

    const updateSectionDesign = (id: string, design: SectionDesign) =>
        syncSections(sections.map(s => s.id === id ? { ...s, design } : s));

    const handleHeroImage = (file: File) => {
        setData("hero_image", file);
        setHeroPreview(URL.createObjectURL(file));
    };

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

    const handleSubmit = () => {
        if (isEdit) put(route("admin.landing-pages.update", page!.id));
        else post(route("admin.landing-pages.store"), { forceFormData: true });
    };

    const err = (field: keyof typeof errors) =>
        errors[field] ? <p className="text-red-400 text-xs mt-1">{errors[field]}</p> : null;

    return (
        <Master
            title={isEdit ? "Edit Landing Page" : "New Landing Page"}
            head={<Header title={isEdit ? "Edit Landing Page" : "New Landing Page"} showUserMenu />}
        >
            <div className="p-4 md:p-5">
                {/* ── Action bar ── */}
                <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
                    <div className="flex items-center gap-3">
                        <div className="text-gray-600 text-xs">
                            {sections.length} section{sections.length !== 1 ? "s" : ""}
                        </div>
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

                {/* ── Two-column layout ── */}
                <div className="flex gap-5 items-start">

                    {/* ── Left panel (sticky) ── */}
                    <div className="w-[340px] flex-shrink-0 sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto flex flex-col gap-0 bg-[#0b1818] border border-[#1E2826] rounded-2xl overflow-hidden">
                        {/* Tab navigation */}
                        <div className="flex border-b border-[#1E2826] bg-[#060f0e]">
                            {PANEL_TABS.map(tab => (
                                <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-xs font-semibold transition-colors ${activeTab === tab.id ? "text-[#2DE3A7] border-b-2 border-[#2DE3A7] -mb-px" : "text-gray-500 hover:text-gray-300"}`}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

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

                                {/* Page type toggle */}
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
                                            All in-stock products from this category will be displayed in a shoppable grid. Customers can select variants and add multiple items before placing one order.
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
                                {/* Layout picker */}
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
                    </div>

                    {/* ── Right canvas: Content sections ── */}
                    <div className="flex-1 min-w-0 space-y-3">
                        {sections.length === 0 && (
                            <div className="bg-[#0b1818] border border-dashed border-[#1E2826] rounded-2xl py-14 flex flex-col items-center gap-3 text-gray-600">
                                <CheckSquare size={32} className="opacity-20" />
                                <p className="text-sm text-center">No content sections yet.<br />Click "Add Section" below to start building.</p>
                            </div>
                        )}
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
                        <AddSectionPicker onAdd={addSection} />
                    </div>
                </div>
            </div>
        </Master>
    );
}
