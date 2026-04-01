import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import { Order, PaginatedData } from "@/types";

export default function Orders({ orders }: { orders: PaginatedData<Order> }) {
    return (
        <CustomerAccountLayout title="Orders">
            <div className="space-y-3">
                {orders.data.length > 0 ? (
                    orders.data.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-lg border border-gray-100 px-4 py-3 flex items-center justify-between"
                        >
                            <div>
                                <p className="font-medium">Order #{order.id}</p>
                                <p className="text-sm text-gray-500 capitalize">
                                    {order.status}
                                </p>
                            </div>
                            <p className="font-semibold">৳{order.total}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No orders found.</p>
                )}
            </div>
        </CustomerAccountLayout>
    );
}
