import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Card from "@/Components/Ui/Card";
import Checkbox from "@/Components/Ui/Checkbox";
import InputError from "@/Components/Ui/InputError";
import RichTextEditor from "@/Components/Ui/RichTextEditor";
import TextInput from "@/Components/Ui/TextInput";
import Master from "@/Layouts/Master";
import { BlogPost } from "@/types";
import { Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";
import { FormEvent } from "react";
import { getAssetUrl } from "@/Utils/helpers";

interface Props {
    post: BlogPost | null;
}

export default function BlogForm({ post }: Props) {
    const isEdit = Boolean(post?.id);

    const {
        data,
        setData,
        post: submitPost,
        put,
        processing,
        errors,
    } = useForm({
        title: post?.title ?? "",
        slug: post?.slug ?? "",
        excerpt: post?.excerpt ?? "",
        content: post?.content ?? "",
        is_published: Boolean(post?.is_published ?? false),
        cover_image: null as File | null,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route("admin.blogs.update", post!.id), {
                forceFormData: true,
                preserveScroll: true,
            });
        } else {
            submitPost(route("admin.blogs.store"), {
                forceFormData: true,
                preserveScroll: true,
            });
        }
    };

    return (
        <Master title={isEdit ? "Edit Blog Post" : "Create Blog Post"}>
            <div className="mx-auto max-w-8xl space-y-6 p-4 md:p-6">
                <Link
                    href={route("admin.blogs.index")}
                    className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"
                >
                    <ArrowLeft size={16} />
                    Back to blog list
                </Link>

                <form
                    onSubmit={submit}
                    className="grid grid-cols-1 gap-6 xl:grid-cols-3"
                >
                    <div className="space-y-6 xl:col-span-2">
                        <Card className="space-y-5">
                            <h2 className="text-lg font-semibold text-[#2DE3A7]">
                                Post details
                            </h2>
                            <div>
                                <label className="mb-2 block text-sm text-gray-300">
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
                                <InputError message={errors.title as any} />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-gray-300">
                                    Slug (optional)
                                </label>
                                <TextInput
                                    id="slug"
                                    name="slug"
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData("slug", e.target.value)
                                    }
                                    className="w-full"
                                    placeholder="luxury-lifestyle-tips"
                                />
                                <InputError message={errors.slug as any} />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-gray-300">
                                    Excerpt
                                </label>
                                <textarea
                                    value={data.excerpt}
                                    onChange={(e) =>
                                        setData("excerpt", e.target.value)
                                    }
                                    rows={4}
                                    maxLength={500}
                                    className="w-full rounded-lg border border-[#1E2826] bg-[#0C1311] p-3 text-sm text-white outline-none ring-[#2DE3A7]/50 focus:ring"
                                    placeholder="Short summary shown on blog listing cards..."
                                />
                                <InputError message={errors.excerpt as any} />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm text-gray-300">
                                    Content
                                </label>
                                <RichTextEditor
                                    value={data.content}
                                    onChange={(v) => setData("content", v)}
                                />
                                <InputError message={errors.content as any} />
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="space-y-4">
                            <h3 className="text-base font-semibold text-[#2DE3A7]">
                                Publish
                            </h3>
                            <label className="flex items-center gap-3 text-sm text-gray-300">
                                <Checkbox
                                    name="is_published"
                                    checked={data.is_published}
                                    onChange={(e) =>
                                        setData(
                                            "is_published",
                                            e.target.checked,
                                        )
                                    }
                                />
                                Publish now
                            </label>
                        </Card>

                        <Card className="space-y-4">
                            <h3 className="text-base font-semibold text-[#2DE3A7]">
                                Cover image
                            </h3>
                            {post?.cover_image && (
                                <img
                                    src={getAssetUrl(post.cover_image)}
                                    alt=""
                                    className="h-40 w-full rounded-lg object-cover"
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        "cover_image",
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                                className="w-full rounded-lg border border-[#1E2826] bg-[#0C1311] p-2 text-sm text-gray-300"
                            />
                            <InputError message={errors.cover_image as any} />
                        </Card>

                        <PrimaryButton
                            type="submit"
                            disabled={processing}
                            className="w-full justify-center gap-2"
                        >
                            <Save size={16} />
                            {processing ? "Saving..." : "Save post"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Master>
    );
}
