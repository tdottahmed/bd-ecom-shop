import React from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import SelectInput from "@/Components/Ui/SelectInput";
import ImageUploader from "@/Components/Ui/ImageUploader";
import { PlusIcon, Trash2Icon } from "lucide-react";
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
    productType: "single" | "variant";
    existingImages?: any[];
    onRemoveExisting?: (image: string) => void;
}

export default function ImagesVariations({
    data,
    setData,
    errors,
    attributes,
    productType,
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
        setData("variations", [
            ...data.variations,
            {
                id: "temp_" + Date.now().toString() + "_" + Math.random().toString(36).substring(2),
                attribute_id: "",
                value: "",
                stock: "",
                price: "",
                image: null,
                deleted_image: false,
            } as Variation,
        ]);
    };

    const removeVariation = (id: string) => {
        setData("variations", data.variations.filter((item: Variation) => item.id !== id));
    };

    const updateVariation = (id: string, field: keyof Variation, value: any) => {
        setData(
            "variations",
            data.variations.map((item: Variation) => (item.id === id ? { ...item, [field]: value } : item)),
        );
    };

    const updateVariationFields = (id: string, fields: Partial<Variation>) => {
        setData(
            "variations",
            data.variations.map((item: Variation) => (item.id === id ? { ...item, ...fields } : item)),
        );
    };

    return (
        <div className="space-y-6">
            {/* Images */}
            <Card padding="none">
                <CardHeader className="px-6 pt-6">
                    <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent padding="none" className="px-6 pb-6 pt-4">
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

            {/* Variations — only for variable products */}
            {productType === "variant" && <Card padding="none">
                <CardHeader className="px-6 pt-6 flex items-center justify-between">
                    <CardTitle>Variations</CardTitle>
                    <PrimaryButton type="button" size="sm" variant="outline" onClick={addVariation}>
                        <PlusIcon size={14} className="mr-1" />
                        Add Variant
                    </PrimaryButton>
                </CardHeader>

                <CardContent padding="none" className="px-6 pb-6 pt-2">
                    {data.variations.length === 0 ? (
                        <p className="text-sm text-gray-500 py-4 text-center">
                            No variations added. Click "Add Variant" to get started.
                        </p>
                    ) : (
                        <div className="space-y-4 mt-2">
                            {data.variations.map((variation: Variation, index: number) => (
                                <div
                                    key={variation.id}
                                    className="relative rounded-lg border border-[#1E2826] bg-[#0C1311] p-4"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeVariation(variation.id)}
                                        className="absolute top-3 right-3 text-gray-500 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2Icon size={16} />
                                    </button>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pr-6">
                                        <div>
                                            <InputLabel htmlFor={`va-attr-${variation.id}`} value="Attribute" required />
                                            <SelectInput
                                                id={`va-attr-${variation.id}`}
                                                name={`variations[${index}][attribute_id]`}
                                                value={variation.attribute_id}
                                                onChange={(val) => updateVariation(variation.id, "attribute_id", val)}
                                                options={attributes.map((attr) => ({ value: attr.id, label: attr.name }))}
                                                placeholder="Select"
                                            />
                                            {errors[`variations.${index}.attribute_id`] && (
                                                <p className="text-xs text-red-500 mt-1">{errors[`variations.${index}.attribute_id`]}</p>
                                            )}
                                        </div>
                                        <div>
                                            <InputLabel htmlFor={`va-val-${variation.id}`} value="Value" required />
                                            <TextInput
                                                id={`va-val-${variation.id}`}
                                                name={`variations[${index}][value]`}
                                                value={variation.value}
                                                onChange={(e) => updateVariation(variation.id, "value", e.target.value)}
                                                placeholder="e.g. Red, Large"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor={`va-price-${variation.id}`} value="Price (BDT)" />
                                            <TextInput
                                                id={`va-price-${variation.id}`}
                                                name={`variations[${index}][price]`}
                                                type="number"
                                                value={variation.price || ""}
                                                onChange={(e) => updateVariation(variation.id, "price", e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor={`va-stock-${variation.id}`} value="Stock" />
                                            <TextInput
                                                id={`va-stock-${variation.id}`}
                                                name={`variations[${index}][stock]`}
                                                type="number"
                                                value={variation.stock || ""}
                                                onChange={(e) => updateVariation(variation.id, "stock", e.target.value)}
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>

                                    {/* Variation image */}
                                    <div className="mt-4">
                                        <InputLabel htmlFor={`va-img-${variation.id}`} value="Image (optional)" />

                                        {!variation.deleted_image && typeof variation.image === "string" && variation.image && (
                                            <div className="flex items-center gap-3 mb-2">
                                                <img
                                                    src={getAssetUrl(ensureVariationImagePath(variation.image))}
                                                    alt="Variation"
                                                    className="w-14 h-14 rounded-lg object-cover border border-[#1E2826]"
                                                    onError={(e) => { e.currentTarget.src = "/placeholder.png"; }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => updateVariationFields(variation.id, { image: null, deleted_image: true })}
                                                    className="text-xs px-3 py-1.5 rounded-lg border border-[#1E2826] text-red-400 hover:bg-red-600/10 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}

                                        <input
                                            id={`va-img-${variation.id}`}
                                            name={`variations[${index}][image]`}
                                            type="file"
                                            accept="image/*"
                                            className="block w-full text-sm text-gray-400
                                                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                                                file:text-sm file:font-medium file:bg-[#1E2826] file:text-[#2DE3A7]
                                                hover:file:bg-[#243330] cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] ?? null;
                                                updateVariationFields(variation.id, { image: file, deleted_image: false });
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>}
        </div>
    );
}
