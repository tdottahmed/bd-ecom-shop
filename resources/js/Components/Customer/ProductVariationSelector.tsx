import React, { useState, useEffect, useMemo, useRef } from "react";
import { Product, ProductVariation } from "@/types";
import { Check, X, Bell, Zap, ShoppingCart } from "lucide-react";
import { formatPrice, getAssetUrl } from "@/Utils/helpers";
import { toast } from "sonner";

interface ProductVariationSelectorProps {
    product: Product;
    onAddToCart: (variations: ProductVariation[], quantity: number) => void;
    onBuyNow?: () => void;
    onVariationSelect?: (
        variation: ProductVariation,
        allSelected: Record<number, ProductVariation>,
    ) => void;
    onRequestVariation?: (label: string) => void;
}

const ProductVariationSelector: React.FC<ProductVariationSelectorProps> = ({
    product,
    onAddToCart,
    onBuyNow,
    onVariationSelect,
    onRequestVariation,
}) => {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);
    const [selectedVariations, setSelectedVariations] = useState<
        Record<number, ProductVariation>
    >({});
    const [cartBatch, setCartBatch] = useState<
        { variations: ProductVariation[]; quantity: number }[]
    >([]);
    const [isOutOfStockCombo, setIsOutOfStockCombo] = useState(false);

    // Group variations by attribute
    const variationsByAttribute = useMemo(() => {
        const groups: Record<
            number,
            { name: string; variations: ProductVariation[] }
        > = {};

        if (!product.product_variations) return groups;

        product.product_variations.forEach((variation) => {
            const attrId = variation.product_attribute_id;
            const attrName =
                variation.product_attribute?.name ||
                variation.attribute?.name ||
                "Option";

            if (attrId) {
                if (!groups[attrId]) {
                    groups[attrId] = {
                        name: attrName,
                        variations: [],
                    };
                }
                groups[attrId].variations.push(variation);
            }
        });

        return groups;
    }, [product]);

    const handleVariationSelect = (
        attributeId: number,
        variation: ProductVariation,
    ) => {
        const newSelected = {
            ...selectedVariations,
            [attributeId]: variation,
        };
        setSelectedVariations(newSelected);
        setIsOutOfStockCombo(false);
        if (onVariationSelect) {
            onVariationSelect(variation, newSelected);
        }
    };

    const isAllSelected =
        Object.keys(variationsByAttribute).length > 0 &&
        Object.keys(variationsByAttribute).every(
            (attrId) => selectedVariations[Number(attrId)],
        );

    // Calculate available stock for CURRENT selection
    const currentSelectionStock = useMemo(() => {
        if (!isAllSelected || Object.keys(selectedVariations).length === 0) {
            return product.stock;
        }
        const selectedVariationList = Object.values(selectedVariations);
        const variationStocks = selectedVariationList
            .map((v) => v.stock ?? product.stock)
            .filter((s) => s !== undefined && s !== null && !isNaN(s));

        if (variationStocks.length === 0) return product.stock;
        return Math.min(...variationStocks);
    }, [selectedVariations, isAllSelected, product.stock]);

    // Build a human-readable label from current selected variations
    const buildVariationLabel = (variations: Record<number, ProductVariation>) =>
        Object.values(variations)
            .map((v) => {
                const attrName =
                    v.product_attribute?.name || v.attribute?.name || "Option";
                return `${attrName}: ${v.value}`;
            })
            .join(", ");

    // Detect completion and auto-add to batch
    useEffect(() => {
        if (isAllSelected) {
            const currentVariations = Object.values(selectedVariations);
            const currentIds = currentVariations.map((v) => v.id).sort().join("-");

            const existsIndex = cartBatch.findIndex(
                (item) =>
                    item.variations.map((v) => v.id).sort().join("-") === currentIds,
            );

            if (existsIndex === -1) {
                if (product.is_preorder || currentSelectionStock > 0) {
                    setIsOutOfStockCombo(false);
                    const initialQty = 1;
                    setCartBatch((prev) => [
                        ...prev,
                        { variations: currentVariations, quantity: initialQty },
                    ]);
                } else {
                    // Keep selection, show request prompt instead of resetting
                    setIsOutOfStockCombo(true);
                }
            }
        } else {
            setIsOutOfStockCombo(false);
        }
    }, [
        selectedVariations,
        isAllSelected,
        product.is_preorder,
        currentSelectionStock,
        cartBatch,
    ]);

    const handleBatchQuantityUpdate = (index: number, newQty: number) => {
        const minQty = 1;

        if (newQty < minQty) return;

        const item = cartBatch[index];
        const itemStock = Math.min(
            ...item.variations.map((v) => v.stock ?? product.stock),
        );
        const maxQty = product.is_preorder ? undefined : itemStock;

        if (maxQty !== undefined && newQty > maxQty) {
            toast.error(`Only ${maxQty} available for this item`);
            return;
        }

        setCartBatch((prev) => {
            const newBatch = [...prev];
            newBatch[index].quantity = newQty;
            return newBatch;
        });
    };

    const handleRemoveFromBatch = (index: number) => {
        const itemToRemove = cartBatch[index];
        const isCurrentSelection =
            isAllSelected &&
            itemToRemove.variations.every((v) => {
                const attrId = v.product_attribute_id;
                return attrId ? selectedVariations[attrId]?.id === v.id : false;
            });

        if (isCurrentSelection) {
            setSelectedVariations({});
        }

        setCartBatch((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddToCart = () => {
        if (cartBatch.length === 0) return;

        cartBatch.forEach((item) => {
            onAddToCart(item.variations, item.quantity);
        });
        toast.success(`Added ${cartBatch.length} items to cart`);
        setCartBatch([]);
        setSelectedVariations({});
        setIsOutOfStockCombo(false);
    };

    const handleBuyNow = () => {
        if (cartBatch.length === 0) return;

        cartBatch.forEach((item) => {
            onAddToCart(item.variations, item.quantity);
        });
        setCartBatch([]);
        setSelectedVariations({});
        setIsOutOfStockCombo(false);
        onBuyNow?.();
    };

    const handleRequestCombination = () => {
        if (!onRequestVariation) return;
        const label = buildVariationLabel(selectedVariations);
        onRequestVariation(label);
    };

    const batchTotalQuantity = cartBatch.reduce(
        (acc, item) => acc + item.quantity,
        0,
    );
    const batchTotalPrice = cartBatch.reduce((acc, item) => {
        const prices = item.variations
            .map((v) =>
                v.discounted_price != null
                    ? Number(v.discounted_price)
                    : v.price ? parseFloat(String(v.price)) : null,
            )
            .filter((p) => p !== null) as number[];
        const price = prices.length > 0 ? Math.max(...prices) : product.sale_price;
        return acc + price * item.quantity;
    }, 0);

    if (!product.product_variations || product.product_variations.length === 0)
        return null;

    const handleWheelCapture: React.WheelEventHandler<HTMLDivElement> = (e) => {
        const el = scrollContainerRef.current;
        if (!el) return;

        if (el.scrollHeight > el.clientHeight) {
            e.preventDefault();
            e.stopPropagation();
            el.scrollTop += e.deltaY;
        }
    };

    return (
        <div className="space-y-6">
            <div
                ref={scrollContainerRef}
                onWheelCapture={handleWheelCapture}
                className="max-h-[70vh] md:max-h-[34rem] overflow-y-auto overscroll-contain pr-1 space-y-6 touch-pan-y"
            >
                {/* Attributes Selection */}
                <div className="space-y-5">
                    {Object.entries(variationsByAttribute).map(
                        ([attrId, group]) => (
                            <div key={attrId}>
                                <h5 className="text-sm font-semibold text-gray-800 mb-3 block">
                                    {group.name}
                                </h5>
                                <div className="flex flex-wrap gap-2">
                                    {group.variations.map((variation) => {
                                        const isSelected =
                                            selectedVariations[Number(attrId)]?.id === variation.id;
                                        const vPrice = variation.price != null ? parseFloat(String(variation.price)) : null;
                                        const vDiscounted = variation.discounted_price != null ? Number(variation.discounted_price) : null;
                                        const hasVarDiscount = vDiscounted !== null && vPrice !== null && vDiscounted < vPrice;
                                        const showPriceHint = vPrice !== null && vPrice > 0 && vPrice !== product.sale_price;
                                        const isOutOfStock =
                                            !product.is_preorder &&
                                            variation.stock !== null &&
                                            variation.stock !== undefined &&
                                            variation.stock <= 0;

                                        if (isOutOfStock) {
                                            return (
                                                <button
                                                    key={variation.id}
                                                    onClick={() => {
                                                        if (!onRequestVariation) {
                                                            toast.error("This option is out of stock.");
                                                            return;
                                                        }
                                                        onRequestVariation(`${group.name}: ${variation.value}`);
                                                    }}
                                                    className={`relative py-2.5 pr-4 text-sm border transition-all flex items-center gap-2 font-medium ${
                                                        variation.image ? "pl-2" : "pl-4"
                                                    } border-brand-primary/25 bg-brand-bg text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary/35 rounded-lg cursor-pointer group`}
                                                    title="Out of stock – click to request"
                                                >
                                                    {variation.image && (
                                                        <img
                                                            src={getAssetUrl(variation.image)}
                                                            alt={variation.value}
                                                            className="w-6 h-6 rounded object-cover bg-white pointer-events-none shrink-0 relative z-10 grayscale opacity-70"
                                                        />
                                                    )}
                                                    <span className="relative z-10 flex items-center gap-1.5">
                                                        {variation.value}
                                                        <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded-sm border border-brand-primary/20">
                                                            <Bell size={8} />
                                                            Request
                                                        </span>
                                                    </span>
                                                    {showPriceHint && vPrice && (
                                                        <span className="text-xs font-normal ml-0.5 relative z-10 opacity-60">
                                                            ({formatPrice(vPrice)})
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        }

                                        return (
                                            <button
                                                key={variation.id}
                                                onClick={() => handleVariationSelect(Number(attrId), variation)}
                                                className={`relative py-2 pr-3 text-sm border transition-all flex flex-col items-start font-medium ${
                                                    variation.image ? "pl-2" : "pl-3"
                                                } ${
                                                    isSelected
                                                        ? "border-brand-primary bg-brand-bg text-brand-primary shadow-sm ring-1 ring-brand-primary"
                                                        : hasVarDiscount
                                                          ? "border-amber-200 bg-amber-50/50 hover:border-amber-300 text-gray-700"
                                                          : "border-gray-200 hover:border-gray-300 text-gray-600 hover:bg-gray-50"
                                                } rounded-lg group`}
                                            >
                                                <span className="relative z-10 flex items-center gap-1.5">
                                                    {variation.image && (
                                                        <img
                                                            src={getAssetUrl(variation.image)}
                                                            alt={variation.value}
                                                            className="w-6 h-6 rounded object-cover bg-white pointer-events-none shrink-0"
                                                        />
                                                    )}
                                                    {variation.value}
                                                    {isSelected && (
                                                        <Check size={13} strokeWidth={3} className="text-brand-primary" />
                                                    )}
                                                </span>
                                                {showPriceHint && vPrice && (
                                                    <span className="relative z-10 flex items-center gap-1 mt-0.5">
                                                        {hasVarDiscount && vDiscounted !== null ? (
                                                            <>
                                                                <span className="text-amber-600 font-bold text-xs">{formatPrice(vDiscounted)}</span>
                                                                <span className="text-gray-400 line-through text-[10px]">{formatPrice(vPrice)}</span>
                                                            </>
                                                        ) : (
                                                            <span className="text-gray-500 text-xs">{formatPrice(vPrice)}</span>
                                                        )}
                                                    </span>
                                                )}
                                                {hasVarDiscount && variation.discount_type && (
                                                    <span className="absolute -top-2 -right-2 text-[9px] font-extrabold text-white bg-amber-500 px-1.5 py-0.5 rounded-full shadow-sm z-20">
                                                        {variation.discount_type === "percentage"
                                                            ? `-${variation.discount_value}%`
                                                            : `-৳${variation.discount_value}`}
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ),
                    )}
                </div>

                {/* Out-of-stock combination prompt */}
                {isOutOfStockCombo && (
                    <div className="rounded-xl border border-brand-primary/20 bg-brand-bg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-brand-dark mb-0.5">
                                This combination is out of stock
                            </p>
                            <p className="text-xs text-brand-primary/90">
                                <span className="font-medium">{buildVariationLabel(selectedVariations)}</span>
                                {" "}— submit a request and we'll notify you.
                            </p>
                        </div>
                        {onRequestVariation && (
                            <button
                                onClick={handleRequestCombination}
                                className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white text-sm font-bold rounded-lg transition-colors"
                            >
                                <Bell size={14} />
                                Request
                            </button>
                        )}
                    </div>
                )}

                {/* Helper Text */}
                {!isOutOfStockCombo && (
                    <div className="text-xs text-gray-500 italic">
                        Select options to automatically add them to your list below.
                    </div>
                )}

                {/* Batch List Display */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                        <h5 className="font-semibold text-gray-900 text-sm">
                            Your Selection
                        </h5>
                        {cartBatch.length > 0 && (
                            <span className="text-brand-primary text-xs font-bold bg-brand-bg px-2 py-1 rounded-full">
                                {cartBatch.length} items
                            </span>
                        )}
                    </div>

                    <div className="p-4 bg-white">
                        {cartBatch.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">
                                No items selected yet.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cartBatch.map((item, index) => {
                                    const effectivePrices = item.variations
                                        .map((v) =>
                                            v.discounted_price != null
                                                ? Number(v.discounted_price)
                                                : v.price ? parseFloat(String(v.price)) : null,
                                        )
                                        .filter((p) => p !== null) as number[];
                                    const originalPrices = item.variations
                                        .map((v) => (v.price ? parseFloat(String(v.price)) : null))
                                        .filter((p) => p !== null) as number[];
                                    const itemPrice =
                                        effectivePrices.length > 0 ? Math.max(...effectivePrices) : product.sale_price;
                                    const itemOriginalPrice =
                                        originalPrices.length > 0 ? Math.max(...originalPrices) : null;
                                    const hasItemDiscount =
                                        itemOriginalPrice !== null && itemPrice < itemOriginalPrice;

                                    const isCurrent =
                                        isAllSelected &&
                                        Object.values(selectedVariations).every((v) =>
                                            item.variations.some((iv) => iv.id === v.id),
                                        );

                                    return (
                                        <div
                                            key={index}
                                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                                                isCurrent
                                                    ? "bg-brand-bg border-brand-bg ring-1 ring-brand-bg"
                                                    : "bg-white border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-gray-900 text-sm truncate">
                                                    {item.variations
                                                        .map((v) => {
                                                            const attrName =
                                                                v.product_attribute?.name ||
                                                                v.attribute?.name ||
                                                                "Option";
                                                            return `${attrName}: ${v.value}`;
                                                        })
                                                        .join(", ")}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-0.5 font-medium flex items-center gap-1 flex-wrap">
                                                    {hasItemDiscount ? (
                                                        <>
                                                            <span className="text-brand-primary font-bold">{formatPrice(itemPrice)}</span>
                                                            <span className="line-through opacity-60">{formatPrice(itemOriginalPrice!)}</span>
                                                            <span>× {item.quantity} =</span>
                                                            <span className="text-brand-primary font-bold">{formatPrice(itemPrice * item.quantity)}</span>
                                                        </>
                                                    ) : (
                                                        <span>{formatPrice(itemPrice)} × {item.quantity} = {formatPrice(itemPrice * item.quantity)}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg h-8">
                                                <button
                                                    onClick={() =>
                                                        handleBatchQuantityUpdate(
                                                            index,
                                                            item.quantity - 1,
                                                        )
                                                    }
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                    className={`w-8 h-full flex items-center justify-center rounded-l-lg transition-colors ${
                                                        item.quantity <= 1
                                                            ? "text-gray-300 cursor-not-allowed"
                                                            : "hover:bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm font-bold text-gray-900 leading-none">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleBatchQuantityUpdate(
                                                            index,
                                                            item.quantity + 1,
                                                        )
                                                    }
                                                    className="w-8 h-full flex items-center justify-center hover:bg-gray-100 text-gray-600 rounded-r-lg transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    handleRemoveFromBatch(index)
                                                }
                                                className="text-gray-400 hover:text-brand-primary p-1.5 hover:bg-brand-bg rounded-md transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {cartBatch.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-600 text-sm">
                                        Total Amount({batchTotalQuantity} items)
                                    </span>
                                    <span className="font-bold text-gray-900 text-lg">
                                        {formatPrice(batchTotalPrice)}
                                    </span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-brand-primary px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-primary/30 hover:bg-brand-primary/90 hover:shadow-xl transition-all transform active:scale-[0.98]"
                                        onClick={handleBuyNow}
                                    >
                                        <Zap size={16} strokeWidth={2.5} />
                                        Buy Now
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-white border-2 border-slate-200 hover:border-brand-dark/40 text-brand-dark px-4 py-2.5 text-sm font-bold hover:bg-slate-50 transition-all transform active:scale-[0.98]"
                                        onClick={handleAddToCart}
                                    >
                                        <ShoppingCart size={16} strokeWidth={2.5} />
                                        Add All to Cart
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {cartBatch.length > 0 && (
                <div className="md:hidden text-[11px] text-gray-500">
                    Tip: swipe inside the selector area to browse options.
                </div>
            )}
        </div>
    );
};

export default ProductVariationSelector;
