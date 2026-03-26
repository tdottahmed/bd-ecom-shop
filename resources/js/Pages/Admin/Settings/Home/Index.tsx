import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/Ui/Card";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import SecondaryButton from "@/Components/Actions/SecondaryButton";
import TextInput from "@/Components/Ui/TextInput";
import TextArea from "@/Components/Ui/TextArea";
import Checkbox from "@/Components/Ui/Checkbox";
import ImageUploader from "@/Components/Ui/ImageUploader";
import { Head, useForm } from "@inertiajs/react";
import React from "react";
import { Trash2, Plus } from "lucide-react";

type FeatureItem = {
    icon?: string | null;
    title?: string | null;
    description?: string | null;
    tone?: string | null;
};

type HomeSettings = {
    features_enabled: boolean;
    features_title: string;
    features_subtitle: string;
    features_items: FeatureItem[];

    promo_enabled: boolean;
    promo_badge: string;
    promo_title: string;
    promo_description: string;
    promo_bg_image: string | File | null;
    promo_primary_cta_text: string;
    promo_secondary_cta_text: string;

    newsletter_enabled: boolean;
    newsletter_title: string;
    newsletter_description: string;
    newsletter_placeholder: string;

    brands_enabled: boolean;
    brands_title: string;
    brands_subtitle: string;
    brands_cta_text: string;
};

