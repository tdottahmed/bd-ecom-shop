import React from "react";
import { User, Phone, MapPin, Mail, CheckCircle2 } from "lucide-react";
import { useAntiSpam } from "@/Hooks/useAntiSpam";
import {
    isValidBdLocalPhone,
    localToNationalDigits,
    nationalDigitsToLocal,
    normalizeToLocalBdPhone,
    stripDigits,
} from "@/Utils/bdPhone";

interface CustomerFormProps {
    data: {
        customer_name: string;
        customer_phone: string;
        customer_address: string;
        customer_email: string;
        create_account: boolean;
    };
    setData: (key: string, value: string | boolean) => void;
    errors: {
        customer_name?: string;
        customer_phone?: string;
        customer_address?: string;
        customer_email?: string;
    };
    handleSubmit: (e: React.FormEvent) => void;
    isLoggedIn?: boolean;
}

export default function CustomerForm({
    data,
    setData,
    errors,
    handleSubmit,
    isLoggedIn = false,
}: CustomerFormProps) {
    const { honeypot, setHoneypot, validate } = useAntiSpam(2);

    const guardedSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        handleSubmit(e);
    };

    const nationalDigits = localToNationalDigits(data.customer_phone);
    const phoneValid = isValidBdLocalPhone(data.customer_phone);
    const localNormalized = normalizeToLocalBdPhone(data.customer_phone);
    const localPretty =
        localNormalized.length === 11
            ? `${localNormalized.slice(0, 2)} ${localNormalized.slice(2, 5)} ${localNormalized.slice(5, 8)} ${localNormalized.slice(8)}`
            : localNormalized || "—";

    const onPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const digits = stripDigits(raw);
        if (digits.length >= 11 || digits.startsWith("880")) {
            setData("customer_phone", normalizeToLocalBdPhone(raw));
            return;
        }
        setData("customer_phone", nationalDigitsToLocal(digits));
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            {isLoggedIn && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/80 px-4 py-3">
                    <CheckCircle2
                        className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5"
                        aria-hidden
                    />
                    <div>
                        <p className="text-sm font-semibold text-emerald-900">
                            You&apos;re signed in
                        </p>
                        <p className="text-xs text-emerald-800/90 mt-0.5">
                            We&apos;ve filled your details from your account.
                            You can edit them for this order if needed.
                        </p>
                    </div>
                </div>
            )}

            <form
                id="checkout-form"
                onSubmit={guardedSubmit}
                className="space-y-6"
            >
                <input
                    className="spam-trap"
                    type="text"
                    name="_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        Full name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={data.customer_name}
                            onChange={(e) =>
                                setData("customer_name", e.target.value)
                            }
                            autoComplete="name"
                            className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="Enter your name"
                        />
                    </div>
                </div>

                {/* Bangladesh mobile: +880 + 10-digit national (same as 01XXXXXXXXX) */}
                <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            Mobile number (Bangladesh)
                            <span className="text-red-500">*</span>
                        </label>
                        <span
                            className={`text-xs shrink-0 ${
                                phoneValid
                                    ? "text-emerald-600 font-medium"
                                    : "text-gray-400"
                            }`}
                        >
                            {phoneValid
                                ? "Valid format"
                                : `${nationalDigits.length}/10`}
                        </span>
                    </div>
                    <div
                        className={`flex rounded-xl border bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all ${
                            errors.customer_phone
                                ? "border-red-500 bg-red-50/50"
                                : "border-gray-200"
                        }`}
                    >
                        <div
                            className="flex items-center gap-1.5 pl-3 pr-2 py-3 bg-gray-100/90 border-r border-gray-200 text-gray-700"
                            aria-hidden
                        >
                            <span className="text-base leading-none" title="Bangladesh">
                                🇧🇩
                            </span>
                            <span className="text-sm font-semibold tracking-tight">
                                +880
                            </span>
                        </div>
                        <div className="relative flex-1 flex items-center min-w-0">
                            <div className="absolute left-3 pointer-events-none text-gray-400">
                                <Phone className="h-5 w-5" />
                            </div>
                            <input
                                type="tel"
                                inputMode="numeric"
                                autoComplete="tel-national"
                                value={nationalDigits}
                                onChange={onPhoneChange}
                                className="block w-full pl-10 pr-3 py-3 bg-transparent border-0 outline-none text-gray-900 placeholder:text-gray-400"
                                placeholder="1XX XXX XXXX"
                                aria-describedby="bd-phone-hint"
                                required
                            />
                        </div>
                    </div>
                    <p
                        id="bd-phone-hint"
                        className="text-xs text-gray-500 leading-relaxed"
                    >
                        {data.customer_phone ? (
                            <>
                                Full number:{" "}
                                <span className="font-mono text-gray-700">
                                    {localPretty}
                                </span>
                                {nationalDigits.length > 0 &&
                                    nationalDigits.length < 10 && (
                                        <span className="text-gray-400">
                                            {" "}
                                            — 11 digits total, starting with 01
                                        </span>
                                    )}
                            </>
                        ) : (
                            <>
                                Example:{" "}
                                <span className="font-mono">01712 345 678</span>
                                . Enter 10 digits after +880, or paste a full
                                01… number.
                            </>
                        )}
                    </p>
                    {errors.customer_phone && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.customer_phone}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            Delivery address
                            <span className="text-red-500">*</span>
                        </label>
                        <span className="text-xs text-gray-400">
                            {data.customer_address.length} / 255
                        </span>
                    </div>
                    <div className="relative">
                        <div className="absolute top-3 left-3 pointer-events-none">
                            <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                            value={data.customer_address}
                            onChange={(e) =>
                                setData("customer_address", e.target.value)
                            }
                            maxLength={255}
                            rows={3}
                            autoComplete="street-address"
                            className={`block w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none ${
                                errors.customer_address
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200"
                            }`}
                            placeholder="Enter full address"
                            required
                        />
                    </div>
                    {errors.customer_address && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.customer_address}
                        </p>
                    )}
                </div>

                {!isLoggedIn && (
                    <>
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <label className="flex items-center justify-between gap-3 cursor-pointer">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">
                                        Create an account
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Save your details and track orders later.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={data.create_account}
                                    onChange={(e) =>
                                        setData(
                                            "create_account",
                                            e.target.checked,
                                        )
                                    }
                                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </label>
                        </div>

                        {data.create_account && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.customer_email}
                                        onChange={(e) =>
                                            setData(
                                                "customer_email",
                                                e.target.value,
                                            )
                                        }
                                        autoComplete="email"
                                        className={`block w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                                            errors.customer_email
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200"
                                        }`}
                                        placeholder="Enter your email"
                                        required={data.create_account}
                                    />
                                </div>
                                {errors.customer_email && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.customer_email}
                                    </p>
                                )}
                            </div>
                        )}
                    </>
                )}
            </form>
        </div>
    );
}
