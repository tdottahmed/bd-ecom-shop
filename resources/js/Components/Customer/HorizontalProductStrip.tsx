import React, { useCallback, useRef } from "react";

interface HorizontalProductStripProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Horizontal scroll with pointer drag; touch devices keep native momentum.
 */
const HorizontalProductStrip: React.FC<HorizontalProductStripProps> = ({
    children,
    className = "",
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const drag = useRef({
        active: false,
        pointerId: 0,
        startX: 0,
        scrollStart: 0,
        lastX: 0,
        lastT: 0,
        vel: 0,
    });
    const momentumRef = useRef<number | null>(null);

    const stopMomentum = useCallback(() => {
        if (momentumRef.current != null) {
            cancelAnimationFrame(momentumRef.current);
            momentumRef.current = null;
        }
    }, []);

    const applyMomentum = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        let v = drag.current.vel * 16;
        const decay = 0.92;
        const tick = () => {
            if (!el || Math.abs(v) < 0.4) {
                momentumRef.current = null;
                return;
            }
            el.scrollLeft -= v;
            v *= decay;
            momentumRef.current = requestAnimationFrame(tick);
        };
        stopMomentum();
        if (Math.abs(v) > 2) {
            momentumRef.current = requestAnimationFrame(tick);
        }
    }, [stopMomentum]);

    const onPointerDown = (e: React.PointerEvent) => {
        if (!ref.current || e.button !== 0) return;
        const t = e.target as HTMLElement | null;
        if (t?.closest("a, button, input, select, textarea, [role='button']")) {
            return;
        }
        stopMomentum();
        ref.current.setPointerCapture(e.pointerId);
        drag.current = {
            active: true,
            pointerId: e.pointerId,
            startX: e.clientX,
            scrollStart: ref.current.scrollLeft,
            lastX: e.clientX,
            lastT: performance.now(),
            vel: 0,
        };
        ref.current.classList.add("cursor-grabbing");
    };

    const onPointerMove = (e: React.PointerEvent) => {
        const el = ref.current;
        if (!el || !drag.current.active || e.pointerId !== drag.current.pointerId)
            return;
        const dx = e.clientX - drag.current.startX;
        el.scrollLeft = drag.current.scrollStart - dx;
        const now = performance.now();
        const dt = now - drag.current.lastT;
        if (dt > 0) {
            drag.current.vel = (e.clientX - drag.current.lastX) / dt;
        }
        drag.current.lastX = e.clientX;
        drag.current.lastT = now;
    };

    const endDrag = (e: React.PointerEvent) => {
        const el = ref.current;
        if (!el || !drag.current.active || e.pointerId !== drag.current.pointerId)
            return;
        drag.current.active = false;
        try {
            el.releasePointerCapture(e.pointerId);
        } catch {
            /* ignore */
        }
        el.classList.remove("cursor-grabbing");
        applyMomentum();
    };

    return (
        <div
            ref={ref}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={`flex gap-5 overflow-x-auto overscroll-x-contain pb-2 pt-1 scrollbar-hide cursor-grab touch-pan-x active:cursor-grabbing ${className}`}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            {children}
        </div>
    );
};

export default HorizontalProductStrip;
