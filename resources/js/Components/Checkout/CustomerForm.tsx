import React from "react";
import { User, Phone, MapPin, Mail } from "lucide-react";
import { useAntiSpam } from "@/Hooks/useAntiSpam";

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
}

export default function CustomerForm({
    data,
    setData,
    errors,
    handleSubmit,
}: CustomerFormProps) {
    const { honeypot, setHoneypot, validate } = useAntiSpam(2);

    const guardedSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return; // silent bot rejection
        handleSubmit(e);
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <form
                id="checkout-form"
                onSubmit={guardedSubmit}
                className="space-y-6"
            >
                {/* Honeypot — bots fill this, humans never see it */}
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
                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                        আপনার নাম <span className="text-red-500">* </span>
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
                            className="block w-full pl-10 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            placeholder="Enter your name"
                        />
                    </div>
                </div>

                {/* Phone Input */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            মোবাইল নাম্বার{" "}
                            <span className="text-red-500">* </span>
                        </label>
                        <span className="text-xs text-gray-400">
                            {data.customer_phone.length} / 11
                        </span>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="tel"
                            value={data.customer_phone}
                            onChange={(e) =>
                                setData("customer_phone", e.target.value)
                            }
                            maxLength={11}
                            className={`block w-full pl-10 pr-3 py-3 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none ${
                                errors.customer_phone
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-200"
                            }`}
                            placeholder="01XXXXXXXXX"
                            required
                        />
                    </div>
                    {errors.customer_phone && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.customer_phone}
                        </p>
                    )}
                </div>

                {/* Address Input */}
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            আপনার ঠিকানা{" "}
                            <span className="text-red-500">* </span>
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

                {/* Account Creation Toggle */}
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
                                setData("create_account", e.target.checked)
                            }
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                    </label>
                </div>

                {/* Email Input - required only when account creation is enabled */}
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
                                    setData("customer_email", e.target.value)
                                }
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
            </form>
        </div>
    );
}
