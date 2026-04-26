import { useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card, { CardContent } from "@/Components/Ui/Card";
import {
    Wallet,
    RotateCcw,
    CreditCard,
    Package,
    CheckCircle,
    ChevronRight,
    AlertCircle,
} from "lucide-react";

interface ReturnRequest {
    id: number;
    consignment_id: number | string;
    reason: string | null;
    status: "pending" | "approved" | "processing" | "completed" | "cancelled";
    created_at: string;
    updated_at: string;
}

interface Payment {
    id: number;
    amount?: number;
    status?: string;
    created_at?: string;
    [key: string]: unknown;
}

interface Props {
    balance: number | null;
    return_requests: ReturnRequest[];
    payments: Payment[];
}

const STATUS_STYLES: Record<string, string> = {
    pending:    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    approved:   "bg-blue-500/10  text-blue-400  border-blue-500/20",
    processing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    completed:  "bg-green-500/10 text-green-400  border-green-500/20",
    cancelled:  "bg-red-500/10   text-red-400    border-red-500/20",
    success:    "bg-green-500/10 text-green-400  border-green-500/20",
};

function StatusBadge({ status }: { status: string }) {
    const cls = STATUS_STYLES[status] ?? "bg-gray-500/10 text-gray-400 border-gray-500/20";
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
            {status}
        </span>
    );
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-3">
            <Icon className="w-8 h-8 opacity-40" />
            <p className="text-sm">{message}</p>
        </div>
    );
}

