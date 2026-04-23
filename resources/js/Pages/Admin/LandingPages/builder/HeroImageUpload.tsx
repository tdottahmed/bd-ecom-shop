import { useRef } from "react";
import { Image as ImageIcon } from "lucide-react";

interface Props {
    current: string | null;
    onChange: (file: File) => void;
}

export function HeroImageUpload({ current, onChange }: Props) {
    const ref = useRef<HTMLInputElement>(null);

    return (
        <div>
            {current ? (
                <div
                    className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#0C1311] border border-[#1E2826] group cursor-pointer"
                    onClick={() => ref.current?.click()}
                >
                    <img src={current} alt="Hero" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                        <ImageIcon size={20} />
                        <span className="text-xs font-medium">Change Image</span>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => ref.current?.click()}
                    className="w-full aspect-video border-2 border-dashed border-[#1E2826] hover:border-[#2DE3A7]/40 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-600 hover:text-gray-400 transition-colors"
                >
                    <ImageIcon size={22} />
                    <span className="text-xs font-medium">Upload Hero Image</span>
                    <span className="text-[10px] text-gray-700">Recommended: 1200 × 800px</span>
                </button>
            )}
            <input
                ref={ref}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && onChange(e.target.files[0])}
            />
        </div>
    );
}
