import React, { useEffect, useMemo, useState } from "react";
import { calculateProfit } from "@/Utils/helpers";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import InputError from "@/Components/Ui/InputError";
import { Box } from "lucide-react";

function computeDiscountedPrice(
    salePrice: string | number,
    discountType: string,
    discountValue: string | number
): number | null {
    const sale = parseFloat(String(salePrice)) || 0;
    const val = parseFloat(String(discountValue)) || 0;
    if (sale <= 0 || !discountType || (discountType !== "flat" && discountType !== "percentage")) return null;
    if (discountType === "flat") {
        const discounted = sale - val;
        return Math.max(0, Math.round(discounted * 100) / 100);
    }
    const discounted = sale * (1 - val / 100);
    return Math.max(0, Math.round(discounted * 100) / 100);
}

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    settings: {
        additional_cost: string;
    };
}

export default function PricingInventory({
    data,
    setData,
    errors,
    settings,
}: Props) {
    const [profit, setProfit] = useState<number | null>(null);

    const computedDiscountedPrice = useMemo(() => {
        if (!data.has_discount || !data.discount_type || data.discount_value === "" || data.discount_value === undefined) return null;
        return computeDiscountedPrice(data.sale_price, data.discount_type, data.discount_value);
    }, [data.has_discount, data.discount_type, data.discount_value, data.sale_price]);

    const recomputeDiscountedPrice = (
        salePrice: string,
        discountType: string,
        discountValue: string
    ) => {
        const value = computeDiscountedPrice(salePrice, discountType, discountValue);
        setData("discounted_sale_price", value != null ? value.toFixed(2) : null);
    };

    useEffect(() => {
        const purchase = parseFloat(data.purchase_price) || 0;
        const sale = parseFloat(data.sale_price) || 0;
        const additional = parseFloat(settings.additional_cost) || 0;

        if (purchase > 0 && sale > 0) {
            setProfit(calculateProfit(sale, purchase, additional));
        } else {
            setProfit(null);
        }
    }, [data.purchase_price, data.sale_price, settings.additional_cost]);

    return (
        <div className="lg:p-6 sm:p-2 space-y-4">
            {/* Pricing Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Product Pricing</span>
                        {profit !== null && (
                            <div
                                className={`text-xs font-semibold px-2 py-1 rounded ${
                                    profit >= 0
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                Profit: {profit.toFixed(2)}
                            </div>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent padding="lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <InputLabel
                                htmlFor="purchase_price"
                                value="Buy Price (BDT)"
                            />
                            <TextInput
                                id="purchase_price"
                                name="purchase_price"
                                type="number"
                                step="0.01"
                                value={data.purchase_price}
                                onChange={(e) =>
                                    setData("purchase_price", e.target.value)
                                }
                                placeholder="0.00"
                            />
                            <InputError message={errors.purchase_price} />
                        </div>
                        <div>
                            <InputLabel
                                htmlFor="sale_price"
                                value="Sale Price (BDT)"
                            />
                            <TextInput
                                id="sale_price"
                                name="sale_price"
                                type="number"
                                step="0.01"
                                value={data.sale_price}
                                onChange={(e) =>
                                    setData("sale_price", e.target.value)
                                }
                                placeholder="0.00"
                            />
                            <InputError message={errors.sale_price} />
                        </div>
                    </div>

                    <div className="mt-6 pt-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Box className="text-[#2DE3A7]" size={20} />
                            <InputLabel htmlFor="stock" value="Stock" />
                        </div>
                        <TextInput
                            id="stock"
                            name="stock"
                            type="number"
                            value={data.stock}
                            onChange={(e) => setData("stock", e.target.value)}
                            placeholder="0"
                        />
                        <InputError message={errors.stock} />

                        {/* Has discount */}
                        <div className="mt-6 pt-4 border-t border-gray-200">
                            <div className="flex items-center">
                                <input
                                    id="has_discount"
                                    name="has_discount"
                                    type="checkbox"
                                    checked={data.has_discount ?? false}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setData("has_discount", checked);
                                        if (!checked) {
                                            setData("discount_type", "");
                                            setData("discount_value", "");
                                            setData("discounted_sale_price", null);
                                        }
                                    }}
                                    className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label
                                    htmlFor="has_discount"
                                    className="ml-2 text-sm font-medium text-gray-300"
                                >
                                    Has discount
                                </label>
                            </div>

                            {data.has_discount && (
                                <div className="mt-4 space-y-4 pl-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel
                                                htmlFor="discount_type"
                                                value="Discount type"
                                            />
                                            <select
                                                id="discount_type"
                                                name="discount_type"
                                                value={data.discount_type ?? ""}
                                                onChange={(e) => {
                                                    const v = e.target.value as "flat" | "percentage" | "";
                                                    setData("discount_type", v || "");
                                                    recomputeDiscountedPrice(
                                                        data.sale_price,
                                                        v || "",
                                                        String(data.discount_value ?? ""),
                                                    );
                                                }}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-700 text-gray-100"
                                            >
                                                <option value="">Select type</option>
                                                <option value="flat">Flat amount (BDT)</option>
                                                <option value="percentage">Percentage (%)</option>
                                            </select>
                                            <InputError message={errors.discount_type} />
                                        </div>
                                        <div>
                                            <InputLabel
                                                htmlFor="discount_value"
                                                value={
                                                    data.discount_type === "percentage"
                                                        ? "Discount (%)"
                                                        : "Discount amount (BDT)"
                                                }
                                            />
                                            <TextInput
                                                id="discount_value"
                                                name="discount_value"
                                                type="number"
                                                step={data.discount_type === "percentage" ? "0.01" : "1"}
                                                min="0"
                                                value={data.discount_value ?? ""}
                                                onChange={(e) => {
                                                    const v = e.target.value;
                                                    setData("discount_value", v);
                                                    recomputeDiscountedPrice(
                                                        data.sale_price,
                                                        String(data.discount_type ?? ""),
                                                        v,
                                                    );
                                                }}
                                                placeholder={
                                                    data.discount_type === "percentage"
                                                        ? "e.g. 10"
                                                        : "e.g. 50"
                                                }
                                            />
                                            <InputError message={errors.discount_value} />
                                        </div>
                                    </div>
                                    {computedDiscountedPrice !== null && (
                                        <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 px-4 py-3">
                                            <p className="text-sm text-gray-400">
                                                Discounted sale price
                                            </p>
                                            <p className="text-lg font-semibold text-indigo-400">
                                                ৳{computedDiscountedPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
