import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import { Order } from "@/types";

export default function Dashboard({
    stats,
    recentOrders,
}: {
    stats: { totalOrders: number; pendingOrders: number; cartItems: number };
    recentOrders: Order[];
}) {
    return (
        <CustomerAccountLayout title="Dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Total Orders</p>
                    <p className="text-2xl font-semibold">{stats.totalOrders}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Pending Orders</p>
                    <p className="text-2xl font-semibold">{stats.pendingOrders}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">Saved Cart Items</p>
                    <p className="text-2xl font-semibold">{stats.cartItems}</p>
                </div>
            </div>

            <div>
                <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
                <div className="space-y-3">
                    {recentOrders.length > 0 ? (
                        recentOrders.map((order) => (
                            <div
                                key={order.id}
                                className="rounded-lg border border-gray-100 px-4 py-3 flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-medium">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">
                                        {order.created_at}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">৳{order.total}</p>
                                    <p className="text-sm text-gray-500 capitalize">
                                        {order.status}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No orders yet.</p>
                    )}
                </div>
            </div>
        </CustomerAccountLayout>
    );
}
