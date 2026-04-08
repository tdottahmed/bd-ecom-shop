import React, { useEffect, useMemo, useRef, useState } from "react";
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

function getCsrfToken(): string {
    return (
        document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content") ?? ""
    );
}

function getXsrfTokenFromCookie(): string {
    if (typeof document === "undefined") return "";
    const raw = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

    if (!raw) return "";

    try {
        return decodeURIComponent(raw);
    } catch {
        return raw;
    }
}

export default function NotificationBell() {
    const { url } = usePage();
    const isAdminRoute = useMemo(() => url?.startsWith("/admin"), [url]);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [items, setItems] = useState<AdminNotification[]>([]);

    const rootRef = useRef<HTMLDivElement | null>(null);
    const unreadRef = useRef<number>(0);
    const canPlaySoundRef = useRef(false);

    const load = async () => {
        if (!isAdminRoute) return;

        setLoading(true);
        try {
            const res = await fetch(route("admin.notifications.index"), {
                headers: {
                    Accept: "application/json",
                },
            });
            const data = await res.json();
            const nextUnread = data.unread_count ?? 0;
            setUnreadCount(nextUnread);
            unreadRef.current = nextUnread;
            setItems(data.notifications ?? []);
        } catch (e) {
            // keep UI quiet; header should never hard-fail
        } finally {
            setLoading(false);
        }
    };

    const playPing = () => {
        if (!canPlaySoundRef.current) return;
        if (typeof window === "undefined") return;
        if (document.visibilityState !== "visible") return;
        try {
            const AudioCtx =
                (window as any).AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();

            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.type = "sine";
            o.frequency.setValueAtTime(880, ctx.currentTime); // A5
            g.gain.setValueAtTime(0.0001, ctx.currentTime);
            g.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

            o.connect(g);
            g.connect(ctx.destination);
            o.start();
            o.stop(ctx.currentTime + 0.2);

            setTimeout(() => ctx.close().catch(() => {}), 400);
        } catch {
            // ignore
        }
    };

    const poll = async () => {
        if (!isAdminRoute) return;
        try {
            const res = await fetch(route("admin.notifications.index"), {
                headers: { Accept: "application/json" },
            });
            const data = await res.json();
            const nextUnread = data.unread_count ?? 0;
            const prevUnread = unreadRef.current ?? 0;

            if (nextUnread > prevUnread) {
                playPing();
            }

            unreadRef.current = nextUnread;
            setUnreadCount(nextUnread);
            setItems(data.notifications ?? []);
        } catch {
            // ignore
        }
    };

    const markAllRead = async () => {
        try {
            const csrf = getCsrfToken();
            const xsrf = getXsrfTokenFromCookie();
            await fetch(route("admin.notifications.read-all"), {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
                    ...(xsrf ? { "X-XSRF-TOKEN": xsrf } : {}),
                },
                credentials: "same-origin",
            });
            unreadRef.current = 0;
            setUnreadCount(0);
            setItems((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
        } catch (e) {
            // ignore
        }
    };

    const markRead = async (id: string) => {
        try {
            const csrf = getCsrfToken();
            const xsrf = getXsrfTokenFromCookie();
            const res = await fetch(
                route("admin.notifications.read", { notificationId: id }),
                {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "X-Requested-With": "XMLHttpRequest",
                    ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}),
                    ...(xsrf ? { "X-XSRF-TOKEN": xsrf } : {}),
                },
                    credentials: "same-origin",
                    keepalive: true,
                }
            );
            const data = await res.json().catch(() => ({}));
            if (typeof data.unread_count === "number") {
                unreadRef.current = data.unread_count;
                setUnreadCount(data.unread_count);
            } else {
                setUnreadCount((c) => {
                    const next = Math.max(0, c - 1);
                    unreadRef.current = next;
                    return next;
                });
            }
            setItems((prev) =>
                prev.map((n) =>
                    n.id === id
                        ? { ...n, read_at: n.read_at ?? new Date().toISOString() }
                        : n
                )
            );
        } catch (e) {
            // ignore
        }
    };

    const openNotification = async (n: AdminNotification) => {
        const actionUrl = n.data?.action_url;

        // Optimistically mark read for instant UI response.
        if (n.read_at == null) {
            unreadRef.current = Math.max(0, unreadRef.current - 1);
            setUnreadCount((c) => Math.max(0, c - 1));
            setItems((prev) =>
                prev.map((item) =>
                    item.id === n.id
                        ? {
                              ...item,
                              read_at:
                                  item.read_at ?? new Date().toISOString(),
                          }
                        : item
                )
            );
            // Fire and forget (keepalive) so route navigation doesn't cancel it.
            void markRead(n.id);
        }

        setOpen(false);
        if (actionUrl) {
            try {
                // Notifications store absolute URLs. Compare hostname only (not port)
                // so dev (localhost:8000) and prod (localhost:80) both resolve correctly.
                const parsed = new URL(actionUrl, window.location.origin);
                const isSameHost = parsed.hostname === window.location.hostname;
                const target = `${parsed.pathname}${parsed.search}${parsed.hash}`;

                if (isSameHost) {
                    router.visit(target);
                } else {
                    window.location.assign(actionUrl);
                }
            } catch {
                // If URL parsing fails, fall back to hard navigation.
                window.location.assign(actionUrl);
            }
        }
    };

    useEffect(() => {
        if (!isAdminRoute) return;
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdminRoute]);

    // Unlock sound after first user interaction (required by browsers)
    useEffect(() => {
        if (!isAdminRoute) return;
        const unlock = () => {
            canPlaySoundRef.current = true;
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("keydown", unlock);
        };
        window.addEventListener("pointerdown", unlock, { once: true });
        window.addEventListener("keydown", unlock, { once: true });
        return () => {
            window.removeEventListener("pointerdown", unlock);
            window.removeEventListener("keydown", unlock);
        };
    }, [isAdminRoute]);

    // Poll notifications (admin) for realtime-ish updates
    useEffect(() => {
        if (!isAdminRoute) return;
        const id = window.setInterval(() => {
            poll();
        }, 20000);
        return () => window.clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdminRoute]);

    useEffect(() => {
        if (!open) return;
        load();

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        const onClick = (e: MouseEvent) => {
            const el = rootRef.current;
            if (!el) return;
            if (e.target instanceof Node && !el.contains(e.target)) {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("mousedown", onClick);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("mousedown", onClick);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    if (!isAdminRoute) return null;

    return (
        <div ref={rootRef} className="relative">
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

            {open && (
                <div className="absolute right-0 mt-3 w-[360px] max-w-[calc(100vw-24px)] z-50">
                    <div className="rounded-2xl border border-[#1E2826] bg-[#0E1614] shadow-[0_18px_60px_rgba(0,0,0,0.55)] overflow-hidden">
                        <div className="px-4 py-3 border-b border-[#1E2826] flex items-center justify-between">
                            <div className="min-w-0">
                                <div className="text-sm font-semibold text-white">
                                    Notifications
                                </div>
                                <div className="text-xs text-gray-400">
                                    {unreadCount > 0
                                        ? `${unreadCount} unread`
                                        : "All caught up"}
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

                        <div className="max-h-[420px] overflow-auto">
                            {loading && items.length === 0 ? (
                                <div className="p-4 text-sm text-gray-400">
                                    Loading notifications…
                                </div>
                            ) : items.length === 0 ? (
                                <div className="p-6">
                                    <div className="text-sm font-semibold text-white">
                                        No notifications yet
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Contact messages and order updates will
                                        appear here.
                                    </div>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#1E2826]">
                                    {items.map((n) => {
                                        const isUnread = n.read_at == null;
                                        const created =
                                            n.created_at ??
                                            n.data?.created_at ??
                                            null;
                                        const timeLabel = created
                                            ? formatDistanceToNow(
                                                  new Date(created),
                                                  { addSuffix: true }
                                              )
                                            : "";

                                        return (
                                            <button
                                                key={n.id}
                                                type="button"
                                                onClick={() =>
                                                    openNotification(n)
                                                }
                                                className={`w-full text-left px-4 py-3 transition-colors ${
                                                    isUnread
                                                        ? "bg-[#0F1A18] hover:bg-[#13201E]"
                                                        : "hover:bg-[#121C1A]"
                                                }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="pt-1">
                                                        <span
                                                            className={`block w-2.5 h-2.5 rounded-full ${
                                                                isUnread
                                                                    ? "bg-[#2DE3A7]"
                                                                    : "bg-gray-700"
                                                            }`}
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="min-w-0">
                                                                <div className="text-sm font-semibold text-white truncate">
                                                                    {n.data
                                                                        ?.title ??
                                                                        "Notification"}
                                                                </div>
                                                                {n.data?.body && (
                                                                    <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">
                                                                        {
                                                                            n
                                                                                .data
                                                                                .body
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-[11px] text-gray-500 whitespace-nowrap pt-0.5">
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

