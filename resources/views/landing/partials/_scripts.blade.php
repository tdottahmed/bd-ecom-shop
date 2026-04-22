<script>
/* ══════════════════════════════════════════════
   GSAP + ScrollTrigger
══════════════════════════════════════════════ */
window.addEventListener('load', function () {
    if (typeof gsap === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    /* ── 1. Hero entrance ── */
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    /* Split headline into chars */
    const headlineEl = document.getElementById('hero-headline');
    if (headlineEl) {
        const raw = headlineEl.textContent;
        headlineEl.innerHTML = raw.split('').map(c =>
            c === ' '
                ? '<span class="sp" style="display:inline"> </span>'
                : `<span class="ch" style="display:inline-block">${c}</span>`
        ).join('');

        tl.from('#hero-headline .ch', {
            y: 90, opacity: 0,
            rotationX: -80,
            transformOrigin: '0% 50% -50px',
            stagger: 0.022,
            duration: 0.9,
            delay: 0.3,
        });
    }

    const badge = document.getElementById('hero-badge');
    if (badge) {
        tl.from(badge, { y: -30, opacity: 0, duration: 0.6 }, '<0.1');
    }

    tl.to('#hero-sub',     { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .to('#hero-actions', { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .to('#hero-scroll',  { opacity: 1, duration: 0.6 }, '-=0.3');

    /* Hero sub and actions start from below */
    gsap.set('#hero-sub',     { y: 30 });
    gsap.set('#hero-actions', { y: 30 });

    /* ── 2. Hero parallax ── */
    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        onUpdate: self => {
            gsap.set('#hero', {
                backgroundPositionY: `${50 + self.progress * 25}%`
            });
        }
    });

    /* ── 3. Nav scroll state ── */
    const lpNav = document.getElementById('lp-nav');
    ScrollTrigger.create({
        start: 'top-=80',
        onUpdate: self => lpNav.classList.toggle('nav-scrolled', self.scroll() > 80),
    });

    /* ── 4. Section word reveals ── */
    document.querySelectorAll('[data-split="words"]').forEach(el => {
        const words = el.textContent.trim().split(' ');
        el.innerHTML = words.map(w =>
            `<span style="display:inline-block;overflow:hidden;vertical-align:bottom">` +
            `<span class="wd" style="display:inline-block">${w}&nbsp;</span></span>`
        ).join('');

        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.from(el.querySelectorAll('.wd'), {
                    y: '105%', opacity: 0,
                    duration: 0.65, stagger: 0.055,
                    ease: 'power3.out',
                });
            }
        });
    });

    /* ── 5. Generic scroll-triggered reveals ── */
    document.querySelectorAll('[data-gsap]').forEach(el => {
        const type    = el.dataset.gsap;
        const delay   = parseFloat(el.dataset.delay || 0);
        const fromMap = {
            'fade-up':    { y: 60, opacity: 0 },
            'fade-left':  { x: -60, opacity: 0 },
            'fade-right': { x: 60, opacity: 0 },
            'scale':      { scale: 0.88, opacity: 0 },
        };
        const from = fromMap[type] || { y: 60, opacity: 0 };

        gsap.set(el, { opacity: 0 }); /* keep hidden until trigger */

        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter: () => {
                gsap.fromTo(el, from, {
                    y: 0, x: 0, scale: 1, opacity: 1,
                    duration: 0.75, delay,
                    ease: 'power3.out',
                    clearProps: 'transform',
                });
            }
        });
    });
});

