import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import { useForm } from "@inertiajs/react";

export default function Addresses({ address }: { address: string | null }) {
    const form = useForm({
        name: "",
        phone: "",
        address: address ?? "",
    });

    return (
        <CustomerAccountLayout title="Addresses">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.put(route("account.profile.update"));
                }}
                className="space-y-4"
            >
                <p className="text-sm text-gray-500">
                    Save your default delivery address for faster checkout.
                </p>
                <textarea
                    rows={4}
                    value={form.data.address}
                    onChange={(e) => form.setData("address", e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2"
                    placeholder="Your delivery address"
                />
                <button
                    type="submit"
                    className="rounded-lg bg-gray-900 text-white px-4 py-2"
                >
                    Save Address
                </button>
            </form>
        </CustomerAccountLayout>
    );
}
