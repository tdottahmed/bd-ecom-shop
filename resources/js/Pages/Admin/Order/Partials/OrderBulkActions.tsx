import Checkbox from "@/Components/Ui/Checkbox";
import { Eye, Printer, Truck } from "lucide-react";

interface Props {
    selectedIds: number[];
    totalOrders: number;
    toggleSelectAll: () => void;
    handleBulkDetails: () => void;
    handleBulkPrint: () => void;
    onBulkConsignmentOpen: () => void;
}

export default function OrderBulkActions({
    selectedIds,
    totalOrders,
    toggleSelectAll,
    handleBulkDetails,
    handleBulkPrint,
    onBulkConsignmentOpen,
}: Props) {
    return (
        <div className="flex items-center justify-between bg-[#0E1614] p-4 rounded-lg border border-[#1E2826]">
            <div className="flex items-center gap-3">
                <Checkbox
                    name="select-all"
                    checked={
                        selectedIds.length === totalOrders && totalOrders > 0
                    }
                    onChange={toggleSelectAll}
                />
                <span className="text-sm text-gray-400">
                    {selectedIds.length > 0
                        ? `${selectedIds.length} Selected`
                        : "Select All"}
                </span>
            </div>

            {selectedIds.length > 0 && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={onBulkConsignmentOpen}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                        title="Create courier consignments for selected orders"
                    >
                        <Truck className="w-4 h-4" />
                        <span className="hidden sm:inline">Create Consignments</span>
                    </button>
                    <button
                        onClick={handleBulkDetails}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1E2826] text-white rounded-lg font-semibold text-sm hover:bg-[#2A3633] transition-colors border border-[#2A3633]"
                    >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline"> Details </span>
                    </button>
                    <button
                        onClick={handleBulkPrint}
                        className="flex items-center gap-2 px-4 py-2 bg-[#2DE3A7] text-[#0C1311] rounded-lg font-semibold text-sm hover:bg-[#26c28f] transition-colors"
                    >
                        <Printer className="w-4 h-4" />
                        <span className="hidden sm:inline"> Print Invoices </span>
                    </button>
                </div>
            )}
        </div>
    );
}
