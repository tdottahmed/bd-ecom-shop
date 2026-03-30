import React from "react";
import { Package, Layers } from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";

type ProductType = "single" | "variant";

interface Props {
    value: ProductType;
    onChange: (type: ProductType) => void;
}

const options = [
    {
        value: "single" as ProductType,
        icon: Package,
        label: "Single Product",
        description: "One product with a fixed price and stock.",
    },
    {
        value: "variant" as ProductType,
        icon: Layers,
        label: "Variable Product",
        description: "Multiple options like size, color, or material.",
    },
];

export default function ProductTypeSelector({ value, onChange }: Props) {
    return (
        <Card padding="none">
            <CardHeader className="px-6 pt-6">
                <CardTitle>Product Type</CardTitle>
            </CardHeader>
            <CardContent padding="none" className="px-6 pb-6 pt-4">
                <div className="grid grid-cols-2 gap-3">
                    {options.map((opt) => {
                        const Icon = opt.icon;
                        const selected = value === opt.value;
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => onChange(opt.value)}
                                className={`
                                    relative flex flex-col items-start gap-2 rounded-lg border p-4 text-left
                                    transition-all duration-200 focus:outline-none
                                    ${selected
                                        ? "border-[#2DE3A7] bg-[#2DE3A7]/5 shadow-[0_0_0_1px_#2DE3A7]"
                                        : "border-[#1E2826] bg-[#0C1311] hover:border-gray-600"
                                    }
                                `}
                            >
                                {/* Selected dot indicator */}
                                <span
                                    className={`
                                        absolute top-3 right-3 h-2.5 w-2.5 rounded-full border-2 transition-all
                                        ${selected
                                            ? "border-[#2DE3A7] bg-[#2DE3A7]"
                                            : "border-gray-600 bg-transparent"
                                        }
                                    `}
                                />

                                <div className={`rounded-md p-2 ${selected ? "bg-[#2DE3A7]/15 text-[#2DE3A7]" : "bg-[#1E2826] text-gray-400"}`}>
                                    <Icon size={18} />
                                </div>

                                <div>
                                    <p className={`text-sm font-semibold ${selected ? "text-white" : "text-gray-300"}`}>
                                        {opt.label}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                                        {opt.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
