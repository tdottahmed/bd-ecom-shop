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
    ExternalLinkIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ToggleLeftIcon,
    ToggleRightIcon,
    BanknoteIcon,
    FlaskConicalIcon,
} from "lucide-react";

interface GatewayConfig {
    enabled: boolean;
    sandbox?: boolean;
    app_key?: string;
    app_secret?: string;
    username?: string;
    password?: string;
    merchant_id?: string;
    merchant_private_key?: string;
    store_id?: string;
    store_password?: string;
    signature_key?: string;
}

interface Props {
    gateways: {
        cod: { enabled: boolean };
        bkash: GatewayConfig;
        nagad: GatewayConfig;
        sslcommerz: GatewayConfig;
        shurjopay: GatewayConfig;
        aamarpay: GatewayConfig;
    };
}

/* ─── Reusable primitives ─────────────────────────────────── */

function EnableToggle({
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

function SandboxToggle({
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
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border transition-all ${
                enabled
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                    : "bg-transparent text-gray-500 border-gray-700 hover:border-gray-500 hover:text-gray-300"
            }`}
        >
            <FlaskConicalIcon size={12} />
            {enabled ? "Sandbox" : "Live"}
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
                            <li key={i} className="flex items-start gap-2.5">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2DE3A7]/15 text-[#2DE3A7] text-xs flex items-center justify-center font-semibold mt-0.5">
                                    {i + 1}
                                </span>
                                <span className="text-gray-300">{step}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}

function Field({
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
}) {
    return (
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
}

/* ─── Gateway card header ─────────────────────────────────── */

function GatewayHeader({
    logo,
    name,
    subtitle,
    accentClass,
    enabled,
    onEnableChange,
    sandbox,
    onSandboxChange,
}: {
    logo: React.ReactNode;
    name: string;
    subtitle: string;
    accentClass: string;
    enabled: boolean;
    onEnableChange: (v: boolean) => void;
    sandbox?: boolean;
    onSandboxChange?: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between border-b border-[#1E2826] pb-3 mb-1">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${accentClass}`}>{logo}</div>
                <div>
                    <h3 className="font-semibold text-white">{name}</h3>
                    <p className="text-xs text-gray-500">{subtitle}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {onSandboxChange && sandbox !== undefined && (
                    <SandboxToggle
                        enabled={sandbox}
                        onChange={onSandboxChange}
                    />
                )}
                <EnableToggle enabled={enabled} onChange={onEnableChange} />
            </div>
        </div>
    );
}

/* ─── Main page ───────────────────────────────────────────── */

export default function Index({ gateways }: Props) {
    const { data, setData, post, processing } = useForm({
        // COD
        cod_enabled: gateways.cod.enabled,
        // bKash
        bkash_enabled: gateways.bkash.enabled,
        bkash_app_key: gateways.bkash.app_key ?? "",
        bkash_app_secret: gateways.bkash.app_secret ?? "",
        bkash_username: gateways.bkash.username ?? "",
        bkash_password: gateways.bkash.password ?? "",
        bkash_sandbox: gateways.bkash.sandbox ?? false,
        // Nagad
        nagad_enabled: gateways.nagad.enabled,
        nagad_merchant_id: gateways.nagad.merchant_id ?? "",
        nagad_merchant_private_key: gateways.nagad.merchant_private_key ?? "",
        nagad_sandbox: gateways.nagad.sandbox ?? false,
        // SSLCommerz
        sslcommerz_enabled: gateways.sslcommerz.enabled,
        sslcommerz_store_id: gateways.sslcommerz.store_id ?? "",
        sslcommerz_store_password: gateways.sslcommerz.store_password ?? "",
        sslcommerz_sandbox: gateways.sslcommerz.sandbox ?? false,
        // ShurjoPay
        shurjopay_enabled: gateways.shurjopay.enabled,
        shurjopay_username: gateways.shurjopay.username ?? "",
        shurjopay_password: gateways.shurjopay.password ?? "",
        shurjopay_sandbox: gateways.shurjopay.sandbox ?? false,
        // AamarPay
        aamarpay_enabled: gateways.aamarpay.enabled,
        aamarpay_store_id: gateways.aamarpay.store_id ?? "",
        aamarpay_signature_key: gateways.aamarpay.signature_key ?? "",
        aamarpay_sandbox: gateways.aamarpay.sandbox ?? false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.payment-gateways.update"));
    };

    return (
        <Master
            title="Payment Gateways"
            head={<Header title="Payment Gateways" showUserMenu={true} />}
        >
            <Head title="Payment Gateways" />
            <div className="p-6 max-w-8xl mx-auto">
                <form onSubmit={submit} className="space-y-6">
                    {/* ── Cash on Delivery ──────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6">
                            <GatewayHeader
                                logo={
                                    <BanknoteIcon
                                        size={18}
                                        className="text-emerald-400"
                                    />
                                }
                                name="Cash on Delivery"
                                subtitle="Customer pays in cash upon delivery — no credentials required"
                                accentClass="bg-emerald-500/10"
                                enabled={data.cod_enabled}
                                onEnableChange={(v) =>
                                    setData("cod_enabled", v)
                                }
                            />
                            <p className="text-xs text-gray-500 mt-3">
                                When enabled, customers can choose to pay cash
                                when the order is delivered. No additional
                                configuration is needed.
                            </p>
                        </CardContent>
                    </Card>

                    {/* ── bKash ─────────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <GatewayHeader
                                logo={
                                    <span className="text-[#e2136e] font-extrabold text-sm">
                                        bKash
                                    </span>
                                }
                                name="bKash"
                                subtitle="Bangladesh's largest mobile financial service"
                                accentClass="bg-[#e2136e]/10"
                                enabled={data.bkash_enabled}
                                onEnableChange={(v) =>
                                    setData("bkash_enabled", v)
                                }
                                sandbox={data.bkash_sandbox}
                                onSandboxChange={(v) =>
                                    setData("bkash_sandbox", v)
                                }
                            />
                            <InstructionPanel
                                title="How to get bKash credentials"
                                link="https://developer.bka.sh"
                                linkLabel="Open bKash Developer Portal →"
                                steps={[
                                    <>
                                        Register at{" "}
                                        <strong className="text-white">
                                            developer.bka.sh
                                        </strong>{" "}
                                        as a merchant and complete your KYC
                                        verification.
                                    </>,
                                    <>
                                        Create a new app to receive your{" "}
                                        <strong className="text-white">
                                            App Key
                                        </strong>{" "}
                                        and{" "}
                                        <strong className="text-white">
                                            App Secret
                                        </strong>
                                        .
                                    </>,
                                    <>
                                        Your{" "}
                                        <strong className="text-white">
                                            Username
                                        </strong>{" "}
                                        and{" "}
                                        <strong className="text-white">
                                            Password
                                        </strong>{" "}
                                        are your bKash merchant account
                                        credentials.
                                    </>,
                                    <>
                                        Use{" "}
                                        <strong className="text-white">
                                            Sandbox
                                        </strong>{" "}
                                        mode for testing. The sandbox base URL
                                        is{" "}
                                        <code className="text-[#2DE3A7] bg-[#1E2826] px-1 rounded">
                                            tokenized.sandbox.bka.sh
                                        </code>
                                        .
                                    </>,
                                    <>
                                        Switch to{" "}
                                        <strong className="text-white">
                                            Live
                                        </strong>{" "}
                                        when ready for production (
                                        <code className="text-[#2DE3A7] bg-[#1E2826] px-1 rounded">
                                            tokenized.pay.bka.sh
                                        </code>
                                        ).
                                    </>,
                                ]}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    id="bkash_app_key"
                                    label="App Key"
                                    value={data.bkash_app_key}
                                    onChange={(v) =>
                                        setData("bkash_app_key", v)
                                    }
                                    mono
                                />
                                <Field
                                    id="bkash_app_secret"
                                    label="App Secret"
                                    value={data.bkash_app_secret}
                                    onChange={(v) =>
                                        setData("bkash_app_secret", v)
                                    }
                                    type="password"
                                />
                                <Field
                                    id="bkash_username"
                                    label="Username"
                                    value={data.bkash_username}
                                    onChange={(v) =>
                                        setData("bkash_username", v)
                                    }
                                />
                                <Field
                                    id="bkash_password"
                                    label="Password"
                                    value={data.bkash_password}
                                    onChange={(v) =>
                                        setData("bkash_password", v)
                                    }
                                    type="password"
                                />
                            </div>
                            <SandboxUrlBox
                                sandbox={data.bkash_sandbox}
                                sandboxUrl="https://tokenized.sandbox.bka.sh/v1.2.0-beta"
                                liveUrl="https://tokenized.pay.bka.sh/v1.2.0-beta"
                            />
                        </CardContent>
                    </Card>

                    {/* ── Nagad ─────────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <GatewayHeader
                                logo={
                                    <span className="text-[#f37021] font-extrabold text-sm">
                                        Nagad
                                    </span>
                                }
                                name="Nagad"
                                subtitle="Digital financial service by Bangladesh Post Office"
                                accentClass="bg-[#f37021]/10"
                                enabled={data.nagad_enabled}
                                onEnableChange={(v) =>
                                    setData("nagad_enabled", v)
                                }
                                sandbox={data.nagad_sandbox}
                                onSandboxChange={(v) =>
                                    setData("nagad_sandbox", v)
                                }
                            />
                            <InstructionPanel
                                title="How to get Nagad credentials"
                                link="https://nagad.com.bd/merchant"
                                linkLabel="Open Nagad Merchant Portal →"
                                steps={[
                                    <>
                                        Register as a merchant at the{" "}
                                        <strong className="text-white">
                                            Nagad Merchant Portal
                                        </strong>
                                        .
                                    </>,
                                    <>
                                        Your{" "}
                                        <strong className="text-white">
                                            Merchant ID
                                        </strong>{" "}
                                        will be issued after account approval.
                                    </>,
                                    <>
                                        Generate your{" "}
                                        <strong className="text-white">
                                            Merchant Private Key
                                        </strong>{" "}
                                        from the developer section of your
                                        dashboard.
                                    </>,
                                    <>
                                        Use sandbox credentials for testing —
                                        sandbox and live credentials are
                                        separate.
                                    </>,
                                ]}
                            />
                            <div className="grid grid-cols-1 gap-4">
                                <Field
                                    id="nagad_merchant_id"
                                    label="Merchant ID"
                                    value={data.nagad_merchant_id}
                                    onChange={(v) =>
                                        setData("nagad_merchant_id", v)
                                    }
                                    mono
                                />
                                <Field
                                    id="nagad_merchant_private_key"
                                    label="Merchant Private Key"
                                    value={data.nagad_merchant_private_key}
                                    onChange={(v) =>
                                        setData("nagad_merchant_private_key", v)
                                    }
                                    type="password"
                                    placeholder="PEM-encoded private key"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── SSLCommerz ────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <GatewayHeader
                                logo={
                                    <span className="text-[#2196f3] font-extrabold text-xs">
                                        SSL
                                    </span>
                                }
                                name="SSLCommerz"
                                subtitle="Bangladesh's leading payment gateway — cards, banking & wallets"
                                accentClass="bg-[#2196f3]/10"
                                enabled={data.sslcommerz_enabled}
                                onEnableChange={(v) =>
                                    setData("sslcommerz_enabled", v)
                                }
                                sandbox={data.sslcommerz_sandbox}
                                onSandboxChange={(v) =>
                                    setData("sslcommerz_sandbox", v)
                                }
                            />
                            <InstructionPanel
                                title="How to get SSLCommerz credentials"
                                link="https://developer.sslcommerz.com"
                                linkLabel="Open SSLCommerz Developer Portal →"
                                steps={[
                                    <>
                                        Register at{" "}
                                        <strong className="text-white">
                                            developer.sslcommerz.com
                                        </strong>{" "}
                                        and complete merchant verification.
                                    </>,
                                    <>
                                        Once approved, go to{" "}
                                        <strong className="text-white">
                                            Merchant Panel → Store Management
                                        </strong>{" "}
                                        to find your{" "}
                                        <strong className="text-white">
                                            Store ID
                                        </strong>{" "}
                                        and{" "}
                                        <strong className="text-white">
                                            Store Password
                                        </strong>
                                        .
                                    </>,
                                    <>
                                        For sandbox testing, use the sandbox
                                        credentials provided during registration
                                        — sandbox URL is{" "}
                                        <code className="text-[#2DE3A7] bg-[#1E2826] px-1 rounded">
                                            sandbox.sslcommerz.com
                                        </code>
                                        .
                                    </>,
                                    <>
                                        Live endpoint:{" "}
                                        <code className="text-[#2DE3A7] bg-[#1E2826] px-1 rounded">
                                            securepay.sslcommerz.com
                                        </code>
                                    </>,
                                ]}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    id="sslcommerz_store_id"
                                    label="Store ID"
                                    value={data.sslcommerz_store_id}
                                    onChange={(v) =>
                                        setData("sslcommerz_store_id", v)
                                    }
                                    mono
                                />
                                <Field
                                    id="sslcommerz_store_password"
                                    label="Store Password"
                                    value={data.sslcommerz_store_password}
                                    onChange={(v) =>
                                        setData("sslcommerz_store_password", v)
                                    }
                                    type="password"
                                />
                            </div>
                            <SandboxUrlBox
                                sandbox={data.sslcommerz_sandbox}
                                sandboxUrl="https://sandbox.sslcommerz.com"
                                liveUrl="https://securepay.sslcommerz.com"
                            />
                        </CardContent>
                    </Card>

                    {/* ── ShurjoPay ─────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <GatewayHeader
                                logo={
                                    <span className="text-[#6c3baa] font-extrabold text-xs">
                                        SP
                                    </span>
                                }
                                name="ShurjoPay"
                                subtitle="Fast & secure Bangladeshi payment gateway"
                                accentClass="bg-[#6c3baa]/10"
                                enabled={data.shurjopay_enabled}
                                onEnableChange={(v) =>
                                    setData("shurjopay_enabled", v)
                                }
                                sandbox={data.shurjopay_sandbox}
                                onSandboxChange={(v) =>
                                    setData("shurjopay_sandbox", v)
                                }
                            />
                            <InstructionPanel
                                title="How to get ShurjoPay credentials"
                                link="https://shurjopay.com.bd"
                                linkLabel="Open ShurjoPay Portal →"
                                steps={[
                                    <>
                                        Contact ShurjoPay at{" "}
                                        <strong className="text-white">
                                            shurjopay.com.bd
                                        </strong>{" "}
                                        to register as a merchant.
                                    </>,
                                    <>
                                        After approval, you will receive a{" "}
                                        <strong className="text-white">
                                            Username
                                        </strong>{" "}
                                        and{" "}
                                        <strong className="text-white">
                                            Password
                                        </strong>{" "}
                                        for API access.
                                    </>,
                                    <>
                                        Use sandbox credentials for development;
                                        switch to live credentials before going
                                        live.
                                    </>,
                                ]}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    id="shurjopay_username"
                                    label="Username"
                                    value={data.shurjopay_username}
                                    onChange={(v) =>
                                        setData("shurjopay_username", v)
                                    }
                                />
                                <Field
                                    id="shurjopay_password"
                                    label="Password"
                                    value={data.shurjopay_password}
                                    onChange={(v) =>
                                        setData("shurjopay_password", v)
                                    }
                                    type="password"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── AamarPay ──────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <GatewayHeader
                                logo={
                                    <span className="text-[#0f9d58] font-extrabold text-xs">
                                        AP
                                    </span>
                                }
                                name="AamarPay"
                                subtitle="aamarPay — unified Bangladesh payment gateway"
                                accentClass="bg-[#0f9d58]/10"
                                enabled={data.aamarpay_enabled}
                                onEnableChange={(v) =>
                                    setData("aamarpay_enabled", v)
                                }
                                sandbox={data.aamarpay_sandbox}
                                onSandboxChange={(v) =>
                                    setData("aamarpay_sandbox", v)
                                }
                            />
                            <InstructionPanel
                                title="How to get AamarPay credentials"
                                link="https://aamarpay.com"
                                linkLabel="Open AamarPay Portal →"
                                steps={[
                                    <>
                                        Sign up at{" "}
                                        <strong className="text-white">
                                            aamarpay.com
                                        </strong>{" "}
                                        and complete the merchant onboarding.
                                    </>,
                                    <>
                                        From your merchant dashboard, copy your{" "}
                                        <strong className="text-white">
                                            Store ID
                                        </strong>{" "}
                                        (also called merchant ID).
                                    </>,
                                    <>
                                        Copy the{" "}
                                        <strong className="text-white">
                                            Signature Key
                                        </strong>{" "}
                                        — this is used to sign payment requests.
                                    </>,
                                    <>
                                        Sandbox endpoint:{" "}
                                        <code className="text-[#2DE3A7] bg-[#1E2826] px-1 rounded">
                                            sandbox.aamarpay.com
                                        </code>
                                        . Live:{" "}
                                        <code className="text-[#2DE3A7] bg-[#1E2826] px-1 rounded">
                                            secure.aamarpay.com
                                        </code>
                                        .
                                    </>,
                                ]}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    id="aamarpay_store_id"
                                    label="Store ID"
                                    value={data.aamarpay_store_id}
                                    onChange={(v) =>
                                        setData("aamarpay_store_id", v)
                                    }
                                    mono
                                />
                                <Field
                                    id="aamarpay_signature_key"
                                    label="Signature Key"
                                    value={data.aamarpay_signature_key}
                                    onChange={(v) =>
                                        setData("aamarpay_signature_key", v)
                                    }
                                    type="password"
                                />
                            </div>
                            <SandboxUrlBox
                                sandbox={data.aamarpay_sandbox}
                                sandboxUrl="https://sandbox.aamarpay.com"
                                liveUrl="https://secure.aamarpay.com"
                            />
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

/* ── Sandbox / Live URL indicator ──────────────────────────── */
function SandboxUrlBox({
    sandbox,
    sandboxUrl,
    liveUrl,
}: {
    sandbox: boolean;
    sandboxUrl: string;
    liveUrl: string;
}) {
    const url = sandbox ? sandboxUrl : liveUrl;
    return (
        <div
            className={`flex items-start gap-2 border rounded-lg p-3 text-xs ${
                sandbox
                    ? "bg-amber-500/5 border-amber-500/20 text-amber-300"
                    : "bg-[#0C1311] border-[#1E2826] text-gray-400"
            }`}
        >
            <FlaskConicalIcon
                size={13}
                className={sandbox ? "text-amber-400" : "text-[#2DE3A7]"}
            />
            <div className="flex-1 min-w-0">
                <span className="font-medium">
                    {sandbox ? "Sandbox" : "Live"} base URL:{" "}
                </span>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <code
                        className={`px-1.5 py-0.5 rounded break-all ${
                            sandbox
                                ? "text-amber-300 bg-amber-500/10"
                                : "text-[#2DE3A7] bg-[#1E2826]"
                        }`}
                    >
                        {url}
                    </code>
                    <CopyButton value={url} />
                </div>
            </div>
        </div>
    );
}
