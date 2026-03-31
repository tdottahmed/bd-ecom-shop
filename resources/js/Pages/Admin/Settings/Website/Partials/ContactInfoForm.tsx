import React from "react";
import { useForm } from "@inertiajs/react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import { WebsiteSetting } from "../types";

export default function ContactInfoForm({ settings }: { settings: WebsiteSetting }) {
    const { data, setData, post, processing } = useForm({
        type: "contact",
        contact_address: settings.contact_address || "",
        contact_phone: settings.contact_phone || "",
        contact_email: settings.contact_email || "",
        contact_hours: settings.contact_hours || "",
        contact_map_embed: settings.contact_map_embed || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit}>
            <Card>
                <CardHeader>
                    <CardTitle>Contact Page Info</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { key: "contact_phone", label: "Phone Number", placeholder: "+60 3 1234 5678" },
                            { key: "contact_email", label: "Email Address", placeholder: "support@example.com" },
                            { key: "contact_hours", label: "Business Hours", placeholder: "Mon–Fri: 9am–6pm" },
                        ].map(({ key, label, placeholder }) => (
                            <div key={key} className="space-y-1">
                                <label className="text-xs text-gray-400">{label}</label>
                                <input
                                    type="text"
                                    value={(data as any)[key]}
                                    onChange={(e) => setData(key as any, e.target.value)}
                                    placeholder={placeholder}
                                    className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                                />
                            </div>
                        ))}
                        <div className="space-y-1">
                            <label className="text-xs text-gray-400">Address</label>
                            <textarea
                                value={data.contact_address}
                                onChange={(e) => setData("contact_address", e.target.value)}
                                rows={2}
                                placeholder="Full address"
                                className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7] resize-none"
                            />
                        </div>
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs text-gray-400">Google Maps Embed URL</label>
                            <input
                                type="text"
                                value={data.contact_map_embed}
                                onChange={(e) => setData("contact_map_embed", e.target.value)}
                                placeholder="https://www.google.com/maps/embed?pb=..."
                                className="w-full bg-[#0E1614] border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2DE3A7]"
                            />
                            <p className="text-xs text-gray-600">Paste the src URL from a Google Maps embed iframe.</p>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#2DE3A7] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#26c28f] transition-colors disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Contact Info"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
