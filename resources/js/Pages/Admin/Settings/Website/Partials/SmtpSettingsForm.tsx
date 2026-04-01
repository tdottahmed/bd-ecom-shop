import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Eye, EyeOff } from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import { WebsiteSetting } from "../types";

export default function SmtpSettingsForm({
    settings,
}: {
    settings: WebsiteSetting;
}) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        type: "smtp",
        smtp_host: settings.smtp_host ?? "",
        smtp_port: settings.smtp_port ?? "587",
        smtp_username: settings.smtp_username ?? "",
        smtp_password: settings.smtp_password ?? "",
        smtp_encryption: settings.smtp_encryption ?? "tls",
        smtp_from_address: settings.smtp_from_address ?? "",
        smtp_from_name: settings.smtp_from_name ?? "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), { preserveScroll: true });
    };

    const inputClass =
        "w-full rounded-lg bg-[#0E1614] border border-[#1E3330] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]/30 transition-colors";
    const labelClass = "block text-xs font-medium text-gray-400 mb-1";

    return (
        <form onSubmit={submit}>
            <Card>
                <CardHeader>
                    <CardTitle>SMTP / Mail Settings</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                        Override the default mail credentials from <code className="text-gray-400">.env</code>.
                        Leave all fields empty to use environment defaults.
                        Required for sending welcome emails on account creation.
                    </p>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* Row 1: Host + Port */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <label className={labelClass}>SMTP Host</label>
                            <input
                                type="text"
                                value={data.smtp_host}
                                onChange={(e) => setData("smtp_host", e.target.value)}
                                placeholder="smtp.example.com"
                                className={inputClass}
                            />
                            {errors.smtp_host && <p className="text-xs text-red-400 mt-1">{errors.smtp_host}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Port</label>
                            <input
                                type="number"
                                value={data.smtp_port}
                                onChange={(e) => setData("smtp_port", e.target.value)}
                                placeholder="587"
                                className={inputClass}
                            />
                            {errors.smtp_port && <p className="text-xs text-red-400 mt-1">{errors.smtp_port}</p>}
                        </div>
                    </div>

                    {/* Row 2: Username + Encryption */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                            <label className={labelClass}>Username / Email</label>
                            <input
                                type="text"
                                value={data.smtp_username}
                                onChange={(e) => setData("smtp_username", e.target.value)}
                                placeholder="you@example.com"
                                autoComplete="off"
                                className={inputClass}
                            />
                            {errors.smtp_username && <p className="text-xs text-red-400 mt-1">{errors.smtp_username}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Encryption</label>
                            <select
                                value={data.smtp_encryption}
                                onChange={(e) => setData("smtp_encryption", e.target.value)}
                                className={inputClass}
                            >
                                <option value="tls">TLS (recommended)</option>
                                <option value="ssl">SSL</option>
                                <option value="starttls">STARTTLS</option>
                                <option value="">None</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 3: Password */}
                    <div>
                        <label className={labelClass}>Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={data.smtp_password}
                                onChange={(e) => setData("smtp_password", e.target.value)}
                                placeholder="••••••••••••"
                                autoComplete="new-password"
                                className={inputClass + " pr-10"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-300 transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>
                        {errors.smtp_password && <p className="text-xs text-red-400 mt-1">{errors.smtp_password}</p>}
                    </div>

                    {/* Row 4: From Address + From Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>From Address</label>
                            <input
                                type="email"
                                value={data.smtp_from_address}
                                onChange={(e) => setData("smtp_from_address", e.target.value)}
                                placeholder="no-reply@yourstore.com"
                                className={inputClass}
                            />
                            {errors.smtp_from_address && <p className="text-xs text-red-400 mt-1">{errors.smtp_from_address}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>From Name</label>
                            <input
                                type="text"
                                value={data.smtp_from_name}
                                onChange={(e) => setData("smtp_from_name", e.target.value)}
                                placeholder="Your Store Name"
                                className={inputClass}
                            />
                            {errors.smtp_from_name && <p className="text-xs text-red-400 mt-1">{errors.smtp_from_name}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-[#2DE3A7] px-6 py-2 font-semibold text-black transition-colors hover:bg-[#26c28f] disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save SMTP Settings"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
