import React from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import SelectInput from "@/Components/Ui/SelectInput";
import ImageUploader from "@/Components/Ui/ImageUploader";
import { Car, PlusIcon, Trash2Icon } from "lucide-react";
import { ensureVariationImagePath, getAssetUrl } from "@/Utils/helpers";

interface Variation {
    id: string;
    attribute_id: string;
    value: string;
    stock?: string;
    price?: string;
    image?: string | File | null;
    deleted_image?: boolean;
}

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    attributes: any[];
    existingImages?: any[];
    onRemoveExisting?: (image: string) => void;
}

export default function ImagesVariations({
    data,
    setData,
    errors,
    attributes,
    existingImages = [],
    onRemoveExisting,
}: Props) {
    const handleImagesChange = (files: File | File[] | null) => {
        if (Array.isArray(files)) {
            setData("images", files);
        } else if (files) {
            setData("images", [files]);
        } else {
            setData("images", []);
        }
    };

    const addVariation = () => {
        const newVariation: Variation = {
            id: "temp_" + Date.now().toString() + "_" + Math.random().toString(36).substring(2),
            attribute_id: "",
            value: "",
            stock: "",
            price: "",
            image: null,
            deleted_image: false,
        };
        setData("variations", [...data.variations, newVariation]);
    };

    const removeVariation = (id: string) => {
        setData(
            "variations",
            data.variations.filter((item: Variation) => item.id !== id),
        );
    };

    const updateVariation = (
        id: string,
        field: keyof Variation,
        value: any,
    ) => {
        const updated = data.variations.map((item: Variation) =>
            item.id === id ? { ...item, [field]: value } : item,
        );
        setData("variations", updated);
    };

    const updateVariationFields = (id: string, fields: Partial<Variation>) => {
        const updated = data.variations.map((item: Variation) =>
            item.id === id ? { ...item, ...fields } : item,
        );
        setData("variations", updated);
    };

    return (
        <div className="lg:p-6 sm:p-2">
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Product Images </CardTitle>
                </CardHeader>
                <CardContent padding="lg">
                    <ImageUploader
                        label="Product Images"
                        value={data.images}
                        onChange={handleImagesChange}
                        error={errors.images}
                        existingImages={existingImages}
                        onRemoveExisting={onRemoveExisting}
                    />
                </CardContent>
            </Card>
            <Card className="mt-4">
                <CardHeader className="flex items-center justify-between">
                    <CardTitle>Variations </CardTitle>
                    <PrimaryButton
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={addVariation}
                        className="flex justify-end text-xs md:text-l"
                    >
                        <PlusIcon size={16} />
                        Add Variant
                    </PrimaryButton>
                </CardHeader>
                {data.variations.map((variation: Variation, index: number) => (
                    <CardContent key={variation.id}>
                        <Card className="relative">
                            <CardContent className="pt-6">
                                <div className="absolute top-3 right-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeVariation(variation.id)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2Icon size={18} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <InputLabel
                                            htmlFor={`variation-attribute-${variation.id}`}
                                            value="Attribute"
                                            required
                                        />
                                        <SelectInput
                                            id={`variation-attribute-${variation.id}`}
                                            name={`variations[${index}][attribute_id]`}
                                            value={variation.attribute_id}
                                            onChange={(val) =>
                                                updateVariation(
                                                    variation.id,
                                                    "attribute_id",
                                                    val,
                                                )
                                            }
                                            options={attributes.map((attr) => ({
                                                value: attr.id,
                                                label: attr.name,
                                            }))}
                                            placeholder="Select Attribute"
                                        />
                                        {errors[`variations.${index}.attribute_id`] && (
                                            <div className="text-sm text-red-500 mt-1">
                                                {errors[`variations.${index}.attribute_id`]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor={`variation-value-${variation.id}`}
                                            value="Value"
                                            required
                                        />
                                        <TextInput
                                            id={`variation-value-${variation.id}`}
                                            name={`variations[${index}][value]`}
                                            value={variation.value}
                                            onChange={(e) =>
                                                updateVariation(
                                                    variation.id,
                                                    "value",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., Red, Large"
                                            required
                                        />
                                        {errors[`variations.${index}.value`] && (
                                            <div className="text-sm text-red-500 mt-1">
                                                {errors[`variations.${index}.value`]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor={`variation-price-${variation.id}`}
                                            value="Price"
                                            required
                                        />
                                        <TextInput
                                            id={`variation-price-${variation.id}`}
                                            name={`variations[${index}][price]`}
                                            type="number"
                                            value={variation.price || ""}
                                            onChange={(e) =>
                                                updateVariation(
                                                    variation.id,
                                                    "price",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., 50.00"
                                            required
                                        />
                                        {errors[`variations.${index}.price`] && (
                                            <div className="text-sm text-red-500 mt-1">
                                                {errors[`variations.${index}.price`]}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <InputLabel
                                            htmlFor={`variation-stock-${variation.id}`}
                                            value="Stock Available"
                                            required
                                        />
                                        <TextInput
                                            id={`variation-stock-${variation.id}`}
                                            name={`variations[${index}][stock]`}
                                            type="number"
                                            value={variation.stock || ""}
                                            onChange={(e) =>
                                                updateVariation(
                                                    variation.id,
                                                    "stock",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., 100"
                                            required
                                        />
                                        {errors[`variations.${index}.stock`] && (
                                            <div className="text-sm text-red-500 mt-1">
                                                {errors[`variations.${index}.stock`]}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor={`variation-image-${variation.id}`}
                                        value="Variation Image (optional)"
                                    />

                                    {/* Existing image preview (if any) */}
                                    {!variation.deleted_image &&
                                        typeof variation.image === "string" &&
                                        variation.image && (
                                            <div className="mt-2 flex items-center gap-3">
                                                <img
                                                    src={getAssetUrl(
                                                        ensureVariationImagePath(
                                                            variation.image,
                                                        ),
                                                    )}
                                                    alt="Variation"
                                                    className="w-16 h-16 rounded-lg object-cover border border-gray-800 bg-[#0C1311]"
                                                    onError={(e) => {
                                                        e.currentTarget.src =
                                                            "/placeholder.png";
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        updateVariationFields(variation.id, {
                                                            image: null,
                                                            deleted_image: true,
                                                        });
                                                    }}
                                                    className="text-sm px-3 py-2 rounded-lg border border-gray-800 text-red-400 hover:bg-red-600/10 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}

                                    {/* New upload */}
                                    <input
                                        id={`variation-image-${variation.id}`}
                                        name={`variations[${index}][image]`}
                                        type="file"
                                        accept="image/*"
                                        className="mt-2 block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#151F1D] file:text-white hover:file:bg-[#1A2624]"
                                        onChange={(e) => {
                                            const file =
                                                e.target.files?.[0] ?? null;
                                            updateVariationFields(variation.id, {
                                                image: file,
                                                deleted_image: false,
                                            });
                                        }}
                                    />

                                    {errors[`variations.${index}.image`] && (
                                        <div className="text-sm text-red-500 mt-2">
                                            {errors[`variations.${index}.image`]}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </CardContent>
                ))}
            </Card>
        </div>
    );
}
