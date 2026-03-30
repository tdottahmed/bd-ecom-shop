import React, { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import Master from "@/Layouts/Master";
import { Order, PaginatedData, PageProps } from "@/types";
import OrderGridItem from "@/Components/Order/OrderGridItem";
import OrderListItem from "@/Components/Order/OrderListItem";
import { useDebounce } from "@/Hooks/useDebounce";
import Pagination from "@/Components/Ui/Pagination";
import OrderHeader from "./Partials/OrderHeader";
import OrderToolbar from "./Partials/OrderToolbar";
import OrderBulkActions from "./Partials/OrderBulkActions";
import OrderEmptyState from "./Partials/OrderEmptyState";
import ShippingConfirmationModal from "./Partials/ShippingConfirmationModal";

interface Props extends PageProps {
    orders: PaginatedData<Order>;
    filters: {
        search?: string;
        status?: string;
    };
}

export default function Index({ orders, filters }: Props) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [search, setSearch] = useState(filters.search || "");
    const debouncedSearch = useDebounce(search, 500);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Shipping Modal State
    const [isShippingModalOpen, setIsShippingModalOpen] = useState(false);
    const [selectedOrderForShipping, setSelectedOrderForShipping] =
        useState<Order | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Active Search Effect
    useEffect(() => {
        if (debouncedSearch !== (filters.search || "")) {
            router.get(
                route("admin.orders.index"),
                {
                    search: debouncedSearch,
                    status: filters.status,
                },
                { preserveState: true, preserveScroll: true }
            );
        }
    }, [debouncedSearch]);

    // Load view mode from local storage
    useEffect(() => {
        const savedMode = localStorage.getItem("orderViewMode");
        if (savedMode === "grid" || savedMode === "list") {
            setViewMode(savedMode);
        }
    }, []);

    // Save view mode to local storage
    const handleViewModeChange = (mode: "grid" | "list") => {
        setViewMode(mode);
        localStorage.setItem("orderViewMode", mode);
    };

    // Status tabs
    const statuses = [
        "all",
        "pending",
        "unreachable",
        "preparing",
        "shipping",
        "completed",
        "cancelled",
        "returned",
    ];

    // Handle Status Filter
    const handleStatusChange = (status: string) => {
        router.get(
            route("admin.orders.index"),
            {
                search: filters.search,
                status: status === "all" ? undefined : status,
            },
            { preserveState: true }
        );
    };

    // Handle Status Update
    const updateStatus = (order: Order, newStatus: string) => {
        if (newStatus === "shipping") {
            setSelectedOrderForShipping(order);
            setIsShippingModalOpen(true);
            return;
        }

        router.post(
            route("admin.orders.update-status", order.id),
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    // Optional toast notification could go here
                },
            }
        );
    };

    const handleShippingConfirm = (data: {
        name: string;
        address: string;
        phone: string;
        note?: string;
        courier: "steadfast" | "pathao";
        pathao_city_id?: number;
        pathao_zone_id?: number;
        pathao_area_id?: number;
    }) => {
        if (!selectedOrderForShipping) return;

        router.post(
            route("admin.orders.update-status", selectedOrderForShipping.id),
            {
                status: "shipping",
                ...data,
                create_consignment: true,
            },
            {
                preserveScroll: true,
                onStart: () => setIsProcessing(true),
                onFinish: () => setIsProcessing(false),
                onSuccess: () => {
                    setIsShippingModalOpen(false);
                    setSelectedOrderForShipping(null);
                },
            }
        );
    };

    // Selection Logic
    const toggleSelect = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((i) => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === orders.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(orders.data.map((o) => o.id));
        }
    };

    // Bulk Actions
    const handleBulkDetails = () => {
        router.get(route("admin.orders.bulk-details"), {
            ids: selectedIds.join(","),
        });
    };

    const handleBulkPrint = () => {
        const url = route("admin.orders.bulk-invoice", {
            ids: selectedIds.join(","),
        });
        window.open(url, "_blank");
    };

    // Status options for SelectInput
    const statusOptions = statuses.map((s) => ({
        value: s,
        label: s.charAt(0).toUpperCase() + s.slice(1),
    }));

    const filterStatusOptions = [
        { value: "all", label: "All Statuses" },
        ...statuses
            .filter((s) => s !== "all")
            .map((s) => ({
                value: s,
                label: s.charAt(0).toUpperCase() + s.slice(1),
            })),
    ];

    return (
        <Master>
            <Head title="Orders" />

            <div className="md:p-6 space-y-6 pb-4 min-h-screen bg-[#0C1311]">
                {/* Header & Search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <OrderHeader />

                    <OrderToolbar
                        search={search}
                        setSearch={setSearch}
                        filters={filters}
                        filterStatusOptions={filterStatusOptions}
                        handleStatusChange={handleStatusChange}
                        viewMode={viewMode}
                        handleViewModeChange={handleViewModeChange}
                    />
                </div>

                {/* Selection & Bulk Actions Bar */}
                <OrderBulkActions
                    selectedIds={selectedIds}
                    totalOrders={orders.data.length}
                    toggleSelectAll={toggleSelectAll}
                    handleBulkDetails={handleBulkDetails}
                    handleBulkPrint={handleBulkPrint}
                />

                {/* Orders Grid/List */}
                {orders.data.length > 0 ? (
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                                : "space-y-3"
                        }
                    >
                        {orders.data.map((order) =>
                            viewMode === "grid" ? (
                                <OrderGridItem
                                    key={order.id}
                                    order={order}
                                    selected={selectedIds.includes(order.id)}
                                    onSelect={() => toggleSelect(order.id)}
                                    onStatusChange={updateStatus}
                                    statusOptions={statusOptions}
                                />
                            ) : (
                                <OrderListItem
                                    key={order.id}
                                    order={order}
                                    selected={selectedIds.includes(order.id)}
                                    onSelect={() => toggleSelect(order.id)}
                                    onStatusChange={updateStatus}
                                    statusOptions={statusOptions}
                                />
                            )
                        )}
                    </div>
                ) : (
                    <OrderEmptyState />
                )}
                <Pagination data={orders} />

                <ShippingConfirmationModal
                    isOpen={isShippingModalOpen}
                    onClose={() => setIsShippingModalOpen(false)}
                    onConfirm={handleShippingConfirm}
                    order={selectedOrderForShipping}
                    processing={isProcessing}
                />
            </div>
        </Master>
    );
}
