import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Shield, RefreshCw } from "lucide-react";
import { router, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

export interface SuccessRateData {
    total_orders: number;
    successful_orders: number;
    cancel_orders: number;
}

interface Props {
    rate?: SuccessRateData;
    orderId?: number;
    className?: string;
}

export default function SuccessRate({ rate, orderId, className = "" }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const { fraudCheckEnabled } = usePage<PageProps>().props;

    const handleCheckFraud = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!orderId) return;

        setIsLoading(true);
        try {
            await fetch(route("admin.orders.check-fraud", orderId));
            // Refresh the page to get updated data
            router.reload({ only: ["orders"] });
        } catch (error) {
            console.error("Error checking fraud status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!rate) {
        if (orderId && fraudCheckEnabled) {
            return (
                <button
                    onClick={handleCheckFraud}
                    disabled={isLoading}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2DE3A7]/10 text-[#2DE3A7] hover:bg-[#2DE3A7]/20 transition-colors text-xs font-medium w-full justify-center ${className}`}
                >
                    {isLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <Shield className="w-3.5 h-3.5" />
                    )}
                    {isLoading ? "Checking..." : "Check Fraud Status"}
                </button>
            );
        }
        return null;
    }

    if (rate.total_orders === 0) {
        return (
            <div className={`space-y-2 ${className}`}>
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>No Orders Found</span>
                    {orderId && fraudCheckEnabled && (
                        <button
                            onClick={handleCheckFraud}
                            disabled={isLoading}
                            className="p-1 hover:bg-[#2DE3A7]/10 rounded text-[#2DE3A7] transition-colors"
                            title="Check Again"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                        </button>
                    )}
                </div>
            </div>
        );
    }

const percentage = Math.round(
    (rate.successful_orders / rate.total_orders) * 100
);

const getRateConfig = (p: number) => {
    if (p >= 90) {
        return {
            icon: ShieldCheck,
            text: "text-green-500",
            bg: "bg-green-500",
            label: "Excellent",
        };
    } else if (p >= 70) {
        return {
            icon: Shield,
            text: "text-blue-500",
            bg: "bg-blue-500",
            label: "Good",
        };
    } else if (p >= 50) {
        return {
            icon: Shield,
            text: "text-yellow-500",
            bg: "bg-yellow-500",
            label: "Average",
        };
    } else {
        return {
            icon: ShieldAlert,
            text: "text-red-500",
            bg: "bg-red-500",
            label: "Risk",
        };
    }
};

const config = getRateConfig(percentage);
const Icon = config.icon;

return (
    <div className= {`space-y-2 ${className}`}>
        {/* Header */ }
        < div className = "flex items-center justify-between" >
            <div className="flex items-center gap-1.5" >
                <Icon size={ 14 } className = { config.text } />
                    <span className={ `text-xs font-medium ${config.text}` }>
                        { config.label }
                        </span>
                        </div>
                        < span className = {`text-xs font-bold ${config.text}`}>
                            { percentage } %
                            </span>
                            </div>

{/* Progress Bar */ }
<div className="h-1.5 w-full bg-[#1E2826] rounded-full overflow-hidden" >
    <div
                    className={ `h-full rounded-full transition-all duration-500 ${config.bg}` }
style = {{ width: `${percentage}%` }}
                />
    </div>

{/* Stats */ }
<div className="flex items-center justify-between text-[10px] text-gray-500" >
    <div className="flex items-center gap-1" >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500/50" >
            { " "}
            </span>
            < span > { rate.successful_orders } Success </span>
                </div>
                < div className = "flex items-center gap-1" >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500/50" >
                        { " "}
                        </span>
                        < span > { rate.cancel_orders } Cancel </span>
                            </div>
                            < div className = "flex items-center gap-1" >
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-500/50" >
                                    { " "}
                                    </span>
                                    < span > { rate.total_orders } Total </span>
                                        </div>
                                        </div>
                                        </div>
    );
}
