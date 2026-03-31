import React from "react";
import { useForm } from "@inertiajs/react";
import { Plus, Trash2 } from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import { WebsiteSetting } from "../types";

export default function AboutSettingsForm({ settings }: { settings: WebsiteSetting }) {
    const { data, setData, post, processing } = useForm({
        type: "about",
        about_stats: settings.about_stats || [],
        about_testimonials: settings.about_testimonials || [],
    });

    // Stats helpers
    const addStat = () => setData("about_stats", [...data.about_stats, { value: "", label: "" }]);
    const removeStat = (i: number) => setData("about_stats", data.about_stats.filter((_, idx) => idx !== i));
    const updateStat = (i: number, key: "value" | "label", val: string) => {
        const s = [...data.about_stats];
        s[i] = { ...s[i], [key]: val };
        setData("about_stats", s);
    };

    // Testimonials helpers
    const addTestimonial = () =>
        setData("about_testimonials", [
            ...data.about_testimonials,
            { name: "", role: "", quote: "", rating: 5 },
        ]);
    const removeTestimonial = (i: number) =>
        setData("about_testimonials", data.about_testimonials.filter((_, idx) => idx !== i));
    const updateTestimonial = (i: number, key: string, val: string | number) => {
        const t = [...data.about_testimonials];
        t[i] = { ...t[i], [key]: val };
        setData("about_testimonials", t as any);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit}>
            <Card>
                <CardHeader>
                    <CardTitle>About Page Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    {/* Stats */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-300">Stats</h3>
                            <button
                                type="button"
                                onClick={addStat}
                                className="bg-[#151F1D] border border-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-[#1A2624] hover:border-[#2DE3A7] transition-all flex items-center gap-2 text-sm"
                            >
                                <Plus size={14} /> Add Stat
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {data.about_stats.map((stat, i) => (
                                <div key={i} className="bg-[#151F1D] border border-gray-800 rounded-lg p-3 space-y-2">
                                    <input
                                        type="text"
                                        placeholder="10K+"
                                        value={stat.value}
                                        onChange={(e) => updateStat(i, "value", e.target.value)}
                                        className="w-full bg-[#0E1614] border border-gray-700 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Happy Customers"
                                        value={stat.label}
                                        onChange={(e) => updateStat(i, "label", e.target.value)}
                                        className="w-full bg-[#0E1614] border border-gray-700 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeStat(i)}
                                        className="w-full flex items-center justify-center gap-1 text-red-400 hover:bg-red-900/20 rounded py-1 text-xs transition-colors"
                                    >
                                        <Trash2 size={12} /> Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonials */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-300">Testimonials</h3>
                            <button
                                type="button"
                                onClick={addTestimonial}
                                className="bg-[#151F1D] border border-gray-700 text-white px-3 py-1.5 rounded-lg hover:bg-[#1A2624] hover:border-[#2DE3A7] transition-all flex items-center gap-2 text-sm"
                            >
                                <Plus size={14} /> Add Testimonial
                            </button>
                        </div>
                        <div className="space-y-3">
                            {data.about_testimonials.map((t, i) => (
                                <div
                                    key={i}
                                    className="bg-[#151F1D] border border-gray-800 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3"
                                >
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Name</label>
                                        <input
                                            type="text"
                                            placeholder="Customer Name"
                                            value={t.name}
                                            onChange={(e) => updateTestimonial(i, "name", e.target.value)}
                                            className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Role</label>
                                        <input
                                            type="text"
                                            placeholder="Regular Customer"
                                            value={t.role}
                                            onChange={(e) => updateTestimonial(i, "role", e.target.value)}
                                            className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                        />
                                    </div>
                                    <div className="space-y-1 md:col-span-2">
                                        <label className="text-xs text-gray-500">Quote</label>
                                        <textarea
                                            value={t.quote}
                                            rows={2}
                                            onChange={(e) => updateTestimonial(i, "quote", e.target.value)}
                                            placeholder="Customer feedback..."
                                            className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7] resize-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs text-gray-500">Rating (1–5)</label>
                                        <select
                                            value={t.rating}
                                            onChange={(e) => updateTestimonial(i, "rating", parseInt(e.target.value))}
                                            className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                        >
                                            {[5, 4, 3, 2, 1].map((n) => (
                                                <option key={n} value={n}>
                                                    {n} Stars
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            onClick={() => removeTestimonial(i)}
                                            className="flex items-center gap-1.5 text-red-400 hover:bg-red-900/20 px-3 py-2 rounded-lg text-sm transition-colors"
                                        >
                                            <Trash2 size={14} /> Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {data.about_testimonials.length === 0 && (
                                <p className="text-center text-gray-500 py-4 text-sm">No testimonials yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#2DE3A7] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#26c28f] transition-colors disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save About Settings"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
