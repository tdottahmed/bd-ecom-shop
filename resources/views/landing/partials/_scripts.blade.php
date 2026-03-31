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
</script>
