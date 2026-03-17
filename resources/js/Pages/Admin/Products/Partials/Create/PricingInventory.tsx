import React, { useEffect, useState } from "react";
import { calculateProfit } from "@/Utils/helpers";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import InputError from "@/Components/Ui/InputError";
import { Box } from "lucide-react";

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

                        <div className="flex items-center mt-4">
                            <input
                                id="is_preorder"
                                name="is_preorder"
                                type="checkbox"
                                checked={data.is_preorder}
                                onChange={(e) =>
                                    setData("is_preorder", e.target.checked)
                                }
                                className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="is_preorder"
                                className="ml-2 text-sm font-medium text-gray-300"
                            >
                                Is Preorder Product ?
                            </label>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
