import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import { useForm } from "@inertiajs/react";
import { useState, useRef, useCallback } from "react";
import RichTextEditor from "@/Components/Ui/RichTextEditor";
import {
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    Save,
    Globe,
    GlobeLock,
    ExternalLink,
    Image as ImageIcon,
    X,
    GripVertical,
    ChevronDown as Collapse,
    AlignLeft,
    Zap,
    LayoutGrid,
    Video,
    Star,
    Table,
    HelpCircle,
    Megaphone,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionType =
    | "description"
    | "features"
    | "gallery"
    | "video"
    | "reviews"
    | "specs"
    | "faq"
    | "cta";

interface Section {
    id: string;
    type: SectionType;
    data: Record<string, any>;
}

interface Product {
    id: number;
    name: string;
}
interface LandingPage {
    id: number;
    slug: string;
    page_title: string;
    meta_description: string;
    product_id: number | null;
    hero_headline: string;
    hero_subheadline: string;
    hero_badge: string;
    hero_image: string | null;
    hero_cta_text: string;
    hero_cta_url: string;
    accent_color: string;
    sections: Section[];
    is_published: boolean;
}

// ─── Section defaults ──────────────────────────────────────────────────────────

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
        items: [
            {
                name: "Happy Customer",
                location: "",
                rating: 5,
                text: "Amazing product!",
            },
        ],
    },
    specs: {
        title: "Specifications",
        rows: [{ label: "Material", value: "" }],
    },
    faq: {
        title: "Frequently Asked Questions",
        items: [{ question: "Is this product genuine?", answer: "" }],
    },
    cta: {
        headline: "Ready to Order?",
        subtext: "Limited stock available.",
        button_text: "Order Now",
        button_url: "",
    },
};

const SECTION_META: Record<
    SectionType,
    { label: string; icon: React.ReactNode; color: string }
> = {
    description: {
        label: "Description",
        icon: <AlignLeft size={16} />,
        color: "text-blue-400",
    },
    features: {
        label: "Features",
        icon: <Zap size={16} />,
        color: "text-yellow-400",
    },
    gallery: {
        label: "Gallery",
        icon: <LayoutGrid size={16} />,
        color: "text-purple-400",
    },
    video: { label: "Video", icon: <Video size={16} />, color: "text-red-400" },
    reviews: {
        label: "Reviews",
        icon: <Star size={16} />,
        color: "text-amber-400",
    },
    specs: {
        label: "Specifications",
        icon: <Table size={16} />,
        color: "text-cyan-400",
    },
    faq: {
        label: "FAQ",
        icon: <HelpCircle size={16} />,
        color: "text-green-400",
    },
    cta: {
        label: "CTA Block",
        icon: <Megaphone size={16} />,
        color: "text-pink-400",
    },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const uid = () => Math.random().toString(36).slice(2, 9);
const toSlug = (s: string) =>
    s
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

// ─── Shared UI ────────────────────────────────────────────────────────────────

const Field = ({
    label,
    children,
    hint,
}: {
    label: string;
    children: React.ReactNode;
    hint?: string;
}) => (
    <div className="space-y-1.5">
        <label className="text-gray-400 text-xs font-medium uppercase tracking-wide">
            {label}
        </label>
        {children}
        {hint && <p className="text-gray-600 text-xs">{hint}</p>}
    </div>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
        {...props}
        className={`w-full bg-[#0C1311] border border-[#1E2826] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#2DE3A7]/60 placeholder:text-gray-600 ${props.className ?? ""}`}
    />
);

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea
        {...props}
        rows={props.rows ?? 3}
        className={`w-full bg-[#0C1311] border border-[#1E2826] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#2DE3A7]/60 placeholder:text-gray-600 resize-none ${props.className ?? ""}`}
    />
);

