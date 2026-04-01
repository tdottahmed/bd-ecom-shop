import { useRef, useState } from "react";

/**
 * Provides two layers of bot/spam protection:
 *  1. Honeypot — a hidden bait field that bots tend to fill; humans never see it.
 *  2. Time gate — rejects submissions that arrive faster than `minSeconds` after mount;
 *     automated scripts submit instantly while humans take time to read and type.
 *
 * Usage:
 *   const { honeypot, setHoneypot, validate } = useAntiSpam();
 *   // Render <input className="spam-trap" value={honeypot} onChange={e => setHoneypot(e.target.value)} ... />
 *   // Call validate() before submitting — returns false for suspected bots.
 */
export function useAntiSpam(minSeconds = 3) {
    const mountedAt = useRef(Date.now());
    const [honeypot, setHoneypot] = useState("");

    /** Returns true if the submission looks human. */
    function validate(): boolean {
        if (honeypot.length > 0) return false; // bait field was filled
        const elapsed = (Date.now() - mountedAt.current) / 1000;
        return elapsed >= minSeconds; // submitted too fast
    }

    return { honeypot, setHoneypot, validate };
}
