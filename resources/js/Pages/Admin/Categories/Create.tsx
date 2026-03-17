import React, { useState, FormEvent } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Upload, X } from "lucide-react";
import TextInput from "@/Components/Ui/TextInput";
import InputLabel from "@/Components/Ui/InputLabel";
import InputError from "@/Components/Ui/InputError";
import Card from "@/Components/Ui/Card";
import ImageUploader from "@/Components/Ui/ImageUploader";
import Checkbox from "@/Components/Ui/Checkbox";

const Create: React.FC = () => {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        slug: "",
        image: null as File | null,
        is_featured: true,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImagesChange = (files: File | File[] | null) => {
        if (Array.isArray(files)) {
            setData("image", files.length > 0 ? files[0] : null);
        } else {
            setData("image", files);
        }
    };

    const removeImage = () => {
        setData("image", null);
        setImagePreview(null);
    };

    const handleTitleChange = (value: string) => {
        setData("title", value);
        // Auto-generate slug from title
        if (!data.slug || data.slug === generateSlug(data.title)) {
            setData("slug", generateSlug(value));
        }
    };

    const generateSlug = (text: string): string => {
        return text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route("admin.categories.store"));
    };

    return (
        <Master
            title="Create Category"
            head={<Header title="Create Category" showUserMenu={true} />}
        >
            <div className="p-4 md:p-6 max-w-8xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <Link
                        href={route("admin.categories.index")}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span> Back to Categories </span>
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Create Category
                    </h1>
                </div>

                {/* Form */}
                <Card className="p-6 space-y-6">
                    <form onSubmit={handleSubmit}>
                        {/* Title */}
                        <div>
                            <InputLabel
                                htmlFor="title"
                                value="Category Title"
                            />
                            <TextInput
                                id="title"
                                name="title"
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    handleTitleChange(e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="Enter category title"
                                required
                            />
                            <InputError
                                message={errors.title}
                                className="mt-2"
                            />
                        </div>

                        {/* Slug */}
                        <div className="mt-3 mb-3">
                            <InputLabel htmlFor="slug" value="Slug" />
                            <TextInput
                                id="slug"
                                name="slug"
                                type="text"
                                value={data.slug}
                                onChange={(e) =>
                                    setData("slug", e.target.value)
                                }
                                className="mt-1 block w-full"
                                placeholder="category-slug"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                URL - friendly version of the title.Auto -
                                generated if left empty.
                            </p>
                            <InputError
                                message={errors.slug}
                                className="mt-2"
                            />
                        </div>

                        {/* Image Upload */}
                        <div className="mt-3">
                            <ImageUploader
                                label="Category Image"
                                multiple={false}
                                accept="image/*"
                                onChange={handleImagesChange}
                                maxFiles={1}
                                value={data.image}
                                error={errors.image}
                            />
                            <InputError
                                message={errors.image}
                                className="mt-2"
                            />
                        </div>

                        {/* Featured */}
                        <div className="mt-3 flex items-center gap-2">
                            <Checkbox
                                id="is_featured"
                                name="is_featured"
                                checked={data.is_featured ?? true}
                                onChange={(e) =>
                                    setData("is_featured", e.target.checked)
                                }
                            />
                            <InputLabel
                                htmlFor="is_featured"
                                value="Featured category"
                                className="!mb-0 cursor-pointer"
                            />
                        </div>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Show this category prominently (e.g. on homepage).
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <Link
                                href={route("admin.categories.index")}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-center"
                            >
                                Cancel
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="flex-1"
                            >
                                {processing ? "Creating..." : "Create Category"}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </Master>
    );
};

export default Create;
