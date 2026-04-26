import React from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
    quantity: number;
    onIncrease: () => void;
    onDecrease: () => void;
    min?: number;
    max?: number;
    className?: string;
    size?: "sm" | "md" | "lg";
    disabled?: boolean;
}

export default function QuantitySelector({
    quantity,
    onIncrease,
    onDecrease,
    min = 1,
    max,
    className = "",
    size = "md",
    disabled = false,
}: QuantitySelectorProps) {
    const sizeClasses = {
        sm: {
            container: "p-0.5",
            button: "w-8 h-8",
            icon: 14,
            text: "w-8 text-xs",
        },
        md: {
            container: "p-1",
            button: "w-10 h-10",
            icon: 16,
            text: "w-10 text-sm",
        },
        lg: {
            container: "p-1",
            button: "w-10 h-10",
            icon: 18,
            text: "w-12 text-base",
        },
    };

    const currentSize = sizeClasses[size];

    return (
        <div
            className={`flex items-center bg-gray-100 rounded-full w-fit ${currentSize.container} ${className} ${disabled ? "opacity-40 pointer-events-none" : ""}`}
        >
            <button
                onClick={onDecrease}
                className={`${currentSize.button} flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
                disabled={disabled || quantity <= min}
                type="button"
            >
                <Minus size={currentSize.icon} />
            </button>
            <span
                className={`${currentSize.text} text-center font-bold text-gray-900`}
            >
                {quantity}
            </span>
            <button
                onClick={onIncrease}
                className={`${currentSize.button} flex items-center justify-center rounded-full bg-white shadow-sm text-gray-600 hover:text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95`}
                disabled={disabled || (max !== undefined && quantity >= max)}
                type="button"
            >
                <Plus size={currentSize.icon} />
            </button>
        </div>
    );
}
