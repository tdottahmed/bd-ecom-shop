import React from "react";
import { Link } from "@inertiajs/react";
import CategoriesMegaMenu from "./CategoriesMegaMenu";
import BrandsDropdown from "./BrandsDropdown";
import { resolvePageHref } from "@/Utils/pageLink";

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
    headerPages?: { title: string; slug: string }[];
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
    headerPages = [],
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

            {blogEnabled && (
                <Link href={route("blog.index")} className={navLinkClass}>
                    Blog
                </Link>
            )}
            {headerPages.map((page) => (
                <Link key={page.slug} href={resolvePageHref(page)} className={navLinkClass}>
                    {page.title}
                </Link>
            ))}
        </>
    );
};

export default DesktopNav;
