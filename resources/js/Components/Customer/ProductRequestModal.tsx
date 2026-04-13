import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Bell, CheckCircle, Loader2, Phone, User, Hash } from "lucide-react";
import { Product, ProductVariation } from "@/types";
import { getAssetUrl } from "@/Utils/helpers";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    variationLabel?: string;
}

type FormState = "idle" | "loading" | "success" | "error";

// ── Variation picker helpers ──────────────────────────────────────────────────

interface AttrGroup {
    attributeId: number;
    name: string;
    variations: ProductVariation[];
}

function groupByAttribute(variations: ProductVariation[]): AttrGroup[] {
    const map = new Map<number, AttrGroup>();
    for (const v of variations) {
        const id   = v.product_attribute_id ?? 0;
        const name = v.product_attribute?.name ?? (v as any).attribute?.name ?? "Option";
        if (!map.has(id)) map.set(id, { attributeId: id, name, variations: [] });
        map.get(id)!.variations.push(v);
    }
    return Array.from(map.values());
}

function buildLabel(groups: AttrGroup[], selected: Record<number, ProductVariation>): string {
    return groups
        .map((g) => {
            const v = selected[g.attributeId];
            return v ? `${g.name}: ${v.value}` : null;
        })
        .filter(Boolean)
        .join(", ");
}

// ── Modal ─────────────────────────────────────────────────────────────────────

