import React, { useMemo, useState } from "react";
import { Order, PageProps } from "@/types";
import Card, { CardContent } from "@/Components/Ui/Card";
import Checkbox from "@/Components/Ui/Checkbox";
import SelectInput from "@/Components/Ui/SelectInput";
import { FileText, Eye, Shield, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Link, router, usePage } from "@inertiajs/react";
import OrderStatus from "@/Components/Order/OrderStatus";
import SuccessRate from "@/Components/Order/SuccessRate";

interface Props {
    order: Order;
    selected: boolean;
    onSelect: () => void;
    onStatusChange: (order: Order, status: string) => void;
    statusOptions: { value: string; label: string }[];
}

export default function OrderGridItem({
    order,
    selected,
    onSelect,
    onStatusChange,
    statusOptions,
}: Props) {
    const { fraudCheckEnabled } = usePage<PageProps>().props;
    const [isCheckingFraud, setIsCheckingFraud] = useState(false);

    const handleCheckFraud = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsCheckingFraud(true);
        try {
            await fetch(route("admin.orders.check-fraud", order.id));
            router.reload({ only: ["orders"] });
        } catch {
            // silently fail; SuccessRate will show stale data
        } finally {
            setIsCheckingFraud(false);
        }
    };

    // Use real data from courier_order_history
    const success_rate = useMemo(() => {
        if (!order.courier_order_history) return undefined;

        return {
            total_orders: order.courier_order_history.total_orders,
            successful_orders: order.courier_order_history.successful_orders,
            cancel_orders: order.courier_order_history.cancel_orders,
        };
    }, [order.courier_order_history]);

    return (
        <Card
            className={`relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#2DE3A7]/10 ${
                selected ? "border-[#2DE3A7] ring-1 ring-[#2DE3A7]/20" : ""
            }`}
            padding="none"
        >
            <div className="absolute top-4 left-4 z-10">
                <Checkbox
                    name={`order-${order.id}`}
                    checked={selected}
                    onChange={onSelect}
                />
            </div>

            <CardContent className="space-y-4 p-5">
                {/* Header */}
                <div className="flex justify-between items-start pl-8">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white">
                                #{order.id}{" "}
                            </span>
                            <OrderStatus status={order.status} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {format(
                                new Date(order.created_at),
                                "MMM d, h:mm a",
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-[#2DE3A7]">
                            ৳{order.total}{" "}
                        </div>
                        <div className="text-xs text-gray-500">
                            {" "}
                            {order.items?.length || 0} Items{" "}
                        </div>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="bg-[#0C1311] rounded-lg p-3 border border-[#1E2826] space-y-3">
                    <div className="space-y-1">
                        <div className="flex items-center">
                            <span className="text-xs text-gray-100 pr-2 text-bold">
                                Customer:{" "}
                            </span>
                            <span className="text-sm font-medium text-gray-100">
                                {order.customer_name || "Guest"}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-xs text-gray-100 pr-2 text-bold">
                                Phone
                            </span>
                            <span className="text-sm text-gray-100">
                                {order.customer_phone}
                            </span>
                        </div>
                    </div>

                    {/* Success Rate */}
                    <div className="pt-2 border-t border-[#1E2826]">
                        <SuccessRate rate={success_rate} orderId={order.id} />
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                    <SelectInput
                        value={order.status}
                        options={statusOptions}
                        onChange={(val) => onStatusChange(order, val)}
                        className="w-full"
                    />

                    <div className={`grid gap-2 ${fraudCheckEnabled ? "grid-cols-3" : "grid-cols-2"}`}>
                        <a
                            href={route("admin.orders.invoice", order.id)}
                            target="_blank"
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-[#1E2826] text-gray-300 rounded-lg text-sm hover:bg-[#2A3633] transition-colors border border-[#2A3633]"
                        >
                            <FileText className="w-4 h-4" />
                            Invoice
                        </a>
                        <Link
                            href={route("admin.orders.show", order.id)}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-[#1E2826] text-gray-300 rounded-lg text-sm hover:bg-[#2A3633] transition-colors border border-[#2A3633]"
                        >
                            <Eye className="w-4 h-4" />
                            Details
                        </Link>
                        {fraudCheckEnabled && (
                            <button
                                onClick={handleCheckFraud}
                                disabled={isCheckingFraud}
                                className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-400/10 text-purple-400 rounded-lg text-sm hover:bg-purple-400/20 transition-colors border border-purple-400/30 disabled:opacity-50"
                            >
                                {isCheckingFraud ? (
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Shield className="w-4 h-4" />
                                )}
                                Fraud
                            </button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
