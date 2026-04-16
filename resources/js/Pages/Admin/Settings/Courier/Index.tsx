import { useState } from "react";
import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Card, { CardContent } from "@/Components/Ui/Card";
import {
    TruckIcon,
    PackageIcon,
    ZapIcon,
    InfoIcon,
    CopyIcon,
    CheckIcon,
    ExternalLinkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ToggleLeftIcon,
    ToggleRightIcon,
    FlaskConicalIcon,
} from "lucide-react";

interface Props {
    credentials: {
        pathao_user?: string;
        pathao_password?: string;
        pathao_client_id?: string;
        pathao_client_secret?: string;
        pathao_store_id?: string;
        pathao_sandbox?: boolean;
        steadfast_user?: string;
        steadfast_password?: string;
        steadfast_api_key?: string;
        steadfast_secret_key?: string;
        redx_phone?: string;
        redx_password?: string;
    };
}

function Toggle({
    enabled,
    onChange,
    label,
    activeLabel,
}: {
    enabled: boolean;
    onChange: (v: boolean) => void;
    label?: string;
    activeLabel?: string;
}) {
    return (
        <button
            type="button"
            onClick={() => onChange(!enabled)}
            className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                enabled ? "text-amber-400" : "text-gray-500 hover:text-gray-300"
            }`}
        >
            {enabled ? (
                <ToggleRightIcon size={24} className="text-amber-400" />
            ) : (
                <ToggleLeftIcon size={24} />
            )}
            {enabled ? (activeLabel ?? label) : label}
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

function WebhookUrlBox({ url }: { url: string }) {
    return (
        <div className="flex items-start gap-2.5 bg-[#0C1311] border border-[#1E2826] rounded-lg p-3.5 text-xs text-gray-400">
            <InfoIcon size={13} className="text-[#2DE3A7] shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0 space-y-1.5">
                <p>
                    Register this webhook URL in your merchant panel to receive
                    live delivery status updates automatically.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                    <code className="flex-1 min-w-0 text-[#2DE3A7] bg-[#1A2420] border border-[#2DE3A7]/20 px-2 py-1 rounded text-[11px] break-all font-mono">
                        {url}
                    </code>
                    <CopyButton value={url} />
                </div>
            </div>
        </div>
    );
}

const origin = typeof window !== "undefined" ? window.location.origin : "";

export default function Index({ credentials }: Props) {
    const { data, setData, post, processing } = useForm({
        pathao_user: credentials.pathao_user ?? "",
        pathao_password: credentials.pathao_password ?? "",
        pathao_client_id: credentials.pathao_client_id ?? "",
        pathao_client_secret: credentials.pathao_client_secret ?? "",
        pathao_store_id: credentials.pathao_store_id ?? "",
        pathao_sandbox: credentials.pathao_sandbox ?? false,
        steadfast_user: credentials.steadfast_user ?? "",
        steadfast_password: credentials.steadfast_password ?? "",
        steadfast_api_key: credentials.steadfast_api_key ?? "",
        steadfast_secret_key: credentials.steadfast_secret_key ?? "",
        redx_phone: credentials.redx_phone ?? "",
        redx_password: credentials.redx_password ?? "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.courier.update"));
    };

    const Field = ({
        id,
        label,
        value,
        onChange,
        type = "text",
        placeholder,
    }: {
        id: string;
        label: string;
        value: string;
        onChange: (v: string) => void;
        type?: string;
        placeholder?: string;
    }) => (
        <div>
            <InputLabel htmlFor={id} value={label} />
            <TextInput
                id={id}
                name={id}
                type={type}
                className="mt-1 block w-full"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );

    const pathaoWebhookUrl    = `${origin}/webhooks/pathao`;
    const steadfastWebhookUrl = `${origin}/webhooks/steadfast`;

    return (
        <Master
            title="Courier Settings"
            head={<Header title="Courier Settings" showUserMenu={true} />}
        >
            <Head title="Courier Settings" />
            <div className="p-6 max-w-8xl mx-auto">
                <form onSubmit={submit} className="space-y-6">
                    {/* ── Pathao ───────────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <div className="flex items-center justify-between border-b border-[#1E2826] pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-[#2DE3A7]/10">
                                        <TruckIcon
                                            size={18}
                                            className="text-[#2DE3A7]"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">
                                            Pathao Courier
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            OAuth2 credentials from Pathao
                                            merchant portal
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {data.pathao_sandbox && (
                                        <span className="flex items-center gap-1 text-xs bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-full">
                                            <FlaskConicalIcon size={11} />
                                            Sandbox mode
                                        </span>
                                    )}
                                    <Toggle
                                        enabled={data.pathao_sandbox}
                                        onChange={(v) =>
                                            setData("pathao_sandbox", v)
                                        }
                                        label="Live"
                                        activeLabel="Sandbox"
                                    />
                                </div>
                            </div>

                            <InstructionPanel
                                title="How to get Pathao credentials"
                                link="https://merchant.pathao.com"
                                linkLabel="Open Pathao Merchant Portal →"
                                steps={[
                                    <>
                                        Log in to the{" "}
                                        <strong className="text-white">
                                            Pathao Merchant Portal
                                        </strong>{" "}
                                        and go to{" "}
                                        <strong className="text-white">
                                            Developer Settings
                                        </strong>{" "}
                                        or{" "}
                                        <strong className="text-white">
                                            API Access
                                        </strong>
                                        .
                                    </>,
                                    <>
                                        Create a new API application to receive
                                        your{" "}
                                        <strong className="text-white">
                                            Client ID
                                        </strong>{" "}
                                        and{" "}
                                        <strong className="text-white">
                                            Client Secret
                                        </strong>
                                        .
                                    </>,
                                    <>
                                        Your{" "}
                                        <strong className="text-white">
                                            Username/Email
                                        </strong>{" "}
                                        and{" "}
                                        <strong className="text-white">
                                            Password
                                        </strong>{" "}
                                        are your merchant account login
                                        credentials.
                                    </>,
                                    <>
                                        The{" "}
                                        <strong className="text-white">
                                            Store ID
                                        </strong>{" "}
                                        is found under{" "}
                                        <strong className="text-white">
                                            My Stores
                                        </strong>{" "}
                                        in your merchant dashboard.
                                    </>,
                                    <>
                                        Toggle{" "}
                                        <strong className="text-white">
                                            Sandbox
                                        </strong>{" "}
                                        while testing; switch to{" "}
                                        <strong className="text-white">
                                            Live
                                        </strong>{" "}
                                        before going to production.
                                    </>,
                                ]}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    id="pathao_client_id"
                                    label="Client ID"
                                    value={data.pathao_client_id}
                                    onChange={(v) =>
                                        setData("pathao_client_id", v)
                                    }
                                    placeholder="From Pathao merchant portal"
                                />
                                <Field
                                    id="pathao_client_secret"
                                    label="Client Secret"
                                    value={data.pathao_client_secret}
                                    type="password"
                                    onChange={(v) =>
                                        setData("pathao_client_secret", v)
                                    }
                                />
                                <Field
                                    id="pathao_user"
                                    label="Username / Email"
                                    value={data.pathao_user}
                                    onChange={(v) => setData("pathao_user", v)}
                                />
                                <Field
                                    id="pathao_password"
                                    label="Password"
                                    value={data.pathao_password}
                                    type="password"
                                    onChange={(v) =>
                                        setData("pathao_password", v)
                                    }
                                />
                                <Field
                                    id="pathao_store_id"
                                    label="Store ID"
                                    value={data.pathao_store_id}
                                    onChange={(v) =>
                                        setData("pathao_store_id", v)
                                    }
                                    placeholder="Numeric store ID from Pathao"
                                />
                            </div>

                            <WebhookUrlBox url={pathaoWebhookUrl} />
                        </CardContent>
                    </Card>

                    {/* ── Steadfast ────────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <div className="flex items-center gap-3 border-b border-[#1E2826] pb-3 mb-1">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <PackageIcon
                                        size={18}
                                        className="text-blue-400"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">
                                        Steadfast Courier
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        API key from Steadfast portal
                                        (packzy.com)
                                    </p>
                                </div>
                            </div>

                            <InstructionPanel
                                title="How to get Steadfast credentials"
                                link="https://packzy.com"
                                linkLabel="Open Steadfast / Packzy Portal →"
                                steps={[
                                    <>
                                        Log in to{" "}
                                        <strong className="text-white">
                                            packzy.com
                                        </strong>{" "}
                                        with your Steadfast merchant account.
                                    </>,
                                    <>
                                        Go to{" "}
                                        <strong className="text-white">
                                            Account Settings → API
                                        </strong>{" "}
                                        to find or generate your{" "}
                                        <strong className="text-white">
                                            API Key
                                        </strong>{" "}
                                        and{" "}
                                        <strong className="text-white">
                                            Secret Key
                                        </strong>
                                        .
                                    </>,
                                    <>
                                        Your{" "}
                                        <strong className="text-white">
                                            Username/Email
                                        </strong>{" "}
                                        and{" "}
                                        <strong className="text-white">
                                            Password
                                        </strong>{" "}
                                        are your Steadfast account login
                                        credentials.
                                    </>,
                                ]}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    id="steadfast_user"
                                    label="Username / Email"
                                    value={data.steadfast_user}
                                    onChange={(v) =>
                                        setData("steadfast_user", v)
                                    }
                                />
                                <Field
                                    id="steadfast_password"
                                    label="Password"
                                    value={data.steadfast_password}
                                    type="password"
                                    onChange={(v) =>
                                        setData("steadfast_password", v)
                                    }
                                />
                                <Field
                                    id="steadfast_api_key"
                                    label="API Key"
                                    value={data.steadfast_api_key}
                                    onChange={(v) =>
                                        setData("steadfast_api_key", v)
                                    }
                                />
                                <Field
                                    id="steadfast_secret_key"
                                    label="Secret Key"
                                    value={data.steadfast_secret_key}
                                    type="password"
                                    onChange={(v) =>
                                        setData("steadfast_secret_key", v)
                                    }
                                />
                            </div>

                            <WebhookUrlBox url={steadfastWebhookUrl} />
                        </CardContent>
                    </Card>

                    {/* ── RedX ─────────────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <div className="flex items-center gap-3 border-b border-[#1E2826] pb-3 mb-1">
                                <div className="p-2 rounded-lg bg-red-500/10">
                                    <ZapIcon
                                        size={18}
                                        className="text-red-400"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">
                                        RedX Courier
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Phone & password from RedX merchant
                                        account
                                    </p>
                                </div>
                            </div>

                            <InstructionPanel
                                title="How to get RedX credentials"
                                link="https://merchant.redx.com.bd"
                                linkLabel="Open RedX Merchant Portal →"
                                steps={[
                                    <>
                                        Register or log in at the{" "}
                                        <strong className="text-white">
                                            RedX Merchant Portal
                                        </strong>
                                        .
                                    </>,
                                    <>
                                        Your{" "}
                                        <strong className="text-white">
                                            Phone Number
                                        </strong>{" "}
                                        is the mobile number used during
                                        registration.
                                    </>,
                                    <>
                                        Your{" "}
                                        <strong className="text-white">
                                            Password
                                        </strong>{" "}
                                        is your merchant account login password.
                                    </>,
                                ]}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    id="redx_phone"
                                    label="Phone Number"
                                    value={data.redx_phone}
                                    onChange={(v) => setData("redx_phone", v)}
                                    placeholder="01XXXXXXXXX"
                                />
                                <Field
                                    id="redx_password"
                                    label="Password"
                                    value={data.redx_password}
                                    type="password"
                                    onChange={(v) =>
                                        setData("redx_password", v)
                                    }
                                />
                            </div>
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
