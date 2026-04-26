export const CHART_COLORS = {
    green:  "#2DE3A7",
    blue:   "#3B82F6",
    amber:  "#F59E0B",
    red:    "#EF4444",
    purple: "#8B5CF6",
    teal:   "#14B8A6",
};

export const GRID_COLOR   = "#1E2826";
export const AXIS_COLOR   = "#4B5563";
export const PIE_COLORS   = [
    CHART_COLORS.green,
    CHART_COLORS.blue,
    CHART_COLORS.amber,
    CHART_COLORS.red,
    CHART_COLORS.purple,
    CHART_COLORS.teal,
];

interface Entry { name?: string; value: number | string; color?: string; [key: string]: unknown }

interface Props {
    active?: boolean;
    payload?: Entry[];
    label?: string;
    formatter?: (v: number | string, name?: string) => string;
}

export function ChartTooltip({ active, payload, label, formatter }: Props) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#0C1311] border border-[#1E2826] rounded-lg px-3 py-2 shadow-2xl text-xs">
            {label && <p className="text-gray-400 mb-1.5 font-medium">{label}</p>}
            {payload.map((p, i) => (
                <p key={i} className="font-semibold" style={{ color: p.color ?? "#2DE3A7" }}>
                    {p.name ? `${p.name}: ` : ""}
                    {formatter ? formatter(p.value, p.name) : p.value?.toLocaleString()}
                </p>
            ))}
        </div>
    );
}
