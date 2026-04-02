import React from "react";
import { Link } from "@inertiajs/react";
import CategoriesMegaMenu from "./CategoriesMegaMenu";
import BrandsDropdown from "./BrandsDropdown";

interface Category {
    id: number;
    title: string;
    slug: string;
    image?: string;
    products?: any[];
}

interface Brand {
    id: number;
    title: string;
    slug: string;
    image?: string;
}

interface Props {
    categories: Category[];
    featuredCategories: Category[];
    brands: Brand[];
    featuredBrands: Brand[];
    openDropdown: "categories" | "brands" | null;
    setOpenDropdown: (val: "categories" | "brands" | null | ((prev: "categories" | "brands" | null) => "categories" | "brands" | null)) => void;
    isMdRow?: boolean;
    blogEnabled?: boolean;
}

const DesktopNav: React.FC<Props> = ({
    categories,
    featuredCategories,
    brands,
    featuredBrands,
    openDropdown,
    setOpenDropdown,
    isMdRow = false,
    blogEnabled = true,
}) => {
    // Nav link base classes based on context
    const navLinkClass = isMdRow
        ? "px-3 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap"
        : "px-2 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors whitespace-nowrap";

    return (
        <>
            <Link href={route("home")} className={navLinkClass}>
                Home
            </Link>
            <Link href={route("products.index")} className={navLinkClass}>
                Products
            </Link>

            <CategoriesMegaMenu
                categories={categories}
                featuredCategories={featuredCategories}
                isOpen={openDropdown === "categories"}
                onToggle={() =>
                    setOpenDropdown((prev) =>
                        prev === "categories" ? null : "categories"
                    )
                }
                onMouseEnter={() => setOpenDropdown("categories")}
                onClose={() => setOpenDropdown((prev) => prev === "categories" ? null : prev)}
            />

            <BrandsDropdown
                brands={brands}
                featuredBrands={featuredBrands}
                isOpen={openDropdown === "brands"}
                onToggle={() =>
                    setOpenDropdown((prev) =>
                        prev === "brands" ? null : "brands"
                    )
                }
                onMouseEnter={() => setOpenDropdown("brands")}
                onClose={() => setOpenDropdown((prev) => prev === "brands" ? null : prev)}
            />

            {isMdRow && <div className="flex-1" />}

            <Link href={route("pages.about")} className={navLinkClass}>
                About Us
            </Link>
            {blogEnabled && (
                <Link href={route("blog.index")} className={navLinkClass}>
                    Blog
                </Link>
            )}
            <Link href={route("pages.contact")} className={navLinkClass}>
                Contact Us
            </Link>
        </>
    );
};

export default DesktopNav;
