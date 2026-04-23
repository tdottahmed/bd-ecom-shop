import { X } from "lucide-react";

export const baseCls = "w-full bg-[#0C1311] border border-[#1E2826] text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#2DE3A7]/60 placeholder:text-gray-600";

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-gray-400 text-[10px] font-semibold uppercase tracking-widest">{label}</label>
            {children}
            {hint && <p className="text-gray-600 text-xs">{hint}</p>}
        </div>
    );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return <input {...props} className={`${baseCls} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return <textarea {...props} rows={props.rows ?? 3} className={`${baseCls} resize-none ${props.className ?? ""}`} />;
}

export function StyledSelect({ value, onChange, children, className = "" }: {
    value: string; onChange: (v: string) => void; children: React.ReactNode; className?: string;
}) {
    return (
        <select value={value} onChange={e => onChange(e.target.value)} className={`${baseCls} ${className}`}>
            {children}
        </select>
    );
}

export function ColorInput({ value, onChange, placeholder = "#hex or transparent" }: {
    value: string; onChange: (v: string) => void; placeholder?: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <input
                type="color"
                value={value || "#0b1818"}
                onChange={e => onChange(e.target.value)}
                className="w-8 h-8 rounded-lg border border-[#1E2826] bg-[#0C1311] cursor-pointer p-0.5 flex-shrink-0"
            />
            <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="flex-1 text-xs" />
            {value && (
                <button type="button" onClick={() => onChange("")} className="text-gray-600 hover:text-gray-400 flex-shrink-0">
                    <X size={12} />
                </button>
            )}
        </div>
    );
}

export function Btn({
    children, onClick, variant = "ghost", type = "button", disabled = false, className = "",
}: {
    children: React.ReactNode; onClick?: () => void;
    variant?: "ghost" | "danger" | "primary";
    type?: "button" | "submit"; disabled?: boolean; className?: string;
}) {
    const cls = {
        ghost:   "text-gray-400 hover:text-white hover:bg-[#1E2826]",
        danger:  "text-gray-400 hover:text-red-400 hover:bg-red-500/10",
        primary: "bg-[#2DE3A7] hover:bg-[#24c490] text-black font-semibold",
    }[variant];
    return (
        <button type={type} onClick={onClick} disabled={disabled}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-40 ${cls} ${className}`}>
            {children}
        </button>
    );
}

export function Divider() {
    return <div className="border-t border-[#1E2826]" />;
}