/* ══════════════════════════════════════════════
   NAV fallback (without GSAP)
══════════════════════════════════════════════ */
(function () {
    const nav = document.getElementById('lp-nav');
    if (!nav) return;
    function onScroll() { nav.classList.toggle('nav-scrolled', window.scrollY > 80); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ══════════════════════════════════════════════
   FAQ accordion
══════════════════════════════════════════════ */
function lpToggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
}

/* ══════════════════════════════════════════════
   Lightbox
══════════════════════════════════════════════ */
function lpOpenLightbox(src) {
    document.getElementById('lp-lb-img').src = src;
    document.getElementById('lp-lightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function lpCloseLightbox(e) {
    if (!e || e.target !== document.getElementById('lp-lb-img')) {
        document.getElementById('lp-lightbox').classList.remove('open');
        document.body.style.overflow = '';
    }
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') lpCloseLightbox(); });

/* ══════════════════════════════════════════════
   Checkout
══════════════════════════════════════════════ */
@if($page->product)
const LP_UNIT_PRICE = {{ $page->product->discounted_sale_price ?: $page->product->sale_price }};
const LP_ORDER_URL  = '{{ route('landing-page.order', $page->slug) }}';
const LP_SEL_VARS   = {}; /* { attrName: variationId } */

const lpFmt = n => '৳' + Number(n).toLocaleString('en-BD', { maximumFractionDigits: 0 });

function lpSelectVariation(pill) {
    if (pill.disabled || pill.classList.contains('oos')) return;
    const attr = pill.dataset.attr;
    document.querySelectorAll(`.co-pill[data-attr="${attr}"]`).forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');
    LP_SEL_VARS[attr] = parseInt(pill.dataset.id);
    lpUpdateSummary();
}

function lpChangeQty(d) {
    const el = document.getElementById('co-qty');
    el.value = Math.max(1, (parseInt(el.value) || 1) + d);
    lpUpdateSummary();
}

function lpUpdateSummary() {
    const qty = Math.max(1, parseInt(document.getElementById('co-qty').value) || 1);
    const sel = document.getElementById('co-delivery');
    const opt = sel.options[sel.selectedIndex];
    const dc  = opt && opt.value ? parseFloat(opt.dataset.cost) : null;
    const sub = LP_UNIT_PRICE * qty;

    document.getElementById('co-sum-unit').textContent = lpFmt(LP_UNIT_PRICE);
    document.getElementById('co-sum-sub').textContent  = lpFmt(sub);
    document.getElementById('co-sum-del').textContent  = dc !== null ? lpFmt(dc) : 'Select area';
    document.getElementById('co-sum-total').textContent = dc !== null ? lpFmt(sub + dc) : '—';
}

function lpValidateField(id, errId, fn) {
    const el  = document.getElementById(id);
    const err = document.getElementById(errId);
    const ok  = fn(el.value.trim());
    el.classList.toggle('error', !ok);
    err.classList.toggle('show', !ok);
    return ok;
}

function lpValidateAll() {
    const a = lpValidateField('co-name',     'co-err-name',     v => v.length > 0);
    const b = lpValidateField('co-phone',    'co-err-phone',    v => /^[0-9+]{7,15}$/.test(v));
    const c = lpValidateField('co-address',  'co-err-address',  v => v.length > 5);
    const d = lpValidateField('co-delivery', 'co-err-delivery', v => v.length > 0);
    return a && b && c && d;
}

function lpGetXsrf() {
    const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : '';
}

async function lpSubmitOrder() {
    if (!lpValidateAll()) return;

    const btn    = document.getElementById('co-submit-btn');
    const banner = document.getElementById('co-err-banner');
    banner.classList.remove('show');
    btn.classList.add('loading');
    btn.disabled = true;

    const phone = document.getElementById('co-phone').value.trim();

    try {
        const res = await fetch(LP_ORDER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept':        'application/json',
                'X-XSRF-TOKEN':  lpGetXsrf(),
            },
            body: JSON.stringify({
                customer_name:      document.getElementById('co-name').value.trim(),
                customer_phone:     phone,
                customer_address:   document.getElementById('co-address').value.trim(),
                delivery_charge_id: document.getElementById('co-delivery').value,
                quantity:           parseInt(document.getElementById('co-qty').value) || 1,
                variation_ids:      Object.values(LP_SEL_VARS),
            }),
        });

        const data = await res.json();

        if (data.success) {
            document.getElementById('co-form-wrap').style.display = 'none';
            document.getElementById('co-success-id').textContent    = '#' + data.order_id;
            document.getElementById('co-success-phone').textContent = phone;
            const suc = document.getElementById('co-success');
            suc.classList.add('show');
            suc.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            banner.textContent = data.message || 'Something went wrong. Please try again.';
            banner.classList.add('show');
        }
    } catch (_) {
        banner.textContent = 'Network error. Please check your connection and try again.';
        banner.classList.add('show');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

function lpResetCheckout() {
    document.getElementById('co-form-wrap').style.display = '';
    document.getElementById('co-success').classList.remove('show');
    ['co-name','co-phone','co-address'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('co-delivery').value = '';
    document.getElementById('co-qty').value = '1';
    lpUpdateSummary();
    document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
}

lpUpdateSummary();
@endif

/* ══════════════════════════════════════════════
   Category Multi-Product Cart
══════════════════════════════════════════════ */
@if($page->category_id && $categoryProducts && $categoryProducts->count() > 0)
const CAT_ORDER_URL = '{{ route('landing-page.category-order', $page->slug) }}';
const catCart = new Map(); /* productId → { qty, variationIds, varLabels, unitPrice, name } */
const catSelVars = {};    /* productId → { attrName → { id, price, value } }              */
const catFmt = n => '৳' + Number(n).toLocaleString('en-BD', { maximumFractionDigits: 0 });

function catSelectVariation(pill) {
    if (pill.disabled || pill.classList.contains('oos')) return;
    const pid  = parseInt(pill.dataset.productId);
    const attr = pill.dataset.attr;

    /* Deselect siblings */
    document.querySelectorAll(`.cat-pill[data-product-id="${pid}"][data-attr="${attr}"]`)
        .forEach(p => p.classList.remove('selected'));
    pill.classList.add('selected');

    if (!catSelVars[pid]) catSelVars[pid] = {};
    catSelVars[pid][attr] = {
        id:    parseInt(pill.dataset.id),
        price: parseFloat(pill.dataset.price) || 0,
        value: pill.textContent.trim(),
    };

    /* Swap product image */
    if (pill.dataset.image) {
        const img = document.getElementById(`cat-img-${pid}`);
        if (img) img.src = pill.dataset.image;
    }

    /* Update displayed price */
    const priceEl = document.getElementById(`cat-price-${pid}`);
    if (priceEl && pill.dataset.price) {
        priceEl.textContent = catFmt(pill.dataset.price);
    }

    /* Sync cart if already added */
    if (catCart.has(pid)) catSyncItem(pid);
}

function catGetUnitPrice(pid) {
    const vars = catSelVars[pid];
    if (vars && Object.keys(vars).length > 0) {
        return Object.values(vars)[0].price || 0;
    }
    /* Fall back to displayed price */
    const el = document.getElementById(`cat-price-${pid}`);
    if (el) {
        const n = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
        if (!isNaN(n)) return n;
    }
    return 0;
}

function catGetVarIds(pid) {
    const vars = catSelVars[pid];
    return vars ? Object.values(vars).map(v => v.id) : [];
}

function catGetVarLabels(pid) {
    const vars = catSelVars[pid];
    return vars ? Object.values(vars).map(v => v.value) : [];
}

function catChangeQty(pid, delta) {
    const input = document.getElementById(`cat-qty-${pid}`);
    input.value = Math.max(1, (parseInt(input.value) || 1) + delta);
    if (catCart.has(pid)) catSyncItem(pid);
}

function catSyncItem(pid) {
    const qty  = parseInt(document.getElementById(`cat-qty-${pid}`).value) || 1;
    const name = document.getElementById(`cat-card-${pid}`)?.querySelector('.cat-card-name')?.textContent?.trim() || '';
    catCart.set(pid, {
        qty,
        variationIds: catGetVarIds(pid),
        varLabels:    catGetVarLabels(pid),
        unitPrice:    catGetUnitPrice(pid),
        name,
    });
    catRender();
}

function catToggleItem(pid) {
    const btn  = document.getElementById(`cat-add-${pid}`);
    const card = document.getElementById(`cat-card-${pid}`);
    if (catCart.has(pid)) {
        catCart.delete(pid);
        btn.querySelector('span').textContent = 'Add to Order';
        btn.classList.remove('added');
        card.classList.remove('in-order');
    } else {
        catSyncItem(pid);
        btn.querySelector('span').textContent = '✓ In Order';
        btn.classList.add('added');
        card.classList.add('in-order');
    }
    catRender();
}

function catRender() {
    const totalItems = Array.from(catCart.values()).reduce((s, i) => s + i.qty, 0);
    const subtotal   = Array.from(catCart.values()).reduce((s, i) => s + i.unitPrice * i.qty, 0);

    /* Cart bar */
    const bar = document.getElementById('cat-cart-bar');
    if (catCart.size === 0) {
        bar.classList.remove('show');
    } else {
        bar.classList.add('show');
        document.getElementById('cat-bar-count').textContent  = totalItems + ' item' + (totalItems !== 1 ? 's' : '');
        document.getElementById('cat-bar-total').textContent  = catFmt(subtotal);
        const preview = document.getElementById('cat-bar-preview');
        if (preview) {
            preview.innerHTML = '';
            catCart.forEach((item) => {
                const chip = document.createElement('span');
                chip.className = 'cat-bar-item-chip';
                chip.textContent = item.name;
                preview.appendChild(chip);
            });
        }
    }

    /* Order summary panel */
    const badge   = document.getElementById('cat-summary-badge');
    const empty   = document.getElementById('cat-empty-notice');
    const list    = document.getElementById('cat-order-list');
    if (badge) badge.textContent = totalItems + ' item' + (totalItems !== 1 ? 's' : '');

    if (catCart.size === 0) {
        if (empty) empty.style.display = '';
        if (list)  list.style.display  = 'none';
    } else {
        if (empty) empty.style.display = 'none';
        if (list) {
            list.style.display = '';
            list.innerHTML = '';
            catCart.forEach((item, pid) => {
                const row = document.createElement('div');
                row.className = 'cat-order-row';
                const labels = item.varLabels.length ? `<div class="cat-order-row-meta">${item.varLabels.join(' · ')} · ×${item.qty}</div>` : `<div class="cat-order-row-meta">×${item.qty}</div>`;
                row.innerHTML = `
                    <div class="cat-order-row-info">
                        <div class="cat-order-row-name">${item.name}</div>
                        ${labels}
                    </div>
                    <div class="cat-order-row-price">${catFmt(item.unitPrice * item.qty)}</div>
                    <button class="cat-order-row-remove" onclick="catRemoveItem(${pid})" title="Remove">×</button>
                `;
                list.appendChild(row);
            });
        }
    }

    /* Totals */
    const subEl = document.getElementById('cat-co-sub');
    if (subEl) subEl.textContent = catFmt(subtotal);
    catUpdateTotals();
}

function catRemoveItem(pid) {
    catCart.delete(pid);
    const btn  = document.getElementById(`cat-add-${pid}`);
    const card = document.getElementById(`cat-card-${pid}`);
    if (btn)  { btn.querySelector('span').textContent = 'Add to Order'; btn.classList.remove('added'); }
    if (card) card.classList.remove('in-order');
    catRender();
}

function catUpdateTotals() {
    const subtotal = Array.from(catCart.values()).reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const sel      = document.getElementById('cat-delivery');
    const opt      = sel?.options[sel.selectedIndex];
    const dc       = opt && opt.value ? parseFloat(opt.dataset.cost) : null;
    const delEl    = document.getElementById('cat-co-del');
    const totEl    = document.getElementById('cat-co-total');
    if (delEl) delEl.textContent = dc !== null ? catFmt(dc) : 'Select area';
    if (totEl) totEl.textContent = dc !== null ? catFmt(subtotal + dc) : '—';
}

function catScrollToCheckout() {
    document.getElementById('cat-checkout')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function catValidateField(id, errId, fn) {
    const el  = document.getElementById(id);
    const err = document.getElementById(errId);
    const ok  = fn(el.value.trim());
    el.classList.toggle('error', !ok);
    err.classList.toggle('show', !ok);
    return ok;
}

function catValidateAll() {
    const a = catValidateField('cat-name',     'cat-err-name',     v => v.length > 0);
    const b = catValidateField('cat-phone',    'cat-err-phone',    v => /^[0-9+]{7,15}$/.test(v));
    const c = catValidateField('cat-address',  'cat-err-address',  v => v.length > 5);
    const d = catValidateField('cat-delivery', 'cat-err-delivery', v => v.length > 0);
    return a && b && c && d;
}

async function catSubmitOrder() {
    if (catCart.size === 0) {
        catScrollToCheckout();
        const notice = document.getElementById('cat-err-banner');
        notice.textContent = 'Please add at least one product to your order.';
        notice.classList.add('show');
        return;
    }
    if (!catValidateAll()) return;

    const btn    = document.getElementById('cat-submit-btn');
    const banner = document.getElementById('cat-err-banner');
    banner.classList.remove('show');
    btn.classList.add('loading');
    btn.disabled = true;

    const phone = document.getElementById('cat-phone').value.trim();

    const items = [];
    catCart.forEach((item, pid) => {
        items.push({ product_id: pid, quantity: item.qty, variation_ids: item.variationIds });
    });

    try {
        const res = await fetch(CAT_ORDER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept':       'application/json',
                'X-XSRF-TOKEN': lpGetXsrf(),
            },
            body: JSON.stringify({
                customer_name:      document.getElementById('cat-name').value.trim(),
                customer_phone:     phone,
                customer_address:   document.getElementById('cat-address').value.trim(),
                delivery_charge_id: document.getElementById('cat-delivery').value,
                items,
            }),
        });

        const data = await res.json();

        if (data.success) {
            document.getElementById('cat-form-wrap').style.display = 'none';
            document.getElementById('cat-success-id').textContent    = '#' + data.order_id;
            document.getElementById('cat-success-phone').textContent = phone;
            const suc = document.getElementById('cat-success');
            suc.classList.add('show');
            suc.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.getElementById('cat-cart-bar').classList.remove('show');
        } else {
            banner.textContent = data.message || 'Something went wrong. Please try again.';
            banner.classList.add('show');
            banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    } catch (_) {
        banner.textContent = 'Network error. Please check your connection and try again.';
        banner.classList.add('show');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

function catResetCheckout() {
    catCart.clear();
    catSelVars && Object.keys(catSelVars).forEach(k => delete catSelVars[k]);
    document.querySelectorAll('.cat-add-btn').forEach(btn => {
        btn.querySelector('span').textContent = 'Add to Order';
        btn.classList.remove('added');
    });
    document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('in-order'));
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('selected'));
    ['cat-name','cat-phone','cat-address'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    const del = document.getElementById('cat-delivery');
    if (del) del.value = '';
    document.getElementById('cat-form-wrap').style.display = '';
    document.getElementById('cat-success').classList.remove('show');
    catRender();
    document.getElementById('cat-showcase')?.scrollIntoView({ behavior: 'smooth' });
}

catRender();
@endif
</script>
