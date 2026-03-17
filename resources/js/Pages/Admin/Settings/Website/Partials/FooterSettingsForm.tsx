import React from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import Card, {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/Ui/Card";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import { WebsiteSetting } from "../types";

interface FooterSettingsFormProps {
    settings: WebsiteSetting;
}

const FooterSettingsForm: React.FC<FooterSettingsFormProps> = ({ settings }) => {
    const { data, setData, post, processing, errors } = useForm({
        type: "footer",
        footer_description: settings.footer_description || "",
        social_facebook: settings.social_facebook || "",
        social_instagram: settings.social_instagram || "",
        social_youtube: settings.social_youtube || "",
        social_tiktok: settings.social_tiktok || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Footer settings updated successfully");
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Footer Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        <div>
                            <InputLabel htmlFor="footer_description" value="Footer Description" />
                            <textarea
                                id="footer_description"
                                name="footer_description"
                                className="mt-1 block w-full border-[#1E2826] bg-[#0F1A18] text-white rounded-md shadow-sm focus:border-[#2DE3A7] focus:ring-[#2DE3A7] sm:text-sm"
                                value={data.footer_description}
                                onChange={(e) => setData("footer_description", e.target.value)}
                                rows={3}
                                placeholder="Enter short description for footer..."
                            />
                            {errors.footer_description && (
                                <p className="mt-2 text-sm text-red-600">{errors.footer_description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel htmlFor="social_facebook" value="Facebook URL" />
                                <TextInput
                                    id="social_facebook"
                                    name="social_facebook"
                                    type="url"
                                    value={data.social_facebook}
                                    onChange={(e) => setData("social_facebook", e.target.value)}
                                    placeholder="https://facebook.com/yourpage"
                                />
                                {errors.social_facebook && (
                                    <p className="mt-2 text-sm text-red-600">{errors.social_facebook}</p>
                                )}
                            </div>
                            <div>
                                <InputLabel htmlFor="social_instagram" value="Instagram URL" />
                                <TextInput
                                    id="social_instagram"
                                    name="social_instagram"
                                    type="url"
                                    value={data.social_instagram}
                                    onChange={(e) => setData("social_instagram", e.target.value)}
                                    placeholder="https://instagram.com/yourprofile"
                                />
                                {errors.social_instagram && (
                                    <p className="mt-2 text-sm text-red-600">{errors.social_instagram}</p>
                                )}
                            </div>
                            <div>
                                <InputLabel htmlFor="social_youtube" value="YouTube URL" />
                                <TextInput
                                    id="social_youtube"
                                    name="social_youtube"
                                    type="url"
                                    value={data.social_youtube}
                                    onChange={(e) => setData("social_youtube", e.target.value)}
                                    placeholder="https://youtube.com/@yourchannel"
                                />
                                {errors.social_youtube && (
                                    <p className="mt-2 text-sm text-red-600">{errors.social_youtube}</p>
                                )}
                            </div>
                            <div>
                                <InputLabel htmlFor="social_tiktok" value="TikTok URL" />
                                <TextInput
                                    id="social_tiktok"
                                    name="social_tiktok"
                                    type="url"
                                    value={data.social_tiktok}
                                    onChange={(e) => setData("social_tiktok", e.target.value)}
                                    placeholder="https://tiktok.com/@yourprofile"
                                />
                                {errors.social_tiktok && (
                                    <p className="mt-2 text-sm text-red-600">{errors.social_tiktok}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-[#2DE3A7] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#26c28f] transition-colors disabled:opacity-50"
                            >
                                {processing ? "Saving..." : "Save Footer Settings"}
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};

export default FooterSettingsForm;
