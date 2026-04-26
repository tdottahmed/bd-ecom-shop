import { useState, useEffect } from "react";
import { Head, router, Link, useForm } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Pagination from "@/Components/Ui/Pagination";
import { PaginatedData } from "@/types";
import {
    Bell, Trash2, Search, CheckCircle, PhoneCall, Clock,
    ChevronDown, ShoppingBag, X, MapPin, CreditCard,
    Package, User, Phone, FileText, AlertCircle, Boxes, Plus, Minus,
} from "lucide-react";
import { useDebounce } from "@/Hooks/useDebounce";
import { formatPrice } from "@/Utils/helpers";

interface DeliveryCharge {
    id: number;
    name: string;
    cost: string;
    duration: string;
}

interface ProductRequest {
    id: number;
    product_id: number;
    product_name: string;
    variation_label: string | null;
    customer_name: string;
    customer_phone: string;
    quantity: number;
    note: string | null;
    status: "pending" | "contacted" | "fulfilled";
    created_at: string;
    product?: {
        id: number;
        name: string;
        slug: string;
        images: string[];
        sale_price: number;
        discounted_sale_price: number | null;
        product_type: "single" | "variant";
        stock: number;
        product_variations?: {
            id: number;
            value: string;
            stock: number | null;
            product_attribute?: { id: number; name: string } | null;
        }[];
    } | null;
}

interface Props {
    requests: PaginatedData<ProductRequest>;
    counts: { all: number; pending: number; contacted: number; fulfilled: number };
    delivery_charges: DeliveryCharge[];
    filters: { status: string; search: string };
}

