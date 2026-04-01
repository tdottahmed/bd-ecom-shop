import React, { ReactNode } from "react";
import { Head, Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";

interface Props {
    title: string;
    children: ReactNode;
}

const links = [
    { label: "Dashboard", href: "account.dashboard" },
    { label: "Orders", href: "account.orders" },
    { label: "Saved Cart", href: "account.cart" },
    { label: "Profile", href: "account.profile" },
    { label: "Addresses", href: "account.addresses" },
];

export default function CustomerAccountLayout({ title, children }: Props) {
    return (
        <CustomerLayout>
            <Head title={title} />
            <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <aside className="lg:col-span-3">
                        <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2">
                            <h2 className="text-lg font-semibold text-gray-900">
                                My Account
                            </h2>
                            {links.map((item) => (
                                <Link
                                    key={item.href}
                                    href={route(item.href)}
                                    className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </aside>
                    <section className="lg:col-span-9">
                        <div className="bg-white border border-gray-100 rounded-2xl p-6">
                            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                                {title}
                            </h1>
                            {children}
                        </div>
                    </section>
                </div>
            </div>
        </CustomerLayout>
    );
}
