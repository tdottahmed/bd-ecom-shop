import { Head, Link, router, usePage } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import { Order, PageProps } from "@/types";
import {
    ArrowLeft,
    Printer,
    Package,
    User,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    TrendingUp,
    Shield,
    AlertTriangle,
} from "lucide-react";
import Card, { CardContent } from "@/Components/Ui/Card";
import { format } from "date-fns";
import { useState } from "react";
import ConfirmModal from "@/Components/Ui/ConfirmModal";
import { formatPrice, getAssetUrl } from "@/Utils/helpers";

interface Props extends PageProps {
    order: Order;
}

export default function Show({ order }: Props) {
    const { additionalCost } = usePage().props as any;
    const [isUpdating, setIsUpdating] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [fraudData, setFraudData] = useState<any>(null);
    const [isLoadingFraudCheck, setIsLoadingFraudCheck] = useState(false);

    const statusOptions = [
        { value: "pending", label: "Pending" },
        { value: "processing", label: "Processing" },
        { value: "shipped", label: "Shipped" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "processing":
                return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "shipped":
                return "bg-purple-500/10 text-purple-500 border-purple-500/20";
            case "delivered":
                return "bg-green-500/10 text-green-500 border-green-500/20";
            case "cancelled":
                return "bg-red-500/10 text-red-500 border-red-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border-gray-500/20";
        }
    };

    const handleStatusChange = (newStatus: string) => {
        setSelectedStatus(newStatus);
        setShowConfirmModal(true);
    };

    const handleConfirmStatusChange = () => {
        setIsUpdating(true);
        router.post(
            route("admin.orders.update-status", order.id),
            { status: selectedStatus },
            {
                preserveScroll: true,
                onFinish: () => {
                    setIsUpdating(false);
                    setShowConfirmModal(false);
                },
            }
        );
    };

    const handleCheckFraud = async () => {
        setIsLoadingFraudCheck(true);
        try {
            const response = await fetch(
                route("admin.orders.check-fraud", order.id)
            );
            const data = await response.json();
            setFraudData(data);
        } catch (error) {
            console.error("Error checking fraud status:", error);
        } finally {
            setIsLoadingFraudCheck(false);
        }
    };

    const calculateProfit = () => {
        const additional = parseFloat(additionalCost) || 0;
        return (
            order.items?.reduce((total, item) => {
                const purchasePrice = item.product?.purchase_price || 0;
                const actualCost = purchasePrice + additional;
                return total + (item.price - actualCost) * item.quantity;
            }, 0) || 0
        );
    };

    const profit = calculateProfit();

    return (
        <Master>
            <Head title={`Order #${order.id}`} />

            <div className="p-4 md:p-6 space-y-6 pb-24 min-h-screen bg-[#0C1311]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route("admin.orders.index")}
                            className="p-2 rounded-lg bg-[#1E2826] text-gray-400 hover:text-white hover:bg-[#2A3633] transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-white">
                                    Order #{order.id}
                                </h1>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-1">
                                {format(
                                    new Date(order.created_at),
                                    "MMMM d, yyyy 'at' h:mm a"
                                )}
                            </p>
                        </div>
                    </div>

                    <a
                        href={route("admin.orders.invoice", order.id)}
                        target="_blank"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2DE3A7] text-[#0C1311] rounded-lg font-semibold text-sm hover:bg-[#26c28f] transition-colors"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Print Invoice </span>
                    </a>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Amount */}
                    <Card className="bg-[#0E1614] border-[#1E2826]">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-[#2DE3A7]/10 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-[#2DE3A7]" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
                                        Order Total
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        {formatPrice(order.total)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profit */}
                    <Card className="bg-[#0E1614] border-[#1E2826]">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-500/10 rounded-lg">
                                    <TrendingUp className="w-6 h-6 text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
                                        Profit
                                    </div>
                                    <div className="text-2xl font-bold text-green-400">
                                        {formatPrice(profit)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items Count */}
                    <Card className="bg-[#0E1614] border-[#1E2826]">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-lg">
                                    <Package className="w-6 h-6 text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm text-gray-400 uppercase tracking-wider mb-1">
                                        Items
                                    </div>
                                    <div className="text-2xl font-bold text-white">
                                        {order.items?.reduce(
                                            (sum, item) => sum + item.quantity,
                                            0
                                        ) || 0}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Customer & Delivery Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Customer Information */}
                        <Card className="bg-[#0E1614] border-[#1E2826]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <User className="w-5 h-5 text-[#2DE3A7]" />
                                    <h3 className="text-lg font-bold text-white">
                                        Customer Details
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                            Name
                                        </div>
                                        <div className="text-white font-medium">
                                            {order.customer_name || "Guest"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            Phone
                                        </div>
                                        <div className="text-white font-medium">
                                            {order.customer_phone}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            Address
                                        </div>
                                        <div className="text-white text-sm leading-relaxed">
                                            {order.customer_address}
                                        </div>
                                    </div>
                                </div>

                                {/* Fraud Check Section */}
                                <div className="pt-4 border-t border-[#1E2826]">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-[#2DE3A7]" />
                                            Fraud Check
                                        </h4>
                                        <button
                                            onClick={handleCheckFraud}
                                            disabled={isLoadingFraudCheck}
                                            className="text-xs px-2 py-1 bg-[#2DE3A7]/10 text-[#2DE3A7] rounded hover:bg-[#2DE3A7]/20 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                                        >
                                            <AlertTriangle className={`w-3 h-3 ${isLoadingFraudCheck ? "animate-spin" : ""}`} />
                                            {isLoadingFraudCheck ? "Checking…" : fraudData ? "Re-check" : "Check Now"}
                                        </button>
                                    </div>

                                    {/* Feature disabled */}
                                    {fraudData?.disabled && (
                                        <p className="text-xs text-gray-500 italic">
                                            Fraud check is disabled. Enable it in Courier Settings.
                                        </p>
                                    )}

                                    {/* Result */}
                                    {fraudData && !fraudData.disabled && !fraudData.error && (
                                        <div className="space-y-3">
                                            {/* Overall score bar */}
                                            <div className="space-y-1.5">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-gray-400">Delivery success rate</span>
                                                    <span className={`font-bold ${
                                                        fraudData.success_ratio >= 80 ? "text-green-400"
                                                        : fraudData.success_ratio >= 50 ? "text-yellow-400"
                                                        : "text-red-400"
                                                    }`}>{fraudData.success_ratio}%</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-[#1E2826] rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            fraudData.success_ratio >= 80 ? "bg-green-500"
                                                            : fraudData.success_ratio >= 50 ? "bg-yellow-500"
                                                            : "bg-red-500"
                                                        }`}
                                                        style={{ width: `${fraudData.success_ratio}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Totals row */}
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                {[
                                                    { label: "Total", value: fraudData.total_orders, color: "text-gray-300" },
                                                    { label: "Delivered", value: fraudData.successful_orders, color: "text-green-400" },
                                                    { label: "Cancelled", value: fraudData.cancel_orders, color: "text-red-400" },
                                                ].map(({ label, value, color }) => (
                                                    <div key={label} className="bg-[#0C1311] border border-[#1E2826] rounded-lg py-2 px-1">
                                                        <div className={`text-base font-bold ${color}`}>{value}</div>
                                                        <div className="text-[10px] text-gray-500 mt-0.5">{label}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Per-courier breakdown */}
                                            {fraudData.summaries && Object.keys(fraudData.summaries).length > 0 && (
                                                <div className="space-y-1.5">
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">By courier</p>
                                                    {Object.entries(fraudData.summaries as Record<string, { total: number; delivered: number; cancelled: number }>).map(
                                                        ([courier, s]) => {
                                                            const pct = s.total > 0 ? Math.round((s.delivered / s.total) * 100) : 0;
                                                            return (
                                                                <div key={courier} className="flex items-center gap-2 text-xs">
                                                                    <span className="w-16 text-gray-400 truncate">{courier}</span>
                                                                    <div className="flex-1 h-1 bg-[#1E2826] rounded-full overflow-hidden">
                                                                        <div
                                                                            className={`h-full rounded-full ${pct >= 80 ? "bg-green-500" : pct >= 50 ? "bg-yellow-500" : "bg-red-500"}`}
                                                                            style={{ width: `${pct}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="w-8 text-right text-gray-400">{s.total}</span>
                                                                    <span className={`w-8 text-right font-medium ${pct >= 80 ? "text-green-400" : pct >= 50 ? "text-yellow-400" : "text-red-400"}`}>{pct}%</span>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}

                                            <p className="text-[10px] text-gray-600 text-right">
                                                Last checked: {format(new Date(fraudData.last_checked_at), "MMM d, h:mm a")}
                                            </p>
                                        </div>
                                    )}

                                    {fraudData?.error && (
                                        <p className="text-xs text-red-400">{fraudData.error}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Information */}
                        <Card className="bg-[#0E1614] border-[#1E2826]">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Package className="w-5 h-5 text-[#2DE3A7]" />
                                    <h3 className="text-lg font-bold text-white">
                                        Delivery Info
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                            Method
                                        </div>
                                        <div className="text-white font-medium">
                                            {order.delivery_charge?.name ||
                                                "Standard Delivery"}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                                            Charge
                                        </div>
                                        <div className="text-white font-medium">
                                            {formatPrice(order.delivery_cost)}
                                        </div>
                                    </div>
                                    {order.delivery_charge?.duration && (
                                        <div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                Duration
                                            </div>
                                            <div className="text-white text-sm">
                                                {order.delivery_charge.duration}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Status Update */}
                        <Card className="bg-[#0E1614] border-[#1E2826]">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-white mb-4">
                                    Update Status
                                </h3>
                                <div className="space-y-2">
                                    {statusOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() =>
                                                handleStatusChange(option.value)
                                            }
                                            disabled={
                                                isUpdating ||
                                                order.status === option.value
                                            }
                                            className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                                                order.status === option.value
                                                    ? getStatusColor(
                                                          option.value
                                                      ) + " font-semibold"
                                                    : "bg-[#1E2826] border-[#2A3633] text-gray-300 hover:bg-[#2A3633] hover:border-[#2DE3A7]/30"
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {option.label}
                                            {order.status === option.value && (
                                                <span className="ml-2 text-xs">
                                                    (Current)
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Order Items */}
                    <div className="lg:col-span-2">
                        <Card className="bg-[#0E1614] border-[#1E2826]">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-bold text-white mb-6">
                                    Order Items
                                </h3>

                                {/* Items Table */}
                                {/* Desktop View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-[#1E2826]">
                                                <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th className="text-center py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Qty
                                                </th>
                                                <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Total
                                                </th>
                                                <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                                    Profit
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items?.map((item, idx) => {
                                                const purchasePrice = item.product?.purchase_price || 0;
                                                const actualCost = purchasePrice + (parseFloat(additionalCost) || 0);
                                                const itemProfit =
                                                    (item.price - actualCost) *
                                                    item.quantity;
                                                return (
                                                    <tr
                                                        key={idx}
                                                        className="border-b border-[#1E2826] hover:bg-[#1E2826]/50 transition-colors"
                                                    >
                                                        <td className="py-4 px-2">
                                                            <div className="flex items-center gap-3">
                                                                {item.product
                                                                    ?.images?.[0] && (
                                                                    <img
                                                                        src={getAssetUrl(
                                                                            item
                                                                                .product
                                                                                ?.images?.[0]
                                                                        )}
                                                                        alt={
                                                                            item
                                                                                .product
                                                                                ?.name ||
                                                                            ""
                                                                        }
                                                                        className="w-12 h-12 object-cover rounded-lg border border-[#2A3633]"
                                                                    />
                                                                )}
                                                                <div>
                                                                    <div className="text-white font-medium text-sm">
                                                                        {item
                                                                            .product
                                                                            ?.name ||
                                                                            "Unknown Product"}
                                                                    </div>
                                                                    {item.variation_ids && item.variation_ids.length > 0 && item.product?.product_variations && (
                                                                        <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                                                            {item.variation_ids.map((variationId) => {
                                                                                const variation = item.product?.product_variations?.find(
                                                                                    (v) => v.id === variationId
                                                                                );
                                                                                if (!variation) return null;
                                                                                return (
                                                                                    <div key={variationId}>
                                                                                        <span className="font-medium">
                                                                                            {variation.product_attribute?.name || "Option"}:
                                                                                        </span>{" "}
                                                                                        <span>{variation.value}</span>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    )}
                                                                    {item
                                                                        .product
                                                                        ?.sku && (
                                                                        <div className="text-xs text-gray-500">
                                                                            SKU:{" "}
                                                                            {
                                                                                item
                                                                                    .product
                                                                                    .sku
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-2 text-right text-white">
                                                            {formatPrice(
                                                                item.price
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-2 text-center">
                                                            <span className="inline-block px-3 py-1 bg-[#1E2826] text-white rounded-full text-sm font-medium">
                                                                {item.quantity}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-2 text-right text-white font-semibold">
                                                            {formatPrice(
                                                                item.price *
                                                                    item.quantity
                                                            )}
                                                        </td>
                                                        <td className="py-4 px-2 text-right text-green-400 font-semibold">
                                                            {formatPrice(
                                                                itemProfit
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile View */}
                                <div className="md:hidden space-y-4">
                                    {order.items?.map((item, idx) => {
                                        const purchasePrice = item.product?.purchase_price || 0;
                                        const actualCost = purchasePrice + (parseFloat(additionalCost) || 0);
                                        const itemProfit =
                                            (item.price - actualCost) *
                                            item.quantity;
                                        return (
                                            <div
                                                key={idx}
                                                className="border border-[#1E2826] rounded-lg p-4 bg-[#1E2826]/30"
                                            >
                                                {/* Product Info */}
                                                <div className="flex items-start gap-3 mb-4 pb-4 border-b border-[#1E2826]">
                                                    {item.product
                                                        ?.images?.[0] && (
                                                        <img
                                                            src={getAssetUrl(
                                                                item.product
                                                                    .images[0]
                                                            )}
                                                            alt={
                                                                item.product
                                                                    ?.name || ""
                                                            }
                                                            className="w-16 h-16 object-cover rounded-lg border border-[#2A3633] flex-shrink-0"
                                                        />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-white font-semibold text-sm">
                                                            {item.product
                                                                ?.name ||
                                                                "Unknown Product"}
                                                        </div>
                                                        {item.variation_ids && item.variation_ids.length > 0 && item.product?.product_variations && (
                                                            <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                                                                {item.variation_ids.map((variationId) => {
                                                                    const variation = item.product?.product_variations?.find(
                                                                        (v) => v.id === variationId
                                                                    );
                                                                    if (!variation) return null;
                                                                    return (
                                                                        <div key={variationId}>
                                                                            <span className="font-medium text-gray-400">
                                                                                {variation.product_attribute?.name || "Option"}:
                                                                            </span>{" "}
                                                                            <span>{variation.value}</span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                        {item.product?.sku && (
                                                            <div className="text-xs text-gray-500 mt-2">
                                                                <span className="text-gray-400">
                                                                    SKU:{" "}
                                                                </span>
                                                                {
                                                                    item.product
                                                                        .sku
                                                                }
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Details Rows */}
                                                <div className="space-y-3 text-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-500 uppercase tracking-wider text-xs">
                                                            Price
                                                        </span>
                                                        <span className="text-white font-medium">
                                                            {formatPrice(
                                                                item.price
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-500 uppercase tracking-wider text-xs">
                                                            Quantity
                                                        </span>
                                                        <span className="inline-block px-2 py-1 bg-[#1E2826] text-white rounded text-xs font-medium">
                                                            {item.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-500 uppercase tracking-wider text-xs">
                                                            Total
                                                        </span>
                                                        <span className="text-white font-semibold">
                                                            {formatPrice(
                                                                item.price *
                                                                    item.quantity
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center pt-2 border-t border-[#1E2826]">
                                                        <span className="text-gray-500 uppercase tracking-wider text-xs">
                                                            Profit
                                                        </span>
                                                        <span className="text-green-400 font-semibold">
                                                            {formatPrice(
                                                                itemProfit
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Price Breakdown */}
                                <div className="mt-6 pt-6 border-t border-[#1E2826]">
                                    <div className="max-w-md ml-auto space-y-3">
                                        <div className="flex justify-between text-gray-400">
                                            <span>Subtotal </span>
                                            <span className="text-white font-medium">
                                                {formatPrice(order.subtotal)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-gray-400">
                                            <span>Delivery Charge </span>
                                            <span className="text-white font-medium">
                                                {formatPrice(
                                                    order.delivery_cost
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold pt-3 border-t border-[#1E2826]">
                                            <span className="text-white">
                                                Total
                                            </span>
                                            <span className="text-[#2DE3A7]">
                                                {formatPrice(order.total)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-white">
                                                Profit
                                            </span>
                                            <span className="text-green-400">
                                                {formatPrice(profit)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmStatusChange}
                title="Change Order Status"
                message={`Are you sure you want to change the order status to "${selectedStatus}"? This action will update the order immediately.`}
                confirmText="Change Status"
                cancelText="Cancel"
                variant="warning"
                isLoading={isUpdating}
            />
        </Master>
    );
}