const STATUS_CONFIG = {
    pending:   { label: "Pending",   color: "text-amber-400",   bg: "bg-amber-400/10  border-amber-400/20",   icon: <Clock size={12} /> },
    contacted: { label: "Contacted", color: "text-blue-400",    bg: "bg-blue-400/10   border-blue-400/20",    icon: <PhoneCall size={12} /> },
    fulfilled: { label: "Fulfilled", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20", icon: <CheckCircle size={12} /> },
} as const;

/* ── Create-Order modal ─────────────────────────────────── */
function CreateOrderModal({
    req,
    deliveryCharges,
    onClose,
}: {
    req: ProductRequest;
    deliveryCharges: DeliveryCharge[];
    onClose: () => void;
}) {
    const unitPrice =
        req.product?.discounted_sale_price != null &&
        Number(req.product.discounted_sale_price) < Number(req.product?.sale_price)
            ? Number(req.product.discounted_sale_price)
            : Number(req.product?.sale_price ?? 0);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_address:   "",
        delivery_charge_id: deliveryCharges[0]?.id?.toString() ?? "",
        payment_method:     "cod",
        quantity:           req.quantity,
        price:              unitPrice,
        note:               req.note ?? "",
    });

    // Close on Escape
    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, [onClose]);

    const selectedCharge = deliveryCharges.find(
        (d) => d.id.toString() === data.delivery_charge_id,
    );
    const subtotal = data.price * data.quantity;
    const deliveryCost = selectedCharge ? Number(selectedCharge.cost) : 0;
    const total = subtotal + deliveryCost;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.product-requests.create-order", req.id), {
            preserveScroll: true,
            onSuccess: () => { reset(); onClose(); },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-[#0E1614] border border-[#1E2826] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2826] sticky top-0 bg-[#0E1614] z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#2DE3A7]/10 border border-[#2DE3A7]/20 flex items-center justify-center">
                            <ShoppingBag size={16} className="text-[#2DE3A7]" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Create Order</p>
                            <p className="text-xs text-gray-500">from request #{req.id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#151F1D] text-gray-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Product + Customer summary */}
                <div className="px-6 py-4 bg-[#0C1311] border-b border-[#1E2826] space-y-3">
                    {/* Product */}
                    <div className="flex items-center gap-3">
                        {req.product?.images?.[0] && (
                            <img
                                src={`/storage/${req.product.images[0]}`}
                                alt={req.product_name}
                                className="w-12 h-12 rounded-lg object-cover border border-[#1E2826] shrink-0"
                            />
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{req.product_name}</p>
                            {req.variation_label && (
                                <p className="text-xs text-[#2DE3A7]/70 truncate">{req.variation_label}</p>
                            )}
                            <p className="text-xs text-gray-400 mt-0.5 font-medium">
                                Unit price: <span className="text-white">{formatPrice(unitPrice)}</span>
                            </p>
                        </div>
                    </div>

                    {/* Customer */}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                            <User size={11} />
                            {req.customer_name}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Phone size={11} />
                            {req.customer_phone}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Quantity & Price */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                                Quantity <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.quantity}
                                onChange={(e) => setData("quantity", Math.max(1, parseInt(e.target.value) || 1))}
                                min={1}
                                className="w-full px-3 py-2.5 text-sm bg-[#0C1311] border border-[#1E2826] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#2DE3A7]/40"
                            />
                            {errors.quantity && <p className="text-xs text-red-400 mt-1">{errors.quantity}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                                Unit Price (৳) <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.price}
                                onChange={(e) => setData("price", parseFloat(e.target.value) || 0)}
                                min={0}
                                step="0.01"
                                className="w-full px-3 py-2.5 text-sm bg-[#0C1311] border border-[#1E2826] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#2DE3A7]/40"
                            />
                            {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
                        </div>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1">
                            <MapPin size={11} />
                            Delivery Address <span className="text-red-400">*</span>
                        </label>
                        <textarea
                            value={data.customer_address}
                            onChange={(e) => setData("customer_address", e.target.value)}
                            placeholder="Full delivery address..."
                            rows={2}
                            required
                            className="w-full px-3 py-2.5 text-sm bg-[#0C1311] border border-[#1E2826] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#2DE3A7]/40 resize-none"
                        />
                        {errors.customer_address && <p className="text-xs text-red-400 mt-1">{errors.customer_address}</p>}
                    </div>

                    {/* Delivery Charge */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1">
                            <Package size={11} />
                            Delivery Zone <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={data.delivery_charge_id}
                            onChange={(e) => setData("delivery_charge_id", e.target.value)}
                            className="w-full px-3 py-2.5 text-sm bg-[#0C1311] border border-[#1E2826] rounded-lg text-white focus:outline-none focus:border-[#2DE3A7]/40"
                        >
                            {deliveryCharges.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name} — ৳{d.cost} ({d.duration})
                                </option>
                            ))}
                        </select>
                        {errors.delivery_charge_id && <p className="text-xs text-red-400 mt-1">{errors.delivery_charge_id}</p>}
                    </div>

                    {/* Payment Method */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1">
                            <CreditCard size={11} />
                            Payment Method <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["cod", "bkash", "nagad"] as const).map((method) => (
                                <button
                                    key={method}
                                    type="button"
                                    onClick={() => setData("payment_method", method)}
                                    className={`py-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                                        data.payment_method === method
                                            ? "bg-[#2DE3A7]/10 border-[#2DE3A7]/40 text-[#2DE3A7]"
                                            : "bg-[#0C1311] border-[#1E2826] text-gray-400 hover:border-[#2DE3A7]/20"
                                    }`}
                                >
                                    {method === "cod" ? "Cash on Delivery" : method === "bkash" ? "bKash" : "Nagad"}
                                </button>
                            ))}
                        </div>
                        {errors.payment_method && <p className="text-xs text-red-400 mt-1">{errors.payment_method}</p>}
                    </div>

                    {/* Note */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-400 mb-1.5 flex items-center gap-1">
                            <FileText size={11} />
                            Order Note <span className="text-gray-600 font-normal">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={data.note}
                            onChange={(e) => setData("note", e.target.value)}
                            placeholder="Internal note for this order..."
                            className="w-full px-3 py-2.5 text-sm bg-[#0C1311] border border-[#1E2826] rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-[#2DE3A7]/40"
                        />
                    </div>

                    {/* Order Summary */}
                    <div className="bg-[#0C1311] border border-[#1E2826] rounded-xl p-4 space-y-2">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Order Summary</p>
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>Subtotal ({data.quantity} × ৳{data.price})</span>
                            <span className="font-medium text-white">{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>Delivery ({selectedCharge?.name ?? "—"})</span>
                            <span className="font-medium text-white">{formatPrice(deliveryCost)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold border-t border-[#1E2826] pt-2 mt-1">
                            <span className="text-gray-200">Total</span>
                            <span className="text-[#2DE3A7] text-base">{formatPrice(total)}</span>
                        </div>
                    </div>

                    {/* Warning: product may be out of stock */}
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                        <AlertCircle size={14} className="text-amber-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-400/80">
                            This order will be created with <span className="font-semibold">pending</span> status.
                            Stock is <span className="font-semibold">not decremented</span> for requested products — manage fulfilment manually.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-200 border border-[#1E2826] hover:border-[#2DE3A7]/20 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || !data.customer_address.trim()}
                            className="flex-2 flex-1 py-3 rounded-xl text-sm font-bold bg-[#2DE3A7] hover:bg-[#26c795] text-[#0C1311] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={15} />
                            {processing ? "Creating…" : "Create Order"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Update-Stock modal ─────────────────────────────────── */
function UpdateStockModal({
    req,
    onClose,
}: {
    req: ProductRequest;
    onClose: () => void;
}) {
    const product = req.product!;
    const isVariant = product.product_type === "variant";
    const variations = product.product_variations ?? [];

    // For simple products: how much to ADD
    const [simpleAdd, setSimpleAdd] = useState(1);

    // For variant products: map variationId → new absolute stock value
    // Initialise with each variation's current stock (null → 0)
    const [varStock, setVarStock] = useState<Record<number, number>>(() =>
        Object.fromEntries(variations.map((v) => [v.id, v.stock ?? 0])),
    );

    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", h);
        return () => document.removeEventListener("keydown", h);
    }, [onClose]);

    // Parse variation_label ("Color: Red, Size: XL") into a set of "attrName:value" tokens
    // used to highlight matching rows.
    const requestedTokens = new Set(
        (req.variation_label ?? "")
            .split(",")
            .map((s) => s.trim().toLowerCase()),
    );
    const isRequestedVariation = (v: { value: string; product_attribute?: { name: string } | null }) => {
        const token = `${(v.product_attribute?.name ?? "").toLowerCase()}: ${v.value.toLowerCase()}`;
        return requestedTokens.has(token);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const payload = isVariant
            ? {
                  variations: variations.map((v) => ({
                      id: v.id,
                      stock: varStock[v.id] ?? v.stock ?? 0,
                  })),
              }
            : { stock: simpleAdd };

        router.post(route("admin.product.update-stock", product.id), payload, {
            preserveScroll: true,
            onSuccess: () => { setSubmitting(false); onClose(); },
            onError:   () => setSubmitting(false),
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-[#0E1614] border border-[#1E2826] rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto z-10">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2826] sticky top-0 bg-[#0E1614] z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                            <Boxes size={16} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Update Stock</p>
                            <p className="text-xs text-gray-500 truncate max-w-[220px]">{product.name}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#151F1D] text-gray-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                    {/* Product preview */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-[#0C1311] border border-[#1E2826]">
                        {product.images?.[0] && (
                            <img
                                src={`/storage/${product.images[0]}`}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover border border-[#1E2826] shrink-0"
                            />
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{product.name}</p>
                            {req.variation_label && (
                                <p className="text-xs text-amber-400/80 truncate mt-0.5">
                                    Requested: {req.variation_label}
                                </p>
                            )}
                            {!isVariant && (
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Current stock:{" "}
                                    <span className={`font-bold ${product.stock > 0 ? "text-emerald-400" : "text-red-400"}`}>
                                        {product.stock}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>

                    {isVariant ? (
                        /* Variant: one row per variation — set absolute stock value */
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Set stock per variation
                            </p>
                            {variations.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No variations found.</p>
                            ) : (
                                <div className="space-y-2">
                                    {variations.map((v) => {
                                        const attrName = v.product_attribute?.name ?? "Option";
                                        const oldStock = v.stock ?? 0;
                                        const newStock = varStock[v.id] ?? oldStock;
                                        const isRequested = isRequestedVariation(v);
                                        return (
                                            <div
                                                key={v.id}
                                                className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                                                    isRequested
                                                        ? "bg-amber-500/5 border-amber-500/30"
                                                        : "bg-[#0C1311] border-[#1E2826]"
                                                }`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="text-sm font-medium text-gray-200">
                                                            {attrName}: <span className="text-white font-semibold">{v.value}</span>
                                                        </p>
                                                        {isRequested && (
                                                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold uppercase tracking-wide">
                                                                Requested
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        Was:{" "}
                                                        <span className={`font-bold ${oldStock > 0 ? "text-emerald-400" : "text-red-400"}`}>
                                                            {oldStock}
                                                        </span>
                                                        {newStock !== oldStock && (
                                                            <span className={`ml-1.5 font-bold ${newStock > oldStock ? "text-[#2DE3A7]" : "text-red-400"}`}>
                                                                → {newStock}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                                {/* Direct stock input */}
                                                <div className="flex items-center gap-1 bg-[#0E1614] border border-[#1E2826] rounded-lg">
                                                    <button
                                                        type="button"
                                                        onClick={() => setVarStock((p) => ({ ...p, [v.id]: Math.max(0, (p[v.id] ?? 0) - 1) }))}
                                                        disabled={(varStock[v.id] ?? 0) === 0}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                    <input
                                                        type="number"
                                                        value={varStock[v.id] ?? 0}
                                                        onChange={(e) =>
                                                            setVarStock((p) => ({
                                                                ...p,
                                                                [v.id]: Math.max(0, parseInt(e.target.value) || 0),
                                                            }))
                                                        }
                                                        min={0}
                                                        className="w-12 text-center text-sm font-bold bg-transparent text-white focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setVarStock((p) => ({ ...p, [v.id]: (p[v.id] ?? 0) + 1 }))}
                                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#2DE3A7] transition-colors"
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Simple product: add-stock stepper */
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                Quantity to add
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 bg-[#0C1311] border border-[#1E2826] rounded-xl flex-1">
                                    <button
                                        type="button"
                                        onClick={() => setSimpleAdd((v) => Math.max(1, v - 1))}
                                        disabled={simpleAdd <= 1}
                                        className="w-10 h-11 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-xl"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <input
                                        type="number"
                                        value={simpleAdd}
                                        onChange={(e) => setSimpleAdd(Math.max(1, parseInt(e.target.value) || 1))}
                                        min={1}
                                        className="flex-1 text-center text-lg font-bold bg-transparent text-white focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setSimpleAdd((v) => v + 1)}
                                        className="w-10 h-11 flex items-center justify-center text-gray-400 hover:text-[#2DE3A7] transition-colors rounded-r-xl"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                After update:{" "}
                                <span className="text-[#2DE3A7] font-bold">{product.stock + simpleAdd}</span> in stock
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-400 hover:text-gray-200 border border-[#1E2826] hover:border-[#2DE3A7]/20 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || (isVariant && variations.length === 0)}
                            className="flex-1 py-3 rounded-xl text-sm font-bold bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                        >
                            <Boxes size={15} />
                            {submitting ? "Saving…" : "Save Stock"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Main Page ──────────────────────────────────────────── */
export default function ProductRequestsIndex({ requests, counts, delivery_charges, filters }: Props) {
    const [search, setSearch] = useState(filters.search || "");
    const debouncedSearch = useDebounce(search, 500);
    const [activeStatus, setActiveStatus] = useState(filters.status || "");
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [orderModalReq, setOrderModalReq] = useState<ProductRequest | null>(null);
    const [stockModalReq, setStockModalReq] = useState<ProductRequest | null>(null);

    useEffect(() => {
        if (debouncedSearch !== filters.search) {
            router.get(
                route("admin.product-requests.index"),
                { search: debouncedSearch, status: activeStatus },
                { preserveState: true, preserveScroll: true }
            );
        }
    }, [debouncedSearch]);

    const handleStatusTab = (status: string) => {
        setActiveStatus(status);
        router.get(
            route("admin.product-requests.index"),
            { status, search: filters.search },
            { preserveState: true, preserveScroll: true }
        );
    };

    const updateStatus = (id: number, status: string) => {
        router.post(
            route("admin.product-requests.update-status", id),
            { status },
            { preserveScroll: true }
        );
        setOpenDropdown(null);
    };

    const remove = (id: number) => {
        if (!confirm("Delete this request?")) return;
        router.delete(route("admin.product-requests.destroy", id), { preserveScroll: true });
    };

    const tabs = [
        { key: "", label: "All", count: counts.all },
        { key: "pending",   label: "Pending",   count: counts.pending },
        { key: "contacted", label: "Contacted", count: counts.contacted },
        { key: "fulfilled", label: "Fulfilled", count: counts.fulfilled },
    ];

    return (
        <Master title="Product Requests" head={<Header title="Product Requests" showUserMenu={true} />}>
            <Head title="Product Requests" />

            <div className="p-4 md:p-6 space-y-5 max-w-8xl mx-auto">
                {/* Page header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                            <Bell size={18} className="text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Product Requests</h1>
                            <p className="text-gray-400 text-sm mt-0.5">Customers requesting out-of-stock products</p>
                        </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold">
                        {counts.pending} pending
                    </span>
                </div>

                {/* Table card */}
                <div className="bg-[#0E1614] rounded-xl border border-[#1E2826] overflow-hidden">
                    {/* Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 pt-4 pb-3 border-b border-[#1E2826]">
                        <div className="flex gap-1 flex-wrap">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => handleStatusTab(tab.key)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                                        activeStatus === tab.key
                                            ? "bg-[#2DE3A7]/10 text-[#2DE3A7] border border-[#2DE3A7]/20"
                                            : "text-gray-400 hover:text-gray-200 hover:bg-[#151F1D]"
                                    }`}
                                >
                                    {tab.label}
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                                        activeStatus === tab.key ? "bg-[#2DE3A7]/20 text-[#2DE3A7]" : "bg-gray-700 text-gray-300"
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search name, phone, product..."
                                className="w-full pl-9 pr-3 py-2 text-sm bg-[#0C1311] border border-[#1E2826] rounded-lg text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#2DE3A7]/40"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-[#0C1311] text-gray-400 text-xs uppercase tracking-wide">
                                <tr>
                                    <th className="text-left px-4 py-3">Product</th>
                                    <th className="text-left px-4 py-3">Customer</th>
                                    <th className="text-left px-4 py-3">Phone</th>
                                    <th className="text-center px-4 py-3">Qty</th>
                                    <th className="text-left px-4 py-3">Note</th>
                                    <th className="text-left px-4 py-3">Status</th>
                                    <th className="text-left px-4 py-3">Date</th>
                                    <th className="text-right px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1E2826]">
                                {requests.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-16 text-center">
                                            <div className="flex flex-col items-center gap-3 text-gray-500">
                                                <Bell size={32} className="opacity-30" />
                                                <p>No requests found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    requests.data.map((req) => {
                                        const cfg = STATUS_CONFIG[req.status];
                                        return (
                                            <tr key={req.id} className="text-gray-200 hover:bg-[#0C1311]/50 transition-colors">
                                                {/* Product */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2.5 min-w-0">
                                                        {req.product?.images?.[0] && (
                                                            <img
                                                                src={`/storage/${req.product.images[0]}`}
                                                                alt={req.product_name}
                                                                className="w-9 h-9 rounded-lg object-cover border border-[#1E2826] shrink-0"
                                                            />
                                                        )}
                                                        <div className="min-w-0">
                                                            {req.product ? (
                                                                <Link
                                                                    href={route("admin.product.show", req.product.id)}
                                                                    className="text-sm font-medium text-gray-100 hover:text-[#2DE3A7] transition-colors line-clamp-1"
                                                                >
                                                                    {req.product_name}
                                                                </Link>
                                                            ) : (
                                                                <span className="text-sm font-medium text-gray-400 line-clamp-1">
                                                                    {req.product_name}
                                                                </span>
                                                            )}
                                                            {req.variation_label && (
                                                                <p className="text-[10px] text-[#2DE3A7]/70 mt-0.5 truncate">
                                                                    {req.variation_label}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Customer */}
                                                <td className="px-4 py-3 font-medium capitalize whitespace-nowrap">
                                                    {req.customer_name}
                                                </td>

                                                {/* Phone */}
                                                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">
                                                    <a href={`tel:${req.customer_phone}`} className="hover:text-[#2DE3A7] transition-colors">
                                                        {req.customer_phone}
                                                    </a>
                                                </td>

                                                {/* Qty */}
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-block px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-300 text-xs font-bold">
                                                        ×{req.quantity}
                                                    </span>
                                                </td>

                                                {/* Note */}
                                                <td className="px-4 py-3 text-gray-500 max-w-[140px]">
                                                    <span className="line-clamp-1 text-xs">{req.note || "—"}</span>
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-3">
                                                    <div className="relative inline-block">
                                                        <button
                                                            onClick={() => setOpenDropdown(openDropdown === req.id ? null : req.id)}
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${cfg.bg} ${cfg.color} hover:opacity-80 transition-colors`}
                                                        >
                                                            {cfg.icon}
                                                            {cfg.label}
                                                            <ChevronDown size={10} />
                                                        </button>
                                                        {openDropdown === req.id && (
                                                            <div className="absolute left-0 mt-1 z-20 bg-[#0E1614] border border-[#1E2826] rounded-xl shadow-2xl py-1 min-w-[140px]">
                                                                {(["pending", "contacted", "fulfilled"] as const).map((s) => {
                                                                    const c = STATUS_CONFIG[s];
                                                                    return (
                                                                        <button
                                                                            key={s}
                                                                            onClick={() => updateStatus(req.id, s)}
                                                                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors hover:bg-[#151F1D] ${
                                                                                req.status === s ? c.color : "text-gray-400"
                                                                            }`}
                                                                        >
                                                                            {c.icon}
                                                                            {c.label}
                                                                            {req.status === s && <CheckCircle size={10} className="ml-auto" />}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Date */}
                                                <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                                                    {new Date(req.created_at).toLocaleDateString("en-US", {
                                                        day: "numeric", month: "short", year: "numeric",
                                                    })}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* Create Order — only for non-fulfilled and if product still exists */}
                                                        {req.status !== "fulfilled" && req.product && (
                                                            <button
                                                                onClick={() => setOrderModalReq(req)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2DE3A7]/10 text-[#2DE3A7] border border-[#2DE3A7]/20 hover:bg-[#2DE3A7]/20 text-xs font-semibold transition-colors"
                                                            >
                                                                <ShoppingBag size={13} />
                                                                Create Order
                                                            </button>
                                                        )}
                                                        {/* Update Stock — only if product still exists */}
                                                        {req.product && (
                                                            <button
                                                                onClick={() => setStockModalReq(req)}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 text-xs font-semibold transition-colors"
                                                            >
                                                                <Boxes size={13} />
                                                                Stock
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => remove(req.id)}
                                                            className="inline-flex items-center p-1.5 rounded-lg bg-red-600/10 text-red-400 hover:bg-red-600/20 transition-colors"
                                                        >
                                                            <Trash2 size={13} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {requests.last_page > 1 && (
                        <div className="border-t border-[#1E2826]">
                            <Pagination data={requests} />
                        </div>
                    )}
                </div>
            </div>

            {/* Dropdown backdrop */}
            {openDropdown !== null && (
                <div className="fixed inset-0 z-10" onClick={() => setOpenDropdown(null)} />
            )}

            {/* Create Order Modal */}
            {orderModalReq && (
                <CreateOrderModal
                    req={orderModalReq}
                    deliveryCharges={delivery_charges}
                    onClose={() => setOrderModalReq(null)}
                />
            )}

            {/* Update Stock Modal */}
            {stockModalReq && (
                <UpdateStockModal
                    req={stockModalReq}
                    onClose={() => setStockModalReq(null)}
                />
            )}
        </Master>
    );
}
