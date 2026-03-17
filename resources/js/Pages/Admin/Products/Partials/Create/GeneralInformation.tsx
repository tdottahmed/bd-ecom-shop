import React from "react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import CollapsibleSection from "@/Components/Ui/CollapsibleSection";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import SelectInput from "@/Components/Ui/SelectInput";
import TextArea from "@/Components/Ui/TextArea";
import InputError from "@/Components/Ui/InputError";
import Checkbox from "@/Components/Ui/Checkbox";

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    categories: any[];
    brands: any[];
    suppliers: any[];
}

export default function GeneralInformation({
    data,
    setData,
    errors,
    categories,
    brands,
    suppliers,
}: Props) {
    return (
        <div className="mb-2">
            <CollapsibleSection title="General Information" defaultOpen={true}>
                <Card>
                    <CardHeader>
                        <CardTitle>Product Details </CardTitle>
                    </CardHeader>
                    <CardContent padding="lg">
                        <div className="mb-4">
                            <InputLabel
                                htmlFor="name"
                                value="Product Name"
                                required
                            />
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

                        <div className="mb-4">
                            <InputLabel htmlFor="slug" value="Slug" required />
                            <TextInput
                                id="slug"
                                name="slug"
                                value={data.slug}
                                onChange={(e) =>
                                    setData("slug", e.target.value)
                                }
                                placeholder="product-slug"
                                required
                            />
                            <InputError message={errors.slug} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <InputLabel
                                    htmlFor="category_id"
                                    value="Category"
                                    required
                                />
                                <SelectInput
                                    id="category_id"
                                    name="category_id"
                                    value={data.category_id}
                                    onChange={(val) =>
                                        setData("category_id", val)
                                    }
                                    options={categories.map((c) => ({
                                        value: c.id,
                                        label: c.title,
                                    }))}
                                    placeholder="Select Category"
                                    error={errors.category_id}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="brand_id"
                                    value="Brand"
                                />
                                <SelectInput
                                    id="brand_id"
                                    name="brand_id"
                                    value={data.brand_id ?? ""}
                                    onChange={(val) =>
                                        setData("brand_id", val || null)
                                    }
                                    options={brands.map((b) => ({
                                        value: b.id,
                                        label: b.title,
                                    }))}
                                    placeholder="Select Brand (optional)"
                                    error={errors.brand_id}
                                />
                            </div>
                            <div>
                                <InputLabel
                                    htmlFor="supplier_id"
                                    value="Supplier"
                                    required
                                />
                                <SelectInput
                                    id="supplier_id"
                                    name="supplier_id"
                                    value={data.supplier_id}
                                    onChange={(val) =>
                                        setData("supplier_id", val)
                                    }
                                    options={suppliers.map((s) => ({
                                        value: s.id,
                                        label: s.name,
                                    }))}
                                    placeholder="Select Supplier"
                                    error={errors.supplier_id}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1">
                            <InputLabel
                                htmlFor="description"
                                value="Description"
                                required
                            />
                            <TextArea
                                id="description"
                                name="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                                required
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex items-center gap-2 mt-4">
                            <Checkbox
                                name="is_preorder"
                                checked={data.is_preorder}
                                onChange={(e) =>
                                    setData("is_preorder", e.target.checked)
                                }
                            />
                            <InputLabel
                                htmlFor="is_preorder"
                                value="Is Preorder Product?"
                                className="!mb-0 cursor-pointer"
                            />
                        </div>
                    </CardContent>
                </Card>
            </CollapsibleSection>
        </div>
    );
}
