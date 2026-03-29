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
        category_id?: string;
        brand_id?: string;
    };
    brands?: { id: number; title: string; slug: string }[];
}

const Home: React.FC<HomeProps> = ({
    categories,
    productsByCategory = [],
    bannerImages,
    bannerActive,
    homeContent,
    filters = {},
    category,
    brands = [],
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

    const handleApplyFilters = (params: Record<string, string>) => {
        let targetUrl = currentUrl;
        
        if (params.category_id) {
            const selectedCat = categories?.find(c => c.id.toString() === params.category_id);
            if (selectedCat) {
                targetUrl = route("products.category", selectedCat.slug);
                delete params.category_id;
            }
        } else if (currentUrl.includes('/category/')) {
            targetUrl = route("products.index");
        }
        
        router.visit(targetUrl, { data: params, preserveState: true, preserveScroll: true });
    };

    return (
        <CustomerLayout>
            <Head title={category ? category.title : "Home"} />
            <div className="relative min-h-screen bg-luxury-page text-slate-900">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[min(60vh,520px)] bg-gradient-to-b from-white/40 to-transparent" />

                <FilterSidebar
                    isOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    filters={filters}
                    categories={categories}
                    brands={brands}
                    onApply={handleApplyFilters}
                />

                <div className="relative w-full px-4 pb-6 pt-4 sm:px-6 sm:pb-8 sm:pt-6 lg:px-10 lg:pt-8">
                    <ScrollReveal animation="fade-up" delay="delay-0">
                        <Hero
                            bannerImages={bannerImages}
                            bannerActive={bannerActive}
                            content={homeContent?.hero}
                        />
                    </ScrollReveal>
                </div>

                <div className="relative mx-auto flex max-w-full flex-col gap-6 px-4 pb-10 sm:px-6 lg:px-10">
                    <div className="space-y-8 md:space-y-12">
                        {/* Categories — bento */}
                        <ScrollReveal animation="fade-up" delay="delay-150">
                            <div className="overflow-hidden rounded-[24px] border border-white/40 bg-white/50 shadow-luxury backdrop-blur-xl">
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
                                primaryCtaText={
                                    homeContent?.promo?.primaryCtaText
                                }
                                secondaryCtaText={
                                    homeContent?.promo?.secondaryCtaText
                                }
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
                                className="rounded-[24px] border border-white/50 bg-white/85 py-4 shadow-luxury backdrop-blur-xl md:py-6"
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

                        {/* Features Section */}
                        <ScrollReveal animation="fade-up" delay="delay-100">
                            <FeaturesSection
                                enabled={homeContent?.features?.enabled}
                                title={homeContent?.features?.title}
                                subtitle={homeContent?.features?.subtitle}
                                items={homeContent?.features?.items}
                            />
                        </ScrollReveal>
                        {/* Newsletter Section */}
                        <ScrollReveal animation="fade-up" delay="delay-200">
                            <NewsletterSection
                                enabled={homeContent?.newsletter?.enabled}
                                title={homeContent?.newsletter?.title}
                                description={
                                    homeContent?.newsletter?.description
                                }
                                placeholder={
                                    homeContent?.newsletter?.placeholder
                                }
                            />
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Home;
