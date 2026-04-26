import React, { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Check, Copy, Terminal } from "lucide-react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import { WebsiteSetting } from "../types";

const CRON_PRESETS = [
    { label: "Every Hour",       value: "0 * * * *"   },
    { label: "Every 6 Hours",    value: "0 */6 * * *" },
    { label: "Daily (midnight)", value: "0 0 * * *"   },
    { label: "Daily (6 AM)",     value: "0 6 * * *"   },
    { label: "Weekly (Sun midnight)", value: "0 0 * * 0" },
    { label: "Custom",           value: "__custom__"  },
] as const;

function CopyBlock({ label, value }: { label: string; value: string }) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div>
            <p className="text-xs font-medium text-gray-400 mb-1.5">{label}</p>
            <div className="flex items-center gap-2 rounded-lg bg-[#060E0C] border border-[#1E3330] px-3 py-2.5">
                <Terminal size={13} className="text-[#2DE3A7] flex-shrink-0" />
                <code className="flex-1 text-xs text-gray-300 font-mono break-all select-all">
                    {value}
                </code>
                <button
                    type="button"
                    onClick={copy}
                    className="flex-shrink-0 text-gray-500 hover:text-[#2DE3A7] transition-colors"
                    title="Copy"
                >
                    {copied ? <Check size={13} className="text-[#2DE3A7]" /> : <Copy size={13} />}
                </button>
            </div>
        </div>
    );
}

export default function SchedulerSettingsForm({
    settings,
}: {
    settings: WebsiteSetting;
}) {
    const currentCron = settings.scheduled_product_update_cron ?? "0 0 * * *";
    const isPreset = CRON_PRESETS.slice(0, -1).some((p) => p.value === currentCron);

    const [presetValue, setPresetValue] = useState<string>(
        isPreset ? currentCron : "__custom__"
    );

    const { data, setData, post, processing, errors } = useForm({
        type: "scheduler",
        additional_cost: String(settings.additional_cost ?? "0"),
        scheduled_product_update_enabled:
            settings.scheduled_product_update_enabled ?? false,
        scheduled_product_update_cron: currentCron,
    });

    const handlePresetChange = (val: string) => {
        setPresetValue(val);
        if (val !== "__custom__") {
            setData("scheduled_product_update_cron", val);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), { preserveScroll: true });
    };

    const inputClass =
        "w-full rounded-lg bg-[#0E1614] border border-[#1E3330] px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#2DE3A7] focus:ring-1 focus:ring-[#2DE3A7]/30 transition-colors";
    const labelClass = "block text-xs font-medium text-gray-400 mb-1";

    return (
        <form onSubmit={submit} className="space-y-5">
            {/* Server Setup — informational */}
            <Card>
                <CardHeader>
                    <CardTitle>Server Setup</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                        Add these commands to your server to enable the Laravel scheduler and queue worker.
                        Replace <code className="text-gray-400">/path/to/project</code> with your actual project root.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <CopyBlock
                        label="Laravel Scheduler (add to server crontab)"
                        value="* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1"
                    />
                    <CopyBlock
                        label="Queue Worker (run as a persistent process / supervisor)"
                        value="php artisan queue:work --queue=mail,default --tries=3 --timeout=60"
                    />
                </CardContent>
            </Card>

            {/* Product Auto-Update */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Auto-Update</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                        Runs <code className="text-gray-400">php artisan update:products</code> on the
                        configured schedule. The additional cost is added to each product's purchase
                        price during the update.
                    </p>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* Additional Cost */}
                    <div>
                        <label className={labelClass}>Additional Cost (added to purchase price)</label>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.additional_cost}
                            onChange={(e) => setData("additional_cost", e.target.value)}
                            placeholder="0"
                            className={inputClass}
                        />
                        {errors.additional_cost && (
                            <p className="text-xs text-red-400 mt-1">{errors.additional_cost}</p>
                        )}
                    </div>

                    {/* Enable toggle */}
                    <label className="inline-flex items-center gap-2 text-sm text-gray-300 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={data.scheduled_product_update_enabled}
                            onChange={(e) =>
                                setData("scheduled_product_update_enabled", e.target.checked)
                            }
                            className="h-4 w-4 rounded border-gray-600 bg-[#0E1614] text-[#2DE3A7] focus:ring-[#2DE3A7]"
                        />
                        Enable automatic scheduled product update
                    </label>

                    {/* Cron schedule — only shown when enabled */}
                    {data.scheduled_product_update_enabled && (
                        <div className="space-y-3 pl-6 border-l border-[#1E3330]">
                            <div>
                                <label className={labelClass}>Frequency</label>
                                <select
                                    value={presetValue}
                                    onChange={(e) => handlePresetChange(e.target.value)}
                                    className={inputClass}
                                >
                                    {CRON_PRESETS.map((p) => (
                                        <option key={p.value} value={p.value}>
                                            {p.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {presetValue === "__custom__" && (
                                <div>
                                    <label className={labelClass}>
                                        Custom Cron Expression
                                    </label>
                                    <input
                                        type="text"
                                        value={data.scheduled_product_update_cron}
                                        onChange={(e) =>
                                            setData(
                                                "scheduled_product_update_cron",
                                                e.target.value
                                            )
                                        }
                                        placeholder="0 0 * * *"
                                        className={inputClass + " font-mono"}
                                    />
                                    {errors.scheduled_product_update_cron && (
                                        <p className="text-xs text-red-400 mt-1">
                                            {errors.scheduled_product_update_cron}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="rounded-lg bg-[#060E0C] border border-[#1E3330] px-3 py-2.5 flex items-center gap-2">
                                <Terminal size={13} className="text-[#2DE3A7] flex-shrink-0" />
                                <code className="text-xs text-gray-400 font-mono">
                                    {data.scheduled_product_update_cron || "0 0 * * *"} &nbsp;
                                    php artisan update:products
                                </code>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-[#2DE3A7] px-6 py-2 font-semibold text-black transition-colors hover:bg-[#26c28f] disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Scheduler Settings"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
