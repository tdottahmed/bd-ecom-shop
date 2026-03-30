import React, { useEffect, useMemo, useState } from "react";
import { calculateProfit } from "@/Utils/helpers";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import InputError from "@/Components/Ui/InputError";
import { Layers, Info } from "lucide-react";

function computeDiscountedPrice(
    salePrice: string | number,
    discountType: string,
    discountValue: string | number
): number | null {
    const sale = parseFloat(String(salePrice)) || 0;
    const val = parseFloat(String(discountValue)) || 0;
    if (sale <= 0 || !discountType || (discountType !== "flat" && discountType !== "percentage")) return null;
    if (discountType === "flat") return Math.max(0, Math.round((sale - val) * 100) / 100);
    return Math.max(0, Math.round(sale * (1 - val / 100) * 100) / 100);
}

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    settings: { additional_cost: string };
    productType: "single" | "variant";
}

export default function PricingInventory({ data, setData, errors, settings, productType }: Props) {
    const isVariant = productType === "variant";
    const [profit, setProfit] = useState<number | null>(null);

    const computedDiscountedPrice = useMemo(() => {
        if (!data.has_discount || !data.discount_type || data.discount_value === "" || data.discount_value === undefined) return null;
        return computeDiscountedPrice(data.sale_price, data.discount_type, data.discount_value);
    }, [data.has_discount, data.discount_type, data.discount_value, data.sale_price]);

    const recomputeDiscountedPrice = (salePrice: string, discountType: string, discountValue: string) => {
        const value = computeDiscountedPrice(salePrice, discountType, discountValue);
        setData("discounted_sale_price", value != null ? value.toFixed(2) : null);
    };

    useEffect(() => {
        const purchase = parseFloat(data.purchase_price) || 0;
        const sale = parseFloat(data.sale_price) || 0;
        const additional = parseFloat(settings.additional_cost) || 0;
        setProfit(!isVariant && purchase > 0 && sale > 0 ? calculateProfit(sale, purchase, additional) : null);
    }, [data.purchase_price, data.sale_price, settings.additional_cost, isVariant]);

    return (
        <Card padding="none">
            <CardHeader className="px-6 pt-6">
                <CardTitle className="flex items-center justify-between">
                    <span>Pricing & Inventory</span>
                    {profit !== null && (
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${profit >= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                            Profit: ৳{profit.toFixed(2)}
                        </span>
                    )}
                </CardTitle>
            </CardHeader>

            <CardContent padding="none" className="px-6 pb-6 pt-4 space-y-4">
                {/* Buy price — always shown */}
                <div>
                    <InputLabel
                        htmlFor="purchase_price"
                        value={isVariant ? "Base Cost (BDT)" : "Buy Price (BDT)"}
                    />
                    {isVariant && (
                        <p className="text-xs text-gray-500 mb-1">
                            Average or base cost used for internal profit tracking.
                        </p>
                    )}
                    <TextInput
                        id="purchase_price"
                        name="purchase_price"
                        type="number"
                        step="0.01"
                        value={data.purchase_price}
                        onChange={(e) => setData("purchase_price", e.target.value)}
                        placeholder="0.00"
                    />
                    <InputError message={errors.purchase_price} />
                </div>

                {/* Single product fields */}
                {!isVariant && (
                    <>
                        <div>
                            <InputLabel htmlFor="sale_price" value="Sale Price (BDT)" />
                            <TextInput
                                id="sale_price"
                                name="sale_price"
                                type="number"
                                step="0.01"
                                value={data.sale_price}
                                onChange={(e) => setData("sale_price", e.target.value)}
                                placeholder="0.00"
                            />
                            <InputError message={errors.sale_price} />
                        </div>

                        <div>
                            <InputLabel htmlFor="stock" value="Stock Quantity" />
                            <TextInput
                                id="stock"
                                name="stock"
                                type="number"
                                value={data.stock}
                                onChange={(e) => setData("stock", e.target.value)}
                                placeholder="0"
                            />
                            <InputError message={errors.stock} />
                        </div>

                        {/* Discount */}
                        <div className="pt-2 border-t border-[#1E2826]">
                            <div className="flex items-center gap-2">
                                <input
                                    id="has_discount"
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
                                    className="w-4 h-4 rounded border-gray-600 bg-[#0F1A18] text-[#2DE3A7] focus:ring-[#2DE3A7]"
                                />
                                <label htmlFor="has_discount" className="text-sm font-medium text-gray-300 cursor-pointer">
                                    Apply discount
                                </label>
                            </div>

                            {data.has_discount && (
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <InputLabel htmlFor="discount_type" value="Discount Type" />
                                        <select
                                            id="discount_type"
                                            value={data.discount_type ?? ""}
                                            onChange={(e) => {
                                                const v = e.target.value as "flat" | "percentage" | "";
                                                setData("discount_type", v || "");
                                                recomputeDiscountedPrice(data.sale_price, v || "", String(data.discount_value ?? ""));
                                            }}
                                            className="w-full px-4 py-3 bg-[#0F1A18] border border-[#1E2826] rounded-lg text-gray-100 focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7] transition-all"
                                        >
                                            <option value="">Select type</option>
                                            <option value="flat">Flat (BDT)</option>
                                            <option value="percentage">Percentage (%)</option>
                                        </select>
                                        <InputError message={errors.discount_type} />
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor="discount_value"
                                            value={data.discount_type === "percentage" ? "Discount (%)" : "Discount Amount (BDT)"}
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
                                                recomputeDiscountedPrice(data.sale_price, String(data.discount_type ?? ""), v);
                                            }}
                                            placeholder={data.discount_type === "percentage" ? "e.g. 10" : "e.g. 50"}
                                        />
                                        <InputError message={errors.discount_value} />
                                    </div>
                                    {computedDiscountedPrice !== null && (
                                        <div className="rounded-lg bg-[#2DE3A7]/10 border border-[#2DE3A7]/20 px-4 py-3">
                                            <p className="text-xs text-gray-400">Discounted price</p>
                                            <p className="text-lg font-semibold text-[#2DE3A7]">৳{computedDiscountedPrice.toFixed(2)}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Variant notice */}
                {isVariant && (
                    <div className="flex gap-3 rounded-lg border border-[#1E2826] bg-[#0C1311] px-4 py-3">
                        <Layers size={16} className="text-[#2DE3A7] mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-medium text-gray-300">Prices &amp; stock per variation</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Set the sale price and stock for each variant in the Variations section.
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
