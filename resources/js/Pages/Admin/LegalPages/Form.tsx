import React, { useEffect } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import InputError from "@/Components/Ui/InputError";
import Checkbox from "@/Components/Ui/Checkbox";
import RichTextEditor from "@/Components/Ui/RichTextEditor";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, Save } from "lucide-react";

type LegalPage = {
    id: number;
    title: string;
    slug: string;
    content?: string | null;
    is_published: boolean;
    show_in_header?: boolean;
    show_in_footer?: boolean;
};

interface Props {
    page: LegalPage;
}

export default function LegalPageForm({ page }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        content:      page.content ?? "",
        is_published: page.is_published,
        show_in_header: page.show_in_header ?? false,
        show_in_footer: page.show_in_footer ?? false,
    });

    useEffect(() => {
        return () => reset();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route("admin.legal-pages.update", page.id), {
            preserveScroll: true,
        });
    };

    return (
        <Master
            title={`Edit — ${page.title}`}
            head={
                <Header
                    title={`Edit — ${page.title}`}
                    showUserMenu={true}
                />
            }
        >
            <Head title={`Edit — ${page.title}`} />

            <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-3">
                    <Link
                        href={route("admin.legal-pages.index")}
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-white"
                    >
                        <ArrowLeft size={18} />
                        Legal Pages
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-[#2DE3A7]">
                                {page.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                URL: /{page.slug} &nbsp;·&nbsp; Slug is fixed and cannot be changed.
                            </p>
                        </div>

                        <div>
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
                            <InputError
                                message={errors.content as any}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label className="flex items-center gap-3 text-sm text-gray-300">
                                <Checkbox
                                    name="is_published"
                                    checked={!!data.is_published}
                                    onChange={(e) =>
                                        setData("is_published", e.target.checked)
                                    }
                                />
                                Published
                            </label>
                            <label className="flex items-center gap-3 text-sm text-gray-300">
                                <Checkbox
                                    name="show_in_header"
                                    checked={!!data.show_in_header}
                                    onChange={(e) =>
                                        setData("show_in_header", e.target.checked)
                                    }
                                />
                                Show in header menu
                            </label>
                            <label className="flex items-center gap-3 text-sm text-gray-300">
                                <Checkbox
                                    name="show_in_footer"
                                    checked={!!data.show_in_footer}
                                    onChange={(e) =>
                                        setData("show_in_footer", e.target.checked)
                                    }
                                />
                                Show in footer links
                            </label>
                        </div>
                    </Card>

                    <div className="flex justify-end">
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
