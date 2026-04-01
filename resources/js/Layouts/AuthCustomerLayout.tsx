import React, { ReactNode } from "react";
import { Link } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import BrandLogo from "@/Components/Utility/BrandLogo";

interface AuthCustomerLayoutProps {
    title: string;
    subtitle: string;
    children: ReactNode;
}

export default function AuthCustomerLayout({
    title,
    subtitle,
    children,
}: AuthCustomerLayoutProps) {
    return (
        <CustomerLayout>
            <div className="min-h-[calc(100vh-220px)] bg-[#F8F9FA] py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                    <section className="hidden lg:flex rounded-3xl bg-gradient-to-br from-gray-900 to-gray-700 text-white p-10 flex-col justify-between">
                        <div>
                            <BrandLogo
                                size="lg"
                                withText={true}
                                className="justify-start mb-8"
                            />
                            <h2 className="text-3xl font-semibold leading-tight">
                                Welcome to your customer account
                            </h2>
                            <p className="mt-4 text-gray-200 text-sm leading-6">
                                Track orders, save your cart, and checkout
                                faster with a smoother shopping experience.
                            </p>
                        </div>
                        <div className="text-sm text-gray-300">
                            Need help?{" "}
                            <Link
                                href={route("pages.contact")}
                                className="text-white underline"
                            >
                                Contact support
                            </Link>
                        </div>
                    </section>

                    <section className="rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8">
                        <div className="mb-6">
                            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                                {title}
                            </h1>
                            <p className="text-sm text-gray-500 mt-2">
                                {subtitle}
                            </p>
                        </div>
                        {children}
                    </section>
                </div>
            </div>
        </CustomerLayout>
    );
}
