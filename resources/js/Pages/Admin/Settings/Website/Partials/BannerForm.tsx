import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

import Card, {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/Ui/Card";
import ImageUploader from "@/Components/Ui/ImageUploader";
import { WebsiteSetting } from "../types";

interface BannerFormProps {
    settings: WebsiteSetting;
}

const BannerForm: React.FC<BannerFormProps> = ({ settings }) => {
    const [existingImages, setExistingImages] = useState<string[]>(
        settings.banner_images || [],
    );

    const { data, setData, post, processing, errors } = useForm({
        type: "banner",
        banner_active: settings.banner_active,
        banner_images: [] as File[],
        existing_banner_images: settings.banner_images || [],
        deleted_images: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setData("banner_images", []);
                toast.success("Banner settings updated successfully");
            },
        });
    };

    const handleImagesChange = (files: File | File[] | null) => {
        if (Array.isArray(files)) {
            setData("banner_images", files);
        } else if (files) {
            setData("banner_images", [files]);
        } else {
            setData("banner_images", []);
        }
    };

    const handleRemoveExistingImage = (path: string) => {
        const cleanPath = path.startsWith("/") ? path.slice(1) : path;

        setData("deleted_images", [...data.deleted_images, cleanPath]);
        setExistingImages((prev) => prev.filter((img) => img !== cleanPath));
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Banner Settings</CardTitle>
                        <button
                            type="button"
                            onClick={() =>
                                setData("banner_active", !data.banner_active)
                            }
                            className={`w-12 h-6 rounded-full transition-colors relative ${
                                data.banner_active
                                    ? "bg-[#2DE3A7]"
                                    : "bg-gray-600"
                            }`}
                        >
                            <div
                                className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                                    data.banner_active ? "left-7" : "left-1"
                                }`}
                            />
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ImageUploader
                        label="Banner Images"
                        multiple={true}
                        value={data.banner_images}
                        existingImages={existingImages}
                        onChange={handleImagesChange}
                        onRemoveExisting={handleRemoveExistingImage}
                        error={errors.banner_images as string}
                    />
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#2DE3A7] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#26c28f] transition-colors disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Banner Settings"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};

export default BannerForm;

