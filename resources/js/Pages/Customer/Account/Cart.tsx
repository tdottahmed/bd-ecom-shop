import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import { CartItem } from "@/types";

export default function Cart({ cartItems }: { cartItems: CartItem[] }) {
    return (
        <CustomerAccountLayout title="Saved Cart">
            <div className="space-y-3">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div
                            key={item.cart_id}
                            className="rounded-lg border border-gray-100 px-4 py-3 flex items-center justify-between"
                        >
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-500">
                                    Qty: {item.quantity}
                                </p>
                            </div>
                            <p className="font-semibold">৳{item.price}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">
                        No saved cart items found.
                    </p>
                )}
            </div>
        </CustomerAccountLayout>
    );
}
