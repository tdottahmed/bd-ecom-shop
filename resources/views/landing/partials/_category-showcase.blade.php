<style>
/* ── Category Showcase ─────────────────────────────── */
#cat-showcase { padding: 80px 0; background: var(--bg-soft); }
#cat-showcase .section-center { margin-bottom: 48px; }

.cat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 24px;
}

.cat-card {
    background: var(--card);
    border: 2px solid var(--border-light);
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    position: relative;
}
.cat-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
.cat-card.in-order {
    border-color: var(--accent);
    box-shadow: 0 0 0 4px var(--accent-20), var(--shadow-md);
}

.cat-card-img-wrap {
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    background: var(--bg-soft);
    flex-shrink: 0;
}
.cat-card-img-wrap img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
}
.cat-card:hover .cat-card-img-wrap img { transform: scale(1.07); }

.cat-img-placeholder {
    width: 100%; height: 100%;
    display: flex; align-items: center; justify-content: center;
    color: var(--light); font-size: 48px;
}

.cat-discount-badge {
    position: absolute; top: 12px; left: 12px;
    background: var(--accent); color: #000;
    font-size: 11px; font-weight: 800;
    padding: 3px 10px; border-radius: 20px;
    letter-spacing: 0.03em;
}

.cat-in-order-check {
    position: absolute; top: 10px; right: 10px;
    width: 28px; height: 28px;
    background: #10b981; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 14px;
    opacity: 0; transform: scale(0.5);
    transition: opacity 0.2s, transform 0.2s;
    pointer-events: none;
}
.cat-card.in-order .cat-in-order-check { opacity: 1; transform: scale(1); }

.cat-card-body {
    padding: 18px;
    display: flex; flex-direction: column; gap: 12px; flex: 1;
}

