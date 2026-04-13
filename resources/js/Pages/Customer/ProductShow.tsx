import React, { useState, useEffect, useMemo } from "react";
import { Head, Link, router } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Product } from "@/types";
import {
    ShoppingCart,
    ChevronRight,
    Check,
    ShieldCheck,
    Truck,
    PackageCheck,
    ChevronDown,
} from "lucide-react";
import Image from "@/Components/Ui/Image";
import { getAssetUrl } from "@/Utils/helpers";
import { useCartStore } from "@/Stores/useCartStore";
import { useDebounce } from "@/Hooks/useDebounce";
import QuantitySelector from "@/Components/Ui/QuantitySelector";
import ProductVariationSelector from "@/Components/Customer/ProductVariationSelector";
import ProductRequestModal from "@/Components/Customer/ProductRequestModal";
import ProductSlider from "@/Components/Customer/ProductSlider";
import NewsletterSection from "@/Components/Customer/CtaSection";
import ScrollReveal from "@/Components/Ui/ScrollReveal";
import { Bell } from "lucide-react";

interface ProductShowProps {
    product: Product;
    related_products?: Product[];
    random_products?: Product[];
}

const ExpandableDescription = ({ htmlContent }: { htmlContent: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="relative mt-2">
            <div
                className={`prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed font-medium transition-all duration-700 ease-in-out overflow-hidden ${isExpanded ? "max-h-full" : "max-h-[200px]"}`}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            {!isExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
            )}
            <div
                className={`mt-2 ${isExpanded ? "" : "absolute bottom-0 left-0 w-full flex justify-center"}`}
            >
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="inline-flex items-center px-6 py-2.5 rounded-full bg-slate-50 hover:bg-slate-100 font-bold text-brand-primary transition-colors group border border-slate-100 shadow-sm"
                >
                    {isExpanded ? "Read Less" : "Read More"}
                    <ChevronDown
                        size={16}
                        className={`ml-2 transition-transform duration-300 ${isExpanded ? "rotate-180" : "rotate-0 group-hover:translate-y-0.5"}`}
                    />
                </button>
            </div>
        </div>
    );
};

