import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import SelectInput from "@/Components/Ui/SelectInput";
import ImageUploader from "@/Components/Ui/ImageUploader";
import { PlusIcon, Trash2Icon, TagIcon } from "lucide-react";
import { ensureVariationImagePath, getAssetUrl } from "@/Utils/helpers";

interface Variation {
    id: string;
    attribute_id: string;
    value: string;
    stock?: string;
    price?: string;
    image?: string | File | null;
    deleted_image?: boolean;
    has_discount?: boolean;
    discount_type?: "" | "flat" | "percentage";
    discount_value?: string;
    discounted_price?: string | null;
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

function computeVariationDiscount(
    price: string | undefined,
    discountType: string | undefined,
    discountValue: string | undefined
): number | null {
    const p = parseFloat(price ?? "") || 0;
    const val = parseFloat(discountValue ?? "") || 0;
    if (p <= 0 || !discountType || (discountType !== "flat" && discountType !== "percentage")) return null;
    if (discountType === "flat") return Math.max(0, Math.round((p - val) * 100) / 100);
    return Math.max(0, Math.round(p * (1 - val / 100) * 100) / 100);
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
                has_discount: false,
                discount_type: "",
                discount_value: "",
                discounted_price: null,
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

    const handleDiscountToggle = (id: string, checked: boolean) => {
        if (!checked) {
            updateVariationFields(id, {
                has_discount: false,
                discount_type: "",
                discount_value: "",
                discounted_price: null,
            });
        } else {
            updateVariation(id, "has_discount", true);
        }
    };

    const handleDiscountTypeChange = (variation: Variation, type: "flat" | "percentage" | "") => {
        const computed = computeVariationDiscount(variation.price, type, variation.discount_value);
        updateVariationFields(variation.id, {
            discount_type: type,
            discounted_price: computed != null ? computed.toFixed(2) : null,
        });
    };

    const handleDiscountValueChange = (variation: Variation, value: string) => {
        const computed = computeVariationDiscount(variation.price, variation.discount_type, value);
        updateVariationFields(variation.id, {
            discount_value: value,
            discounted_price: computed != null ? computed.toFixed(2) : null,
        });
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
                            {data.variations.map((variation: Variation, index: number) => {
                                const computedPreview = variation.has_discount
                                    ? computeVariationDiscount(variation.price, variation.discount_type, variation.discount_value)
                                    : null;

                                return (
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

                                        {/* Main fields */}
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
                                                    onChange={(e) => {
                                                        const newPrice = e.target.value;
                                                        if (variation.has_discount) {
                                                            const computed = computeVariationDiscount(newPrice, variation.discount_type, variation.discount_value);
                                                            updateVariationFields(variation.id, {
                                                                price: newPrice,
                                                                discounted_price: computed != null ? computed.toFixed(2) : null,
                                                            });
                                                        } else {
                                                            updateVariation(variation.id, "price", newPrice);
                                                        }
                                                    }}
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

                                        {/* Discount section */}
                                        <div className="mt-4 pt-3 border-t border-[#1E2826]">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    id={`va-discount-${variation.id}`}
                                                    type="checkbox"
                                                    checked={variation.has_discount ?? false}
                                                    onChange={(e) => handleDiscountToggle(variation.id, e.target.checked)}
                                                    className="w-4 h-4 rounded border-gray-600 bg-[#0F1A18] text-[#2DE3A7] focus:ring-[#2DE3A7]"
                                                />
                                                <label
                                                    htmlFor={`va-discount-${variation.id}`}
                                                    className="text-xs font-medium text-gray-400 cursor-pointer flex items-center gap-1.5"
                                                >
                                                    <TagIcon size={12} className="text-[#2DE3A7]" />
                                                    Apply discount to this variant
                                                </label>
                                            </div>

                                            {variation.has_discount && (
                                                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                                                    <div>
                                                        <InputLabel value="Discount Type" className="text-xs" />
                                                        <select
                                                            value={variation.discount_type ?? ""}
                                                            onChange={(e) => handleDiscountTypeChange(variation, e.target.value as "flat" | "percentage" | "")}
                                                            className="w-full px-3 py-2.5 bg-[#0F1A18] border border-[#1E2826] rounded-lg text-sm text-gray-100 focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7] transition-all"
                                                        >
                                                            <option value="">Select type</option>
                                                            <option value="flat">Flat (BDT)</option>
                                                            <option value="percentage">Percentage (%)</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <InputLabel
                                                            value={variation.discount_type === "percentage" ? "Discount (%)" : "Discount Amount (BDT)"}
                                                            className="text-xs"
                                                        />
                                                        <TextInput
                                                            id={`va-dval-${variation.id}`}
                                                            name={`variations[${index}][discount_value]`}
                                                            type="number"
                                                            step={variation.discount_type === "percentage" ? "0.01" : "1"}
                                                            min="0"
                                                            value={variation.discount_value ?? ""}
                                                            onChange={(e) => handleDiscountValueChange(variation, e.target.value)}
                                                            placeholder={variation.discount_type === "percentage" ? "e.g. 10" : "e.g. 50"}
                                                        />
                                                    </div>
                                                    {computedPreview !== null && (
                                                        <div className="rounded-lg bg-[#2DE3A7]/10 border border-[#2DE3A7]/20 px-3 py-2.5 flex flex-col justify-center">
                                                            <p className="text-xs text-gray-400">Discounted price</p>
                                                            <p className="text-base font-semibold text-[#2DE3A7]">৳{computedPreview.toFixed(2)}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
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
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>}
        </div>
    );
}