.cat-card-name {
    font-size: 14px; font-weight: 700;
    color: var(--text); line-height: 1.35;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.cat-price-row { display: flex; align-items: baseline; gap: 8px; }
.cat-price-main { font-size: 21px; font-weight: 800; color: var(--accent); }
.cat-price-old { font-size: 13px; color: var(--light); text-decoration: line-through; }
.cat-price-save { font-size: 11px; font-weight: 700; color: #10b981; }

/* Variations */
.cat-attr-group { display: flex; flex-direction: column; gap: 5px; }
.cat-attr-label { font-size: 10px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
.cat-pills { display: flex; flex-wrap: wrap; gap: 5px; }
.cat-pill {
    padding: 3px 10px; border: 1.5px solid var(--border);
    border-radius: 20px; font-size: 12px; font-weight: 600;
    color: var(--text-2); background: transparent; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
    white-space: nowrap;
}
.cat-pill:hover:not(.oos):not(:disabled) { border-color: var(--accent); color: var(--accent); }
.cat-pill.selected { background: var(--accent); border-color: var(--accent); color: #000; }
.cat-pill.oos { opacity: 0.35; cursor: not-allowed; text-decoration: line-through; }

/* Quantity */
.cat-qty-row { display: flex; align-items: center; justify-content: space-between; }
.cat-qty-label { font-size: 11px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
.cat-qty-ctrl {
    display: flex; align-items: center;
    border: 1.5px solid var(--border); border-radius: 10px; overflow: hidden;
}
.cat-qty-ctrl button {
    width: 30px; height: 30px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; font-weight: 700; color: var(--text-2);
    background: var(--bg-soft); border: none; cursor: pointer;
    transition: background 0.12s, color 0.12s;
}
.cat-qty-ctrl button:hover { background: var(--accent-10); color: var(--accent); }
.cat-qty-input {
    width: 36px; height: 30px; text-align: center;
    border: none; border-left: 1.5px solid var(--border); border-right: 1.5px solid var(--border);
    font-size: 13px; font-weight: 700; color: var(--text);
    background: white; outline: none;
    -moz-appearance: textfield;
}
.cat-qty-input::-webkit-outer-spin-button, .cat-qty-input::-webkit-inner-spin-button { -webkit-appearance: none; }

/* Add to Order button */
.cat-add-btn {
    width: 100%; padding: 11px 16px; margin-top: auto;
    border-radius: 12px; font-size: 13px; font-weight: 700;
    background: var(--accent); color: #000; border: none; cursor: pointer;
    transition: filter 0.15s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
}
.cat-add-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
.cat-add-btn.added { background: #10b981; color: #fff; }
.cat-add-btn.added:hover { filter: brightness(1.05); }

/* ── Sticky Cart Bar ──────────────────────────────── */
#cat-cart-bar {
    position: fixed; bottom: -90px; left: 0; right: 0; z-index: 200;
    background: #111827; color: white;
    padding: 14px 24px;
    display: flex; align-items: center; gap: 16px;
    box-shadow: 0 -6px 40px rgba(0,0,0,0.25);
    transition: bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
#cat-cart-bar.show { bottom: 0; }

.cat-bar-left { display: flex; align-items: center; gap: 16px; flex: 1; min-width: 0; }
.cat-bar-icon { font-size: 22px; flex-shrink: 0; }
.cat-bar-meta { display: flex; flex-direction: column; line-height: 1.2; }
.cat-bar-count { font-size: 11px; color: #9CA3AF; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }
.cat-bar-total { font-size: 22px; font-weight: 800; color: white; }

.cat-bar-items-preview {
    flex: 1; display: flex; gap: 8px; overflow: hidden; align-items: center;
}
.cat-bar-item-chip {
    background: #1F2937; color: #D1D5DB;
    font-size: 11px; padding: 4px 10px; border-radius: 20px; white-space: nowrap;
    max-width: 130px; overflow: hidden; text-overflow: ellipsis;
}

.cat-bar-cta {
    flex-shrink: 0; padding: 12px 24px;
    background: var(--accent); color: #000;
    border: none; border-radius: 12px;
    font-size: 14px; font-weight: 800;
    cursor: pointer; transition: filter 0.15s;
    display: flex; align-items: center; gap: 8px; white-space: nowrap;
}
.cat-bar-cta:hover { filter: brightness(1.1); }

/* Responsive */
@media (max-width: 768px) {
    .cat-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
    .cat-card-body { padding: 12px; gap: 9px; }
    .cat-price-main { font-size: 17px; }
    .cat-add-btn { padding: 9px 12px; font-size: 12px; }
    #cat-cart-bar { padding: 10px 16px; gap: 10px; }
    .cat-bar-total { font-size: 18px; }
    .cat-bar-cta { padding: 10px 16px; font-size: 13px; }
    .cat-bar-items-preview { display: none; }
}
@media (max-width: 420px) {
    .cat-grid { grid-template-columns: 1fr; }
}
</style>

<section id="cat-showcase">
    <div class="lp-container">
        <div class="section-center" data-gsap="fade-up">
            <span class="section-label">{{ $page->category->title ?? 'Shop the Collection' }}</span>
            <h2 class="section-title" data-split="words">Choose Your Products</h2>
            <p class="section-sub">Pick the items you want, select your options, then place one easy order below.</p>
        </div>

        <div class="cat-grid">
            @foreach($categoryProducts as $product)
            @php
                $unitPrice   = $product->discounted_sale_price ?: $product->sale_price;
                $hasDiscount = $product->discounted_sale_price && $product->discounted_sale_price < $product->sale_price;
                $attrGroups  = $product->product_variations->groupBy(fn($v) => $v->product_attribute->name ?? 'Option');
                $firstImage  = is_array($product->images) && count($product->images) > 0 ? $product->images[0] : null;
                $savings     = $hasDiscount ? round((($product->sale_price - $product->discounted_sale_price) / $product->sale_price) * 100) : 0;
            @endphp
            <div class="cat-card" id="cat-card-{{ $product->id }}" data-gsap="fade-up" data-delay="{{ $loop->index * 0.05 }}">

                {{-- Image --}}
                <div class="cat-card-img-wrap">
                    @if($firstImage)
                        <img id="cat-img-{{ $product->id }}" src="{{ Storage::url($firstImage) }}" alt="{{ $product->name }}" loading="lazy" />
                    @else
                        <div class="cat-img-placeholder">📦</div>
                    @endif
                    @if($hasDiscount)
                        <span class="cat-discount-badge">-{{ $savings }}%</span>
                    @endif
                    <div class="cat-in-order-check">✓</div>
                </div>

                {{-- Body --}}
                <div class="cat-card-body">
                    <p class="cat-card-name">{{ $product->name }}</p>

                    {{-- Price --}}
                    <div class="cat-price-row">
                        <span class="cat-price-main" id="cat-price-{{ $product->id }}">
                            ৳{{ number_format($unitPrice, 0) }}
                        </span>
                        @if($hasDiscount)
                            <span class="cat-price-old">৳{{ number_format($product->sale_price, 0) }}</span>
                            <span class="cat-price-save">Save {{ $savings }}%</span>
                        @endif
                    </div>

                    {{-- Variations --}}
                    @if($attrGroups->count() > 0)
                        @foreach($attrGroups as $attrName => $vars)
                        <div class="cat-attr-group">
                            <span class="cat-attr-label">{{ $attrName }}</span>
                            <div class="cat-pills">
                                @foreach($vars as $v)
                                @php $oos = $v->stock !== null && $v->stock <= 0 && !$product->is_preorder; @endphp
                                <button
                                    type="button"
                                    class="cat-pill {{ $oos ? 'oos' : '' }}"
                                    data-product-id="{{ $product->id }}"
                                    data-attr="{{ $attrName }}"
                                    data-id="{{ $v->id }}"
                                    data-price="{{ $v->price ?: $unitPrice }}"
                                    data-image="{{ $v->image ? Storage::url($v->image) : '' }}"
                                    onclick="catSelectVariation(this)"
                                    {{ $oos ? 'disabled' : '' }}>
                                    {{ $v->value }}
                                </button>
                                @endforeach
                            </div>
                        </div>
                        @endforeach
                    @endif

                    {{-- Quantity --}}
                    <div class="cat-qty-row">
                        <span class="cat-qty-label">Quantity</span>
                        <div class="cat-qty-ctrl">
                            <button type="button" onclick="catChangeQty({{ $product->id }}, -1)">−</button>
                            <input type="number" class="cat-qty-input" id="cat-qty-{{ $product->id }}" value="1" min="1" max="99" readonly />
                            <button type="button" onclick="catChangeQty({{ $product->id }}, 1)">+</button>
                        </div>
                    </div>

                    {{-- Add button --}}
                    <button type="button" id="cat-add-{{ $product->id }}" class="cat-add-btn" onclick="catToggleItem({{ $product->id }})">
                        <span>Add to Order</span>
                    </button>
                </div>
            </div>
            @endforeach
        </div>
    </div>
</section>

{{-- Sticky cart bar --}}
<div id="cat-cart-bar">
    <div class="cat-bar-left">
        <span class="cat-bar-icon">🛒</span>
        <div class="cat-bar-meta">
            <span class="cat-bar-count" id="cat-bar-count">0 items</span>
            <span class="cat-bar-total" id="cat-bar-total">৳0</span>
        </div>
        <div class="cat-bar-items-preview" id="cat-bar-preview"></div>
    </div>
    <button type="button" class="cat-bar-cta" onclick="catScrollToCheckout()">
        Review Order
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
</div>
