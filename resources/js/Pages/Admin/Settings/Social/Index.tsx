import { useState } from "react";
import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Card, { CardContent } from "@/Components/Ui/Card";
import {
    InfoIcon,
    CopyIcon,
    CheckIcon,
    ToggleLeftIcon,
    ToggleRightIcon,
    ExternalLinkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "lucide-react";

interface Props {
    credentials: {
        google_client_id?: string;
        google_client_secret?: string;
        google_enabled?: boolean;
        facebook_client_id?: string;
        facebook_client_secret?: string;
        facebook_enabled?: boolean;
    };
}

function Toggle({
    enabled,
    onChange,
}: {
    enabled: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!enabled)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                enabled ? "text-[#2DE3A7]" : "text-gray-500 hover:text-gray-300"
            }`}
        >
            {enabled ? (
                <ToggleRightIcon size={24} className="text-[#2DE3A7]" />
            ) : (
                <ToggleLeftIcon size={24} />
            )}
            {enabled ? "Enabled" : "Disabled"}
        </button>
    );
}

function CopyButton({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#2DE3A7] transition-colors"
        >
            {copied ? (
                <CheckIcon size={13} className="text-[#2DE3A7]" />
            ) : (
                <CopyIcon size={13} />
            )}
            {copied ? "Copied!" : "Copy"}
        </button>
    );
}

function InstructionStep({
    step,
    children,
}: {
    step: number;
    children: React.ReactNode;
}) {
    return (
        <li className="flex items-start gap-2.5">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2DE3A7]/15 text-[#2DE3A7] text-xs flex items-center justify-center font-semibold mt-0.5">
                {step}
            </span>
            <span className="text-gray-300">{children}</span>
        </li>
    );
}

function InstructionPanel({
    title,
    link,
    linkLabel,
    steps,
}: {
    title: string;
    link: string;
    linkLabel: string;
    steps: React.ReactNode[];
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-[#0C1311] border border-[#1E2826] rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-300 hover:text-white transition-colors"
            >
                <span className="flex items-center gap-2">
                    <InfoIcon size={14} className="text-[#2DE3A7]" />
                    {title}
                </span>
                {open ? (
                    <ChevronUpIcon size={15} />
                ) : (
                    <ChevronDownIcon size={15} />
                )}
            </button>

            {open && (
                <div className="px-4 pb-4 space-y-3 border-t border-[#1E2826]">
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-[#2DE3A7] hover:underline mt-3"
                    >
                        <ExternalLinkIcon size={12} />
                        {linkLabel}
                    </a>
                    <ol className="space-y-2.5 text-xs mt-1">
                        {steps.map((step, i) => (
                            <InstructionStep key={i} step={i + 1}>
                                {step}
                            </InstructionStep>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}

const callbackBase =
    typeof window !== "undefined" ? window.location.origin : "";

export default function Index({ credentials }: Props) {
    const { data, setData, post, processing } = useForm({
        google_client_id: credentials.google_client_id ?? "",
        google_client_secret: credentials.google_client_secret ?? "",
        google_enabled: credentials.google_enabled ?? false,
        facebook_client_id: credentials.facebook_client_id ?? "",
        facebook_client_secret: credentials.facebook_client_secret ?? "",
        facebook_enabled: credentials.facebook_enabled ?? false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.social-login.update"));
    };

    const Field = ({
        id,
        label,
        value,
        onChange,
        type = "text",
        placeholder,
        mono = false,
    }: {
        id: string;
        label: string;
        value: string;
        onChange: (v: string) => void;
        type?: string;
        placeholder?: string;
        mono?: boolean;
    }) => (
        <div>
            <InputLabel htmlFor={id} value={label} />
            <TextInput
                id={id}
                name={id}
                type={type}
                className={`mt-1 block w-full ${mono ? "font-mono text-sm" : ""}`}
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );

    const CallbackUrlBox = ({ provider }: { provider: string }) => {
        const url = `${callbackBase}/auth/${provider}/callback`;
        return (
            <div className="flex items-start gap-2 bg-[#0C1311] border border-[#1E2826] rounded-lg p-3 text-xs text-gray-400">
                <InfoIcon
                    size={13}
                    className="text-[#2DE3A7] shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                    <span>
                        Authorized redirect URI to register in the developer
                        console:{" "}
                    </span>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <code className="text-[#2DE3A7] bg-[#1E2826] px-1.5 py-0.5 rounded break-all">
                            {url}
                        </code>
                        <CopyButton value={url} />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Master
            title="Social Login"
            head={<Header title="Social Login Settings" showUserMenu={true} />}
        >
            <Head title="Social Login Settings" />
            <div className="p-6 max-w-8xl mx-auto">
                <form onSubmit={submit} className="space-y-6">
                    {/* ── Google ───────────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <div className="flex items-center justify-between border-b border-[#1E2826] pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-white/5">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-[18px] h-[18px]"
                                            fill="none"
                                        >
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">
                                            Google
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            OAuth 2.0 via Google Cloud Console
                                        </p>
                                    </div>
                                </div>
                                <Toggle
                                    enabled={data.google_enabled}
                                    onChange={(v) =>
                                        setData("google_enabled", v)
                                    }
                                />
                            </div>

                            <InstructionPanel
                                title="How to get Google credentials"
                                link="https://console.cloud.google.com/apis/credentials"
                                linkLabel="Open Google Cloud Console →"
                                steps={[
                                    <>
                                        Go to{" "}
                                        <strong className="text-white">
                                            APIs &amp; Services → Credentials
                                        </strong>{" "}
                                        and click{" "}
                                        <strong className="text-white">
                                            Create Credentials → OAuth client ID
                                        </strong>
                                        .
                                    </>,
                                    <>
                                        Select{" "}
                                        <strong className="text-white">
                                            Web application
                                        </strong>{" "}
                                        as the application type.
                                    </>,
                                    <>
                                        Under{" "}
                                        <strong className="text-white">
                                            Authorized redirect URIs
                                        </strong>
                                        , add the callback URL shown below.
                                    </>,
                                    <>
                                        Copy the{" "}
                                        <strong className="text-white">
                                            Client ID
                                        </strong>{" "}
                                        and{" "}
                                        <strong className="text-white">
                                            Client Secret
                                        </strong>{" "}
                                        and paste them here.
                                    </>,
                                    <>
                                        Make sure the{" "}
                                        <strong className="text-white">
                                            Google+ API
                                        </strong>{" "}
                                        or{" "}
                                        <strong className="text-white">
                                            Google Identity
                                        </strong>{" "}
                                        service is enabled in your project.
                                    </>,
                                ]}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    id="google_client_id"
                                    label="Client ID"
                                    value={data.google_client_id}
                                    onChange={(v) =>
                                        setData("google_client_id", v)
                                    }
                                    placeholder="xxxx.apps.googleusercontent.com"
                                    mono
                                />
                                <Field
                                    id="google_client_secret"
                                    label="Client Secret"
                                    value={data.google_client_secret}
                                    onChange={(v) =>
                                        setData("google_client_secret", v)
                                    }
                                    type="password"
                                    placeholder="GOCSPX-…"
                                />
                            </div>

                            <CallbackUrlBox provider="google" />
                        </CardContent>
                    </Card>

                    {/* ── Facebook ─────────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <div className="flex items-center justify-between border-b border-[#1E2826] pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-[#1877F2]/10">
                                        <svg
                                            viewBox="0 0 24 24"
                                            className="w-[18px] h-[18px]"
                                            fill="none"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M22.5 12.067c0-5.803-4.701-10.504-10.5-10.504-5.798 0-10.5 4.701-10.5 10.504 0 5.239 3.824 9.58 8.86 10.378v-7.34H7.695v-3.038h2.665V9.418c0-2.628 1.564-4.083 3.966-4.083 1.146 0 2.348.204 2.348.204v2.583h-1.321c-1.303 0-1.71.808-1.71 1.637v1.947h2.909l-.465 3.038h-2.444v7.34c5.035-.797 8.859-5.14 8.859-10.378z"
                                                fill="#1877F2"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">
                                            Facebook
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            OAuth via Meta for Developers portal
                                        </p>
                                    </div>
                                </div>
                                <Toggle
                                    enabled={data.facebook_enabled}
                                    onChange={(v) =>
                                        setData("facebook_enabled", v)
                                    }
                                />
                            </div>

                            <InstructionPanel
                                title="How to get Facebook credentials"
                                link="https://developers.facebook.com/apps"
                                linkLabel="Open Meta for Developers →"
                                steps={[
                                    <>
                                        Create a new app and choose{" "}
                                        <strong className="text-white">
                                            Consumer
                                        </strong>{" "}
                                        as the use case.
                                    </>,
                                    <>
                                        Go to{" "}
                                        <strong className="text-white">
                                            Facebook Login → Settings
                                        </strong>{" "}
                                        and add the callback URL under{" "}
                                        <strong className="text-white">
                                            Valid OAuth Redirect URIs
                                        </strong>
                                        .
                                    </>,
                                    <>
                                        From{" "}
                                        <strong className="text-white">
                                            App Settings → Basic
                                        </strong>
                                        , copy the{" "}
                                        <strong className="text-white">
                                            App ID
                                        </strong>{" "}
                                        and{" "}
                                        <strong className="text-white">
                                            App Secret
                                        </strong>
                                        .
                                    </>,
                                    <>
                                        Make sure your app is in{" "}
                                        <strong className="text-white">
                                            Live
                                        </strong>{" "}
                                        mode (not Development) so any user can
                                        log in.
                                    </>,
                                ]}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    id="facebook_client_id"
                                    label="App ID"
                                    value={data.facebook_client_id}
                                    onChange={(v) =>
                                        setData("facebook_client_id", v)
                                    }
                                    placeholder="123456789012345"
                                    mono
                                />
                                <Field
                                    id="facebook_client_secret"
                                    label="App Secret"
                                    value={data.facebook_client_secret}
                                    onChange={(v) =>
                                        setData("facebook_client_secret", v)
                                    }
                                    type="password"
                                    placeholder="abc123…"
                                />
                            </div>

                            <CallbackUrlBox provider="facebook" />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <PrimaryButton disabled={processing}>
                            {processing ? "Saving…" : "Save Changes"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Master>
    );
}
