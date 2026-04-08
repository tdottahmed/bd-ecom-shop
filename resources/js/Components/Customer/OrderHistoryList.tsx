import { useEffect, useState } from "react";
import axios from "axios";
import { Package, ChevronRight, Loader2, Trash2 } from "lucide-react";
import {
    formatPrice,
    formatDate,
    getGuestOrders,
    setGuestOrders,
    removeGuestOrder,
} from "@/Utils/helpers";
import OrderDetailsModal from "./OrderDetailsModal";
import { toast } from "sonner";

interface Order {
    id: number;
    created_at: string;
    status: string;
    total: number;
    subtotal: number;
    delivery_cost: number;
    customer_name: string;
    customer_address: string;
    customer_phone: string;
    items: any[];
}

const OrderHistoryList = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Get order IDs from cookie (this also validates the cookie format)
                const orderIds = getGuestOrders();

                if (!orderIds || orderIds.length === 0) {
                    setLoading(false);
                    return;
                }

                const response = await axios.post(route("api.orders.history"), {
                    order_ids: orderIds,
                });
                setOrders(response.data);

                // Self-healing: Update cookie to only include existing orders
                // This also refreshes the cookie expiration (important!)
                const validOrderIds = response.data.map((o: Order) => o.id);
                setGuestOrders(validOrderIds); // Refreshes expiration to 2 years
            } catch (error) {
                console.error("Failed to fetch order history:", error);

                // If API fails, try to clean up invalid order IDs
                // Only clear cookie if it's a client error (4xx) that suggests bad data
                if (axios.isAxiosError(error) && error.response) {
                    const status = error.response.status;
                    if (status === 404 || status === 422) {
                        // API rejected the order IDs, clear invalid ones
                        // But keep the cookie structure intact if possible
                        console.warn(
                            "API rejected order IDs, but keeping cookie for potential recovery"
                        );
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const handleDeleteOrder = async (orderId: number) => {
        try {
            await axios.delete(route("api.orders.destroy", orderId));

            // Remove from state
            const updatedOrders = orders.filter((o) => o.id !== orderId);
            setOrders(updatedOrders);
            setSelectedOrder(null);

            // Update cookie (this also refreshes expiration)
            removeGuestOrder(orderId);

            toast.success("Order deleted successfully");
        } catch (error) {
            console.error("Failed to delete order:", error);
            toast.error("Failed to delete order");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p>Loading history...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 space-y-4">
                <Package size={48} className="opacity-50" />
                <p className="text-lg font-medium"> No order history </p>
                <p className="text-sm text-center px-8">
                    Orders you place will appear here.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4 p-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer group relative"
                        onClick={() => setSelectedOrder(order)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="text-xs font-medium text-gray-500">
                                    {" "}
                                    Order #{order.id}{" "}
                                </span>
                                <p className="text-sm font-bold text-gray-900">
                                    {" "}
                                    {formatDate(order.created_at)}{" "}
                                </p>
                            </div>
                            <span
                                className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                                ${
                                    order.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : order.status === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {order.status}
                            </span>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <span className="font-bold text-gray-900">
                                {" "}
                                {formatPrice(order.total)}{" "}
                            </span>
                            <div className="flex items-center text-brand-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                                Details <ChevronRight size={16} />
                            </div>
                        </div>

                        {/* Quick Delete for Pending Orders */}
                        {order.status === "pending" && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (
                                        confirm(
                                            "Are you sure you want to delete this order?"
                                        )
                                    ) {
                                        handleDeleteOrder(order.id);
                                    }
                                }}
                                className="absolute top-4 right-12 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Order"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <OrderDetailsModal
                order={selectedOrder}
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onDelete={handleDeleteOrder}
            />
        </>
    );
};

export default OrderHistoryList;
