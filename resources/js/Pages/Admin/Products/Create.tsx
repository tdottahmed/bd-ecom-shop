import React from "react";
import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { CreatePageProps } from "@/types";
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
        has_discount: false,
        discount_type: "",
        discount_value: "",
        discounted_sale_price: null as string | null,
        qty_prices: [] as QtyPrice[],
        product_type: "single" as "single" | "variant",
        images: [] as File[],
        variations: [] as Variation[],
        short_description: "",
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        og_image: null as File | null,
        delete_og_image: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.product.store"), { forceFormData: true });
    };

    return (
        <Master
            title="Create Product"
            head={<Header title="Create Product" showUserMenu={true} />}
        >
            <form onSubmit={handleSubmit} className="flex flex-col min-h-full">
                {/* Content — pb ensures last card isn't hidden under sticky bar */}
                <div className="flex-1 p-4 lg:p-6 pb-24 space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Create Product</h1>
                        <p className="text-sm text-gray-500 mt-1">Fill in the details below to add a new product.</p>
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
                            />
                        </div>
                    </div>
                </div>

                {/* Sticky action bar — bleeds through main's padding via negative margins */}
                <div className="sticky bottom-0 -mx-4 -mb-4 lg:-mx-6 lg:-mb-6 z-30
                                bg-[#0E1614]/90 backdrop-blur-md
                                border-t border-[#1E2826]
                                shadow-[0_-8px_24px_rgba(0,0,0,0.4)]
                                px-4 lg:px-6 py-3">
                    <div className="flex justify-end">
                        <PrimaryButton
                            type="submit"
                            size="sm"
                            disabled={processing}
                            className="min-w-36 justify-center"
                        >
                            {processing ? "Creating..." : "Create Product"}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </Master>
    );
}
