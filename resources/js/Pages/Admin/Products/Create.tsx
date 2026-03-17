import React from "react";
import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { CreatePageProps } from "@/types";
import GeneralInformation from "./Partials/Create/GeneralInformation";
import PricingInventory from "./Partials/Create/PricingInventory";
import ImagesVariations from "./Partials/Create/ImagesVariations";

// Interfaces (kept for type safety in useForm, though used in children too)
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

export default function Create({
    categories,
    brands,
    attributes,
    settings,
}: CreatePageProps & { settings: priceSettings }) {
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        category_id: "",
        brand_id: "" as string | null,
        description: "",
        purchase_price: "",
        sale_price: "",

        stock: "",
        is_preorder: false,
        has_discount: false,
        discount_type: "",
        discount_value: "",
        discounted_sale_price: null as string | null,
        qty_prices: [] as QtyPrice[],
        images: [] as File[],
        variations: [] as Variation[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.product.store"), {
            forceFormData: true,
        });
    };

    return (
        <Master
            title="Create Product"
            head={<Header title="Create Product" showUserMenu={true} />}
        >
            <form onSubmit={handleSubmit}>
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
                />

                <div className="lg:p-6 pt-6 pb-6">
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <PrimaryButton
                            size="sm"
                            type="submit"
                            disabled={processing}
                            className="w-full sm:w-auto justify-center"
                        >
                            {processing ? "Creating..." : "Create Product"}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </Master>
    );
}
