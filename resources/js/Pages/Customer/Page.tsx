import React from "react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { Head } from "@inertiajs/react";
import NewsletterSection from "@/Components/Customer/CtaSection";

type Page = {
    title: string;
    slug: string;
    content?: string | null;
};

interface Props {
    page: Page;
}

export default function PageView({ page }: Props) {
    return (
        <CustomerLayout>
            <Head title={page.title} />

            <div className="max-w-full mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {page.title}
                    </h1>

                    <div className="prose prose-slate max-w-none mt-6">
                        {page.content ? (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: page.content,
                                }}
                            />
                        ) : (
                            <p>This page has no content yet.</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="max-w-full mx-auto px-4 md:px-6 py-8 md:py-12">
                <NewsletterSection />
            </div>
        </CustomerLayout>
    );
}
