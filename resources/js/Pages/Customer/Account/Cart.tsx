import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import { useCartStore } from "@/Stores/useCartStore";
import { CartItem } from "@/types";
import { Link, router } from "@inertiajs/react";
import { ShoppingBag } from "lucide-react";
import { getAssetUrl } from "@/Utils/helpers";

export default function Cart({ cartItems }: { cartItems: CartItem[] }) {
    const mergeSavedCartFromAccount = useCartStore(
        (s) => s.mergeSavedCartFromAccount
    );

    const loadIntoCart = () => {
        if (cartItems.length === 0) return;
        mergeSavedCartFromAccount(
            cartItems.map((item) => ({
                ...item,
                cart_id: item.cart_id,
            }))
        );
        router.visit(route("cart.index"));
    };

    return (
        <CustomerAccountLayout title="Saved Cart">
            <p className="mb-6 text-sm text-gray-600">
                Items saved to your account from your last session. Load them into
                your cart to continue checkout.
            </p>
            {cartItems.length > 0 && (
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={loadIntoCart}
                        className="inline-flex items-center justify-center rounded-xl bg-[#0C1311] px-5 py-3 text-sm font-semibold text-[#2DE3A7] shadow-sm transition hover:bg-[#152520]"
                    >
                        Load into cart
                    </button>
                </div>
            )}
            <div className="space-y-4">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div
                            key={item.cart_id}
                            className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                        >
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                {item.image ? (
                                    <img
                                        src={getAssetUrl(item.image)}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                                        <ShoppingBag className="h-8 w-8" />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold text-gray-900">
                                    {item.name}
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Qty {item.quantity}
                                </p>
                                {item.variations && item.variations.length > 0 && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        {item.variations
                                            .map((v) => v.value)
                                            .join(" · ")}
                                    </p>
                                )}
                            </div>
                            <div className="shrink-0 text-right">
                                <p className="font-bold text-[#0C1311]">
                                    ৳{Number(item.price) * item.quantity}
                                </p>
                                <p className="text-xs text-gray-500">
                                    ৳{item.price} each
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-12 text-center">
                        <ShoppingBag className="mx-auto h-10 w-10 text-gray-300" />
                        <p className="mt-3 text-sm text-gray-500">
                            No saved cart items.
                        </p>
                        <Link
                            href={route("cart.index")}
                            className="mt-4 inline-block text-sm font-semibold text-[#0C1311] hover:text-[#2DE3A7]"
                        >
                            Go to cart
                        </Link>
                    </div>
                )}
            </div>
        </CustomerAccountLayout>
    );
}
