import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Modal from "@/Components/Ui/Modal";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import SelectInput from "@/Components/Ui/SelectInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import SecondaryButton from "@/Components/Actions/SecondaryButton";
import { Order } from "@/types";
import { TruckIcon, PackageIcon, LoaderCircleIcon } from "lucide-react";

interface PathaoArea   { area_id: number;   area_name: string }
interface PathaoZone   { zone_id: number;   zone_name: string }
interface PathaoCity   { city_id: number;   city_name: string }

interface ConfirmData {
    name: string;
    address: string;
    phone: string;
    note?: string;
    courier: "steadfast" | "pathao";
    pathao_city_id?: number;
    pathao_zone_id?: number;
    pathao_area_id?: number;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: ConfirmData) => void;
    order: Order | null;
    processing?: boolean;
}

export default function ShippingConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    order,
    processing = false,
}: Props) {
    const [name,    setName]    = useState("");
    const [address, setAddress] = useState("");
    const [phone,   setPhone]   = useState("");
    const [note,    setNote]    = useState("");
    const [courier, setCourier] = useState<"steadfast" | "pathao">("steadfast");

    // Pathao address state
    const [cities,      setCities]      = useState<PathaoCity[]>([]);
    const [zones,       setZones]       = useState<PathaoZone[]>([]);
    const [areas,       setAreas]       = useState<PathaoArea[]>([]);
    const [cityId,      setCityId]      = useState<number | "">("");
    const [zoneId,      setZoneId]      = useState<number | "">("");
    const [areaId,      setAreaId]      = useState<number | "">("");
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingZones,  setLoadingZones]  = useState(false);
    const [loadingAreas,  setLoadingAreas]  = useState(false);

    // Pre-fill from order
    useEffect(() => {
        if (order) {
            setName(order.customer_name || "");
            setAddress(order.customer_address || "");
            setPhone(order.customer_phone || "");
            setNote("");
        }
    }, [order]);

    // Load Pathao cities when tab switches
    useEffect(() => {
        if (courier === "pathao" && cities.length === 0) {
            setLoadingCities(true);
            axios
                .get(route("admin.pathao.cities"))
                .then((r) => setCities(r.data))
                .catch(() => setCities([]))
                .finally(() => setLoadingCities(false));
        }
        // Reset cascading selects when switching courier
        if (courier === "steadfast") {
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: ConfirmData = { name, address, phone, note, courier };
        if (courier === "pathao") {
            data.pathao_city_id = cityId as number;
            data.pathao_zone_id = zoneId as number;
            data.pathao_area_id = areaId as number;
        }
        onConfirm(data);
    };

    const cityOptions = useMemo(
        () => cities.map((c) => ({ value: c.city_id, label: c.city_name })),
        [cities],
    );
    const zoneOptions = useMemo(
        () => zones.map((z) => ({ value: z.zone_id, label: z.zone_name })),
        [zones],
    );
    const areaOptions = useMemo(
        () => areas.map((a) => ({ value: a.area_id, label: a.area_name })),
        [areas],
    );

    const pathaoReady =
        courier === "steadfast" ||
        (courier === "pathao" && !!cityId && !!zoneId && !!areaId);

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-6 bg-[#0E1614] text-gray-100">
                <h2 className="text-lg font-semibold text-[#2DE3A7] mb-1">
                    Confirm Shipping Details
                </h2>
                <p className="text-sm text-gray-400 mb-5">
                    Review customer info and choose a courier before dispatching.
                </p>

                {/* Courier selector */}
                <div className="flex gap-3 mb-6">
                    {(["steadfast", "pathao"] as const).map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setCourier(c)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border text-sm font-medium transition-all ${
                                courier === c
                                    ? "border-[#2DE3A7] bg-[#2DE3A7]/10 text-[#2DE3A7]"
                                    : "border-[#1E2826] bg-[#0C1311] text-gray-400 hover:border-[#2DE3A7]/40"
                            }`}
                        >
                            {c === "steadfast" ? <PackageIcon size={15} /> : <TruckIcon size={15} />}
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Customer details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <InputLabel htmlFor="ship-name" value="Customer Name" />
                            <TextInput
                                id="ship-name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                        <div>
                            <InputLabel htmlFor="ship-phone" value="Phone Number" />
                            <TextInput
                                id="ship-phone"
                                name="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="ship-address" value="Delivery Address" />
                        <TextInput
                            id="ship-address"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="mt-1 block w-full"
                            required
                        />
                    </div>

                    <div>
                        <InputLabel htmlFor="ship-note" value="Note (optional)" />
                        <TextInput
                            id="ship-note"
                            name="note"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="Special instructions for courier"
                        />
                    </div>

                    {/* Pathao address selectors */}
                    {courier === "pathao" && (
                        <div className="border border-[#1E2826] rounded-lg p-4 bg-[#0C1311] space-y-3">
                            <p className="text-xs text-[#2DE3A7] font-medium uppercase tracking-wide mb-1">
                                Pathao Delivery Area
                            </p>

                            {/* City */}
                            <div>
                                <InputLabel htmlFor="pathao-city" value="City" />
                                <div className="mt-1">
                                    {loadingCities ? (
                                        <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 border border-[#1E2826] rounded-xl bg-[#0C1311]">
                                            <LoaderCircleIcon size={14} className="animate-spin" />
                                            Loading cities…
                                        </div>
                                    ) : (
                                        <SelectInput
                                            id="pathao-city"
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
                                <InputLabel htmlFor="pathao-zone" value="Zone" />
                                <div className="mt-1">
                                    {loadingZones ? (
                                        <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 border border-[#1E2826] rounded-xl bg-[#0C1311]">
                                            <LoaderCircleIcon size={14} className="animate-spin" />
                                            Loading zones…
                                        </div>
                                    ) : (
                                        <SelectInput
                                            id="pathao-zone"
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
                                <InputLabel htmlFor="pathao-area" value="Area" />
                                <div className="mt-1">
                                    {loadingAreas ? (
                                        <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-400 border border-[#1E2826] rounded-xl bg-[#0C1311]">
                                            <LoaderCircleIcon size={14} className="animate-spin" />
                                            Loading areas…
                                        </div>
                                    ) : (
                                        <SelectInput
                                            id="pathao-area"
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
                        <PrimaryButton disabled={processing || !pathaoReady}>
                            {processing ? (
                                <>
                                    <LoaderCircleIcon size={14} className="animate-spin mr-1.5" />
                                    Processing…
                                </>
                            ) : (
                                "Confirm & Ship"
                            )}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
