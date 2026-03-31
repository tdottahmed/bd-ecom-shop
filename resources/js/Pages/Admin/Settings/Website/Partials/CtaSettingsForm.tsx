import React from "react";
import { useForm } from "@inertiajs/react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import { WebsiteSetting } from "../types";

export default function CtaSettingsForm({
    settings,
}: {
    settings: WebsiteSetting;
}) {
    const { data, setData, post, processing } = useForm({
        type: "cta",
        cta_enabled: settings.cta_enabled ?? true,
        cta_title: settings.cta_title || "",
        cta_description: settings.cta_description || "",
        cta_browse_text: settings.cta_browse_text || "",
        cta_browse_link: settings.cta_browse_link || "",
        cta_contact_text: settings.cta_contact_text || "",
        cta_contact_link: settings.cta_contact_link || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit}>
            <Card>
                <CardHeader>
                    <CardTitle>Home CTA Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                        <input
                            type="checkbox"
                            checked={data.cta_enabled}
                            onChange={(e) =>
                                setData("cta_enabled", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-600 bg-[#0E1614] text-[#2DE3A7] focus:ring-[#2DE3A7]"
                        />
                        Enable animated CTA on home page
                    </label>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs text-gray-400">
                                CTA Title
                            </label>
                            <input
                                type="text"
                                value={data.cta_title}
                                onChange={(e) =>
                                    setData("cta_title", e.target.value)
                                }
                                placeholder="Ready to Discover Something Exceptional?"
                                className="w-full rounded-lg border border-gray-700 bg-[#0E1614] px-3 py-2 text-sm text-white focus:border-[#2DE3A7] focus:outline-none"
                            />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs text-gray-400">
                                CTA Description
                            </label>
                            <textarea
                                rows={3}
                                value={data.cta_description}
                                onChange={(e) =>
                                    setData("cta_description", e.target.value)
                                }
                                placeholder="Short supporting text for your CTA section."
                                className="w-full resize-none rounded-lg border border-gray-700 bg-[#0E1614] px-3 py-2 text-sm text-white focus:border-[#2DE3A7] focus:outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">
                                Browse Button Text
                            </label>
                            <input
                                type="text"
                                value={data.cta_browse_text}
                                onChange={(e) =>
                                    setData("cta_browse_text", e.target.value)
                                }
                                placeholder="Browse Our Products"
                                className="w-full rounded-lg border border-gray-700 bg-[#0E1614] px-3 py-2 text-sm text-white focus:border-[#2DE3A7] focus:outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">
                                Browse Button Link
                            </label>
                            <input
                                type="text"
                                value={data.cta_browse_link}
                                onChange={(e) =>
                                    setData("cta_browse_link", e.target.value)
                                }
                                placeholder="/products"
                                className="w-full rounded-lg border border-gray-700 bg-[#0E1614] px-3 py-2 text-sm text-white focus:border-[#2DE3A7] focus:outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">
                                Contact Button Text
                            </label>
                            <input
                                type="text"
                                value={data.cta_contact_text}
                                onChange={(e) =>
                                    setData("cta_contact_text", e.target.value)
                                }
                                placeholder="Contact Us"
                                className="w-full rounded-lg border border-gray-700 bg-[#0E1614] px-3 py-2 text-sm text-white focus:border-[#2DE3A7] focus:outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">
                                Contact Button Link
                            </label>
                            <input
                                type="text"
                                value={data.cta_contact_link}
                                onChange={(e) =>
                                    setData("cta_contact_link", e.target.value)
                                }
                                placeholder="/contact-us"
                                className="w-full rounded-lg border border-gray-700 bg-[#0E1614] px-3 py-2 text-sm text-white focus:border-[#2DE3A7] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-[#2DE3A7] px-6 py-2 font-semibold text-black transition-colors hover:bg-[#26c28f] disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save CTA Settings"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
