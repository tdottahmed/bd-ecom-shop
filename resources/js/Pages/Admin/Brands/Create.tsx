import React, { FormEvent } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
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

    const handleImagesChange = (files: File | File[] | null) => {
        if (Array.isArray(files)) {
            setData("image", files.length > 0 ? files[0] : null);
        } else {
            setData("image", files);
        }
    };

    const handleTitleChange = (value: string) => {
        setData("title", value);
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
        post(route("admin.brands.store"));
    };

    return (
        <Master
            title="Create Brand"
            head={<Header title="Create Brand" showUserMenu={true} />}
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
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        Create Brand
                    </h1>
                </div>

                <Card className="p-6 space-y-6">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <InputLabel htmlFor="title" value="Brand Title" />
                            <TextInput
                                id="title"
                                name="title"
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    handleTitleChange(e.target.value)
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
                                placeholder="brand-slug"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                URL-friendly version of the title. Auto-generated
                                if left empty.
                            </p>
                            <InputError
                                message={errors.slug}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-3">
                            <ImageUploader
                                label="Brand Image"
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
                                {processing ? "Creating..." : "Create Brand"}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>
            </div>
        </Master>
    );
};

export default Create;
