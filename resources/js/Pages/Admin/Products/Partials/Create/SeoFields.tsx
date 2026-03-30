import React, { useRef, useState } from "react";
import { X } from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import InputError from "@/Components/Ui/InputError";

interface Props {
    data: any;
    setData: (key: string, value: any) => void;
    errors: any;
    existingOgImage?: string | null;
}

const TEXTAREA_CLASS =
    "w-full px-4 py-3 bg-[#0F1A18] border border-[#1E2826] rounded-lg text-gray-100 placeholder-gray-500 focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7] transition-all duration-200 ease-in-out resize-none";

export default function SeoFields({ data, setData, errors, existingOgImage }: Props) {
    const ogImageRef = useRef<HTMLInputElement>(null);
    const [ogImagePreview, setOgImagePreview] = useState<string | null>(null);
    const [deleteOgImage, setDeleteOgImage] = useState(false);

    const metaTitleCount = (data.meta_title ?? "").length;
    const metaDescCount = (data.meta_description ?? "").length;

    const handleOgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) {
            setData("og_image", file);
            setOgImagePreview(URL.createObjectURL(file));
            setDeleteOgImage(false);
            setData("delete_og_image", false);
        }
    };

    const handleRemoveOgImage = () => {
        setData("og_image", null);
        setOgImagePreview(null);
        setDeleteOgImage(true);
        setData("delete_og_image", true);
        if (ogImageRef.current) ogImageRef.current.value = "";
    };

    const currentOgImage = ogImagePreview ?? (deleteOgImage ? null : (existingOgImage ?? null));

    return (
        <Card padding="none">
            <CardHeader className="px-6 pt-6">
                <CardTitle>SEO & Meta</CardTitle>
            </CardHeader>
            <CardContent padding="none" className="px-6 pb-6 pt-4 space-y-4">
                {/* Short Description */}
                <div>
                    <InputLabel htmlFor="short_description" value="Short Description" />
                    <p className="text-xs text-gray-500 mb-1">Used in RSS feeds and search snippets (max 500 chars).</p>
                    <textarea
                        id="short_description"
                        name="short_description"
                        value={data.short_description ?? ""}
                        onChange={(e) => setData("short_description", e.target.value)}
                        placeholder="A brief product summary..."
                        rows={2}
                        maxLength={500}
                        className={TEXTAREA_CLASS}
                    />
                    <InputError message={errors.short_description} />
                </div>

                {/* Meta Title */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <InputLabel htmlFor="meta_title" value="Meta Title" />
                        <span className={`text-xs ${metaTitleCount > 60 ? "text-yellow-400" : "text-gray-500"}`}>
                            {metaTitleCount}/60
                        </span>
                    </div>
                    <TextInput
                        id="meta_title"
                        name="meta_title"
                        value={data.meta_title ?? ""}
                        onChange={(e) => setData("meta_title", e.target.value)}
                        placeholder="Leave blank to use product name"
                    />
                    <InputError message={errors.meta_title} />
                </div>

                {/* Meta Description */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <InputLabel htmlFor="meta_description" value="Meta Description" />
                        <span className={`text-xs ${metaDescCount > 160 ? "text-yellow-400" : "text-gray-500"}`}>
                            {metaDescCount}/160
                        </span>
                    </div>
                    <textarea
                        id="meta_description"
                        name="meta_description"
                        value={data.meta_description ?? ""}
                        onChange={(e) => setData("meta_description", e.target.value)}
                        placeholder="Leave blank to use short description"
                        rows={3}
                        maxLength={500}
                        className={TEXTAREA_CLASS}
                    />
                    <InputError message={errors.meta_description} />
                </div>

                {/* Meta Keywords */}
                <div>
                    <InputLabel htmlFor="meta_keywords" value="Meta Keywords" />
                    <p className="text-xs text-gray-500 mb-1">Comma-separated, e.g. shirt, cotton, men</p>
                    <TextInput
                        id="meta_keywords"
                        name="meta_keywords"
                        value={data.meta_keywords ?? ""}
                        onChange={(e) => setData("meta_keywords", e.target.value)}
                        placeholder="keyword1, keyword2, keyword3"
                    />
                    <InputError message={errors.meta_keywords} />
                </div>

                {/* OG Image */}
                <div>
                    <InputLabel htmlFor="og_image" value="OG Image (Social Share)" />
                    <p className="text-xs text-gray-500 mb-2">Recommended: 1200×630px. Defaults to first product image.</p>

                    {currentOgImage && (
                        <div className="relative inline-block mb-3">
                            <img
                                src={ogImagePreview ? currentOgImage : `/storage/${currentOgImage}`}
                                alt="OG preview"
                                className="h-28 w-auto rounded-lg border border-[#1E2826] object-cover"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveOgImage}
                                className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-0.5 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    <input
                        ref={ogImageRef}
                        id="og_image"
                        name="og_image"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                        onChange={handleOgImageChange}
                        className="block w-full text-sm text-gray-400
                            file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                            file:text-sm file:font-medium file:bg-[#1E2826] file:text-[#2DE3A7]
                            hover:file:bg-[#243330] cursor-pointer"
                    />
                    <InputError message={errors.og_image} />
                </div>

                {/* Search preview */}
                {(data.meta_title || data.meta_description) && (
                    <div className="rounded-lg border border-[#1E2826] p-4 bg-[#0a1210]">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Search Preview</p>
                        <p className="text-[#2DE3A7] text-sm font-medium truncate">
                            {data.meta_title || data.name || "Product Title"}
                        </p>
                        <p className="text-green-600 text-xs mb-1">
                            {typeof window !== "undefined" ? window.location.hostname : "yoursite.com"}/product/{data.slug || "product-slug"}
                        </p>
                        <p className="text-gray-400 text-xs line-clamp-2">
                            {data.meta_description || data.short_description || "Product description will appear here..."}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
