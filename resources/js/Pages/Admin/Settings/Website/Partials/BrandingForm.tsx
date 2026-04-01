import React from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

import Card, {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/Ui/Card";
import ImageUploader from "@/Components/Ui/ImageUploader";
import { WebsiteSetting } from "../types";

interface BrandingFormProps {
    settings: WebsiteSetting;
}

const BrandingForm: React.FC<BrandingFormProps> = ({ settings }) => {
    const { data, setData, post, processing, errors } = useForm({
        type: "branding",
        logo: null as File | null,
        favicon: null as File | null,
        auth_page_image: null as File | null,
        existing_logo: settings.site_logo || null,
        existing_favicon: settings.site_favicon || null,
        existing_auth_page_image: settings.auth_page_image || null,
        deleted_logo: false,
        deleted_favicon: false,
        deleted_auth_page_image: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setData("logo", null);
                setData("favicon", null);
                setData("auth_page_image", null);
                toast.success("Branding updated successfully");
            },
        });
    };

    const handleLogoChange = (file: File | File[] | null) => {
        setData("logo", (file as File | null) || null);
    };

    const handleFaviconChange = (file: File | File[] | null) => {
        setData("favicon", (file as File | null) || null);
    };

    const handleAuthImageChange = (file: File | File[] | null) => {
        setData("auth_page_image", (file as File | null) || null);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Branding (Logo, Favicon &amp; Auth Image)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-white">
                                Logo
                            </h3>
                            <p className="text-xs text-gray-400 mb-2">
                                Upload your website logo. Recommended size:
                                200x60px, PNG with transparent background.
                            </p>
                            <ImageUploader
                                label="Logo"
                                multiple={false}
                                maxFiles={1}
                                value={data.logo}
                                existingImages={
                                    data.existing_logo
                                        ? [data.existing_logo]
                                        : []
                                }
                                onChange={handleLogoChange}
                                onRemoveExisting={() => {
                                    setData("existing_logo", null);
                                    setData("deleted_logo", true);
                                }}
                                error={errors.logo as string}
                            />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-white">
                                Favicon
                            </h3>
                            <p className="text-xs text-gray-400 mb-2">
                                Upload your browser tab icon. Recommended size:
                                64x64px, PNG or ICO format.
                            </p>
                            <ImageUploader
                                label="Favicon"
                                multiple={false}
                                maxFiles={1}
                                value={data.favicon}
                                existingImages={
                                    data.existing_favicon
                                        ? [data.existing_favicon]
                                        : []
                                }
                                onChange={handleFaviconChange}
                                onRemoveExisting={() => {
                                    setData("existing_favicon", null);
                                    setData("deleted_favicon", true);
                                }}
                                error={errors.favicon as string}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <h3 className="text-sm font-semibold text-white">
                                Auth Pages Image
                            </h3>
                            <p className="text-xs text-gray-400 mb-2">
                                Upload an image for the left column of authentication pages. Recommended size: 1080x1080px (Square) or 1920x1080px (Landscape), JPG or PNG.
                            </p>
                            <ImageUploader
                                label="Auth Page Image"
                                multiple={false}
                                maxFiles={1}
                                value={data.auth_page_image}
                                existingImages={
                                    data.existing_auth_page_image
                                        ? [data.existing_auth_page_image]
                                        : []
                                }
                                onChange={handleAuthImageChange}
                                onRemoveExisting={() => {
                                    setData("existing_auth_page_image", null);
                                    setData("deleted_auth_page_image", true);
                                }}
                                error={errors.auth_page_image as string}
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#2DE3A7] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#26c28f] transition-colors disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Branding"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};

export default BrandingForm;

