import React from "react";
import Master from "@/Layouts/Master";
import Header from "@/Components/Layouts/Header";
import { Head } from "@inertiajs/react";
import FaqForm from "./Partials/FaqForm";

type FAQ = {
    question: string;
    answer: string;
};

interface Props {
    faqs: FAQ[];
}

export default function FaqIndex({ faqs }: Props) {
    return (
        <Master
            title="FAQ"
            head={<Header title="FAQ Manager" showUserMenu={true} />}
        >
            <Head title="FAQ Manager" />
            <div className="p-2 md:p-6 max-w-8xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                        FAQ Manager
                    </h1>
                    <p className="text-sm md:text-base text-gray-400 mt-1">
                        Manage all storefront frequently asked questions from
                        one dedicated place.
                    </p>
                </div>
                <FaqForm faqs={faqs || []} />
            </div>
        </Master>
    );
}
