import React, { useEffect, useMemo } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import InputError from "@/Components/Ui/InputError";
import Checkbox from "@/Components/Ui/Checkbox";
import RichTextEditor from "@/Components/Ui/RichTextEditor";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, ListChecks, Save, Sparkles } from "lucide-react";

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

type BlockTemplate = {
    key: string;
    label: string;
    description: string;
    html: string;
};

const BUILDER_BLOCKS: BlockTemplate[] = [
    {
        key: "section_heading",
        label: "Section heading",
        description: "Add a clean heading block",
        html: "<h2>Section title</h2><p>Write details for this section.</p>",
    },
    {
        key: "bullet_list",
        label: "Bullet points",
        description: "Great for rights, obligations, rules",
        html: "<h3>Key points</h3><ul><li>First point</li><li>Second point</li><li>Third point</li></ul>",
    },
    {
        key: "contact_block",
        label: "Contact block",
        description: "Support/contact info snippet",
        html: "<h3>Contact us</h3><p>If you have any questions, contact us at support@example.com.</p>",
    },
    {
        key: "effective_date",
        label: "Effective date",
        description: "Adds legal effective date line",
        html: `<p><strong>Effective date:</strong> ${new Date().toISOString().slice(0, 10)}</p>`,
    },
    {
        key: "table",
        label: "Simple table",
        description: "Use for policy mapping",
        html: "<table><thead><tr><th>Item</th><th>Details</th></tr></thead><tbody><tr><td>Example</td><td>Add your details</td></tr></tbody></table>",
    },
    {
        key: "divider",
        label: "Divider",
        description: "Visual separation",
        html: "<hr /><p>&nbsp;</p>",
    },
];

const LEGAL_PRESETS: Record<string, string> = {
    "privacy-policy": `
            <h1>Privacy Policy</h1>
            <p>We value your privacy and explain here how we collect, use, and protect your personal data.</p>
            <h2>Information we collect</h2>
            <ul>
            <li>Account details (name, phone, email)</li>
            <li>Order and delivery information</li>
            <li>Device/browser analytics for security and performance</li>
            </ul>
            <h2>How we use your information</h2>
            <ul>
            <li>To process and deliver orders</li>
            <li>To provide customer support</li>
            <li>To improve our service and prevent fraud</li>
            </ul>
            <h2>Data sharing</h2>
            <p>We only share data with trusted payment, courier, and technical providers required to operate the store.</p>
            <h2>Your rights</h2>
            <p>You may request access, correction, or deletion of your personal data by contacting support.</p>
            <p><strong>Effective date:</strong> ${new Date().toISOString().slice(0, 10)}</p>
            `.trim(),
    "terms-conditions": `
            <h1>Terms & Conditions</h1>
            <p>These terms govern your access to and use of our website and services.</p>
            <h2>Orders and payments</h2>
            <ul>
            <li>All orders are subject to availability and confirmation.</li>
            <li>Prices and promotions may change without prior notice.</li>
            <li>Payment must be completed through approved payment methods.</li>
            </ul>
            <h2>Shipping and delivery</h2>
            <p>Estimated delivery windows are indicative and may vary due to courier operations.</p>
            <h2>Returns and refunds</h2>
            <p>Please review our Refund Policy for return eligibility and refund timelines.</p>
            <h2>Limitation of liability</h2>
            <p>We are not liable for indirect or consequential losses arising from service interruption or third-party issues.</p>
            <p><strong>Effective date:</strong> ${new Date().toISOString().slice(0, 10)}</p>
            `.trim(),
    "refund-policy": `
            <h1>Refund Policy</h1>
            <p>We aim to keep our return and refund process simple and fair.</p>
            <h2>Eligibility</h2>
            <ul>
            <li>Item is damaged, defective, or incorrect</li>
            <li>Return request is submitted within the allowed period</li>
            <li>Product is in original condition where applicable</li>
            </ul>
            <h2>How to request a return</h2>
            <ol>
            <li>Contact support with your order number and issue details.</li>
            <li>Our team verifies the request and provides next steps.</li>
            <li>Approved refunds are processed through the original payment method.</li>
            </ol>
            <h2>Refund timeline</h2>
            <p>Refund processing typically takes 3-10 business days after approval.</p>
            <p><strong>Effective date:</strong> ${new Date().toISOString().slice(0, 10)}</p>
            `.trim(),
};