export default function ProductShow({
    product,
    related_products,
    random_products,
}: ProductShowProps) {
    const { cart, addToCart, updateQuantity, setIsOpen } = useCartStore();
    const cartItem = cart[String(product.id)];
    const isInCart = !!cartItem;
    const hasVariations =
        product.product_variations && product.product_variations.length > 0;

    const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
    const [selectedImage, setSelectedImage] = useState(
        product.images?.[0] || null,
    );
    const [selectedVariationPrice, setSelectedVariationPrice] = useState<
        number | null
    >(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestVariationLabel, setRequestVariationLabel] = useState<string | undefined>(undefined);
    const debouncedQuantity = useDebounce(quantity, 300);

    const isOutOfStock = product.stock <= 0 && !product.is_preorder;

    const handleRequestVariation = (label: string) => {
        setRequestVariationLabel(label);
        setShowRequestModal(true);
    };

    // Sync local quantity with store quantity (handling external updates)
    useEffect(() => {
        if (cartItem) {
            setQuantity(cartItem.quantity);
        }
    }, [cartItem?.quantity]);

    // Debounced update to store (handling local updates)
    useEffect(() => {
        if (
            debouncedQuantity > 0 &&
            cartItem &&
            debouncedQuantity !== cartItem.quantity
        ) {
            updateQuantity(String(product.id), debouncedQuantity);
        }
    }, [debouncedQuantity, updateQuantity, product.id]);

    const handleQuantityChange = (type: "increment" | "decrement") => {
        if (type === "increment") {
            setQuantity((prev) => prev + 1);
        } else if (type === "decrement" && quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleAddToCart = () => {
        if (isInCart) {
            setIsOpen(true);
        } else {
            addToCart(product, quantity);
        }
    };

    const handleVariationAddToCart = (variations: any[], quantity: number) => {
        addToCart(product, quantity, variations);
    };

    const displayProducts =
        related_products && related_products.length > 0
            ? related_products
            : random_products && random_products.length > 0
              ? random_products
              : [];

    return (
        <CustomerLayout>
            <Head title={product.name} />

            <div className="bg-slate-50 py-6 md:py-12 min-h-screen">
                <div className="max-w-full px-4 sm:px-6 lg:px-8 mx-auto space-y-12">
                    {/* Main Product Container */}
                    <ScrollReveal animation="fade-up" delay="delay-0">
                        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] border border-slate-100 overflow-hidden">
                            {/* Breadcrumbs */}
                            <div className="border-b border-slate-100 px-6 py-4 md:px-10 md:py-5">
                                <nav className="flex items-center text-sm text-slate-500">
                                    <Link
                                        href="/"
                                        className="hover:text-brand-primary transition-colors"
                                    >
                                        Home
                                    </Link>
                                    <ChevronRight
                                        size={16}
                                        className="mx-2 text-slate-300"
                                    />
                                    <Link
                                        href={route("products.index")}
                                        className="hover:text-brand-primary transition-colors"
                                    >
                                        Products
                                    </Link>
                                    {product.category && (
                                        <>
                                            <ChevronRight
                                                size={16}
                                                className="mx-2 text-slate-300"
                                            />
                                            <Link
                                                href={route(
                                                    "products.category",
                                                    product.category.slug,
                                                )}
                                                className="hover:text-brand-primary transition-colors"
                                            >
                                                {product.category.title}
                                            </Link>
                                        </>
                                    )}
                                    <ChevronRight
                                        size={16}
                                        className="mx-2 text-slate-300"
                                    />
                                    <span className="text-slate-900 font-medium truncate max-w-xs">
                                        {product.name}
                                    </span>
                                </nav>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-10 lg:p-12 items-start">
                                {/* Left Column: Image Gallery & Description */}
                                <div className="flex flex-col space-y-10 w-full max-w-3xl mx-auto lg:mx-0">
                                    {/* Image Gallery Element */}
                                    <div className="space-y-6">
                                        <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden relative group border border-slate-100 shadow-inner">
                                            <Image
                                                src={getAssetUrl(
                                                    selectedImage ||
                                                        product.images[0],
                                                )}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            {product.stock <= 0 &&
                                                !product.is_preorder && (
                                                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                                                        <span className="bg-rose-100 text-rose-800 px-6 py-2 rounded-full font-bold text-lg shadow-sm border border-rose-200">
                                                            Out of Stock
                                                        </span>
                                                    </div>
                                                )}
                                        </div>
                                        {product.images &&
                                            product.images.length > 1 && (
                                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x px-1">
                                                    {product.images.map(
                                                        (image, index) => (
                                                            <button
                                                                key={index}
                                                                onClick={() =>
                                                                    setSelectedImage(
                                                                        image,
                                                                    )
                                                                }
                                                                className={`relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 snap-start shadow-sm ${
                                                                    (selectedImage ||
                                                                        product
                                                                            .images[0]) ===
                                                                    image
                                                                        ? "border-brand-primary ring-4 ring-brand-primary/20 translate-y-[-2px]"
                                                                        : "border-slate-200 hover:border-brand-tint opacity-70 hover:opacity-100"
                                                                }`}
                                                            >
                                                                <img
                                                                    src={getAssetUrl(
                                                                        image,
                                                                    )}
                                                                    alt={`${product.name} thumbnail ${index + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </button>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                    </div>

                                    {/* Product Description Block (Moved to Left Column) */}
                                    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex-grow">
                                        <h3 className="text-xl font-extrabold text-slate-900 mb-5 pb-4 border-b border-slate-100 flex items-center">
                                            <span className="w-2 h-6 bg-brand-primary rounded-full mr-3"></span>
                                            Details & Features
                                        </h3>
                                        <ExpandableDescription
                                            htmlContent={(
                                                product.description || ""
                                            )
                                                .replace(/\\n/g, "<br/>")
                                                .replace(/\n/g, "<br/>")}
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Title, Price, Attributes */}
                                <div className="flex flex-col h-full lg:sticky lg:top-8">
                                    <div className="mb-8">
                                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
                                            {product.name}
                                        </h1>

                                        <div className="flex flex-wrap items-baseline gap-4 mt-6">
                                            {useMemo(() => {
                                                if (
                                                    selectedVariationPrice !==
                                                        null &&
                                                    selectedVariationPrice > 0
                                                ) {
                                                    return (
                                                        <span className="text-3xl md:text-4xl font-extrabold text-brand-primary drop-shadow-sm">
                                                            ৳
                                                            {
                                                                selectedVariationPrice
                                                            }
                                                        </span>
                                                    );
                                                }

                                                // Check if base price is effectively 0 and we have variations with prices
                                                if (
                                                    (!product.sale_price ||
                                                        Number(
                                                            product.sale_price,
                                                        ) === 0) &&
                                                    hasVariations &&
                                                    product.product_variations
                                                ) {
                                                    const validPrices =
                                                        product.product_variations
                                                            .map((v) =>
                                                                v.price != null
                                                                    ? parseFloat(
                                                                          String(
                                                                              v.price,
                                                                          ),
                                                                      )
                                                                    : 0,
                                                            )
                                                            .filter(
                                                                (p) => p > 0,
                                                            );

                                                    if (
                                                        validPrices.length > 0
                                                    ) {
                                                        const minPrice =
                                                            Math.min(
                                                                ...validPrices,
                                                            );
                                                        const maxPrice =
                                                            Math.max(
                                                                ...validPrices,
                                                            );

                                                        if (
                                                            minPrice ===
                                                            maxPrice
                                                        ) {
                                                            return (
                                                                <span className="text-3xl md:text-4xl font-extrabold text-brand-primary drop-shadow-sm">
                                                                    ৳{minPrice}
                                                                </span>
                                                            );
                                                        }

                                                        return (
                                                            <span className="text-3xl md:text-4xl font-extrabold text-brand-primary drop-shadow-sm">
                                                                ৳{minPrice} - ৳
                                                                {maxPrice}
                                                            </span>
                                                        );
                                                    }
                                                }

                                                // Standard logic
                                                if (
                                                    product.discounted_sale_price !=
                                                        null &&
                                                    Number(
                                                        product.discounted_sale_price,
                                                    ) <
                                                        Number(
                                                            product.sale_price,
                                                        )
                                                ) {
                                                    return (
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-4xl font-extrabold text-brand-primary drop-shadow-sm">
                                                                ৳
                                                                {
                                                                    product.discounted_sale_price
                                                                }
                                                            </span>
                                                            <span className="text-2xl text-slate-400 line-through decoration-slate-300 font-medium">
                                                                ৳
                                                                {
                                                                    product.sale_price
                                                                }
                                                            </span>
                                                            <span className="text-sm font-bold text-brand-primary bg-brand-bg px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                                Sale
                                                            </span>
                                                        </div>
                                                    );
                                                }

                                                return (
                                                    <span className="text-3xl md:text-4xl font-extrabold text-brand-primary drop-shadow-sm">
                                                        ৳
                                                        {product.sale_price ||
                                                            0}
                                                    </span>
                                                );
                                            }, [
                                                product,
                                                selectedVariationPrice,
                                                hasVariations,
                                            ])}
                                        </div>
                                    </div>

                                    {/* Variation Selection OR Simple Add to Cart */}
                                    <div className="bg-slate-50/50 p-3 sm:p-6 rounded-3xl border border-slate-100 shadow-[0_2px_15px_rgba(15,23,42,0.02)]">
                                        {hasVariations ? (
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                                    <h3 className="text-lg font-bold text-slate-900">
                                                        Select Options
                                                    </h3>
                                                    <span className="text-xs font-semibold text-brand-primary bg-brand-bg px-2 py-1 rounded-md">
                                                        Required
                                                    </span>
                                                </div>
                                                <ProductVariationSelector
                                                    product={product}
                                                    onAddToCart={
                                                        handleVariationAddToCart
                                                    }
                                                    onRequestVariation={handleRequestVariation}
                                                    onVariationSelect={(
                                                        variation,
                                                        allSelected,
                                                    ) => {
                                                        const imageVariation =
                                                            Object.values(
                                                                allSelected,
                                                            ).find(
                                                                (v) => v.image,
                                                            );
                                                        setSelectedImage(
                                                            imageVariation?.image ||
                                                                product
                                                                    .images?.[0] ||
                                                                null,
                                                        );

                                                        // Find if they selected a price-overriding variation
                                                        const priceVariation =
                                                            Object.values(
                                                                allSelected,
                                                            ).find(
                                                                (v) =>
                                                                    v.price !==
                                                                        null &&
                                                                    v.price !==
                                                                        undefined &&
                                                                    parseFloat(
                                                                        String(
                                                                            v.price,
                                                                        ),
                                                                    ) > 0,
                                                            );

                                                        if (
                                                            priceVariation &&
                                                            priceVariation.price
                                                        ) {
                                                            setSelectedVariationPrice(
                                                                parseFloat(
                                                                    String(
                                                                        priceVariation.price,
                                                                    ),
                                                                ),
                                                            );
                                                        } else {
                                                            setSelectedVariationPrice(
                                                                null,
                                                            );
                                                        }
                                                    }}
                                                />
                                            </div>
                                        ) : isOutOfStock ? (
                                            /* Simple product, out of stock → Request */
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                                        <Bell size={18} className="text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-amber-800">Currently out of stock</p>
                                                        <p className="text-xs text-amber-700 mt-0.5">Submit a request and we'll contact you when it's back.</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setShowRequestModal(true)}
                                                    className="w-full px-8 py-4 rounded-2xl font-bold text-base uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200 shadow-lg hover:-translate-y-1 hover:shadow-xl active:translate-y-0"
                                                >
                                                    <Bell size={22} strokeWidth={2.5} />
                                                    Request This Product
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row gap-5 items-center">
                                                <QuantitySelector
                                                    quantity={quantity}
                                                    onDecrease={() =>
                                                        handleQuantityChange(
                                                            "decrement",
                                                        )
                                                    }
                                                    onIncrease={() =>
                                                        handleQuantityChange(
                                                            "increment",
                                                        )
                                                    }
                                                    max={
                                                        product.is_preorder
                                                            ? undefined
                                                            : product.stock
                                                    }
                                                    size="lg"
                                                />
                                                <button
                                                    className={`w-full sm:flex-1 px-8 py-4 rounded-2xl font-bold text-base uppercase tracking-wide transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 active:shadow-md ${
                                                        isInCart
                                                            ? "bg-brand-success hover:bg-brand-success/90 text-white shadow-brand-success/30"
                                                            : "bg-brand-dark hover:bg-brand-dark/80 text-white shadow-brand-dark/20"
                                                    }`}
                                                    onClick={handleAddToCart}
                                                >
                                                    {isInCart ? (
                                                        <>
                                                            <Check size={22} strokeWidth={3} />
                                                            Added to Cart
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShoppingCart size={22} strokeWidth={2.5} />
                                                            {product.is_preorder && product.stock <= 0
                                                                ? "Pre Order"
                                                                : "Add to Cart"}
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}

                                        {/* Trust Badges section beneath Add to Cart */}
                                        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-8 pt-4 sm:pt-8 border-t border-slate-200/60">
                                            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-center space-y-2 hover:shadow-md transition-shadow">
                                                <div className="w-10 h-10 rounded-full bg-brand-success/10 flex items-center justify-center text-brand-success">
                                                    <ShieldCheck
                                                        size={20}
                                                        strokeWidth={2.5}
                                                    />
                                                </div>
                                                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-600">
                                                    Secure
                                                    <br />
                                                    Checkout
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-center space-y-2 hover:shadow-md transition-shadow">
                                                <div className="w-10 h-10 rounded-full bg-brand-bg flex items-center justify-center text-brand-primary">
                                                    <Truck
                                                        size={20}
                                                        strokeWidth={2.5}
                                                    />
                                                </div>
                                                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-600">
                                                    Fast
                                                    <br />
                                                    Delivery
                                                </span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm text-center space-y-2 hover:shadow-md transition-shadow">
                                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                                    <PackageCheck
                                                        size={20}
                                                        strokeWidth={2.5}
                                                    />
                                                </div>
                                                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-600">
                                                    Easy
                                                    <br />
                                                    Returns
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap items-center gap-4 pt-6 mt-8">
                                        {product.sku && (
                                            <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-slate-200/60 shadow-sm">
                                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                                                    SKU
                                                </span>
                                                <span className="text-slate-900 text-sm font-bold">
                                                    {product.sku}
                                                </span>
                                            </div>
                                        )}
                                        {product.category && (
                                            <div className="flex items-center gap-2 bg-brand-bg px-4 py-2.5 rounded-xl border border-brand-bg shadow-sm">
                                                <span className="text-brand-primary/60 text-xs font-bold uppercase tracking-wider">
                                                    Category
                                                </span>
                                                <Link
                                                    href={route(
                                                        "products.category",
                                                        product.category.slug,
                                                    )}
                                                    className="text-brand-primary hover:text-brand-primary/80 transition-colors text-sm font-bold"
                                                >
                                                    {product.category.title}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Related/Random Products Slider Section */}
                    {displayProducts.length > 0 && (
                        <ScrollReveal animation="fade-up" delay="delay-100">
                            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] border border-slate-100 overflow-hidden box-border">
                                <ProductSlider
                                    products={displayProducts}
                                    title={
                                        related_products &&
                                        related_products.length > 0
                                            ? "You Might Also Like"
                                            : "More Gorgeous Products"
                                    }
                                />
                            </div>
                        </ScrollReveal>
                    )}

                    {/* Newsletter Section */}
                    <ScrollReveal animation="fade-up" delay="delay-150">
                        <NewsletterSection />
                    </ScrollReveal>
                </div>
            </div>

            <ProductRequestModal
                isOpen={showRequestModal}
                onClose={() => { setShowRequestModal(false); setRequestVariationLabel(undefined); }}
                product={product}
                variationLabel={requestVariationLabel}
            />
        </CustomerLayout>
    );
}
