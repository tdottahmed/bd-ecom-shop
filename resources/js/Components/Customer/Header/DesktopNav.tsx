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
    blogEnabled?: boolean;
}

const navLinkClass =
    "px-3 py-1.5 rounded-full text-sm font-medium text-brand-dark hover:text-brand-primary hover:bg-brand-bg transition-colors whitespace-nowrap";

const DesktopNav: React.FC<Props> = ({
    categories,
    featuredCategories,
    brands,
    featuredBrands,
    openDropdown,
    setOpenDropdown,
    blogEnabled = true,
}) => {
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
                onClose={() =>
                    setOpenDropdown((prev) =>
                        prev === "categories" ? null : prev
                    )
                }
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
                onClose={() =>
                    setOpenDropdown((prev) =>
                        prev === "brands" ? null : prev
                    )
                }
            />

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
