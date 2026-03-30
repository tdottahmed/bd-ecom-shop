import React from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import SelectInput from "@/Components/Ui/SelectInput";
import InputError from "@/Components/Ui/InputError";
import RichTextEditor from "@/Components/Ui/RichTextEditor";

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    categories: any[];
    brands: any[];
}

export default function GeneralInformation({ data, setData, errors, categories, brands }: Props) {
    return (
        <div className="space-y-6">
            {/* Product Details */}
            <Card padding="none">
                <CardHeader className="px-6 pt-6">
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent padding="none" className="px-6 pb-6 pt-4 space-y-4">
                    <div>
                        <InputLabel htmlFor="name" value="Product Name" required />
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={(e) => {
                                setData("name", e.target.value);
                                const slug = e.target.value
                                    .toLowerCase()
                                    .replace(/[^a-z0-9]+/g, "-")
                                    .replace(/(^-|-$)/g, "");
                                setData("slug", slug);
                            }}
                            placeholder="Enter product name"
                            required
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div>
                        <InputLabel htmlFor="slug" value="Slug" required />
                        <TextInput
                            id="slug"
                            name="slug"
                            value={data.slug}
                            onChange={(e) => setData("slug", e.target.value)}
                            placeholder="product-slug"
                            required
                        />
                        <InputError message={errors.slug} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="category_id" value="Category" required />
                            <SelectInput
                                id="category_id"
                                name="category_id"
                                value={data.category_id}
                                onChange={(val) => setData("category_id", val)}
                                options={categories.map((c) => ({ value: c.id, label: c.title }))}
                                placeholder="Select Category"
                                error={errors.category_id}
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="brand_id" value="Brand" />
                            <SelectInput
                                id="brand_id"
                                name="brand_id"
                                value={data.brand_id ?? ""}
                                onChange={(val) => setData("brand_id", val || null)}
                                options={brands.map((b) => ({ value: b.id, label: b.title }))}
                                placeholder="Select Brand (optional)"
                                error={errors.brand_id}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Description */}
            <Card padding="none">
                <CardHeader className="px-6 pt-6">
                    <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent padding="none" className="px-6 pb-6 pt-4">
                    <RichTextEditor
                        value={data.description}
                        onChange={(value) => setData("description", value)}
                    />
                    <InputError message={errors.description} />
                </CardContent>
            </Card>
        </div>
    );
}
