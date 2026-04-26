import { useRef, useState } from "react";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import RichTextEditor from "@/Components/Ui/RichTextEditor";
import { Field, Input, Textarea, StyledSelect, Btn } from "./ui";

// ─── Description ──────────────────────────────────────────────────────────────

export function DescriptionEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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

// ─── Features ─────────────────────────────────────────────────────────────────

export function FeaturesEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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
                        <Input value={item.emoji}       onChange={e => update(i, "emoji",       e.target.value)} placeholder="⚡" className="text-center px-1" />
                        <Input value={item.title}       onChange={e => update(i, "title",       e.target.value)} placeholder="Feature name" />
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

// ─── Gallery ──────────────────────────────────────────────────────────────────

export function GalleryEditor({ data, onChange, uploadImage }: {
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
                        <button type="button"
                            onClick={() => onChange({ ...data, images: data.images.filter((_: any, j: number) => j !== i) })}
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

// ─── Video ────────────────────────────────────────────────────────────────────

export function VideoEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function ReviewsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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

// ─── Specs ────────────────────────────────────────────────────────────────────

export function SpecsEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export function FaqEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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

// ─── CTA ──────────────────────────────────────────────────────────────────────

export function CtaEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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

// ─── Trust Badges ─────────────────────────────────────────────────────────────

export function TrustBadgesEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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

// ─── Countdown ────────────────────────────────────────────────────────────────

export function CountdownEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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

// ─── Pricing ──────────────────────────────────────────────────────────────────

export function PricingEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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

// ─── Comparison ───────────────────────────────────────────────────────────────

export function ComparisonEditor({ data, onChange }: { data: any; onChange: (d: any) => void }) {
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
                        <Input value={row.ours}    onChange={e => updateRow(i, "ours",    e.target.value)} placeholder="✅ Our value" />
                        <Input value={row.theirs}  onChange={e => updateRow(i, "theirs",  e.target.value)} placeholder="❌ Their value" />
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
