import React from "react";
import { useForm } from "@inertiajs/react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import { WebsiteSetting } from "../types";

export default function BlogSettingsForm({
    settings,
}: {
    settings: WebsiteSetting;
}) {
    const { data, setData, post, processing } = useForm({
        type: "blog",
        blog_enabled: settings.blog_enabled ?? true,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit}>
            <Card>
                <CardHeader>
                    <CardTitle>Blog Visibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <label className="inline-flex items-center gap-2 text-sm text-gray-300">
                        <input
                            type="checkbox"
                            checked={data.blog_enabled}
                            onChange={(e) =>
                                setData("blog_enabled", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-600 bg-[#0E1614] text-[#2DE3A7] focus:ring-[#2DE3A7]"
                        />
                        Enable blog pages in storefront navigation
                    </label>
                    <p className="text-xs text-gray-400">
                        When disabled, Blog is hidden from header/footer and public
                        blog URLs return 404.
                    </p>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-[#2DE3A7] px-6 py-2 font-semibold text-black transition-colors hover:bg-[#26c28f] disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Blog Settings"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

