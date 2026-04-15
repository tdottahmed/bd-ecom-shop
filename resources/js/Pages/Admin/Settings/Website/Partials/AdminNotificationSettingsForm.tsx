import React from "react";
import { useForm } from "@inertiajs/react";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import { WebsiteSetting } from "../types";

export default function AdminNotificationSettingsForm({
    settings,
}: {
    settings: WebsiteSetting;
}) {
    const { data, setData, post, processing, errors } = useForm({
        type: "admin_notifications",
        admin_notification_emails: settings.admin_notification_emails ?? "",
        admin_notification_enabled: settings.admin_notification_enabled ?? true,
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
                    <CardTitle>Admin Notifications</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">
                        Control where system notifications (like new orders, contact messages) are sent. 
                        You can disable notifications or specify multiple comma-separated email addresses.
                    </p>
                </CardHeader>
                <CardContent className="space-y-5">
                    {/* Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-300">Enable Admin Notifications</p>
                            <p className="text-xs text-gray-500">
                                Send emails to admins for important store events.
                            </p>
                        </div>
                        <input
                            type="checkbox"
                            checked={data.admin_notification_enabled}
                            onChange={(e) =>
                                setData("admin_notification_enabled", e.target.checked)
                            }
                            className="rounded border-[#1E3330] bg-[#0E1614] text-[#2DE3A7] focus:ring-[#2DE3A7] focus:ring-offset-0"
                        />
                    </div>

                    {/* Emails Field */}
                    {data.admin_notification_enabled && (
                        <div>
                            <label className={labelClass}>Notification Emails (comma separated)</label>
                            <textarea
                                value={data.admin_notification_emails}
                                onChange={(e) => setData("admin_notification_emails", e.target.value)}
                                placeholder="admin@example.com, developer@example.com"
                                className={inputClass}
                                rows={3}
                            />
                            {errors.admin_notification_emails && (
                                <p className="text-xs text-red-400 mt-1">{errors.admin_notification_emails}</p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-[#2DE3A7] px-6 py-2 font-semibold text-black transition-colors hover:bg-[#26c28f] disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Configuration"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