export default function Index({ balance, return_requests, payments }: Props) {
    const { flash } = usePage().props as any;
    const [activeTab, setActiveTab] = useState<"returns" | "payments">("returns");
    const [expandedPayment, setExpandedPayment] = useState<number | null>(null);
    const [paymentDetail, setPaymentDetail] = useState<Record<number, unknown>>({});
    const [loadingPayment, setLoadingPayment] = useState<number | null>(null);

    const { data, setData, post, processing, reset, errors } = useForm({
        consignment_id: "",
        invoice: "",
        tracking_code: "",
        reason: "",
    });

    const submitReturnRequest = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.steadfast.return-requests.create"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const loadPaymentDetail = async (id: number) => {
        if (expandedPayment === id) {
            setExpandedPayment(null);
            return;
        }
        setExpandedPayment(id);
        if (paymentDetail[id]) return;

        setLoadingPayment(id);
        try {
            const res = await fetch(route("admin.steadfast.payments.show", id));
            const json = await res.json();
            setPaymentDetail((prev) => ({ ...prev, [id]: json }));
        } catch {
            // silently fail
        } finally {
            setLoadingPayment(null);
        }
    };

    return (
        <Master
            title="Steadfast Operations"
            head={<Header title="Steadfast Operations" showUserMenu={true} />}
        >
            <Head title="Steadfast Operations" />
            <div className="p-6 max-w-8xl mx-auto space-y-6">

                {/* Flash messages */}
                {flash?.success && (
                    <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {flash.error}
                    </div>
                )}

                {/* Balance card */}
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-[#2DE3A7]/10">
                                <Wallet className="w-5 h-5 text-[#2DE3A7]" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">
                                    Steadfast Current Balance
                                </p>
                                {balance !== null ? (
                                    <p className="text-2xl font-bold text-[#2DE3A7]">
                                        ৳{balance.toLocaleString()}
                                    </p>
                                ) : (
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Balance unavailable — check API credentials
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <div className="flex gap-1 bg-[#0E1614] border border-[#1E2826] rounded-lg p-1 w-fit">
                    {(["returns", "payments"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === tab
                                    ? "bg-[#2DE3A7] text-[#0C1311]"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {tab === "returns" ? (
                                <RotateCcw className="w-4 h-4" />
                            ) : (
                                <CreditCard className="w-4 h-4" />
                            )}
                            {tab === "returns" ? "Return Requests" : "Payments"}
                        </button>
                    ))}
                </div>

                {/* Return Requests tab */}
                {activeTab === "returns" && (
                    <div className="space-y-6">
                        {/* Create Return Request form */}
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <h3 className="font-semibold text-white flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4 text-[#2DE3A7]" />
                                    Create Return Request
                                </h3>
                                <form onSubmit={submitReturnRequest} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">
                                                Consignment ID
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full bg-[#0C1311] border border-[#1E2826] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2DE3A7]/50"
                                                placeholder="e.g. 1424107"
                                                value={data.consignment_id}
                                                onChange={(e) =>
                                                    setData("consignment_id", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">
                                                Invoice / Order ID
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full bg-[#0C1311] border border-[#1E2826] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2DE3A7]/50"
                                                placeholder="e.g. 1042"
                                                value={data.invoice}
                                                onChange={(e) =>
                                                    setData("invoice", e.target.value)
                                                }
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">
                                                Tracking Code
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full bg-[#0C1311] border border-[#1E2826] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2DE3A7]/50"
                                                placeholder="e.g. 15BAEB8A"
                                                value={data.tracking_code}
                                                onChange={(e) =>
                                                    setData("tracking_code", e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">
                                            Reason (optional)
                                        </label>
                                        <textarea
                                            rows={2}
                                            className="w-full bg-[#0C1311] border border-[#1E2826] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#2DE3A7]/50 resize-none"
                                            placeholder="Reason for return..."
                                            value={data.reason}
                                            onChange={(e) =>
                                                setData("reason", e.target.value)
                                            }
                                        />
                                    </div>
                                    {errors.consignment_id && (
                                        <p className="text-xs text-red-400">{errors.consignment_id}</p>
                                    )}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="flex items-center gap-2 px-4 py-2 bg-[#2DE3A7] text-[#0C1311] rounded-lg font-semibold text-sm hover:bg-[#26c28f] transition-colors disabled:opacity-60"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            {processing ? "Submitting…" : "Submit Return Request"}
                                        </button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Return Requests list */}
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gray-400" />
                                    Return Requests
                                    <span className="ml-auto text-xs text-gray-500 font-normal">
                                        {return_requests.length} total
                                    </span>
                                </h3>

                                {return_requests.length === 0 ? (
                                    <EmptyState
                                        icon={RotateCcw}
                                        message="No return requests found"
                                    />
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-[#1E2826]">
                                                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">
                                                        ID
                                                    </th>
                                                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">
                                                        Consignment
                                                    </th>
                                                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">
                                                        Reason
                                                    </th>
                                                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">
                                                        Status
                                                    </th>
                                                    <th className="text-left py-2 px-3 text-xs text-gray-500 font-medium">
                                                        Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#1E2826]">
                                                {return_requests.map((req) => (
                                                    <tr key={req.id} className="hover:bg-[#0E1614] transition-colors">
                                                        <td className="py-3 px-3 text-gray-300">
                                                            #{req.id}
                                                        </td>
                                                        <td className="py-3 px-3 text-gray-300 font-mono text-xs">
                                                            {req.consignment_id}
                                                        </td>
                                                        <td className="py-3 px-3 text-gray-400 max-w-xs truncate">
                                                            {req.reason ?? (
                                                                <span className="text-gray-600 italic">—</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-3">
                                                            <StatusBadge status={req.status} />
                                                        </td>
                                                        <td className="py-3 px-3 text-gray-500 text-xs whitespace-nowrap">
                                                            {new Date(req.created_at).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Payments tab */}
                {activeTab === "payments" && (
                    <Card>
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" />
                                Payment History
                                <span className="ml-auto text-xs text-gray-500 font-normal">
                                    {payments.length} total
                                </span>
                            </h3>

                            {payments.length === 0 ? (
                                <EmptyState
                                    icon={CreditCard}
                                    message="No payments found"
                                />
                            ) : (
                                <div className="space-y-2">
                                    {payments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="border border-[#1E2826] rounded-lg overflow-hidden"
                                        >
                                            <button
                                                onClick={() => loadPaymentDetail(payment.id)}
                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#0E1614] transition-colors text-left"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded bg-[#1E2826]">
                                                        <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-white font-medium">
                                                            Payment #{payment.id}
                                                        </p>
                                                        {payment.created_at && (
                                                            <p className="text-xs text-gray-500">
                                                                {new Date(payment.created_at).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {payment.amount !== undefined && (
                                                        <span className="text-sm font-semibold text-[#2DE3A7]">
                                                            ৳{Number(payment.amount).toLocaleString()}
                                                        </span>
                                                    )}
                                                    {payment.status && (
                                                        <StatusBadge status={String(payment.status)} />
                                                    )}
                                                    <ChevronRight
                                                        className={`w-4 h-4 text-gray-500 transition-transform ${
                                                            expandedPayment === payment.id ? "rotate-90" : ""
                                                        }`}
                                                    />
                                                </div>
                                            </button>

                                            {expandedPayment === payment.id && (
                                                <div className="border-t border-[#1E2826] bg-[#0C1311] px-4 py-3">
                                                    {loadingPayment === payment.id ? (
                                                        <p className="text-xs text-gray-500 py-2">
                                                            Loading consignments…
                                                        </p>
                                                    ) : paymentDetail[payment.id] ? (
                                                        <pre className="text-xs text-gray-400 overflow-x-auto whitespace-pre-wrap">
                                                            {JSON.stringify(paymentDetail[payment.id], null, 2)}
                                                        </pre>
                                                    ) : (
                                                        <p className="text-xs text-gray-500 py-2">
                                                            Failed to load payment details.
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </Master>
    );
}
