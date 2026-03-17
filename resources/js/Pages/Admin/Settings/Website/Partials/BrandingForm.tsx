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
    setting: WebsiteSetting;
}

const BrandingForm: React.FC<BrandingFormProps> = ({ setting }) => {
    const { data, setData, post, processing, errors } = useForm({
        type: "branding",
        logo: null as File | null,
        favicon: null as File | null,
        existing_logo: setting.logo || null,
        existing_favicon: setting.favicon || null,
        deleted_logo: false,
        deleted_favicon: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setData("logo", null);
                setData("favicon", null);
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

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Branding (Logo &amp; Favicon)</CardTitle>
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

