import React, { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import { X, Package, Plus, Minus, Layers, CheckCircle } from "lucide-react";
import { getAssetUrl } from "@/Utils/helpers";
import { Product } from "@/types";

interface VariationStock {
    id: number;
    label: string;
    currentStock: number;
    addQty: number;
}

interface StockUpdateDialogProps {
    product: Product | null;
    onClose: () => void;
}

function stockBadge(stock: number) {
    if (stock > 15) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
    if (stock > 5)  return "text-amber-400 bg-amber-400/10 border-amber-400/30";
    return                 "text-red-400 bg-red-400/10 border-red-400/30";
}

const StockUpdateDialog: React.FC<StockUpdateDialogProps> = ({ product, onClose }) => {
    const isVariant = product?.product_type === "variant";
    const variations = product?.product_variations ?? [];

    const [addQty, setAddQty] = useState(0);
    const [variationStocks, setVariationStocks] = useState<VariationStock[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Reset state when product changes
    useEffect(() => {
        if (!product) return;
        setAddQty(0);
        setSubmitted(false);
        if (isVariant) {
            setVariationStocks(
                variations.map((v) => ({
                    id: v.id,
                    label: `${v.product_attribute?.name ?? "Variant"}: ${v.value}`,
                    currentStock: Number(v.stock) || 0,
                    addQty: 0,
                }))
            );
        }
    }, [product?.id]);

    if (!product) return null;

    const currentStock = isVariant
        ? variations.reduce((s, v) => s + (Number(v.stock) || 0), 0)
        : product.stock || 0;

    const totalAdding = isVariant
        ? variationStocks.reduce((s, v) => s + v.addQty, 0)
        : addQty;

    const updateVariationQty = (id: number, delta: number) => {
        setVariationStocks((prev) =>
            prev.map((v) =>
                v.id === id ? { ...v, addQty: Math.max(0, v.addQty + delta) } : v
            )
        );
    };

    const setVariationQtyDirect = (id: number, value: string) => {
        const n = parseInt(value, 10);
        setVariationStocks((prev) =>
            prev.map((v) =>
                v.id === id ? { ...v, addQty: isNaN(n) ? 0 : Math.max(0, n) } : v
            )
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (totalAdding === 0) return;

        const formData = isVariant
            ? { variations: variationStocks.filter((v) => v.addQty > 0).map((v) => ({ id: v.id, stock: v.addQty })) }
            : { stock: addQty };

        setProcessing(true);
        router.post(route("admin.product.update-stock", product.id), formData, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                }, 1200);
            },
            onFinish: () => setProcessing(false),
        });
    };

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Dialog */}
            <div
                className="relative w-full max-w-lg bg-[#0E1614] border border-[#1E2826] rounded-2xl shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E2826]">
                    <div className="flex items-center gap-2 text-[#2DE3A7]">
                        <Package size={18} />
                        <span className="font-semibold text-sm">Update Stock</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-[#1E2826] transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Product info strip */}
                <div className="flex items-center gap-3 px-5 py-3 bg-[#0C1311] border-b border-[#1E2826]">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1E2826] shrink-0">
                        <img
                            src={product.images?.length ? getAssetUrl(product.images[0]) : "/placeholder.png"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm line-clamp-1">{product.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            {product.category && (
                                <span className="text-xs text-gray-500">{product.category.title}</span>
                            )}
                            {isVariant && (
                                <span className="flex items-center gap-1 text-[10px] font-bold text-[#2DE3A7] bg-[#2DE3A7]/10 border border-[#2DE3A7]/20 px-1.5 py-0.5 rounded">
                                    <Layers size={9} />VARIANT
                                </span>
                            )}
                        </div>
                    </div>
                    {/* Current stock badge */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${stockBadge(currentStock)}`}>
                        <Package size={11} />
                        {currentStock} now
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                    {submitted ? (
                        <div className="flex flex-col items-center justify-center py-6 gap-3 text-emerald-400">
                            <CheckCircle size={36} />
                            <p className="font-semibold text-sm">Stock updated!</p>
                        </div>
                    ) : isVariant ? (
                        /* Variant mode */
                        <div className="space-y-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                Add qty per variation
                            </p>
                            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                {variationStocks.map((v) => (
                                    <div
                                        key={v.id}
                                        className="flex items-center justify-between gap-3 bg-[#0C1311] border border-[#1E2826] rounded-xl px-4 py-3"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-medium truncate">{v.label}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Current: <span className={`font-semibold ${v.currentStock > 5 ? "text-emerald-400" : "text-red-400"}`}>{v.currentStock}</span>
                                                {v.addQty > 0 && (
                                                    <span className="text-[#2DE3A7] ml-1">→ {v.currentStock + v.addQty}</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => updateVariationQty(v.id, -1)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1E2826] text-gray-400 hover:bg-[#2A3633] hover:text-white transition-colors disabled:opacity-40"
                                                disabled={v.addQty === 0}
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <input
                                                type="number"
                                                min={0}
                                                value={v.addQty || ""}
                                                placeholder="0"
                                                onChange={(e) => setVariationQtyDirect(v.id, e.target.value)}
                                                className="w-14 text-center bg-[#1E2826] border border-[#2A3633] text-white text-sm rounded-lg py-1 px-2 focus:outline-none focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]/30"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => updateVariationQty(v.id, 1)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#2DE3A7]/10 text-[#2DE3A7] border border-[#2DE3A7]/30 hover:bg-[#2DE3A7]/20 transition-colors"
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* Single product mode */
                        <div className="space-y-3">
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                                Quantity to add
                            </p>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAddQty((q) => Math.max(0, q - 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#1E2826] text-gray-400 hover:bg-[#2A3633] hover:text-white transition-colors disabled:opacity-40"
                                    disabled={addQty === 0}
                                >
                                    <Minus size={16} />
                                </button>
                                <input
                                    type="number"
                                    min={0}
                                    value={addQty || ""}
                                    placeholder="0"
                                    onChange={(e) => {
                                        const n = parseInt(e.target.value, 10);
                                        setAddQty(isNaN(n) ? 0 : Math.max(0, n));
                                    }}
                                    className="flex-1 text-center text-2xl font-bold bg-[#0C1311] border border-[#1E2826] text-white rounded-xl py-3 px-4 focus:outline-none focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => setAddQty((q) => q + 1)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#2DE3A7]/10 text-[#2DE3A7] border border-[#2DE3A7]/30 hover:bg-[#2DE3A7]/20 transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            {addQty > 0 && (
                                <p className="text-center text-sm text-gray-400">
                                    New total:{" "}
                                    <span className="text-[#2DE3A7] font-bold text-base">
                                        {currentStock + addQty}
                                    </span>{" "}
                                    units
                                </p>
                            )}
                        </div>
                    )}

                    {/* Footer actions */}
                    {!submitted && (
                        <div className="flex items-center gap-3 pt-2 border-t border-[#1E2826]">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2.5 text-sm font-medium text-gray-400 bg-[#1E2826] rounded-xl hover:bg-[#2A3633] hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={totalAdding === 0 || processing}
                                className="flex-1 py-2.5 text-sm font-semibold text-[#0C1311] bg-[#2DE3A7] rounded-xl hover:bg-[#25c994] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <span className="animate-spin w-4 h-4 border-2 border-[#0C1311]/40 border-t-[#0C1311] rounded-full" />
                                ) : (
                                    <>
                                        <Plus size={15} />
                                        Add {totalAdding > 0 ? totalAdding : ""} to Stock
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default StockUpdateDialog;
