import { usePage } from "@inertiajs/react";

interface PaymentMethodConfig {
    enabled: boolean;
    label: string;
}

interface PaymentMethods {
    cod:        PaymentMethodConfig;
    bkash:      PaymentMethodConfig;
    nagad:      PaymentMethodConfig;
    sslcommerz: PaymentMethodConfig;
    shurjopay:  PaymentMethodConfig;
    aamarpay:   PaymentMethodConfig;
}

interface Props {
    value: string;
    onChange: (method: string) => void;
    error?: string;
}

const COD_ICON = (
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
);

const BKASH_LOGO = (
    <div className="w-10 h-6 flex items-center justify-center">
        <span className="text-[#e2136e] font-extrabold text-sm leading-none tracking-tight">bKash</span>
    </div>
);

const NAGAD_LOGO = (
    <div className="w-10 h-6 flex items-center justify-center">
        <span className="text-[#f37021] font-extrabold text-sm leading-none tracking-tight">Nagad</span>
    </div>
);

const SSL_LOGO = (
    <div className="h-6 flex items-center justify-center">
        <span className="text-[#2196f3] font-extrabold text-xs leading-none tracking-tight">SSLCommerz</span>
    </div>
);

const SHURJO_LOGO = (
    <div className="h-6 flex items-center justify-center">
        <span className="text-[#6c3baa] font-extrabold text-xs leading-none tracking-tight">ShurjoPay</span>
    </div>
);

const AAMARPAY_LOGO = (
    <div className="h-6 flex items-center justify-center">
        <span className="text-[#0f9d58] font-extrabold text-xs leading-none tracking-tight">aamarPay</span>
    </div>
);

const METHOD_META: Record<string, { icon: React.ReactNode; description: string; color: string; borderColor: string }> = {
    cod: {
        icon: COD_ICON,
        description: "Pay in cash when your order arrives",
        color: "text-gray-700",
        borderColor: "border-gray-800",
    },
    bkash: {
        icon: BKASH_LOGO,
        description: "Pay securely via bKash mobile banking",
        color: "text-[#e2136e]",
        borderColor: "border-[#e2136e]",
    },
    nagad: {
        icon: NAGAD_LOGO,
        description: "Pay via Nagad digital financial service",
        color: "text-[#f37021]",
        borderColor: "border-[#f37021]",
    },
    sslcommerz: {
        icon: SSL_LOGO,
        description: "Card, net banking & mobile payment",
        color: "text-[#2196f3]",
        borderColor: "border-[#2196f3]",
    },
    shurjopay: {
        icon: SHURJO_LOGO,
        description: "Pay via ShurjoPay payment gateway",
        color: "text-[#6c3baa]",
        borderColor: "border-[#6c3baa]",
    },
    aamarpay: {
        icon: AAMARPAY_LOGO,
        description: "Pay via aamarPay payment gateway",
        color: "text-[#0f9d58]",
        borderColor: "border-[#0f9d58]",
    },
};

export default function PaymentMethod({ value, onChange, error }: Props) {
    const { paymentMethods } = usePage().props as unknown as { paymentMethods: PaymentMethods };

    const enabled = Object.entries(paymentMethods ?? {}).filter(([, cfg]) => cfg.enabled);

    if (enabled.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-base font-bold text-gray-900 mb-4">Payment method</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enabled.map(([key, cfg]) => {
                    const meta = METHOD_META[key];
                    const isSelected = value === key;

                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onChange(key)}
                            className={`relative flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                                isSelected
                                    ? `${meta.borderColor} bg-gray-50 shadow-sm`
                                    : "border-gray-200 hover:border-gray-300 bg-white"
                            }`}
                        >
                            {/* Radio dot */}
                            <div className={`flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isSelected ? `${meta.borderColor} bg-current` : "border-gray-300"
                            }`}>
                                {isSelected && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </div>

                            {/* Icon */}
                            <div className={`flex-shrink-0 ${meta.color}`}>
                                {meta.icon}
                            </div>

                            {/* Text */}
                            <div className="min-w-0">
                                <div className={`text-sm font-semibold ${isSelected ? meta.color : "text-gray-900"}`}>
                                    {cfg.label}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                    {meta.description}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {error && (
                <p className="mt-2 text-xs text-red-500">{error}</p>
            )}
        </div>
    );
}
