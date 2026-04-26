import React from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";
import Card, { CardContent, CardHeader, CardTitle } from "@/Components/Ui/Card";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { WebsiteSetting } from "../types";
import {
    applyThemeColors,
    DEFAULT_THEME_COLORS,
    THEME_COLOR_KEYS,
    THEME_COLOR_LABELS,
    type ThemeColorKey,
} from "@/Utils/themeColors";

interface ThemeColorsFormProps {
    settings: WebsiteSetting;
}

export default function ThemeColorsForm({ settings }: ThemeColorsFormProps) {
    const initial = { ...DEFAULT_THEME_COLORS, ...settings.theme_colors };

    const { data, setData, post, processing, errors, reset } = useForm({
        type: "theme_colors",
        theme_colors: initial,
    });

    const setColor = (key: ThemeColorKey, value: string) => {
        setData("theme_colors", { ...data.theme_colors, [key]: value });
    };

    const handleResetToDefaults = () => {
        setData("theme_colors", { ...DEFAULT_THEME_COLORS });
        applyThemeColors(DEFAULT_THEME_COLORS);
        toast.message("Colors reset to defaults in the form", {
            description: "Save to apply on the live site.",
        });
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), {
            preserveScroll: true,
            onSuccess: () => {
                applyThemeColors(data.theme_colors);
                toast.success("Theme colors updated");
            },
        });
    };

    return (
        <form onSubmit={submit}>
            <Card>
                <CardHeader>
                    <CardTitle>Storefront theme colors</CardTitle>
                    <p className="text-sm text-gray-400 font-normal mt-1">
                        These tokens power the customer site (buttons, badges,
                        backgrounds). Admin panel styling is unchanged.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                        {THEME_COLOR_KEYS.map((key) => (
                            <div key={key} className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <label
                                        htmlFor={`theme-${key}`}
                                        className="text-sm font-medium text-white"
                                    >
                                        {THEME_COLOR_LABELS[key].label}
                                    </label>
                                    <input
                                        id={`theme-${key}-picker`}
                                        type="color"
                                        value={data.theme_colors[key]}
                                        onChange={(e) =>
                                            setColor(key, e.target.value)
                                        }
                                        className="h-9 w-14 cursor-pointer rounded border border-gray-600 bg-[#0E1614] p-0.5"
                                        aria-label={`Pick ${THEME_COLOR_LABELS[key].label}`}
                                    />
                                </div>
                                <input
                                    id={`theme-${key}`}
                                    type="text"
                                    value={data.theme_colors[key]}
                                    onChange={(e) =>
                                        setColor(key, e.target.value)
                                    }
                                    placeholder={DEFAULT_THEME_COLORS[key]}
                                    className="w-full rounded-lg border border-gray-700 bg-[#0E1614] px-3 py-2 font-mono text-sm text-white focus:border-[#2DE3A7] focus:outline-none"
                                />
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {THEME_COLOR_LABELS[key].hint}
                                </p>
                                {errors[`theme_colors.${key}` as keyof typeof errors] && (
                                    <p className="text-xs text-red-400">
                                        {errors[`theme_colors.${key}` as keyof typeof errors]}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-800">
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? "Saving…" : "Save colors"}
                        </PrimaryButton>
                        <button
                            type="button"
                            onClick={handleResetToDefaults}
                            className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            Reset form to defaults
                        </button>
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-4 py-2 text-sm font-medium rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            Revert unsaved changes
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