export default function Index({ settings }: { settings: HomeSettings }) {
    const { data, setData, processing, errors, post } = useForm<HomeSettings>({
        ...settings,
        features_items: Array.isArray(settings.features_items)
            ? settings.features_items
            : [],
    });

    const iconOptions = [
        { value: "Truck", label: "Truck" },
        { value: "ShieldCheck", label: "ShieldCheck" },
        { value: "Clock", label: "Clock" },
        { value: "Headphones", label: "Headphones" },
    ];

    const toneOptions = [
        { value: "indigo", label: "Indigo" },
        { value: "emerald", label: "Emerald" },
        { value: "amber", label: "Amber" },
        { value: "rose", label: "Rose" },
        { value: "slate", label: "Slate" },
    ];

    const updateFeatureItem = (idx: number, patch: Partial<FeatureItem>) => {
        const next = [...(data.features_items ?? [])];
        next[idx] = { ...(next[idx] ?? {}), ...patch };
        setData("features_items", next);
    };

    const removeFeatureItem = (idx: number) => {
        const next = [...(data.features_items ?? [])];
        next.splice(idx, 1);
        setData("features_items", next);
    };

    const addFeatureItem = () => {
        const next = [...(data.features_items ?? [])];
        next.push({
            icon: "Truck",
            title: "",
            description: "",
            tone: "slate",
        });
        setData("features_items", next);
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.home-settings.update"), {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <Master title="Home Settings" head={<Header title="Home Settings" showUserMenu={true} />}>
            <Head title="Home Settings" />

            <form onSubmit={onSubmit} className="p-2 md:p-6 max-w-8xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Home page sections</CardTitle>
                        <CardDescription>
                            Manage content shown on the customer Home page (Features, Promo, Brands, Newsletter). Saved in the <code>settings</code> table.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-end gap-3">
                            <SecondaryButton
                                type="button"
                                onClick={() => window.location.reload()}
                                variant="ghost"
                            >
                                Reset
                            </SecondaryButton>
                            <PrimaryButton type="submit" disabled={processing} loading={processing}>
                                Save changes
                            </PrimaryButton>
                        </div>
                    </CardContent>
                </Card>

                {/* Features */}
                <Card>
                    <CardHeader>
                        <CardTitle>Features section</CardTitle>
                        <CardDescription>
                            Controls the content of the Features block on Home.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="features_enabled"
                                name="features_enabled"
                                checked={data.features_enabled}
                                onChange={(e) =>
                                    setData("features_enabled", e.target.checked)
                                }
                            />
                            <label htmlFor="features_enabled" className="text-sm text-gray-200">
                                Enable features section
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-300">Title</label>
                                <TextInput
                                    id="features_title"
                                    name="features_title"
                                    value={data.features_title}
                                    onChange={(e) => setData("features_title", e.target.value)}
                                />
                                {errors.features_title && (
                                    <div className="text-xs text-red-400 mt-1">{errors.features_title}</div>
                                )}
                            </div>
                            <div>
                                <label className="text-sm text-gray-300">Subtitle</label>
                                <TextInput
                                    id="features_subtitle"
                                    name="features_subtitle"
                                    value={data.features_subtitle}
                                    onChange={(e) => setData("features_subtitle", e.target.value)}
                                />
                                {errors.features_subtitle && (
                                    <div className="text-xs text-red-400 mt-1">{errors.features_subtitle}</div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="text-sm text-gray-300 font-medium">Feature items</div>
                                <div className="text-xs text-gray-500">
                                    Add up to 8 items. Choose an icon + color tone, then write title/description.
                                </div>
                            </div>
                            <SecondaryButton type="button" onClick={addFeatureItem}>
                                <Plus size={16} />
                                Add feature
                            </SecondaryButton>
                        </div>

                        <div className="space-y-3">
                            {(data.features_items ?? []).length === 0 ? (
                                <div className="text-sm text-gray-500">
                                    No feature items yet. Click “Add feature”.
                                </div>
                            ) : (
                                (data.features_items ?? []).map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-xl border border-[#1E2826] bg-[#0C1311] p-4"
                                    >
                                        <div className="flex items-center justify-between gap-3 mb-3">
                                            <div className="text-sm font-semibold text-gray-200">
                                                Item #{idx + 1}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeFeatureItem(idx)}
                                                className="inline-flex items-center gap-2 text-sm text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 size={16} />
                                                Remove
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-gray-300">Icon</label>
                                                <select
                                                    className="w-full mt-1 px-4 py-3 bg-[#0F1A18] border border-[#1E2826] rounded-lg text-gray-100 focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]"
                                                    value={item.icon ?? ""}
                                                    onChange={(e) =>
                                                        updateFeatureItem(idx, { icon: e.target.value })
                                                    }
                                                >
                                                    {iconOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-300">Color tone</label>
                                                <select
                                                    className="w-full mt-1 px-4 py-3 bg-[#0F1A18] border border-[#1E2826] rounded-lg text-gray-100 focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]"
                                                    value={item.tone ?? "slate"}
                                                    onChange={(e) =>
                                                        updateFeatureItem(idx, { tone: e.target.value })
                                                    }
                                                >
                                                    {toneOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <label className="text-sm text-gray-300">Title</label>
                                                <TextInput
                                                    id={`features_items_${idx}_title`}
                                                    name={`features_items.${idx}.title`}
                                                    value={item.title ?? ""}
                                                    onChange={(e) =>
                                                        updateFeatureItem(idx, { title: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm text-gray-300">Description</label>
                                                <TextInput
                                                    id={`features_items_${idx}_description`}
                                                    name={`features_items.${idx}.description`}
                                                    value={item.description ?? ""}
                                                    onChange={(e) =>
                                                        updateFeatureItem(idx, { description: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Promo */}
                <Card>
                    <CardHeader>
                        <CardTitle>Promo banner</CardTitle>
                        <CardDescription>
                            Controls the promo banner on Home (background image, badge, title and CTA).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="promo_enabled"
                                name="promo_enabled"
                                checked={data.promo_enabled}
                                onChange={(e) => setData("promo_enabled", e.target.checked)}
                            />
                            <label htmlFor="promo_enabled" className="text-sm text-gray-200">
                                Enable promo banner
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-300">Badge</label>
                                <TextInput
                                    id="promo_badge"
                                    name="promo_badge"
                                    value={data.promo_badge}
                                    onChange={(e) => setData("promo_badge", e.target.value)}
                                />
                            </div>
                            <div>
                                <ImageUploader
                                    label="Background image"
                                    inputId="promo_bg_image"
                                    multiple={false}
                                    maxFiles={1}
                                    value={
                                        data.promo_bg_image instanceof File
                                            ? data.promo_bg_image
                                            : null
                                    }
                                    existingImages={
                                        typeof data.promo_bg_image === "string" &&
                                        data.promo_bg_image.trim() !== ""
                                            ? [data.promo_bg_image]
                                            : []
                                    }
                                    onChange={(file) =>
                                        setData(
                                            "promo_bg_image",
                                            file instanceof File ? file : null,
                                        )
                                    }
                                    onRemoveExisting={() =>
                                        setData("promo_bg_image", "")
                                    }
                                    accept="image/*"
                                    error={errors.promo_bg_image}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-300">Title</label>
                            <TextInput
                                id="promo_title"
                                name="promo_title"
                                value={data.promo_title}
                                onChange={(e) => setData("promo_title", e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm text-gray-300">Description</label>
                            <TextArea
                                id="promo_description"
                                name="promo_description"
                                value={data.promo_description}
                                rows={4}
                                onChange={(e) => setData("promo_description", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-300">Primary CTA text</label>
                                <TextInput
                                    id="promo_primary_cta_text"
                                    name="promo_primary_cta_text"
                                    value={data.promo_primary_cta_text}
                                    onChange={(e) => setData("promo_primary_cta_text", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300">Secondary CTA text</label>
                                <TextInput
                                    id="promo_secondary_cta_text"
                                    name="promo_secondary_cta_text"
                                    value={data.promo_secondary_cta_text}
                                    onChange={(e) => setData("promo_secondary_cta_text", e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Brands */}
                <Card>
                    <CardHeader>
                        <CardTitle>Brands section</CardTitle>
                        <CardDescription>
                            Adds a visually impactful “Shop by Brand” section on Home.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="brands_enabled"
                                name="brands_enabled"
                                checked={data.brands_enabled}
                                onChange={(e) => setData("brands_enabled", e.target.checked)}
                            />
                            <label htmlFor="brands_enabled" className="text-sm text-gray-200">
                                Enable brands section
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm text-gray-300">Title</label>
                                <TextInput
                                    id="brands_title"
                                    name="brands_title"
                                    value={data.brands_title}
                                    onChange={(e) => setData("brands_title", e.target.value)}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-gray-300">Subtitle</label>
                                <TextInput
                                    id="brands_subtitle"
                                    name="brands_subtitle"
                                    value={data.brands_subtitle}
                                    onChange={(e) => setData("brands_subtitle", e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-300">CTA button text</label>
                            <TextInput
                                id="brands_cta_text"
                                name="brands_cta_text"
                                value={data.brands_cta_text}
                                onChange={(e) => setData("brands_cta_text", e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Newsletter */}
                <Card>
                    <CardHeader>
                        <CardTitle>Newsletter section</CardTitle>
                        <CardDescription>
                            Controls the newsletter section content on Home.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Checkbox
                                id="newsletter_enabled"
                                name="newsletter_enabled"
                                checked={data.newsletter_enabled}
                                onChange={(e) => setData("newsletter_enabled", e.target.checked)}
                            />
                            <label htmlFor="newsletter_enabled" className="text-sm text-gray-200">
                                Enable newsletter section
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-300">Title</label>
                                <TextInput
                                    id="newsletter_title"
                                    name="newsletter_title"
                                    value={data.newsletter_title}
                                    onChange={(e) => setData("newsletter_title", e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm text-gray-300">Placeholder</label>
                                <TextInput
                                    id="newsletter_placeholder"
                                    name="newsletter_placeholder"
                                    value={data.newsletter_placeholder}
                                    onChange={(e) => setData("newsletter_placeholder", e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-300">Description</label>
                            <TextArea
                                id="newsletter_description"
                                name="newsletter_description"
                                value={data.newsletter_description}
                                rows={4}
                                onChange={(e) => setData("newsletter_description", e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Master>
    );
}

