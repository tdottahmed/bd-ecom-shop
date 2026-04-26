<style>
/* ── Category Checkout ──────────────────────────────── */
#cat-checkout { padding: 80px 0 100px; scroll-margin-top: 20px; }

.cat-co-grid {
    display: grid;
    grid-template-columns: 1fr 1.15fr;
    gap: 36px;
    align-items: start;
    margin-top: 48px;
}

/* Order Summary Panel */
.cat-summary-panel {
    background: var(--card);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    position: sticky;
    top: 24px;
}
.cat-summary-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border-light);
    display: flex; align-items: center; justify-content: space-between;
}
.cat-summary-header h3 { font-size: 15px; font-weight: 800; color: var(--text); }
.cat-item-count-badge {
    background: var(--accent-10); color: var(--accent);
    font-size: 11px; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    transition: all 0.2s;
}

.cat-empty-notice {
    padding: 48px 24px; text-align: center; color: var(--muted);
}
.cat-empty-notice .cat-empty-icon { font-size: 44px; display: block; margin-bottom: 12px; opacity: 0.4; }
.cat-empty-notice p { font-size: 14px; line-height: 1.5; }

.cat-order-list { padding: 4px 0; }
.cat-order-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 24px;
    border-bottom: 1px solid var(--border-light);
    transition: background 0.15s;
}
.cat-order-row:last-child { border-bottom: none; }
.cat-order-row:hover { background: var(--bg-soft); }

