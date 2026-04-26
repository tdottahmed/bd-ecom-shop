import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { router, usePage } from "@inertiajs/react";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type AdminNotification = {
    id: string;
    read_at: string | null;
    created_at: string | null;
    data: {
        kind?: string;
        title?: string;
        body?: string;
        action_url?: string;
        created_at?: string;
        [key: string]: any;
    };
};

// ── helpers ──────────────────────────────────────────────────────────────────

function getCsrfHeaders(): Record<string, string> {
    const csrf =
        document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "";
    const raw = document.cookie
        .split("; ")
        .find((r) => r.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];
    const xsrf = raw ? (() => { try { return decodeURIComponent(raw); } catch { return raw; } })() : "";

    return {
        ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
        ...(xsrf ? { "X-XSRF-TOKEN": xsrf } : {}),
    };
}

const POLL_INTERVAL_MS = 30_000; // 30 s — only when tab is visible
const MAX_BACKOFF_MS   = 5 * 60_000; // 5 min cap on error backoff

// ── component ────────────────────────────────────────────────────────────────

export default function NotificationBell() {
    const { url } = usePage();
    const isAdminRoute = useMemo(() => url?.startsWith("/admin"), [url]);

    const [open, setOpen]           = useState(false);
    const [loading, setLoading]     = useState(false);
    const [unreadCount, setUnread]  = useState(0);
    const [items, setItems]         = useState<AdminNotification[]>([]);

    const rootRef        = useRef<HTMLDivElement>(null);
    const unreadRef      = useRef(0);
    const canPingSoundRef = useRef(false);
    const abortRef       = useRef<AbortController | null>(null);
    const errorCountRef  = useRef(0);
    const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastFetchRef   = useRef(0); // timestamp of last successful fetch

    // ── sound ────────────────────────────────────────────────────────────────

    const playPing = useCallback(() => {
        if (!canPingSoundRef.current || document.visibilityState !== "visible") return;
        try {
            const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (!Ctx) return;
            const ctx = new Ctx();
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = "sine";
            o.frequency.setValueAtTime(880, ctx.currentTime);
            g.gain.setValueAtTime(0.0001, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
            o.connect(g);
            g.connect(ctx.destination);
            o.start();
            o.stop(ctx.currentTime + 0.2);
            setTimeout(() => ctx.close().catch(() => {}), 400);
        } catch { /* ignore */ }
    }, []);

    // ── core fetch ───────────────────────────────────────────────────────────

    const fetchNotifications = useCallback(async (opts: { silent?: boolean } = {}) => {
        if (!isAdminRoute) return;

        // Cancel any in-flight request
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        if (!opts.silent) setLoading(true);

        try {
            const res = await fetch(route("admin.notifications.index"), {
                headers: { Accept: "application/json" },
                signal: controller.signal,
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const next: number = data.unread_count ?? 0;
            const prev = unreadRef.current;

            if (next > prev) playPing();

            unreadRef.current = next;
            setUnread(next);
            setItems(data.notifications ?? []);
            lastFetchRef.current = Date.now();
            errorCountRef.current = 0; // reset backoff
        } catch (err: any) {
            if (err?.name === "AbortError") return; // cancelled — not an error
            errorCountRef.current += 1;
        } finally {
            if (!controller.signal.aborted) setLoading(false);
        }
    }, [isAdminRoute, playPing]);

    // ── polling with backoff ──────────────────────────────────────────────────

    const startPolling = useCallback(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            if (document.visibilityState !== "visible") return; // skip hidden tabs

            // Exponential backoff: skip ticks after consecutive errors
            const backoff = Math.min(
                Math.pow(2, errorCountRef.current) * POLL_INTERVAL_MS,
                MAX_BACKOFF_MS,
            );
            if (Date.now() - lastFetchRef.current < backoff - POLL_INTERVAL_MS) return;

            fetchNotifications({ silent: true });
        }, POLL_INTERVAL_MS);
    }, [fetchNotifications]);

    // ── effects ──────────────────────────────────────────────────────────────

    // Initial load + start poll
    useEffect(() => {
        if (!isAdminRoute) return;
        fetchNotifications();
        startPolling();
        return () => {
            intervalRef.current && clearInterval(intervalRef.current);
            abortRef.current?.abort();
        };
    }, [isAdminRoute, fetchNotifications, startPolling]);

    // Page visibility: fetch immediately when tab becomes visible again
    useEffect(() => {
        if (!isAdminRoute) return;
        const onVisible = () => {
            if (document.visibilityState === "visible") {
                // Only re-fetch if data is stale (> 30 s old)
                if (Date.now() - lastFetchRef.current > POLL_INTERVAL_MS) {
                    fetchNotifications({ silent: true });
                }
            }
        };
        document.addEventListener("visibilitychange", onVisible);
        return () => document.removeEventListener("visibilitychange", onVisible);
    }, [isAdminRoute, fetchNotifications]);

    // Unlock audio after first interaction
    useEffect(() => {
        if (!isAdminRoute) return;
        const unlock = () => { canPingSoundRef.current = true; };
        window.addEventListener("pointerdown", unlock, { once: true });
        window.addEventListener("keydown",     unlock, { once: true });
        return () => {
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("keydown",     unlock);
        };
    }, [isAdminRoute]);

    // Close on outside click / Escape
    useEffect(() => {
        if (!open) return;
        const onKey   = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
        const onClick = (e: MouseEvent)    => {
            if (e.target instanceof Node && !rootRef.current?.contains(e.target)) {
                setOpen(false);
            }
        };
        window.addEventListener("keydown",   onKey);
        window.addEventListener("mousedown", onClick);
        return () => {
            window.removeEventListener("keydown",   onKey);
            window.removeEventListener("mousedown", onClick);
        };
    }, [open]);

    // ── mark read helpers ────────────────────────────────────────────────────

    const markAllRead = useCallback(async () => {
        // Optimistic update
        unreadRef.current = 0;
        setUnread(0);
        setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));

        try {
            await fetch(route("admin.notifications.read-all"), {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    ...getCsrfHeaders(),
                },
                credentials: "same-origin",
            });
        } catch { /* ignore */ }
    }, []);

    const openNotification = useCallback(async (n: AdminNotification) => {
        if (n.read_at == null) {
            // Optimistic
            unreadRef.current = Math.max(0, unreadRef.current - 1);
            setUnread((c) => Math.max(0, c - 1));
            setItems((prev) =>
                prev.map((item) =>
                    item.id === n.id ? { ...item, read_at: item.read_at ?? new Date().toISOString() } : item
                )
            );

            // Fire-and-forget (keepalive so navigation won't cancel it)
            fetch(route("admin.notifications.read", { notificationId: n.id }), {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    ...getCsrfHeaders(),
                },
                credentials: "same-origin",
                keepalive: true,
            }).catch(() => {});
        }

        setOpen(false);

        const actionUrl = n.data?.action_url;
        if (!actionUrl) return;

        try {
            const parsed    = new URL(actionUrl, window.location.origin);
            const sameHost  = parsed.hostname === window.location.hostname;
            const target    = `${parsed.pathname}${parsed.search}${parsed.hash}`;
            sameHost ? router.visit(target) : window.location.assign(actionUrl);
        } catch {
            window.location.assign(actionUrl);
        }
    }, []);

    // ── render ───────────────────────────────────────────────────────────────

    if (!isAdminRoute) return null;

    return (
        <div ref={rootRef} className="relative">
            {/* Bell button */}
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="relative inline-flex items-center justify-center h-10 w-10 rounded-xl bg-[#1E2826] hover:bg-[#2A3532] border border-[#2DE3A7]/15 hover:border-[#2DE3A7]/30 transition-colors text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#2DE3A7]/40"
                aria-label="Notifications"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#2DE3A7] text-[#0C1311] text-[11px] font-extrabold flex items-center justify-center shadow-[0_0_0_3px_rgba(14,22,20,1)]">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-3 w-[360px] max-w-[calc(100vw-24px)] z-50">
                    <div className="rounded-2xl border border-[#1E2826] bg-[#0E1614] shadow-[0_18px_60px_rgba(0,0,0,0.55)] overflow-hidden">

                        {/* Header */}
                        <div className="px-4 py-3 border-b border-[#1E2826] flex items-center justify-between">
                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-white">Notifications</div>
                                <div className="text-xs text-gray-400">
                                    {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={markAllRead}
                                disabled={unreadCount === 0}
                                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl border border-[#2DE3A7]/20 text-[#2DE3A7] hover:bg-[#2DE3A7]/10 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                            >
                                <CheckCheck className="w-4 h-4" />
                                Mark all read
                            </button>
                        </div>

                        {/* List */}
                        <div className="max-h-[420px] overflow-auto">
                            {loading && items.length === 0 ? (
                                <div className="p-4 text-sm text-gray-400">Loading…</div>
                            ) : items.length === 0 ? (
                                <div className="p-6">
                                    <div className="text-sm font-semibold text-white">No notifications yet</div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Contact messages and order updates will appear here.
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#1E2826]">
                                    {items.map((n) => {
                                        const isUnread  = n.read_at == null;
                                        const created   = n.created_at ?? n.data?.created_at ?? null;
                                        const timeLabel = created
                                            ? formatDistanceToNow(new Date(created), { addSuffix: true })
                                            : "";

                                        return (
                                            <button
                                                key={n.id}
                                                type="button"
                                                onClick={() => openNotification(n)}
                                                className={`w-full text-left px-4 py-3 transition-colors ${
                                                    isUnread ? "bg-[#0F1A18] hover:bg-[#13201E]" : "hover:bg-[#121C1A]"
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="pt-1.5">
                                                        <span className={`block w-2 h-2 rounded-full ${isUnread ? "bg-[#2DE3A7]" : "bg-gray-700"}`} />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <div className="text-sm font-semibold text-white truncate">
                                                                    {n.data?.title ?? "Notification"}
                                                                </div>
                                                                {n.data?.body && (
                                                                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                                                                        {n.data.body}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-[11px] text-gray-500 whitespace-nowrap pt-0.5 shrink-0">
                                                                {timeLabel}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