export default function LegalPageForm({ page }: Props) {
    const { data, setData, put, processing, errors, reset } = useForm({
        content: page.content ?? "",
        is_published: page.is_published,
        show_in_header: page.show_in_header ?? false,
        show_in_footer: page.show_in_footer ?? false,
    });

    const checklist = useMemo(() => {
        const c = (data.content || "").toLowerCase();
        return [
            { label: "Has clear title", done: c.includes("<h1") },
            {
                label: "Includes contact/support section",
                done: c.includes("contact") || c.includes("support"),
            },
            {
                label: "Includes effective date",
                done: c.includes("effective date"),
            },
            {
                label: "Has at least one detailed section",
                done: c.includes("<h2") || c.includes("<h3"),
            },
        ];
    }, [data.content]);

    const appendBlock = (html: string) => {
        const current = data.content ? String(data.content).trim() : "";
        const next = current ? `${current}\n\n${html}` : html;
        setData("content", next);
    };

    const applyPreset = () => {
        const preset = LEGAL_PRESETS[page.slug];
        if (!preset) return;
        const ok = confirm(
            "Replace editor content with a starter template? Your current text will be overwritten.",
        );
        if (!ok) return;
        setData("content", preset);
    };

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
            head={<Header title={`Edit — ${page.title}`} showUserMenu={true} />}
        >
            <Head title={`Edit — ${page.title}`} />

            <div className="p-4 md:p-6 space-y-6 max-w-8xl mx-auto">
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
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-[#2DE3A7] flex items-center gap-2">
                                    <Sparkles size={18} />
                                    Content Builder
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                    Add ready-to-use legal blocks, then
                                    fine-tune in the editor.
                                </p>
                            </div>
                            {LEGAL_PRESETS[page.slug] && (
                                <button
                                    type="button"
                                    onClick={applyPreset}
                                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-[#0F1A18] text-[#2DE3A7] border border-[#1E2826] hover:bg-[#15211E] transition-colors"
                                >
                                    Use starter template
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                            {BUILDER_BLOCKS.map((block) => (
                                <button
                                    key={block.key}
                                    type="button"
                                    onClick={() => appendBlock(block.html)}
                                    className="text-left p-3 rounded-lg border border-[#1E2826] bg-[#0F1A18] hover:bg-[#15211E] transition-colors"
                                >
                                    <div className="text-sm font-semibold text-white">
                                        {block.label}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        {block.description}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-[#2DE3A7]">
                                {page.title}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                URL: /{page.slug} &nbsp;·&nbsp; Slug is fixed
                                and cannot be changed.
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

                        <div className="mt-4 rounded-lg border border-[#1E2826] bg-[#0F1A18] p-4">
                            <div className="text-sm text-white font-semibold flex items-center gap-2">
                                <ListChecks
                                    size={16}
                                    className="text-[#2DE3A7]"
                                />
                                Quality Checklist
                            </div>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                                {checklist.map((item) => (
                                    <div
                                        key={item.label}
                                        className={`text-xs px-2.5 py-2 rounded border ${
                                            item.done
                                                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                                                : "bg-gray-500/10 text-gray-300 border-gray-500/30"
                                        }`}
                                    >
                                        {item.done ? "✓ " : "• "}
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <label className="flex items-center gap-3 text-sm text-gray-300">
                                <Checkbox
                                    name="is_published"
                                    checked={!!data.is_published}
                                    onChange={(e) =>
                                        setData(
                                            "is_published",
                                            e.target.checked,
                                        )
                                    }
                                />
                                Published
                            </label>
                            <label className="flex items-center gap-3 text-sm text-gray-300">
                                <Checkbox
                                    name="show_in_header"
                                    checked={!!data.show_in_header}
                                    onChange={(e) =>
                                        setData(
                                            "show_in_header",
                                            e.target.checked,
                                        )
                                    }
                                />
                                Show in header menu
                            </label>
                            <label className="flex items-center gap-3 text-sm text-gray-300">
                                <Checkbox
                                    name="show_in_footer"
                                    checked={!!data.show_in_footer}
                                    onChange={(e) =>
                                        setData(
                                            "show_in_footer",
                                            e.target.checked,
                                        )
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