.cat-order-row-info { flex: 1; min-width: 0; }
.cat-order-row-name { font-size: 13px; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cat-order-row-meta { font-size: 11px; color: var(--muted); margin-top: 2px; }
.cat-order-row-price { font-size: 14px; font-weight: 800; color: var(--text); white-space: nowrap; }
.cat-order-row-remove {
    width: 24px; height: 24px; flex-shrink: 0; margin-top: 1px;
    display: flex; align-items: center; justify-content: center;
    border: none; background: none; color: var(--light); cursor: pointer;
    border-radius: 6px; font-size: 16px; transition: color 0.15s, background 0.15s;
}
.cat-order-row-remove:hover { color: #ef4444; background: #fef2f2; }

.cat-co-totals {
    padding: 16px 24px;
    border-top: 1.5px solid var(--border);
    display: flex; flex-direction: column; gap: 8px;
    background: var(--bg-soft);
}
.cat-co-sum-row {
    display: flex; justify-content: space-between; align-items: center;
    font-size: 13px; color: var(--muted);
}
.cat-co-sum-row.total {
    font-size: 18px; font-weight: 800; color: var(--text);
    margin-top: 4px; padding-top: 8px;
    border-top: 1px solid var(--border);
}
.cat-co-sum-val { font-weight: 700; color: var(--text); }
.cat-co-sum-row.total .cat-co-sum-val { font-size: 22px; color: var(--accent); }

/* Form Panel */
.cat-form-panel {
    background: var(--card);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 28px;
}
.cat-form-title { font-size: 18px; font-weight: 800; color: var(--text); margin-bottom: 6px; }
.cat-form-sub { font-size: 13px; color: var(--muted); margin-bottom: 24px; }

.cat-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
.cat-label { font-size: 12px; font-weight: 700; color: var(--text-2); text-transform: uppercase; letter-spacing: 0.06em; }
.cat-input {
    width: 100%; padding: 13px 16px;
    border: 1.5px solid var(--border); border-radius: 12px;
    font-size: 14px; font-weight: 500; color: var(--text);
    background: var(--bg-soft); outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    font-family: inherit;
}
.cat-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-10); background: white; }
.cat-input.error { border-color: #ef4444; box-shadow: 0 0 0 3px #fef2f2; }
.cat-field-error { font-size: 11px; color: #ef4444; display: none; margin-top: 2px; }
.cat-field-error.show { display: block; }

.cat-err-banner {
    background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;
    padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 600;
    margin-bottom: 18px; display: none;
}
.cat-err-banner.show { display: block; }

.cat-submit-btn {
    width: 100%; padding: 16px;
    background: var(--accent); color: #000;
    border: none; border-radius: 14px;
    font-size: 15px; font-weight: 800; cursor: pointer;
    transition: filter 0.15s, transform 0.15s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    position: relative; overflow: hidden;
}
.cat-submit-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
.cat-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.cat-submit-btn.loading .cat-btn-text { opacity: 0; }
.cat-submit-btn .cat-spinner {
    width: 20px; height: 20px;
    border: 3px solid rgba(0,0,0,0.2);
    border-top-color: #000;
    border-radius: 50%;
    position: absolute;
    display: none;
}
.cat-submit-btn.loading .cat-spinner { display: block; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.cat-submit-note { text-align: center; font-size: 12px; color: var(--muted); margin-top: 12px; }

.cat-success {
    text-align: center; padding: 32px 20px;
    display: none;
}
.cat-success.show { display: block; }
.cat-success-icon { font-size: 56px; margin-bottom: 16px; }
.cat-success-title { font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
.cat-success-msg { font-size: 14px; color: var(--muted); line-height: 1.6; }
.cat-success-id { font-weight: 800; color: var(--accent); }
.cat-again-btn {
    margin-top: 20px; padding: 10px 24px;
    background: var(--accent); color: #000;
    border: none; border-radius: 10px;
    font-size: 14px; font-weight: 700; cursor: pointer;
    transition: filter 0.15s;
}
.cat-again-btn:hover { filter: brightness(1.1); }

/* Responsive */
@media (max-width: 768px) {
    .cat-co-grid { grid-template-columns: 1fr; gap: 24px; }
    .cat-summary-panel { position: static; }
    .cat-form-panel { padding: 20px; }
}
</style>

<section id="cat-checkout">
    <div class="lp-container">
        <div class="section-center" data-gsap="fade-up">
            <span class="section-label">Your Order</span>
            <h2 class="section-title" data-split="words">Confirm & Checkout</h2>
            <p class="section-sub">Review your selected items, fill in your delivery details, and we'll handle the rest.</p>
        </div>

        <div class="cat-co-grid">

            {{-- ── Left: Order Summary ── --}}
            <div data-gsap="fade-up" data-delay="0.1">
                <div class="cat-summary-panel">
                    <div class="cat-summary-header">
                        <h3>Order Summary</h3>
                        <span class="cat-item-count-badge" id="cat-summary-badge">0 items</span>
                    </div>

                    <div id="cat-empty-notice" class="cat-empty-notice">
                        <span class="cat-empty-icon">🛒</span>
                        <p>No items selected yet.<br />Add products from the grid above.</p>
                    </div>

                    <div id="cat-order-list" class="cat-order-list" style="display:none;"></div>

                    <div class="cat-co-totals">
                        <div class="cat-co-sum-row">
                            <span>Subtotal</span>
                            <span class="cat-co-sum-val" id="cat-co-sub">৳0</span>
                        </div>
                        <div class="cat-co-sum-row">
                            <span>Delivery</span>
                            <span class="cat-co-sum-val" id="cat-co-del">Select area</span>
                        </div>
                        <div class="cat-co-sum-row total">
                            <span>Total</span>
                            <span class="cat-co-sum-val" id="cat-co-total">—</span>
                        </div>
                    </div>
                </div>
            </div>

            {{-- ── Right: Delivery Form ── --}}
            <div data-gsap="fade-up" data-delay="0.2">
                <div class="cat-form-panel">
                    <p class="cat-form-title">Delivery Information</p>
                    <p class="cat-form-sub">Cash on Delivery · We'll confirm your order by phone.</p>

                    <div id="cat-form-wrap">
                        <div class="cat-err-banner" id="cat-err-banner"></div>

                        <div class="cat-field">
                            <label class="cat-label">Full Name *</label>
                            <input id="cat-name" class="cat-input" type="text" placeholder="Your full name" autocomplete="name" />
                            <p class="cat-field-error" id="cat-err-name">Name is required.</p>
                        </div>

                        <div class="cat-field">
                            <label class="cat-label">Phone Number *</label>
                            <input id="cat-phone" class="cat-input" type="tel" placeholder="01XXXXXXXXX" autocomplete="tel" />
                            <p class="cat-field-error" id="cat-err-phone">Enter a valid phone number.</p>
                        </div>

                        <div class="cat-field">
                            <label class="cat-label">Delivery Address *</label>
                            <textarea id="cat-address" class="cat-input" rows="3" placeholder="District / Thana / House details"></textarea>
                            <p class="cat-field-error" id="cat-err-address">Please enter your delivery address.</p>
                        </div>

                        <div class="cat-field">
                            <label class="cat-label">Delivery Area *</label>
                            <select id="cat-delivery" class="cat-input" onchange="catUpdateTotals()">
                                <option value="">— Select delivery area —</option>
                                @foreach($deliveryCharges as $dc)
                                <option value="{{ $dc->id }}" data-cost="{{ $dc->cost }}">
                                    {{ $dc->name }} — ৳{{ number_format($dc->cost, 0) }}
                                </option>
                                @endforeach
                            </select>
                            <p class="cat-field-error" id="cat-err-delivery">Please select a delivery area.</p>
                        </div>

                        <button type="button" id="cat-submit-btn" class="cat-submit-btn" onclick="catSubmitOrder()">
                            <span class="cat-btn-text">
                                Confirm Order
                                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" style="display:inline;vertical-align:middle;margin-left:4px;"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                            </span>
                            <div class="cat-spinner"></div>
                        </button>
                        <p class="cat-submit-note">🔒 Secure · Cash on Delivery · We'll call to confirm</p>
                    </div>

                    <div class="cat-success" id="cat-success">
                        <div class="cat-success-icon">🎉</div>
                        <h3 class="cat-success-title">Order Confirmed!</h3>
                        <p class="cat-success-msg">
                            Order <span class="cat-success-id" id="cat-success-id"></span> has been placed.<br>
                            We'll call <strong id="cat-success-phone"></strong> shortly to confirm delivery.
                        </p>
                        <button class="cat-again-btn" onclick="catResetCheckout()">Place Another Order</button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</section>
