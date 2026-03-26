import React, { useEffect } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import InputError from "@/Components/Ui/InputError";
import TextInput from "@/Components/Ui/TextInput";
import Checkbox from "@/Components/Ui/Checkbox";
import RichTextEditor from "@/Components/Ui/RichTextEditor";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

type Page = {
    id: number;
    title: string;
    slug: string;
    content?: string | null;
    is_published: boolean;
};

interface Props {
    page: Page | null;
}

export default function PageForm({ page }: Props) {
    const isEdit = !!page?.id;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: page?.title ?? "",
        slug: page?.slug ?? "",
        content: page?.content ?? "",
        is_published: page?.is_published ?? true,
    });

    useEffect(() => {
        return () => reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEdit) {
            put(route("admin.pages.update", page!.id), {
                preserveScroll: true,
            });
        } else {
            post(route("admin.pages.store"), {
                preserveScroll: true,
            });
        }
    };

    return (
        <Master
            title={isEdit ? "Edit Page" : "Add Page"}
            head={
                <Header
                    title={isEdit ? "Edit Page" : "Add Page"}
                    showUserMenu={true}
                />
            }
        >
            <Head title={isEdit ? "Edit Page" : "Add Page"} />

            <div className="p-4 md:p-6 space-y-6 max-w-8xl mx-auto">
                <div className="flex items-center justify-between gap-3">
                    <Link
                        href={route("admin.pages.index")}
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-white"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <h3 className="text-lg font-semibold text-[#2DE3A7] mb-4">
                            Page details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm text-gray-300 block mb-2">
                                    Title
                                </label>
                                <TextInput
                                    id="title"
                                    name="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className="w-full"
                                />
                                <InputError
                                    message={errors.title as any}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-300 block mb-2">
                                    Slug
                                </label>
                                <TextInput
                                    id="slug"
                                    name="slug"
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData("slug", e.target.value)
                                    }
                                    className="w-full"
                                    placeholder="about-us"
                                />
                                <InputError
                                    message={errors.slug as any}
                                    className="mt-2"
                                />
                                <div className="text-xs text-gray-500 mt-2">
                                    Use URL-safe format like <b>about-us</b>.
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="text-sm text-gray-300 block mb-2">
                                Content
                            </label>
                            <div className="rounded-lg border border-[#1E2826] overflow-hidden">
                                <RichTextEditor
                                    value={data.content}
                                    onChange={(value) =>
                                        setData("content", value)
                                    }
                                />
                            </div>
                            <div className="text-xs text-gray-500 mt-2">
                                Tip: You can paste formatted text, add links,
                                lists, and headings.
                            </div>
                            <InputError
                                message={errors.content as any}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                            <Checkbox
                                name="is_published"
                                checked={!!data.is_published}
                                onChange={(e) =>
                                    setData("is_published", e.target.checked)
                                }
                            />
                            <div className="text-sm text-gray-300">
                                Published (visible to customers)
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-2"
                        >
                            <Save size={18} />
                            {processing ? "Saving..." : "Save"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Master>
    );
}
