import React, { useEffect, useMemo, useState } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import Card from "@/Components/Ui/Card";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import InputError from "@/Components/Ui/InputError";
import { Head, Link, useForm } from "@inertiajs/react";

type PreviewRow = {
    row: number;
    data: Record<string, any>;
    errors: string[];
};

type Preview = {
    rows: PreviewRow[];
    counts: { total: number; valid: number; invalid: number };
    willCreate: { categories: string[]; brands: string[]; attributes: string[] };
    formatHelp: { variations: string; images: string };
};

interface Props {
    token: string | null;
    preview: Preview | null;
}

export default function Import({ token, preview }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        file: null as File | null,
        token: token || "",
    });

    const [selectedFileName, setSelectedFileName] = useState<string>("");

    useEffect(() => {
        // When backend redirects back with a new token after preview,
        // keep the form state in sync so confirm works without reload.
        setData("token", token || "");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const canConfirm = useMemo(
        () => !!token && !!preview && preview.counts.valid > 0,
        [token, preview],
    );

    const handlePreview = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.products.import.preview"), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleConfirm = () => {
        post(route("admin.products.import.confirm"), {
            preserveScroll: true,
        });
    };

    return (
        <Master title="Import Products" head={<Header title="Import Products" showUserMenu={true} />}>
            <Head title="Import Products" />

            <div className="md:p-6 space-y-6 max-w-6xl mx-auto">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            Import products from Excel/CSV
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            Upload a file, review validation, then confirm import.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={route("admin.products.index")}
                            className="px-4 py-2 rounded-lg border border-gray-700 text-gray-200 hover:bg-[#151F1D] transition-colors"
                        >
                            Back to products
                        </Link>
                        <a
                            href={route("admin.products.import.template")}
                            className="px-4 py-2 rounded-lg bg-[#151F1D] border border-gray-700 text-white hover:bg-[#1A2624] hover:border-[#2DE3A7] transition-all"
                        >
                            Download template
                        </a>
                    </div>
                </div>

                <Card>
                    <h3 className="text-lg font-semibold text-[#2DE3A7] mb-3">
                        Instructions
                    </h3>
                    <div className="text-sm text-gray-300 space-y-2">
                        <p>
                            - Required columns: <b>name</b>, <b>category</b>, <b>purchase_price</b>, <b>sale_price</b>.
                        </p>
                        <p>
                            - Optional: <b>brand</b> (auto-create if not exists), <b>images</b>, <b>variations</b>, <b>slug</b>, <b>description</b>, <b>stock</b>.
                        </p>
                        <p>
                            - <b>Variations</b>: {preview?.formatHelp?.variations ?? 'Use | to separate variations. Format: Attribute:Value:Price:Stock'}
                        </p>
                        <p>
                            - <b>Images</b>: {preview?.formatHelp?.images ?? 'Optional. Use | to separate multiple image URLs/paths.'}
                        </p>
                        <p className="text-gray-400">
                            Note: Import creates new products; it will skip rows with validation errors.
                        </p>
                    </div>
                </Card>

                <Card>
                    <form onSubmit={handlePreview} className="space-y-4">
                        <div>
                            <label className="text-sm text-gray-300 block mb-2">
                                Upload file (.xlsx / .csv)
                            </label>
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={(e) => {
                                    const f = e.target.files?.[0] ?? null;
                                    setData("file", f);
                                    setSelectedFileName(f?.name ?? "");
                                }}
                                className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#151F1D] file:text-white hover:file:bg-[#1A2624]"
                            />
                            {selectedFileName && (
                                <div className="text-xs text-gray-400 mt-2">
                                    Selected: {selectedFileName}
                                </div>
                            )}
                            <InputError message={errors.file as any} className="mt-2" />
                        </div>

                        <div className="flex justify-end gap-2">
                            <PrimaryButton type="submit" disabled={processing || !data.file}>
                                {processing ? "Validating..." : "Preview & Validate"}
                            </PrimaryButton>
                        </div>
                    </form>
                </Card>

                {preview && (
                    <Card>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    Preview
                                </h3>
                                <p className="text-sm text-gray-400">
                                    Total: {preview.counts.total} • Valid:{" "}
                                    <span className="text-[#2DE3A7] font-semibold">
                                        {preview.counts.valid}
                                    </span>{" "}
                                    • Invalid:{" "}
                                    <span className="text-red-400 font-semibold">
                                        {preview.counts.invalid}
                                    </span>
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <PrimaryButton
                                    type="button"
                                    disabled={!canConfirm || processing}
                                    onClick={handleConfirm}
                                >
                                    {processing ? "Importing..." : "Confirm Import"}
                                </PrimaryButton>
                            </div>
                        </div>

                        {(preview.willCreate.categories.length > 0 ||
                            preview.willCreate.brands.length > 0 ||
                            preview.willCreate.attributes.length > 0) && (
                            <div className="mb-4 text-sm text-gray-300">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="bg-[#151F1D] border border-gray-800 rounded-lg p-3">
                                        <div className="font-semibold text-white mb-1">
                                            Will create categories
                                        </div>
                                        <div className="text-gray-400 text-xs">
                                            {preview.willCreate.categories.join(", ") || "-"}
                                        </div>
                                    </div>
                                    <div className="bg-[#151F1D] border border-gray-800 rounded-lg p-3">
                                        <div className="font-semibold text-white mb-1">
                                            Will create brands
                                        </div>
                                        <div className="text-gray-400 text-xs">
                                            {preview.willCreate.brands.join(", ") || "-"}
                                        </div>
                                    </div>
                                    <div className="bg-[#151F1D] border border-gray-800 rounded-lg p-3">
                                        <div className="font-semibold text-white mb-1">
                                            Will create attributes
                                        </div>
                                        <div className="text-gray-400 text-xs">
                                            {preview.willCreate.attributes.join(", ") || "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="overflow-auto border border-gray-800 rounded-lg">
                            <table className="min-w-full text-sm">
                                <thead className="bg-[#151F1D] text-gray-300">
                                    <tr>
                                        <th className="text-left px-3 py-2 whitespace-nowrap">
                                            Row
                                        </th>
                                        <th className="text-left px-3 py-2 whitespace-nowrap">
                                            Name
                                        </th>
                                        <th className="text-left px-3 py-2 whitespace-nowrap">
                                            Category
                                        </th>
                                        <th className="text-left px-3 py-2 whitespace-nowrap">
                                            Brand
                                        </th>
                                        <th className="text-left px-3 py-2 whitespace-nowrap">
                                            Price
                                        </th>
                                        <th className="text-left px-3 py-2 whitespace-nowrap">
                                            Errors
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {preview.rows.slice(0, 100).map((r) => (
                                        <tr key={r.row} className="text-gray-200">
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                {r.row}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                {r.data.name}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                {r.data.category}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                {r.data.brand || "-"}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                {r.data.sale_price}
                                            </td>
                                            <td className="px-3 py-2">
                                                {r.errors.length > 0 ? (
                                                    <ul className="text-red-400 list-disc list-inside">
                                                        {r.errors.map((e, i) => (
                                                            <li key={i}>{e}</li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="text-[#2DE3A7] font-semibold">
                                                        OK
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {preview.rows.length > 100 && (
                            <div className="text-xs text-gray-400 mt-3">
                                Showing first 100 rows only.
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </Master>
    );
}

