import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Trash2Icon, ArrowLeftIcon, SaveIcon, LoaderCircleIcon } from "lucide-react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import DangerButton from "@/Components/Actions/DangerButton";
import DeleteConfirmationDialog from "@/Components/Ui/DeleteConfirmationDialog";
import { EditPageProps } from "@/types";
import GeneralInformation from "./Partials/Create/GeneralInformation";
import PricingInventory from "./Partials/Create/PricingInventory";
import ImagesVariations from "./Partials/Create/ImagesVariations";
import SeoFields from "./Partials/Create/SeoFields";
import ProductTypeSelector from "./Partials/Create/ProductTypeSelector";

interface QtyPrice {
    id: string;
    qty: string;
    qty_price: string;
}

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

interface priceSettings {
    yuan_rate: string;
    additional_cost: string;
    profit: string;
}

export default function Edit({
    product,
    categories,
    brands,
    attributes,
    settings,
}: EditPageProps & { settings: priceSettings }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [processingDelete, setProcessingDelete] = useState(false);

    const [existingImages, setExistingImages] = useState<string[]>(() => {
        if (Array.isArray(product.images)) return product.images;
        if (typeof product.images === "string") {
            try {
                const parsed = JSON.parse(product.images);
                return Array.isArray(parsed) ? parsed : [];
            } catch {
                return [];
            }
        }
        return [];
    });

    const {
        data,
        setData,
        post,
        processing,
        errors,
        delete: destroy,
    } = useForm({
        product_type: (product.product_type ?? "single") as "single" | "variant",
        name: product.name || "",
        slug: product.slug || "",
        category_id: product.category_id?.toString() || "",
        brand_id: product.brand_id != null ? product.brand_id.toString() : "",
        description: product.description || "",

        purchase_price: product.purchase_price?.toString() || "",
        sale_price: product.sale_price?.toString() || "",
        stock: product.stock?.toString() || "",
        has_discount: !!(
            product.has_discount || product.discounted_sale_price != null
        ),
        discount_type: product.discount_type ?? "",
        discount_value:
            product.discount_value != null
                ? String(product.discount_value)
                : "",
        discounted_sale_price:
            product.discounted_sale_price != null
                ? String(product.discounted_sale_price)
                : null,

        qty_prices: (product.qty_price || []).map((qp: any) => ({
            id: Math.random().toString(),
            qty: qp.qty.toString(),
            qty_price: qp.price.toString(),
        })) as QtyPrice[],

        variations: (product.product_variations || []).map((v: any) => ({
            id:
                v.id?.toString() ||
                "temp_" +
                    Date.now().toString() +
                    "_" +
                    Math.random().toString(36).substring(2),
            attribute_id:
                v.product_attribute_id?.toString() ||
                v.attribute_id?.toString(),
            value: v.value,
            stock: v.stock?.toString(),
            price: v.price?.toString(),
            image: v.image ?? null,
            deleted_image: false,
            has_discount: !!(v.discount_type || v.discounted_price != null),
            discount_type: (v.discount_type as "" | "flat" | "percentage") ?? "",
            discount_value: v.discount_value != null ? String(v.discount_value) : "",
            discounted_price: v.discounted_price != null ? String(v.discounted_price) : null,
        })) as Variation[],

        images: [] as File[],
        deleted_images: [] as string[],

        short_description: product.short_description ?? "",
        meta_title: product.meta_title ?? "",
        meta_description: product.meta_description ?? "",
        meta_keywords: product.meta_keywords ?? "",
        og_image: null as File | null,
        delete_og_image: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.product.update", product.id), {
            forceFormData: true,
        });
    };

    const handleDelete = () => {
        setProcessingDelete(true);
        destroy(route("admin.product.destroy", product.id), {
            onFinish: () => {
                setProcessingDelete(false);
                setShowDeleteDialog(false);
            },
        });
    };

    const handleRemoveExistingImage = (path: string) => {
        setData("deleted_images", [...data.deleted_images, path]);
        setExistingImages((prev) => prev.filter((img) => img !== path));
    };

    return (
        <Master
            title={`Edit ${product.name}`}
            head={<Header title={`Edit ${product.name}`} showUserMenu={true} />}
        >
            <form onSubmit={handleSubmit} className="flex flex-col min-h-full">
                {/* Content — pb ensures last card isn't hidden under sticky bar */}
                <div className="flex-1 p-4 lg:p-6 pb-24 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Edit Product
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {product.name}
                            </p>
                        </div>
                        <DangerButton
                            type="button"
                            variant="outline"
                            onClick={() => setShowDeleteDialog(true)}
                            disabled={processing || processingDelete}
                            className="w-full sm:w-auto"
                        >
                            <Trash2Icon size={15} className="mr-2" />
                            Delete Product
                        </DangerButton>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Main column */}
                        <div className="lg:col-span-2 space-y-6">
                            <ProductTypeSelector
                                value={data.product_type}
                                onChange={(type) => {
                                    setData("product_type", type);
                                    if (type === "single") setData("variations", []);
                                }}
                            />
                            <GeneralInformation
                                data={data}
                                setData={setData}
                                errors={errors}
                                categories={categories}
                                brands={brands}
                            />
                            <ImagesVariations
                                data={data}
                                setData={setData}
                                errors={errors}
                                attributes={attributes}
                                productType={data.product_type}
                                existingImages={existingImages}
                                onRemoveExisting={handleRemoveExistingImage}
                            />
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <PricingInventory
                                data={data}
                                setData={setData}
                                errors={errors}
                                settings={settings}
                                productType={data.product_type}
                            />
                            <SeoFields
                                data={data}
                                setData={setData}
                                errors={errors}
                                existingOgImage={product.og_image}
                            />
                        </div>
                    </div>
                </div>

                {/* Sticky action bar — bleeds through main's padding via negative margins */}
                <div
                    className="sticky bottom-0 -mx-4 -mb-4 lg:-mx-6 lg:-mb-6 z-30
                                bg-[#0E1614]/90 backdrop-blur-md
                                border-t border-[#1E2826]
                                shadow-[0_-8px_24px_rgba(0,0,0,0.4)]
                                px-4 lg:px-6 py-3"
                >
                    <div className="flex items-center justify-end gap-3">
                        <PrimaryButton
                            as="link"
                            href={route("admin.products.index")}
                            variant="outline"
                            className="justify-center"
                        >
                            <ArrowLeftIcon size={15} className="mr-2" />
                            Back
                        </PrimaryButton>
                        <PrimaryButton
                            type="submit"
                            size="sm"
                            disabled={processing}
                            className="min-w-36 justify-center"
                        >
                            {processing ? (
                                <>
                                    <LoaderCircleIcon className="size-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <SaveIcon className="size-4" />
                                    Update Product
                                </>
                            )}
                        </PrimaryButton>
                    </div>
                </div>
            </form>

            <DeleteConfirmationDialog
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
                confirmText={
                    processingDelete ? "Deleting..." : "Delete Product"
                }
                isProcessing={processingDelete}
            />
        </Master>
    );
}