const ProductRequestModal: React.FC<Props> = ({ isOpen, onClose, product, variationLabel }) => {
    const [name, setName]         = useState("");
    const [phone, setPhone]       = useState("");
    const [quantity, setQuantity] = useState(1);
    const [note, setNote]         = useState("");
    const [formState, setFormState] = useState<FormState>("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [selectedVars, setSelectedVars] = useState<Record<number, ProductVariation>>({});
    const [mounted, setMounted] = useState(false);

    useEffect(() => { setMounted(true); }, []);

    const isVariant      = product.product_type === "variant";
    const hasPreselected = Boolean(variationLabel);

    const attrGroups = useMemo(
        () => (isVariant && !hasPreselected ? groupByAttribute(product.product_variations ?? []) : []),
        [isVariant, hasPreselected, product.product_variations],
    );

    const computedLabel = hasPreselected
        ? (variationLabel ?? "")
        : buildLabel(attrGroups, selectedVars);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            setName(""); setPhone(""); setQuantity(1);
            setNote(""); setFormState("idle"); setErrorMsg("");
            setSelectedVars({});
        }
    }, [isOpen]);

    // Lock body scroll while open
    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = prev; };
    }, [isOpen]);

    // Escape to close
    useEffect(() => {
        if (!isOpen) return;
        const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, [isOpen, onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !phone.trim()) return;
        setFormState("loading");
        setErrorMsg("");

        try {
            const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? "";
            const res = await fetch("/api/product-requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": token,
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    product_id:      product.id,
                    customer_name:   name.trim(),
                    customer_phone:  phone.trim(),
                    quantity,
                    note:            note.trim() || null,
                    variation_label: computedLabel || null,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                const firstError = data.errors
                    ? Object.values(data.errors as Record<string, string[]>)[0]?.[0]
                    : data.message;
                setErrorMsg(firstError ?? "Something went wrong.");
                setFormState("error");
                return;
            }
            setFormState("success");
        } catch {
            setErrorMsg("Network error. Please try again.");
            setFormState("error");
        }
    };

    if (!mounted || !isOpen) return null;

    const modal = (
        <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Sheet */}
            <div className="relative w-full sm:max-w-md sm:mx-4 bg-white sm:rounded-2xl rounded-t-2xl shadow-2xl z-10 flex flex-col max-h-[92dvh] sm:max-h-[90vh]">

                {/* Drag handle — mobile only */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
                    <div className="w-10 h-1 rounded-full bg-gray-200" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <Bell size={15} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">Request Product</p>
                            <p className="text-xs text-gray-400">We'll notify you when available</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Product strip */}
                <div className="flex items-center gap-3 px-4 sm:px-5 py-2.5 bg-gray-50 border-b border-gray-100 shrink-0">
                    {product.images?.[0] && (
                        <img
                            src={getAssetUrl(product.images[0])}
                            alt={product.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                        />
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{product.name}</p>
                        {hasPreselected && variationLabel && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">{variationLabel}</p>
                        )}
                        {!hasPreselected && computedLabel && (
                            <p className="text-xs text-amber-600 font-medium truncate mt-0.5">{computedLabel}</p>
                        )}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 shrink-0">
                        Out of Stock
                    </span>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 overscroll-contain">
                    {formState === "success" ? (
                        <div className="px-5 py-10 flex flex-col items-center text-center">
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                <CheckCircle size={28} className="text-green-500" />
                            </div>
                            <h3 className="text-base font-bold text-gray-900 mb-1">Request Submitted!</h3>
                            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                                Our team will contact you at{" "}
                                <span className="font-semibold text-gray-700">{phone}</span>{" "}
                                as soon as this product is available.
                            </p>
                            <button
                                onClick={onClose}
                                className="mt-6 px-8 py-2.5 bg-brand-dark text-white text-sm font-semibold rounded-full hover:bg-brand-dark/85 transition-colors"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="px-4 sm:px-5 pt-4 pb-6 space-y-3.5">

                            {/* Inline variation picker */}
                            {isVariant && !hasPreselected && attrGroups.length > 0 && (
                                <div className="space-y-3 pb-1">
                                    <p className="text-xs font-semibold text-gray-700">
                                        Select Variation{" "}
                                        <span className="text-gray-400 font-normal">(optional)</span>
                                    </p>
                                    {attrGroups.map((group) => (
                                        <div key={group.attributeId}>
                                            <p className="text-[11px] text-gray-500 font-medium mb-1.5 uppercase tracking-wide">
                                                {group.name}
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {group.variations.map((v) => {
                                                    const isSelected = selectedVars[group.attributeId]?.id === v.id;
                                                    const isOos = (v.stock ?? null) !== null && (v.stock as number) <= 0;
                                                    return (
                                                        <button
                                                            key={v.id}
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedVars((prev) => {
                                                                    if (isSelected) {
                                                                        const next = { ...prev };
                                                                        delete next[group.attributeId];
                                                                        return next;
                                                                    }
                                                                    return { ...prev, [group.attributeId]: v };
                                                                })
                                                            }
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                                                                isSelected
                                                                    ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                                                                    : isOos
                                                                    ? "bg-gray-50 border-gray-200 text-gray-400 hover:border-amber-300 hover:text-amber-600"
                                                                    : "bg-white border-gray-200 text-gray-700 hover:border-amber-300 hover:text-amber-600"
                                                            }`}
                                                        >
                                                            {v.value}
                                                            {isOos && !isSelected && (
                                                                <span className="ml-1 text-[9px] opacity-60">OOS</span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="h-px bg-gray-100 mt-1" />
                                </div>
                            )}

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                    Your Name <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        required
                                        maxLength={100}
                                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 bg-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="e.g. 01XXXXXXXXX"
                                        required
                                        maxLength={20}
                                        className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 bg-gray-50"
                                    />
                                </div>
                            </div>

                            {/* Qty + Note — side by side on wider screens, stacked on mobile */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                        Quantity
                                    </label>
                                    <div className="relative">
                                        <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                            min={1}
                                            max={999}
                                            className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 bg-gray-50"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                                        Note <span className="text-gray-400 font-normal">(optional)</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        placeholder="Any note..."
                                        maxLength={500}
                                        className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 bg-gray-50"
                                    />
                                </div>
                            </div>

                            {formState === "error" && (
                                <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">{errorMsg}</p>
                            )}

                            <button
                                type="submit"
                                disabled={formState === "loading" || !name.trim() || !phone.trim()}
                                className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-1"
                            >
                                {formState === "loading" ? (
                                    <>
                                        <Loader2 size={15} className="animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Bell size={15} />
                                        Submit Request
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
};

export default ProductRequestModal;
