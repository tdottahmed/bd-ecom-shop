import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import Hero from "@/Components/Customer/Hero";
import CategorySlider from "@/Components/Customer/CategorySlider";
import ProductGrid from "@/Components/Customer/ProductGrid";
import FilterSidebar from "@/Components/Customer/FilterSidebar";
import FeaturesSection from "@/Components/Customer/FeaturesSection";
import PromoBanner from "@/Components/Customer/PromoBanner";
import NewsletterSection from "@/Components/Customer/NewsletterSection";
import ScrollReveal from "@/Components/Ui/ScrollReveal";
import { Category, Product, PaginatedData } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductFilters from "@/Components/Customer/ProductFilters";
import BrandsShowcaseSection from "@/Components/Customer/BrandsShowcaseSection";

interface CategoryProductsSection {
    category: Category;
    products: PaginatedData<Product>;
}

interface HomeProps {
    categories: Category[];
    productsByCategory: CategoryProductsSection[];
    bannerImages?: string[];
    bannerActive?: boolean;
    homeContent?: any;
    category?: Category;
    filters?: {
        search?: string;
        min_price?: string;
        max_price?: string;
        sort?: string;
        in_stock?: string;
        is_preorder?: string;
        stock_out?: string;
    };
}

const Home: React.FC<HomeProps> = ({
    categories,
    productsByCategory = [],
    bannerImages,
    bannerActive,
    homeContent,
    filters = {},
    category,
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sort, setSort] = useState(filters.sort || "latest");

    // Debounced Sort Effect
    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (sort !== (filters.sort || "latest")) {
                const params: Record<string, string> = {};
                if (filters.search) params.search = filters.search;
                if (filters.min_price) params.min_price = filters.min_price;
                if (filters.max_price) params.max_price = filters.max_price;
                if (sort && sort !== "latest") params.sort = sort;
                if (filters.is_preorder)
                    params.is_preorder = filters.is_preorder;
                if (filters.stock_out) params.stock_out = filters.stock_out;

                const currentUrl = category
                    ? route("products.category", category.slug)
                    : route("home");

                router.visit(currentUrl, {
                    data: params,
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                });
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(timeoutId);
    }, [sort, filters]);

    const currentUrl = category
        ? route("products.category", category.slug)
        : route("home");

    return (
        <CustomerLayout>
            <Head title={category ? category.title : "Home"} />
            <div className="relative min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
                {/* Background accents */}
                <div className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center">
                    <div className="h-72 w-[36rem] rounded-full bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 opacity-40 blur-3xl" />
                </div>
                <div className="pointer-events-none absolute -bottom-32 left-0 h-64 w-64 rounded-full bg-emerald-300/25 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-indigo-300/25 blur-3xl" />

                <div className="relative mx-auto flex max-w-7xl flex-col gap-6 px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:px-10 lg:pt-10">
                    <FilterSidebar
                        isOpen={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                        filters={filters}
                        currentUrl={currentUrl}
                    />
                    <div className="space-y-8 md:space-y-12">
                        {/* Hero Section */}
                        <Hero
                            bannerImages={bannerImages}
                            bannerActive={bannerActive}
                        />
                        {/* Categories */}
                        <ScrollReveal animation="fade-up" delay="delay-150">
                            <div className="rounded-2xl border border-slate-100 bg-white/80 shadow-[0_18px_45px_rgba(15,23,42,0.12)] backdrop-blur-lg">
                                <CategorySlider
                                    categories={categories}
                                    activeCategory={category}
                                />
                            </div>
                        </ScrollReveal>

                        {/* Promo Banner */}
                        <ScrollReveal animation="fade-up" delay="delay-200">
                            <PromoBanner
                                enabled={homeContent?.promo?.enabled}
                                badge={homeContent?.promo?.badge}
                                title={homeContent?.promo?.title}
                                description={homeContent?.promo?.description}
                                bgImage={homeContent?.promo?.bgImage}
                                primaryCtaText={homeContent?.promo?.primaryCtaText}
                                secondaryCtaText={homeContent?.promo?.secondaryCtaText}
                            />
                        </ScrollReveal>

                        {/* Brands showcase */}
                        <ScrollReveal animation="fade-up" delay="delay-200">
                            <BrandsShowcaseSection
                                enabled={homeContent?.brands?.enabled}
                                title={homeContent?.brands?.title}
                                subtitle={homeContent?.brands?.subtitle}
                                ctaText={homeContent?.brands?.ctaText}
                            />
                        </ScrollReveal>

                        {/* Search / Filters & Products Section */}
                        <ScrollReveal animation="fade-up" delay="delay-0">
                            <div
                                className="rounded-3xl border border-slate-100 bg-white py-4 md:py-6 shadow-[0_22px_55px_rgba(15,23,42,0.14)] backdrop-blur-xl"
                                id="products-section"
                            >
                                <ProductFilters
                                    sort={sort}
                                    setSort={setSort}
                                    setIsFilterOpen={setIsFilterOpen}
                                    filters={filters}
                                />
                                <div className="mt-3 md:mt-4">
                                    <ProductGrid
                                        productsByCategory={productsByCategory}
                                        filters={filters}
                                    />
                                </div>
                            </div>
                        </ScrollReveal>
                        
                        {/* Newsletter Section */}
                        <ScrollReveal animation="fade-up" delay="delay-200">
                            <NewsletterSection
                                enabled={homeContent?.newsletter?.enabled}
                                title={homeContent?.newsletter?.title}
                                description={homeContent?.newsletter?.description}
                                placeholder={homeContent?.newsletter?.placeholder}
                            />
                        </ScrollReveal>

                         {/* Features Section */}
                        <ScrollReveal animation="fade-up" delay="delay-100">
                            <FeaturesSection
                                enabled={homeContent?.features?.enabled}
                                title={homeContent?.features?.title}
                                subtitle={homeContent?.features?.subtitle}
                                items={homeContent?.features?.items}
                            />
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Home;
