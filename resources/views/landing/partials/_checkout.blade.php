@php
  $product = $page->product;
  $isVariant = $product->product_type === 'variant';

  if ($isVariant) {
      $firstVar = $product->product_variations->first();
      $unitPrice = $firstVar ? (float) $firstVar->price : 0;
      $hasDiscount = false;
  } else {
      $unitPrice = $product->discounted_sale_price ?: $product->sale_price;
      $hasDiscount = $product->discounted_sale_price && $product->discounted_sale_price < $product->sale_price;
  }
  $attrGroups = $product->product_variations->groupBy(fn($v) => $v->product_attribute->name ?? 'Option');
@endphp

<section id="checkout">
  <div class="lp-container">

    <div class="section-center" style="margin-bottom:52px;" data-gsap="fade-up">
      <span class="section-label">Place Your Order</span>
      <h2 class="section-title" data-split="words">{{ $product->name }}</h2>
      <p class="section-sub">Fill in your details below and we'll handle the rest.</p>
    </div>

    <div class="checkout-grid">

      {{-- ── Left: product summary ── --}}
      <div class="co-product-panel" data-gsap="fade-up" data-delay="0.1">
        <div class="co-product-panel-inner">
          <div class="co-price-row">
            <span class="co-price-main" id="co-display-price">৳{{ number_format($unitPrice, 0) }}</span>
            @if ($hasDiscount)
              <span class="co-price-old">৳{{ number_format($product->sale_price, 0) }}</span>
              @php $savings = round((($product->sale_price - $unitPrice) / $product->sale_price) * 100); @endphp
              <span class="co-price-badge">Save {{ $savings }}%</span>
            @endif
          </div>

          {{-- Variations --}}
          @if ($attrGroups->count() > 0)
            <hr class="co-divider" />
            @foreach ($attrGroups as $attrName => $vars)
              <div class="co-attr-group">
                <span class="co-attr-label">{{ $attrName }}</span>
                <div class="co-pills" data-attr="{{ $attrName }}">
                  @foreach ($vars as $v)
                    @php $isFirstPill = $loop->first && $isVariant; @endphp
                    <button type="button"
                            class="co-pill {{ $isFirstPill ? 'selected' : '' }} {{ $v->stock !== null && $v->stock <= 0 && !$product->is_preorder ? 'oos' : '' }}"
                            data-id="{{ $v->id }}" data-attr="{{ $attrName }}"
                            data-price="{{ $isVariant ? $v->price ?? 0 : ($product->discounted_sale_price ?: $product->sale_price) }}"
                            onclick="lpSelectVariation(this)"
                            {{ $v->stock !== null && $v->stock <= 0 && !$product->is_preorder ? 'disabled' : '' }}>
                      {{ $v->value }}
                    </button>
                  @endforeach
                </div>
              </div>
            @endforeach
          @endif

          <hr class="co-divider" />

          {{-- Quantity --}}
          <div class="co-qty-row">
            <span class="co-qty-label">Quantity</span>
            <div class="co-qty">
              <button type="button" class="co-qty-btn" onclick="lpChangeQty(-1)">−</button>
              <input type="number" id="co-qty" class="co-qty-input" value="1" min="1" max="100"
                     oninput="lpUpdateSummary()" />
              <button type="button" class="co-qty-btn" onclick="lpChangeQty(1)">+</button>
            </div>
          </div>

          {{-- Summary --}}
          <div class="co-summary">
            <div class="co-sum-row">
              <span>Unit price</span>
              <span id="co-sum-unit">৳{{ number_format($unitPrice, 0) }}</span>
            </div>
            <div class="co-sum-row">
              <span>Subtotal</span>
              <span id="co-sum-sub">৳{{ number_format($unitPrice, 0) }}</span>
            </div>
            <div class="co-sum-row">
              <span>Delivery</span>
              <span id="co-sum-del">Select area</span>
            </div>
            <div class="co-sum-row co-total">
              <span>Total</span>
              <span class="co-sum-val" id="co-sum-total">—</span>
            </div>
          </div>
        </div>
      </div>

      {{-- ── Right: form ── --}}
      <div data-gsap="fade-up" data-delay="0.2">
        <div class="co-form-panel">
          <p class="co-form-title">Delivery Information</p>

          <div id="co-form-wrap">
            <div class="co-error-banner" id="co-err-banner"></div>

            <div class="co-field">
              <label class="co-label">Full Name *</label>
              <input id="co-name" class="co-input" type="text" placeholder="Your name" autocomplete="name" />
              <p class="co-field-error" id="co-err-name">Name is required.</p>
            </div>

            <div class="co-field">
              <label class="co-label">Phone Number *</label>
              <input id="co-phone" class="co-input" type="tel" placeholder="01XXXXXXXXX" autocomplete="tel" />
              <p class="co-field-error" id="co-err-phone">Enter a valid phone number.</p>
            </div>

            <div class="co-field">
              <label class="co-label">Delivery Address *</label>
              <textarea id="co-address" class="co-input" rows="3" placeholder="District / Thana / House details"></textarea>
              <p class="co-field-error" id="co-err-address">Address is required.</p>
            </div>

            <div class="co-field">
              <label class="co-label">Delivery Area *</label>
              <select id="co-delivery" class="co-input" onchange="lpUpdateSummary()">
                <option value="">— Select delivery area —</option>
                @foreach ($deliveryCharges as $dc)
                  <option value="{{ $dc->id }}" data-cost="{{ $dc->cost }}">
                    {{ $dc->name }} — ৳{{ number_format($dc->cost, 0) }}
                  </option>
                @endforeach
              </select>
              <p class="co-field-error" id="co-err-delivery">Please select a delivery area.</p>
            </div>

            <button type="button" id="co-submit-btn" class="co-submit-btn" onclick="lpSubmitOrder()">
              <span class="co-btn-text">
                Confirm Order
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5"
                     viewBox="0 0 24 24" style="display:inline;vertical-align:middle;margin-left:4px;">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <div class="co-spinner"></div>
            </button>
            <p class="co-submit-note">Cash on Delivery · We'll confirm by phone</p>
          </div>

          {{-- Success state --}}
          <div class="co-success" id="co-success">
            <div class="co-success-icon">🎉</div>
            <h3 class="co-success-title">Order Confirmed!</h3>
            <p class="co-success-msg">
              Order <span class="co-success-id" id="co-success-id"></span> has been placed.<br>
              We'll call <strong id="co-success-phone"></strong> shortly to confirm delivery.
            </p>
            <button class="co-again-btn" onclick="lpResetCheckout()">Place Another Order</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>
