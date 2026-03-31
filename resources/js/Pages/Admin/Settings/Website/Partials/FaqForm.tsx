import React from "react";
import { useForm } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";

import Card, {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/Ui/Card";

interface FAQ {
    question: string;
    answer: string;
}

interface FaqFormProps {
    faqs: FAQ[];
}

export default function FaqForm({ faqs }: FaqFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        type: "faq",
        faqs: faqs || [],
    });

    const addFaq = () => {
        setData("faqs", [...data.faqs, { question: "", answer: "" }]);
    };

    const removeFaq = (index: number) => {
        const newFaqs = [...data.faqs];
        newFaqs.splice(index, 1);
        setData("faqs", newFaqs);
    };

    const updateFaq = (
        index: number,
        key: "question" | "answer",
        value: string,
    ) => {
        const newFaqs = [...data.faqs];
        newFaqs[index][key] = value;
        setData("faqs", newFaqs);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), {
            preserveScroll: true,
        });
    };

    return (
        <form onSubmit={submit}>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Frequently Asked Questions</CardTitle>
                        <button
                            type="button"
                            onClick={addFaq}
                            className="bg-[#151F1D] border border-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-[#1A2624] hover:border-[#2DE3A7] transition-all flex items-center gap-2 text-sm"
                        >
                            <Plus size={16} />
                            Add FAQ
                        </button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {data.faqs.map((faq, index) => (
                            <div
                                key={index}
                                className="flex gap-4 items-start bg-[#151F1D] p-4 rounded-lg border border-gray-800"
                            >
                                <div className="flex-1 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">
                                            Question
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Do you ship internationally?"
                                            value={faq.question}
                                            onChange={(e) =>
                                                updateFaq(
                                                    index,
                                                    "question",
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                            required
                                        />
                                        {(errors as Record<string, string>)[`faqs.${index}.question`] && (
                                            <p className="mt-1 text-sm text-red-400">
                                                {(errors as Record<string, string>)[`faqs.${index}.question`]}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-400">
                                            Answer
                                        </label>
                                        <textarea
                                            value={faq.answer}
                                            onChange={(e) =>
                                                updateFaq(
                                                    index,
                                                    "answer",
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                            className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7] resize-y"
                                            placeholder="e.g. Yes, we ship to over 150 countries..."
                                            required
                                        />
                                        {(errors as Record<string, string>)[`faqs.${index}.answer`] && (
                                            <p className="mt-1 text-sm text-red-400">
                                                {(errors as Record<string, string>)[`faqs.${index}.answer`]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeFaq(index)}
                                    className="mt-6 p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {data.faqs.length === 0 && (
                            <p className="text-center text-gray-500 py-4">
                                No FAQs added yet.
                            </p>
                        )}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#2DE3A7] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#26c28f] transition-colors disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save FAQs"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
