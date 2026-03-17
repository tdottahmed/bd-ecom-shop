import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Trash2Icon, ArrowLeftIcon } from "lucide-react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import DangerButton from "@/Components/Actions/DangerButton";
import DeleteConfirmationDialog from "@/Components/Ui/DeleteConfirmationDialog";
import { EditPageProps } from "@/types";
import GeneralInformation from "./Partials/Create/GeneralInformation";
import PricingInventory from "./Partials/Create/PricingInventory";
import ImagesVariations from "./Partials/Create/ImagesVariations";

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
            } catch (e) {
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
        name: product.name || "",
        slug: product.slug || "",
        category_id: product.category_id?.toString() || "",
        brand_id: product.brand_id != null ? product.brand_id.toString() : "",
        description: product.description || "",

        purchase_price: product.purchase_price?.toString() || "",
        sale_price: product.sale_price?.toString() || "",
        stock: product.stock?.toString() || "",
        uan_price: product.uan_price?.toString() || "",
        is_preorder: product.is_preorder || false,

        qty_prices: (product.qty_price || []).map((qp: any) => ({
            id: Math.random().toString(), // Add temporary ID for frontend key
            qty: qp.qty.toString(),
            qty_price: qp.price.toString(),
        })) as QtyPrice[],

        variations: (product.product_variations || []).map((v: any) => ({
            id: v.id?.toString() || Math.random().toString(),
            attribute_id:
                v.product_attribute_id?.toString() ||
                v.attribute_id?.toString(),
            value: v.value,
            stock: v.stock?.toString(),
            price: v.price?.toString(),
        })) as Variation[],

        images: [] as File[],
        deleted_images: [] as string[],
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
            <form onSubmit={handleSubmit}>
                <div className="lg:p-6 p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                Edit Product
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Update product information and pricing
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <DangerButton
                                type="button"
                                variant="outline"
                                onClick={() => setShowDeleteDialog(true)}
                                disabled={processing || processingDelete}
                                className="w-full sm:w-auto order-2 sm:order-1"
                            >
                                <Trash2Icon size={16} className="mr-2" />
                                Delete Product
                            </DangerButton>
                        </div>
                    </div>
                </div>

                <GeneralInformation
                    data={data}
                    setData={setData}
                    errors={errors}
                    categories={categories}
                    brands={brands}
                />

                <PricingInventory
                    data={data}
                    setData={setData}
                    errors={errors}
                    settings={settings}
                />

                <ImagesVariations
                    data={data}
                    setData={setData}
                    errors={errors}
                    attributes={attributes}
                    existingImages={existingImages}
                    onRemoveExisting={handleRemoveExistingImage}
                />

                <div className="pt-6 pb-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col gap-3 lg:flex-row lg:justify-end">
                            <PrimaryButton
                                type="submit"
                                size="sm"
                                disabled={processing}
                                className="w-full sm:w-auto lg:w-auto justify-center"
                            >
                                {processing ? "Updating..." : "Update Product"}
                            </PrimaryButton>
                            <PrimaryButton
                                as="link"
                                href={route("admin.products.index")}
                                variant="outline"
                                className="w-full sm:w-auto lg:w-auto justify-center"
                            >
                                <ArrowLeftIcon size={16} className="mr-2" />{" "}
                                Back to Products
                            </PrimaryButton>
                        </div>
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
