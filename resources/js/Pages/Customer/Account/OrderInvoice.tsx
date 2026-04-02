import { Head, Link, usePage } from "@inertiajs/react";
import { Order } from "@/types";
import { format } from "date-fns";
import { ArrowLeft, Download, Printer } from "lucide-react";
import { getAssetUrl } from "@/Utils/helpers";

interface Props {
    order: Order;
}

export default function OrderInvoice({ order }: Props) {
    const page = usePage();
    const seo = page.props.seo as { siteName?: string } | undefined;
    const rawSiteLogo = page.props.siteLogo as string | null | undefined;
    const siteLogo =
        rawSiteLogo && rawSiteLogo.startsWith("storage/")
            ? rawSiteLogo.slice("storage/".length)
            : rawSiteLogo;

    return (
        <div className="min-h-screen bg-[#F4F6F8] text-gray-900">
            <Head title={`Invoice #${order.id}`} />

            <div className="no-print sticky top-0 z-10 border-b border-gray-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
                <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
                    <Link
                        href={route("account.orders.show", order.id)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0C1311] hover:text-[#2DE3A7]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to order
                    </Link>
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-50"
                        >
                            <Printer className="h-4 w-4" />
                            Print
                        </button>
                        <a
                            href={route("account.orders.invoice.pdf", order.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#0C1311] px-4 py-2 text-sm font-semibold text-[#2DE3A7] shadow-sm hover:bg-[#152520]"
                        >
                            <Download className="h-4 w-4" />
                            Download PDF
                        </a>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl p-4 pb-16 sm:p-8">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10 print:border-0 print:shadow-none">
                    <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Invoice
                            </h1>
                            <p className="text-gray-500">#{order.id}</p>
                        </div>
                        <div className="text-left sm:text-right">
                            {siteLogo ? (
                                <img
                                    src={getAssetUrl(siteLogo)}
                                    alt="Logo"
                                    className="mb-2 h-10 w-auto"
                                />
                            ) : null}
                            <h2 className="text-xl font-bold text-gray-900">
                                {seo?.siteName ?? "Store"}
                            </h2>
                            <p className="text-sm text-gray-600">Order confirmation</p>
                        </div>
                    </div>

                    <div className="mb-8 flex flex-col justify-between gap-6 sm:flex-row">
                        <div>
                            <h3 className="mb-2 font-bold text-gray-800">Bill to</h3>
                            <p>{order.customer_name || "Customer"}</p>
                            <p>{order.customer_phone}</p>
                            {order.customer_email && <p>{order.customer_email}</p>}
                            <p className="max-w-md text-gray-600">
                                {order.customer_address}
                            </p>
                        </div>
                        <div className="sm:text-right">
                            <h3 className="mb-2 font-bold text-gray-800">
                                Order details
                            </h3>
                            <p>
                                Date:{" "}
                                {format(new Date(order.created_at), "PPP")}
                            </p>
                            <p className="capitalize">Status: {order.status}</p>
                            {order.payment_method && (
                                <p className="capitalize">
                                    Payment: {order.payment_method}
                                </p>
                            )}
                        </div>
                    </div>

                    <table className="mb-8 w-full text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-300">
                                <th className="py-2 text-left font-semibold">
                                    Image
                                </th>
                                <th className="py-2 text-left font-semibold">
                                    Item
                                </th>
                                <th className="py-2 text-center font-semibold">
                                    Qty
                                </th>
                                <th className="py-2 text-right font-semibold">
                                    Price
                                </th>
                                <th className="py-2 text-right font-semibold">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-100"
                                >
                                    <td className="py-3 align-top">
                                        {item.product?.images?.[0] ? (
                                            <img
                                                src={getAssetUrl(
                                                    item.product.images[0]
                                                )}
                                                alt=""
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                    <td className="py-3 align-top">
                                        <div className="font-medium">
                                            {item.product?.name || "Product"}
                                        </div>
                                        {item.variation_ids &&
                                            item.variation_ids.length > 0 &&
                                            item.product?.product_variations && (
                                                <div className="mt-1 space-y-0.5 text-xs text-gray-500">
                                                    {item.variation_ids.map(
                                                        (variationId) => {
                                                            const variation =
                                                                item.product?.product_variations?.find(
                                                                    (v) =>
                                                                        v.id ===
                                                                        variationId
                                                                );
                                                            if (!variation)
                                                                return null;
                                                            return (
                                                                <div
                                                                    key={
                                                                        variationId
                                                                    }
                                                                >
                                                                    <span className="font-medium">
                                                                        {variation
                                                                            .product_attribute
                                                                            ?.name ||
                                                                            "Option"}
                                                                        :
                                                                    </span>{" "}
                                                                    {
                                                                        variation.value
                                                                    }
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            )}
                                    </td>
                                    <td className="py-3 text-center align-top">
                                        {item.quantity}
                                    </td>
                                    <td className="py-3 text-right align-top">
                                        ৳{item.price}
                                    </td>
                                    <td className="py-3 text-right align-top font-medium">
                                        ৳{item.price * item.quantity}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>৳{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery</span>
                                <span>৳{order.delivery_cost}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-300 pt-2 text-base font-bold">
                                <span>Total</span>
                                <span>৳{order.total}</span>
                            </div>
                        </div>
                    </div>

                    <p className="mt-12 text-center text-sm text-gray-500">
                        Thank you for your order.
                    </p>
                </div>
            </div>

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                }
            `}</style>
        </div>
    );
}
