import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import Card from "@/Components/Ui/Card";
import { Head } from "@inertiajs/react";
import { BarChart3 } from "lucide-react";

interface Props {
    title: string;
    description: string;
}

export default function Generic({ title, description }: Props) {
    return (
        <Master
            title={title}
            head={<Header title={title} showUserMenu={true} />}
        >
            <Head title={title} />
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-[#2DE3A7]/10 border border-[#2DE3A7]/20 text-[#2DE3A7]">
                        <BarChart3 size={28} strokeWidth={1.75} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold text-white tracking-tight">
                            {title}
                        </h1>
                        <p className="text-gray-400 mt-2 leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                <Card>
                    <div className="p-8 text-center text-gray-500 text-sm border border-dashed border-gray-700 rounded-lg bg-[#0E1614]/50">
                        Report data and charts will be wired to your orders, products,
                        and customers in a follow-up. Use the Reports menu to jump
                        between report types.
                    </div>
                </Card>
            </div>
        </Master>
    );
}
