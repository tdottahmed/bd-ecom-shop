import React, { useState, FormEvent } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link, useForm, router } from "@inertiajs/react";
import { ArrowLeft, Trash2 } from "lucide-react";
import TextInput from "@/Components/Ui/TextInput";
import InputLabel from "@/Components/Ui/InputLabel";
import InputError from "@/Components/Ui/InputError";
import { Category } from "@/types";
import ImageUploader from "@/Components/Ui/ImageUploader";
import Card, { CardContent } from "@/Components/Ui/Card";
import Checkbox from "@/Components/Ui/Checkbox";

interface EditProps {
    category: Category;
}

const Edit: React.FC<EditProps> = ({ category }) => {
    const { data, setData, post, processing, errors } = useForm({
        title: category.title,
        slug: category.slug,
        image: null as File | null,
        is_featured: category.is_featured ?? true,
        _method: "PUT",
    });

    const [deleting, setDeleting] = useState(false);

    // Helper to get existing image array
    const existingImages = category.image ? [category.image] : [];

    const handleImageChange = (files: File | File[] | null) => {
        if (Array.isArray(files)) {
            // Should not happen in single mode, but handle just in case
            setData("image", files.length > 0 ? files[0] : null);
        } else {
            setData("image", files);
        }
    };

    const handleRemoveExisting = () => {};

    const handleTitleChange = (value: string) => {
        setData("title", value);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route("admin.categories.update", category.id));
    };

    const handleDelete = () => {
        if (
            confirm(
                "Are you sure you want to delete this category? This action cannot be undone.",
            )
        ) {
            setDeleting(true);
            router.delete(route("admin.categories.destroy", category.id));
        }
    };

    return (
        <Master
            title="Edit Category"
            head={<Header title="Edit Category" showUserMenu={true} />}
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
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Edit Category
                        </h1>
                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Trash2 size={18} />
                            <span> Delete </span>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardContent padding="lg">
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
                            <div>
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
                                    URL - friendly version of the title.
                                </p>
                                <InputError
                                    message={errors.slug}
                                    className="mt-2"
                                />
                            </div>

                            {/* Image Upload */}
                            <div>
                                <ImageUploader
                                    label="Category Image"
                                    multiple={false}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    maxFiles={1}
                                    value={data.image}
                                    existingImages={existingImages}
                                    onRemoveExisting={handleRemoveExisting}
                                    error={errors.image}
                                />
                                <InputError
                                    message={errors.image}
                                    className="mt-2"
                                />
                            </div>

                            {/* Featured */}
                            <div className="mt-4 flex items-center gap-2">
                                <Checkbox
                                    name="is_featured"
                                    checked={data.is_featured ? true : false}
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
                                    {processing
                                        ? "Updating..."
                                        : "Update Category"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Master>
    );
};

export default Edit;
