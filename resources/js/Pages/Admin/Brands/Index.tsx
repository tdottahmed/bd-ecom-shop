import React, { useState } from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import { Link, router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { Brand } from "@/types";
import { getAssetUrl } from "@/Utils/helpers";

interface BrandsIndexProps {
    brands: (Brand & { products_count: number })[];
}

const Index: React.FC<BrandsIndexProps> = ({ brands }) => {
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this brand?")) {
            setDeletingId(id);
            router.delete(route("admin.brands.destroy", id), {
                onFinish: () => setDeletingId(null),
            });
        }
    };

    return (
        <Master
            title="Brands"
            head={<Header title="Brands" showUserMenu={true} />}
        >
            <div className="p-4 md:p-6 space-y-6 max-w-8xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">
                            Brands
                        </h1>
                        <p className="text-sm md:text-base text-gray-400 mt-1">
                            Manage product brands
                        </p>
                    </div>

                    <Link
                        href={route("admin.brands.create")}
                        className="w-full md:w-auto"
                    >
                        <PrimaryButton className="w-full md:w-auto flex items-center justify-center gap-2">
                            <Plus size={18} />
                            <span> Add Brand </span>
                        </PrimaryButton>
                    </Link>
                </div>

                {brands.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {brands.map((brand) => (
                            <div
                                key={brand.id}
                                className="bg-[#0E1614] rounded-lg border border-[#1E2826] overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="aspect-video bg-[#0E1614] relative">
                                    {brand.image ? (
                                        <img
                                            src={getAssetUrl(brand.image)}
                                            alt={brand.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Tag
                                                size={48}
                                                className="text-gray-400"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-lg font-semibold text-white">
                                            {brand.title}
                                        </h3>
                                        {brand.is_featured !== false && (
                                            <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                                Featured
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 mt-1">
                                        {brand.slug}
                                    </p>
                                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                                        <Tag size={16} />
                                        <span>
                                            {brand.products_count} product
                                            {brand.products_count !== 1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </div>
                                </div>
                                <div className="px-4 pb-4 flex gap-2">
                                    <Link
                                        href={route(
                                            "admin.brands.edit",
                                            brand.id
                                        )}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                    >
                                        <Edit size={16} />
                                        <span> Edit </span>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(brand.id)}
                                        disabled={deletingId === brand.id}
                                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-[#0E1614]/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-[#1E2826]">
                        <Tag
                            size={48}
                            className="mx-auto text-gray-400 mb-4"
                        />
                        <p className="text-gray-400 mb-4">
                            No brands found. Create your first brand to get
                            started.
                        </p>
                        <Link href={route("admin.brands.create")}>
                            <PrimaryButton className="inline-flex items-center gap-2">
                                <Plus size={18} />
                                <span> Add Brand </span>
                            </PrimaryButton>
                        </Link>
                    </div>
                )}
            </div>
        </Master>
    );
};

export default Index;
