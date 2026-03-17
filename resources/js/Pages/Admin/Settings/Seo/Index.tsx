import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import Card from "@/Components/Ui/Card";
import TextInput from "@/Components/Ui/TextInput";
import TextArea from "@/Components/Ui/TextArea";
import InputLabel from "@/Components/Ui/InputLabel";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import InputError from "@/Components/Ui/InputError";
import ImageUploader from "@/Components/Ui/ImageUploader";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";

interface Props {
    settings: {
        seo_site_name: string;
        seo_default_title: string;
        seo_default_description: string;
        seo_default_keywords: string;
        seo_og_image: string;
        google_site_verification: string;
        seo_robots: string;
    };
}

export default function Index({ settings }: Props) {
    const [existingOgImage, setExistingOgImage] = useState<string>(
        settings.seo_og_image || "",
    );

    const { data, setData, post, processing, errors } = useForm({
        seo_site_name: settings.seo_site_name || "",
        seo_default_title: settings.seo_default_title || "",
        seo_default_description: settings.seo_default_description || "",
        seo_default_keywords: settings.seo_default_keywords || "",
        google_site_verification: settings.google_site_verification || "",
        seo_robots: settings.seo_robots || "index,follow",

        og_image: null as File | null,
        existing_og_image: settings.seo_og_image || "",
        deleted_og_image: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.seo.update"), { forceFormData: true });
    };

    return (
        <Master title="SEO" head={<Header title="SEO" showUserMenu={true} />}>
            <Head title="SEO" />
            <div className="p-2">
                <div className="max-w-7xl mx-auto space-y-6">
                    <form onSubmit={submit} className="space-y-6">
                        <Card>
                            <h2 className="text-xl font-bold text-[#2DE3A7] mb-6">
                                SEO Defaults
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <InputLabel
                                        htmlFor="seo_site_name"
                                        value="Site Name"
                                    />
                                    <TextInput
                                        id="seo_site_name"
                                        name="seo_site_name"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.seo_site_name}
                                        onChange={(e) =>
                                            setData(
                                                "seo_site_name",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Your brand name"
                                    />
                                    <InputError
                                        message={errors.seo_site_name}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="seo_default_title"
                                        value="Default Title"
                                    />
                                    <TextInput
                                        id="seo_default_title"
                                        name="seo_default_title"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.seo_default_title}
                                        onChange={(e) =>
                                            setData(
                                                "seo_default_title",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Default page title"
                                    />
                                    <InputError
                                        message={errors.seo_default_title}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="seo_default_description"
                                    value="Default Meta Description"
                                />
                                <TextArea
                                    id="seo_default_description"
                                    name="seo_default_description"
                                    value={data.seo_default_description}
                                    onChange={(e) =>
                                        setData(
                                            "seo_default_description",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Short description for search engines"
                                    rows={3}
                                />
                                <InputError
                                    message={errors.seo_default_description}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="seo_default_keywords"
                                    value="Default Keywords (optional)"
                                />
                                <TextArea
                                    id="seo_default_keywords"
                                    name="seo_default_keywords"
                                    value={data.seo_default_keywords}
                                    onChange={(e) =>
                                        setData(
                                            "seo_default_keywords",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="comma,separated,keywords"
                                    rows={2}
                                />
                                <InputError
                                    message={errors.seo_default_keywords}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <InputLabel
                                        htmlFor="google_site_verification"
                                        value="Google Search Console verification"
                                    />
                                    <TextInput
                                        id="google_site_verification"
                                        name="google_site_verification"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.google_site_verification}
                                        onChange={(e) =>
                                            setData(
                                                "google_site_verification",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="google-site-verification content value"
                                    />
                                    <InputError
                                        message={
                                            errors.google_site_verification
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="seo_robots"
                                        value="Robots"
                                    />
                                    <TextInput
                                        id="seo_robots"
                                        name="seo_robots"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.seo_robots}
                                        onChange={(e) =>
                                            setData(
                                                "seo_robots",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="index,follow"
                                    />
                                    <InputError
                                        message={errors.seo_robots}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-xl font-bold text-[#2DE3A7] mb-2">
                                OpenGraph Image
                            </h2>
                            <p className="text-sm text-gray-400 mb-4">
                                Used when your pages are shared on social media.
                                Recommended size: 1200x630.
                            </p>

                            <ImageUploader
                                label="OG Image"
                                multiple={false}
                                maxFiles={1}
                                value={data.og_image}
                                existingImages={
                                    existingOgImage ? [existingOgImage] : []
                                }
                                onChange={(file) =>
                                    setData("og_image", (file as File) || null)
                                }
                                onRemoveExisting={() => {
                                    setData("existing_og_image", "");
                                    setData("deleted_og_image", true);
                                    setExistingOgImage("");
                                }}
                                error={errors.og_image as string}
                            />
                        </Card>

                        <div className="flex items-center justify-end pt-4">
                            <PrimaryButton
                                className="w-auto justify-center max-w-md"
                                disabled={processing}
                            >
                                {processing ? "Saving..." : "Save SEO Settings"}
                            </PrimaryButton>
                        </div>
                    </form>
                    <Card>
                        <h2 className="text-xl font-bold text-[#2DE3A7] mb-2">
                            Tools
                        </h2>
                        <p className="text-sm text-gray-400 mb-4">
                            Regenerate sitemap and RSS to reflect the latest
                            products and categories.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <PrimaryButton
                                type="button"
                                disabled={processing}
                                onClick={() =>
                                    post(route("admin.seo.regenerate-sitemap"))
                                }
                            >
                                Regenerate Sitemap
                            </PrimaryButton>

                            <PrimaryButton
                                type="button"
                                disabled={processing}
                                onClick={() =>
                                    post(route("admin.seo.regenerate-rss"))
                                }
                            >
                                Regenerate RSS
                            </PrimaryButton>
                        </div>
                    </Card>
                </div>
            </div>
        </Master>
    );
}