const Btn = ({
    children,
    onClick,
    variant = "ghost",
    type = "button",
    disabled = false,
    className = "",
}: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "ghost" | "danger" | "primary";
    type?: "button" | "submit";
    disabled?: boolean;
    className?: string;
}) => {
    const base =
        "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40";
    const variants = {
        ghost: "text-gray-400 hover:text-white hover:bg-[#1E2826]",
        danger: "text-gray-400 hover:text-red-400 hover:bg-red-500/10",
        primary: "bg-[#2DE3A7] hover:bg-[#24c490] text-black font-semibold",
    };
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

// ─── Section Editors ──────────────────────────────────────────────────────────

function DescriptionEditor({
    data,
    onChange,
}: {
    data: any;
    onChange: (d: any) => void;
}) {
    return (
        <div className="space-y-3">
            <Field label="Section Title">
                <Input
                    value={data.title}
                    onChange={(e) =>
                        onChange({ ...data, title: e.target.value })
                    }
                />
            </Field>
            <Field label="Content">
                <RichTextEditor
                    value={data.content}
                    onChange={(v) => onChange({ ...data, content: v })}
                />
            </Field>
        </div>
    );
}

function FeaturesEditor({
    data,
    onChange,
}: {
    data: any;
    onChange: (d: any) => void;
}) {
    const update = (idx: number, field: string, value: string) => {
        const items = [...data.items];
        items[idx] = { ...items[idx], [field]: value };
        onChange({ ...data, items });
    };
    const add = () =>
        onChange({
            ...data,
            items: [...data.items, { emoji: "✨", title: "", description: "" }],
        });
    const remove = (idx: number) =>
        onChange({
            ...data,
            items: data.items.filter((_: any, i: number) => i !== idx),
        });

    return (
        <div className="space-y-4">
            <Field label="Section Title">
                <Input
                    value={data.title}
                    onChange={(e) =>
                        onChange({ ...data, title: e.target.value })
                    }
                />
            </Field>
            <div className="space-y-3">
                {data.items.map((item: any, i: number) => (
                    <div
                        key={i}
                        className="grid grid-cols-[40px_1fr_2fr_32px] gap-2 items-start"
                    >
                        <Input
                            value={item.emoji}
                            onChange={(e) => update(i, "emoji", e.target.value)}
                            placeholder="⚡"
                            className="text-center"
                        />
                        <Input
                            value={item.title}
                            onChange={(e) => update(i, "title", e.target.value)}
                            placeholder="Feature name"
                        />
                        <Input
                            value={item.description}
                            onChange={(e) =>
                                update(i, "description", e.target.value)
                            }
                            placeholder="Brief description"
                        />
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            className="p-1.5 text-gray-600 hover:text-red-400 transition-colors mt-0.5"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <Btn onClick={add}>
                <Plus size={13} /> Add Feature
            </Btn>
        </div>
    );
}

function GalleryEditor({
    data,
    onChange,
    uploadImage,
}: {
    data: any;
    onChange: (d: any) => void;
    uploadImage: (f: File) => Promise<string>;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleFiles = async (files: FileList | null) => {
        if (!files) return;
        setUploading(true);
        const urls: string[] = [];
        for (const file of Array.from(files)) {
            const url = await uploadImage(file);
            urls.push(url);
        }
        onChange({ ...data, images: [...data.images, ...urls] });
        setUploading(false);
    };

    const remove = (idx: number) =>
        onChange({
            ...data,
            images: data.images.filter((_: any, i: number) => i !== idx),
        });

    return (
        <div className="space-y-4">
            <Field label="Section Title">
                <Input
                    value={data.title}
                    onChange={(e) =>
                        onChange({ ...data, title: e.target.value })
                    }
                />
            </Field>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {data.images.map((url: string, i: number) => (
                    <div
                        key={i}
                        className="relative aspect-square rounded-lg overflow-hidden bg-[#0C1311] border border-[#1E2826] group"
                    >
                        <img
                            src={url}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            className="absolute top-1 right-1 p-0.5 bg-black/60 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="aspect-square rounded-lg border-2 border-dashed border-[#1E2826] hover:border-[#2DE3A7]/40 flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-gray-400 transition-colors disabled:opacity-50"
                >
                    {uploading ? (
                        <div className="w-4 h-4 border-2 border-[#2DE3A7] border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <ImageIcon size={18} />
                            <span className="text-xs">Add</span>
                        </>
                    )}
                </button>
            </div>
            <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />
        </div>
    );
}

function VideoEditor({
    data,
    onChange,
}: {
    data: any;
    onChange: (d: any) => void;
}) {
    return (
        <div className="space-y-3">
            <Field label="Section Title">
                <Input
                    value={data.title}
                    onChange={(e) =>
                        onChange({ ...data, title: e.target.value })
                    }
                />
            </Field>
            <Field
                label="YouTube / Vimeo URL"
                hint="Paste a full video URL. YouTube and Vimeo are supported."
            >
                <Input
                    value={data.url}
                    onChange={(e) => onChange({ ...data, url: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                />
            </Field>
            <Field label="Caption (optional)">
                <Input
                    value={data.caption}
                    onChange={(e) =>
                        onChange({ ...data, caption: e.target.value })
                    }
                />
            </Field>
        </div>
    );
}

function ReviewsEditor({
    data,
    onChange,
}: {
    data: any;
    onChange: (d: any) => void;
}) {
    const update = (idx: number, field: string, value: any) => {
        const items = [...data.items];
        items[idx] = { ...items[idx], [field]: value };
        onChange({ ...data, items });
    };
    const add = () =>
        onChange({
            ...data,
            items: [
                ...data.items,
                { name: "", location: "", rating: 5, text: "" },
            ],
        });
    const remove = (idx: number) =>
        onChange({
            ...data,
            items: data.items.filter((_: any, i: number) => i !== idx),
        });

    return (
        <div className="space-y-4">
            <Field label="Section Title">
                <Input
                    value={data.title}
                    onChange={(e) =>
                        onChange({ ...data, title: e.target.value })
                    }
                />
            </Field>
            <div className="space-y-4">
                {data.items.map((item: any, i: number) => (
                    <div
                        key={i}
                        className="bg-[#0C1311] border border-[#1E2826] rounded-xl p-4 space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-gray-500 text-xs">
                                Review #{i + 1}
                            </span>
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                className="text-gray-600 hover:text-red-400 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Customer Name">
                                <Input
                                    value={item.name}
                                    onChange={(e) =>
                                        update(i, "name", e.target.value)
                                    }
                                />
                            </Field>
                            <Field label="Location (optional)">
                                <Input
                                    value={item.location}
                                    onChange={(e) =>
                                        update(i, "location", e.target.value)
                                    }
                                />
                            </Field>
                        </div>
                        <Field label="Rating">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <button
                                        key={n}
                                        type="button"
                                        onClick={() => update(i, "rating", n)}
                                        className={`text-xl ${n <= item.rating ? "text-amber-400" : "text-gray-700"} hover:text-amber-300 transition-colors`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                        </Field>
                        <Field label="Review Text">
                            <Textarea
                                value={item.text}
                                onChange={(e) =>
                                    update(i, "text", e.target.value)
                                }
                            />
                        </Field>
                    </div>
                ))}
            </div>
            <Btn onClick={add}>
                <Plus size={13} /> Add Review
            </Btn>
        </div>
    );
}

function SpecsEditor({
    data,
    onChange,
}: {
    data: any;
    onChange: (d: any) => void;
}) {
    const update = (idx: number, field: string, value: string) => {
        const rows = [...data.rows];
        rows[idx] = { ...rows[idx], [field]: value };
        onChange({ ...data, rows });
    };
    const add = () =>
        onChange({ ...data, rows: [...data.rows, { label: "", value: "" }] });
    const remove = (idx: number) =>
        onChange({
            ...data,
            rows: data.rows.filter((_: any, i: number) => i !== idx),
        });

    return (
        <div className="space-y-4">
            <Field label="Section Title">
                <Input
                    value={data.title}
                    onChange={(e) =>
                        onChange({ ...data, title: e.target.value })
                    }
                />
            </Field>
            <div className="space-y-2">
                {data.rows.map((row: any, i: number) => (
                    <div
                        key={i}
                        className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center"
                    >
                        <Input
                            value={row.label}
                            onChange={(e) => update(i, "label", e.target.value)}
                            placeholder="Label"
                        />
                        <Input
                            value={row.value}
                            onChange={(e) => update(i, "value", e.target.value)}
                            placeholder="Value"
                        />
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <Btn onClick={add}>
                <Plus size={13} /> Add Row
            </Btn>
        </div>
    );
}

function FaqEditor({
    data,
    onChange,
}: {
    data: any;
    onChange: (d: any) => void;
}) {
    const update = (idx: number, field: string, value: string) => {
        const items = [...data.items];
        items[idx] = { ...items[idx], [field]: value };
        onChange({ ...data, items });
    };
    const add = () =>
        onChange({
            ...data,
            items: [...data.items, { question: "", answer: "" }],
        });
    const remove = (idx: number) =>
        onChange({
            ...data,
            items: data.items.filter((_: any, i: number) => i !== idx),
        });

    return (
        <div className="space-y-4">
            <Field label="Section Title">
                <Input
                    value={data.title}
                    onChange={(e) =>
                        onChange({ ...data, title: e.target.value })
                    }
                />
            </Field>
            <div className="space-y-3">
                {data.items.map((item: any, i: number) => (
                    <div
                        key={i}
                        className="bg-[#0C1311] border border-[#1E2826] rounded-xl p-4 space-y-2"
                    >
                        <div className="flex items-start gap-2">
                            <Input
                                value={item.question}
                                onChange={(e) =>
                                    update(i, "question", e.target.value)
                                }
                                placeholder="Question"
                                className="flex-1"
                            />
                            <button
                                type="button"
                                onClick={() => remove(i)}
                                className="mt-0.5 text-gray-600 hover:text-red-400 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                        <Textarea
                            value={item.answer}
                            onChange={(e) =>
                                update(i, "answer", e.target.value)
                            }
                            placeholder="Answer"
                            rows={2}
                        />
                    </div>
                ))}
            </div>
            <Btn onClick={add}>
                <Plus size={13} /> Add Question
            </Btn>
        </div>
    );
}

function CtaEditor({
    data,
    onChange,
}: {
    data: any;
    onChange: (d: any) => void;
}) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <Field label="Headline">
                <Input
                    value={data.headline}
                    onChange={(e) =>
                        onChange({ ...data, headline: e.target.value })
                    }
                />
            </Field>
            <Field label="Sub-text">
                <Input
                    value={data.subtext}
                    onChange={(e) =>
                        onChange({ ...data, subtext: e.target.value })
                    }
                />
            </Field>
            <Field label="Button Text">
                <Input
                    value={data.button_text}
                    onChange={(e) =>
                        onChange({ ...data, button_text: e.target.value })
                    }
                />
            </Field>
            <Field label="Button URL">
                <Input
                    value={data.button_url}
                    onChange={(e) =>
                        onChange({ ...data, button_url: e.target.value })
                    }
                    placeholder="https://..."
                />
            </Field>
        </div>
    );
}

// ─── Section Card ──────────────────────────────────────────────────────────────

function SectionCard({
    section,
    index,
    total,
    onMove,
    onRemove,
    onUpdate,
    uploadImage,
}: {
    section: Section;
    index: number;
    total: number;
    onMove: (id: string, dir: "up" | "down") => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, data: any) => void;
    uploadImage: (f: File) => Promise<string>;
}) {
    const [open, setOpen] = useState(true);
    const meta = SECTION_META[section.type];

    const EditorMap: Record<SectionType, React.ReactNode> = {
        description: (
            <DescriptionEditor
                data={section.data}
                onChange={(d) => onUpdate(section.id, d)}
            />
        ),
        features: (
            <FeaturesEditor
                data={section.data}
                onChange={(d) => onUpdate(section.id, d)}
            />
        ),
        gallery: (
            <GalleryEditor
                data={section.data}
                onChange={(d) => onUpdate(section.id, d)}
                uploadImage={uploadImage}
            />
        ),
        video: (
            <VideoEditor
                data={section.data}
                onChange={(d) => onUpdate(section.id, d)}
            />
        ),
        reviews: (
            <ReviewsEditor
                data={section.data}
                onChange={(d) => onUpdate(section.id, d)}
            />
        ),
        specs: (
            <SpecsEditor
                data={section.data}
                onChange={(d) => onUpdate(section.id, d)}
            />
        ),
        faq: (
            <FaqEditor
                data={section.data}
                onChange={(d) => onUpdate(section.id, d)}
            />
        ),
        cta: (
            <CtaEditor
                data={section.data}
                onChange={(d) => onUpdate(section.id, d)}
            />
        ),
    };

    return (
        <div className="bg-[#0b1818] border border-[#1E2826] rounded-2xl overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1E2826]">
                <GripVertical size={14} className="text-gray-700 shrink-0" />
                <span className={`shrink-0 ${meta.color}`}>{meta.icon}</span>
                <span className="text-white text-sm font-medium flex-1">
                    {meta.label}
                </span>
                <div className="flex items-center gap-1">
                    <Btn
                        onClick={() => onMove(section.id, "up")}
                        disabled={index === 0}
                    >
                        <ChevronUp size={13} />
                    </Btn>
                    <Btn
                        onClick={() => onMove(section.id, "down")}
                        disabled={index === total - 1}
                    >
                        <ChevronDown size={13} />
                    </Btn>
                    <Btn variant="danger" onClick={() => onRemove(section.id)}>
                        <Trash2 size={13} />
                    </Btn>
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="p-1.5 text-gray-500 hover:text-white transition-colors"
                    >
                        <Collapse
                            size={14}
                            className={`transition-transform ${open ? "rotate-180" : ""}`}
                        />
                    </button>
                </div>
            </div>
            {/* Editor body */}
            {open && <div className="p-4">{EditorMap[section.type]}</div>}
        </div>
    );
}

// ─── Add Section Picker ────────────────────────────────────────────────────────

function AddSectionPicker({ onAdd }: { onAdd: (type: SectionType) => void }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1E2826] hover:border-[#2DE3A7]/40 text-gray-600 hover:text-gray-300 rounded-2xl py-4 text-sm transition-colors"
            >
                <Plus size={16} /> Add Section
            </button>
            {open && (
                <div className="absolute left-0 right-0 mt-2 bg-[#0b1818] border border-[#1E2826] rounded-2xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 z-10 shadow-2xl">
                    {(
                        Object.entries(SECTION_META) as [
                            SectionType,
                            (typeof SECTION_META)[SectionType],
                        ][]
                    ).map(([type, meta]) => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => {
                                onAdd(type);
                                setOpen(false);
                            }}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[#1E2826] transition-colors group text-center"
                        >
                            <span
                                className={`${meta.color} group-hover:scale-110 transition-transform`}
                            >
                                {meta.icon}
                            </span>
                            <span className="text-gray-400 text-xs font-medium">
                                {meta.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Hero Image Upload ────────────────────────────────────────────────────────

function HeroImageUpload({
    current,
    onChange,
}: {
    current: string | null;
    onChange: (f: File) => void;
}) {
    const ref = useRef<HTMLInputElement>(null);
    return (
        <div>
            {current ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0C1311] border border-[#1E2826] group">
                    <img
                        src={current}
                        alt="Hero"
                        className="w-full h-full object-cover"
                    />
                    <button
                        type="button"
                        onClick={() => ref.current?.click()}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium"
                    >
                        Change Image
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => ref.current?.click()}
                    className="w-full aspect-video border-2 border-dashed border-[#1E2826] hover:border-[#2DE3A7]/40 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                    <ImageIcon size={24} />
                    <span className="text-xs">Upload Hero Image</span>
                </button>
            )}
            <input
                ref={ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                    e.target.files?.[0] && onChange(e.target.files[0])
                }
            />
        </div>
    );
}

// ─── Main Builder ─────────────────────────────────────────────────────────────

export default function Builder({
    products,
    page,
}: {
    products: Product[];
    page: LandingPage | null;
}) {
    const isEdit = !!page;

    const { data, setData, post, put, processing, errors } = useForm<{
        page_title: string;
        slug: string;
        meta_description: string;
        product_id: string;
        hero_headline: string;
        hero_subheadline: string;
        hero_badge: string;
        hero_image: File | null;
        hero_cta_text: string;
        hero_cta_url: string;
        accent_color: string;
        sections: string;
        is_published: boolean;
    }>({
        page_title: page?.page_title ?? "",
        slug: page?.slug ?? "",
        meta_description: page?.meta_description ?? "",
        product_id: page?.product_id?.toString() ?? "",
        hero_headline: page?.hero_headline ?? "",
        hero_subheadline: page?.hero_subheadline ?? "",
        hero_badge: page?.hero_badge ?? "",
        hero_image: null,
        hero_cta_text: page?.hero_cta_text ?? "Order Now",
        hero_cta_url: page?.hero_cta_url ?? "",
        accent_color: page?.accent_color ?? "#2DE3A7",
        sections: page?.sections ? JSON.stringify(page.sections) : "[]",
        is_published: page?.is_published ?? false,
    });

    const [sections, setSections] = useState<Section[]>(page?.sections ?? []);
    const [heroPreview, setHeroPreview] = useState<string | null>(
        page?.hero_image ? `/storage/${page.hero_image}` : null,
    );

    const syncSections = (next: Section[]) => {
        setSections(next);
        setData("sections", JSON.stringify(next));
    };

    const addSection = (type: SectionType) =>
        syncSections([
            ...sections,
            { id: uid(), type, data: { ...SECTION_DEFAULTS[type] } },
        ]);

    const removeSection = (id: string) =>
        syncSections(sections.filter((s) => s.id !== id));

    const moveSection = (id: string, dir: "up" | "down") => {
        const idx = sections.findIndex((s) => s.id === id);
        const next = [...sections];
        if (dir === "up" && idx > 0)
            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        if (dir === "down" && idx < next.length - 1)
            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        syncSections(next);
    };

    const updateSection = (id: string, newData: any) =>
        syncSections(
            sections.map((s) => (s.id === id ? { ...s, data: newData } : s)),
        );

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
        if (isEdit) {
            post(route("admin.landing-pages.update", page!.id), {
                forceFormData: true,
                _method: "put",
            } as any);
        } else {
            post(route("admin.landing-pages.store"), { forceFormData: true });
        }
    };

    const err = (field: keyof typeof errors) =>
        errors[field] ? (
            <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
        ) : null;

    return (
        <Master
            title={isEdit ? "Edit Landing Page" : "New Landing Page"}
            head={
                <Header
                    title={isEdit ? "Edit Landing Page" : "New Landing Page"}
                    showUserMenu
                />
            }
        >
            <div className="p-4 md:p-6">
                <div className="max-w-8xl mx-auto space-y-5">
                    {/* ── Top action bar ── */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                            {isEdit && (
                                <a
                                    href={`/lp/${page!.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#2DE3A7] transition-colors"
                                >
                                    <ExternalLink size={13} /> Preview
                                </a>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <div
                                    onClick={() =>
                                        setData(
                                            "is_published",
                                            !data.is_published,
                                        )
                                    }
                                    className={`relative w-9 h-5 rounded-full transition-colors ${data.is_published ? "bg-[#2DE3A7]" : "bg-[#1E2826]"}`}
                                >
                                    <span
                                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${data.is_published ? "translate-x-4" : ""}`}
                                    />
                                </div>
                                <span className="text-gray-400 text-sm">
                                    {data.is_published ? (
                                        <>
                                            <Globe
                                                size={13}
                                                className="inline mr-1 text-[#2DE3A7]"
                                            />
                                            Published
                                        </>
                                    ) : (
                                        <>
                                            <GlobeLock
                                                size={13}
                                                className="inline mr-1"
                                            />
                                            Draft
                                        </>
                                    )}
                                </span>
                            </label>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={processing}
                                className="inline-flex items-center gap-2 bg-[#2DE3A7] hover:bg-[#24c490] disabled:opacity-50 text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                <Save size={15} />{" "}
                                {processing
                                    ? "Saving…"
                                    : isEdit
                                      ? "Update Page"
                                      : "Create Page"}
                            </button>
                        </div>
                    </div>

                    {/* ── Page settings card ── */}
                    <div className="bg-[#0b1818] border border-[#1E2826] rounded-2xl p-5 space-y-4">
                        <h3 className="text-white text-sm font-semibold border-b border-[#1E2826] pb-3">
                            Page Settings
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Page Title">
                                <Input
                                    value={data.page_title}
                                    onChange={(e) => {
                                        setData("page_title", e.target.value);
                                        if (!isEdit)
                                            setData(
                                                "slug",
                                                toSlug(e.target.value),
                                            );
                                    }}
                                    placeholder="My Amazing Product"
                                />
                                {err("page_title")}
                            </Field>
                            <Field label="Slug" hint="URL: /lp/your-slug">
                                <Input
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData("slug", toSlug(e.target.value))
                                    }
                                    placeholder="my-amazing-product"
                                />
                                {err("slug")}
                            </Field>
                            <Field label="Linked Product (optional)">
                                <select
                                    value={data.product_id}
                                    onChange={(e) =>
                                        setData("product_id", e.target.value)
                                    }
                                    className="w-full bg-[#0C1311] border border-[#1E2826] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#2DE3A7]/60"
                                >
                                    <option value="">— None —</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </Field>
                            <Field label="Accent Color">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="color"
                                        value={data.accent_color}
                                        onChange={(e) =>
                                            setData(
                                                "accent_color",
                                                e.target.value,
                                            )
                                        }
                                        className="w-10 h-9 rounded-lg border border-[#1E2826] bg-[#0C1311] cursor-pointer p-0.5"
                                    />
                                    <Input
                                        value={data.accent_color}
                                        onChange={(e) =>
                                            setData(
                                                "accent_color",
                                                e.target.value,
                                            )
                                        }
                                        className="flex-1"
                                    />
                                </div>
                            </Field>
                            <Field label="Meta Description">
                                <Textarea
                                    value={data.meta_description}
                                    onChange={(e) =>
                                        setData(
                                            "meta_description",
                                            e.target.value,
                                        )
                                    }
                                    rows={2}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* ── Hero section card ── */}
                    <div className="bg-[#0b1818] border border-[#1E2826] rounded-2xl p-5 space-y-4">
                        <h3 className="text-white text-sm font-semibold border-b border-[#1E2826] pb-3">
                            Hero Section
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            <div className="space-y-3">
                                <Field
                                    label="Badge Text (optional)"
                                    hint='e.g. "🔥 Limited Offer"'
                                >
                                    <Input
                                        value={data.hero_badge}
                                        onChange={(e) =>
                                            setData(
                                                "hero_badge",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="🔥 Limited Offer"
                                    />
                                </Field>
                                <Field label="Headline *">
                                    <Textarea
                                        value={data.hero_headline}
                                        onChange={(e) =>
                                            setData(
                                                "hero_headline",
                                                e.target.value,
                                            )
                                        }
                                        rows={2}
                                        placeholder="Your powerful product headline"
                                    />
                                    {err("hero_headline")}
                                </Field>
                                <Field label="Subheadline">
                                    <Textarea
                                        value={data.hero_subheadline}
                                        onChange={(e) =>
                                            setData(
                                                "hero_subheadline",
                                                e.target.value,
                                            )
                                        }
                                        rows={2}
                                    />
                                </Field>
                                <div className="grid grid-cols-2 gap-3">
                                    <Field label="CTA Button Text">
                                        <Input
                                            value={data.hero_cta_text}
                                            onChange={(e) =>
                                                setData(
                                                    "hero_cta_text",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field label="CTA URL (optional)">
                                        <Input
                                            value={data.hero_cta_url}
                                            onChange={(e) =>
                                                setData(
                                                    "hero_cta_url",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="/checkout"
                                        />
                                    </Field>
                                </div>
                            </div>
                            <Field label="Hero Image">
                                <HeroImageUpload
                                    current={heroPreview}
                                    onChange={handleHeroImage}
                                />
                            </Field>
                        </div>
                    </div>

                    {/* ── Content sections ── */}
                    <div className="space-y-3">
                        <h3 className="text-white text-sm font-semibold px-1">
                            Content Sections
                        </h3>
                        {sections.map((section, i) => (
                            <SectionCard
                                key={section.id}
                                section={section}
                                index={i}
                                total={sections.length}
                                onMove={moveSection}
                                onRemove={removeSection}
                                onUpdate={updateSection}
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
