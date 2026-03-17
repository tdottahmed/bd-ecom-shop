import React, { useState, FormEvent } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link, useForm, router } from "@inertiajs/react";
import { ArrowLeft, Trash2 } from "lucide-react";
import TextInput from "@/Components/Ui/TextInput";
import InputLabel from "@/Components/Ui/InputLabel";
import InputError from "@/Components/Ui/InputError";
import { Brand } from "@/types";
import ImageUploader from "@/Components/Ui/ImageUploader";
import Card, { CardContent } from "@/Components/Ui/Card";
import Checkbox from "@/Components/Ui/Checkbox";

interface EditProps {
    brand: Brand;
}

const Edit: React.FC<EditProps> = ({ brand }) => {
    const { data, setData, post, processing, errors } = useForm({
        title: brand.title,
        slug: brand.slug,
        image: null as File | null,
        is_featured: brand.is_featured ?? true,
        _method: "PUT",
    });

    const [deleting, setDeleting] = useState(false);
    const existingImages = brand.image ? [brand.image] : [];

    const handleImageChange = (files: File | File[] | null) => {
        if (Array.isArray(files)) {
            setData("image", files.length > 0 ? files[0] : null);
        } else {
            setData("image", files);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route("admin.brands.update", brand.id));
    };

    const handleDelete = () => {
        if (
            confirm(
                "Are you sure you want to delete this brand? This action cannot be undone."
            )
        ) {
            setDeleting(true);
            router.delete(route("admin.brands.destroy", brand.id));
        }
    };

    return (
        <Master
            title="Edit Brand"
            head={<Header title="Edit Brand" showUserMenu={true} />}
        >
            <div className="p-4 md:p-6 max-w-8xl mx-auto">
                <div className="mb-6">
                    <Link
                        href={route("admin.brands.index")}
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4"
                    >
                        <ArrowLeft size={20} />
                        <span> Back to Brands </span>
                    </Link>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Edit Brand
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

                <Card>
                    <CardContent padding="lg">
                        <form onSubmit={handleSubmit}>
                            <div>
                                <InputLabel htmlFor="title" value="Brand Title" />
                                <TextInput
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="Enter brand title"
                                    required
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                            </div>

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
                                    placeholder="brand-slug"
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    URL-friendly version of the title.
                                </p>
                                <InputError
                                    message={errors.slug}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <ImageUploader
                                    label="Brand Image"
                                    multiple={false}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    maxFiles={1}
                                    value={data.image}
                                    existingImages={existingImages}
                                    onRemoveExisting={() => {}}
                                    error={errors.image}
                                />
                                <InputError
                                    message={errors.image}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4 flex items-center gap-2">
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
                                    value="Featured brand"
                                    className="!mb-0 cursor-pointer"
                                />
                            </div>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Show this brand prominently.
                            </p>

                            <div className="flex gap-3 pt-4">
                                <Link
                                    href={route("admin.brands.index")}
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
                                        : "Update Brand"}
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
