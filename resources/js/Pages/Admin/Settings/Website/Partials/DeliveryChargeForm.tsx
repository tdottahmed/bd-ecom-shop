import React from "react";
import { useForm } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";

import Card, {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/Ui/Card";
import { DeliveryCharge } from "../types";

interface DeliveryChargeFormProps {
    charges: DeliveryCharge[];
}

const DeliveryChargeForm: React.FC<DeliveryChargeFormProps> = ({
    charges,
}) => {
    const { data, setData, post, processing } = useForm({
        type: "delivery",
        delivery_charges: charges.map((c) => ({ ...c })),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), {
            preserveScroll: true,
        });
    };

    const addCharge = () => {
        setData("delivery_charges", [
            ...data.delivery_charges,
            { name: "", cost: "", duration: "" },
        ]);
    };

    const removeCharge = (index: number) => {
        const newCharges = [...data.delivery_charges];
        newCharges.splice(index, 1);
        setData("delivery_charges", newCharges);
    };

    const updateCharge = (
        index: number,
        field: keyof DeliveryCharge,
        value: string | number,
    ) => {
        const newCharges = [...data.delivery_charges];
        newCharges[index] = { ...newCharges[index], [field]: value };
        setData("delivery_charges", newCharges);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Delivery Charges</CardTitle>
                        <button
                            type="button"
                            onClick={addCharge}
                            className="bg-[#151F1D] border border-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-[#1A2624] hover:border-[#2DE3A7] transition-all flex items-center gap-2 text-sm"
                        >
                            <Plus size={16} />
                            Add Charge
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.delivery_charges.map((charge, index) => (
                            <div
                                key={index}
                                className="flex gap-4 items-start bg-[#151F1D] p-4 rounded-lg border border-gray-800"
                            >
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400">
                                                Area Name
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Inside Dhaka"
                                                value={charge.name}
                                                onChange={(e) =>
                                                    updateCharge(
                                                        index,
                                                        "name",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400">
                                                Cost
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={charge.cost}
                                                onChange={(e) =>
                                                    updateCharge(
                                                        index,
                                                        "cost",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-gray-400">
                                                Duration
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g. 2-3 Days"
                                                value={charge.duration}
                                                onChange={(e) =>
                                                    updateCharge(
                                                        index,
                                                        "duration",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCharge(index)}
                                    className="mt-6 p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {data.delivery_charges.length === 0 && (
                            <p className="text-center text-gray-500 py-4">
                                No delivery charges added yet.
                            </p>
                        )}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#2DE3A7] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#26c28f] transition-colors disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Delivery Charges"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};

export default DeliveryChargeForm;
