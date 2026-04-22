import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Modal from "@/Components/Ui/Modal";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import SelectInput from "@/Components/Ui/SelectInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import SecondaryButton from "@/Components/Actions/SecondaryButton";
import { CourierConfig } from "@/types";
import { PackageIcon, TruckIcon, BotIcon, LoaderCircleIcon, InfoIcon, AlertTriangleIcon } from "lucide-react";

interface PathaoCity { city_id: number; city_name: string }
interface PathaoZone { zone_id: number; zone_name: string }
interface PathaoArea { area_id: number; area_name: string }

export type CourierType = "steadfast" | "pathao" | "carrybee";

export interface BulkConfirmData {
    courier: CourierType;
    note?: string;
    pathao_city_id?: number;
    pathao_zone_id?: number;
    pathao_area_id?: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: BulkConfirmData) => void;
    selectedCount: number;
    processing?: boolean;
    enabledCouriers: { steadfast: CourierConfig; pathao: CourierConfig; carrybee: CourierConfig };
}

export default function BulkConsignmentModal({
    isOpen,
    onClose,
    onConfirm,
    selectedCount,
    processing = false,
    enabledCouriers,
}: Props) {
    const availableCouriers = (
        [
            { id: "steadfast" as CourierType, label: "Steadfast", icon: <PackageIcon size={15} /> },
            { id: "pathao"    as CourierType, label: "Pathao",    icon: <TruckIcon    size={15} /> },
            { id: "carrybee"  as CourierType, label: "Carry Bee", icon: <BotIcon      size={15} /> },
        ] as const
    ).filter(({ id }) => enabledCouriers[id]?.enabled);

    const [courier, setCourier] = useState<CourierType>(availableCouriers[0]?.id ?? "steadfast");
    const [note,    setNote]    = useState("");

    // Pathao cascading address
    const [cities,        setCities]        = useState<PathaoCity[]>([]);
    const [zones,         setZones]         = useState<PathaoZone[]>([]);
    const [areas,         setAreas]         = useState<PathaoArea[]>([]);
    const [cityId,        setCityId]        = useState<number | "">("");
    const [zoneId,        setZoneId]        = useState<number | "">("");
    const [areaId,        setAreaId]        = useState<number | "">("");
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingZones,  setLoadingZones]  = useState(false);
    const [loadingAreas,  setLoadingAreas]  = useState(false);

    // Reset on open
    useEffect(() => {
        if (isOpen) {
            const first = availableCouriers[0]?.id ?? "steadfast";
            setCourier(first);
            setNote("");
            setCityId(""); setZoneId(""); setAreaId("");
            setZones([]); setAreas([]);
        }
    }, [isOpen]);

    // Load Pathao cities when switching to Pathao tab
    useEffect(() => {
        if (courier === "pathao" && cities.length === 0) {
            setLoadingCities(true);
            axios
                .get(route("admin.pathao.cities"))
                .then((r) => setCities(r.data))
                .catch(() => setCities([]))
                .finally(() => setLoadingCities(false));
        }
        if (courier !== "pathao") {
            setCityId(""); setZoneId(""); setAreaId("");
            setZones([]); setAreas([]);
        }
    }, [courier]);

    // Load zones when city changes
    useEffect(() => {
        if (!cityId) { setZones([]); setZoneId(""); setAreas([]); setAreaId(""); return; }
        setLoadingZones(true);
        axios
            .get(route("admin.pathao.zones", { cityId }))
            .then((r) => setZones(r.data))
            .catch(() => setZones([]))
            .finally(() => setLoadingZones(false));
        setZoneId(""); setAreas([]); setAreaId("");
    }, [cityId]);

    // Load areas when zone changes
    useEffect(() => {
        if (!zoneId) { setAreas([]); setAreaId(""); return; }
        setLoadingAreas(true);
        axios
            .get(route("admin.pathao.areas", { zoneId }))
            .then((r) => setAreas(r.data))
            .catch(() => setAreas([]))
            .finally(() => setLoadingAreas(false));
        setAreaId("");
    }, [zoneId]);

    const cityOptions = useMemo(() => cities.map((c) => ({ value: c.city_id, label: c.city_name })), [cities]);
    const zoneOptions = useMemo(() => zones.map((z)  => ({ value: z.zone_id, label: z.zone_name })), [zones]);
    const areaOptions = useMemo(() => areas.map((a)  => ({ value: a.area_id, label: a.area_name })), [areas]);

    const isReady =
        availableCouriers.length > 0 &&
        (courier !== "pathao" || (!!cityId && !!zoneId && !!areaId));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: BulkConfirmData = { courier, note };
        if (courier === "pathao") {
            data.pathao_city_id = cityId as number;
            data.pathao_zone_id = zoneId as number;
            data.pathao_area_id = areaId as number;
        }
        onConfirm(data);
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-6 bg-[#0E1614] text-gray-100">
                <h2 className="text-lg font-semibold text-[#2DE3A7] mb-1">
                    Create Bulk Consignments
                </h2>
                <p className="text-sm text-gray-400 mb-5">
                    Choose a courier for the{" "}
                    <strong className="text-white">{selectedCount} selected order(s)</strong>.
                    Orders that already have a consignment will be skipped.
                </p>

                {/* Courier selector */}
                {availableCouriers.length === 0 ? (
                    <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg px-4 py-3 mb-6 text-sm">
                        <AlertTriangleIcon size={15} className="shrink-0" />
                        No couriers are enabled. Go to <strong className="mx-1">Courier Settings</strong> to enable at least one.
                    </div>
                ) : (
                    <div className="flex gap-3 mb-6">
                        {availableCouriers.map(({ id, label, icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setCourier(id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                                    courier === id
                                        ? "border-[#2DE3A7] bg-[#2DE3A7]/10 text-[#2DE3A7]"
                                        : "border-[#1E2826] bg-[#0C1311] text-gray-400 hover:border-[#2DE3A7]/40"
                                }`}
                            >
                                {icon}
                                {label}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Note */}
                    <div>
                        <InputLabel htmlFor="bulk-note" value="Note (optional — applied to all orders)" />
                        <TextInput
                            id="bulk-note"
                            name="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="e.g. Handle with care"
                        />
                    </div>

                    {/* Pathao address — shared for all orders in the batch */}
                    {courier === "pathao" && (
                        <div className="border border-[#1E2826] rounded-lg p-4 bg-[#0C1311] space-y-3">
                            <p className="text-xs text-[#2DE3A7] font-medium uppercase tracking-wide mb-1">
                                Pathao Delivery Area
                            </p>
                            <div className="flex items-start gap-2 text-xs text-amber-400 bg-amber-500/5 border border-amber-500/20 rounded px-3 py-2">
                                <InfoIcon size={13} className="shrink-0 mt-0.5" />
                                <span>
                                    The same city / zone / area will be applied to all selected orders. Use this for batch deliveries within one area.
                                </span>
                            </div>

                            {/* City */}
                            <div>
                                <InputLabel htmlFor="bulk-pathao-city" value="City" />
                                <div className="mt-1">
                                    {loadingCities ? (
                                        <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 border border-[#1E2826] rounded-xl bg-[#0C1311]">
                                            <LoaderCircleIcon size={14} className="animate-spin" />
                                            Loading cities…
                                        </div>
                                    ) : (
                                        <SelectInput
                                            id="bulk-pathao-city"
                                            value={cityId === "" ? null : cityId}
                                            options={cityOptions}
                                            onChange={(v) => setCityId(v ? Number(v) : "")}
                                            placeholder="Select city"
                                            isSearchable
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Zone */}
                            <div>
                                <InputLabel htmlFor="bulk-pathao-zone" value="Zone" />
                                <div className="mt-1">
                                    {loadingZones ? (
                                        <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 border border-[#1E2826] rounded-xl bg-[#0C1311]">
                                            <LoaderCircleIcon size={14} className="animate-spin" />
                                            Loading zones…
                                        </div>
                                    ) : (
                                        <SelectInput
                                            id="bulk-pathao-zone"
                                            value={zoneId === "" ? null : zoneId}
                                            options={zoneOptions}
                                            onChange={(v) => setZoneId(v ? Number(v) : "")}
                                            placeholder={cityId ? "Select zone" : "Select city first"}
                                            isSearchable
                                            disabled={!cityId}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Area */}
                            <div>
                                <InputLabel htmlFor="bulk-pathao-area" value="Area" />
                                <div className="mt-1">
                                    {loadingAreas ? (
                                        <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 border border-[#1E2826] rounded-xl bg-[#0C1311]">
                                            <LoaderCircleIcon size={14} className="animate-spin" />
                                            Loading areas…
                                        </div>
                                    ) : (
                                        <SelectInput
                                            id="bulk-pathao-area"
                                            value={areaId === "" ? null : areaId}
                                            options={areaOptions}
                                            onChange={(v) => setAreaId(v ? Number(v) : "")}
                                            placeholder={zoneId ? "Select area" : "Select zone first"}
                                            isSearchable
                                            disabled={!zoneId}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <SecondaryButton type="button" onClick={onClose} disabled={processing}>
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton disabled={processing || !isReady}>
                            {processing ? (
                                <>
                                    <LoaderCircleIcon size={14} className="animate-spin mr-1.5" />
                                    Creating…
                                </>
                            ) : (
                                `Create ${selectedCount} Consignment${selectedCount !== 1 ? "s" : ""}`
                            )}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
