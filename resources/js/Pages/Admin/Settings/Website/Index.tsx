import { useState } from "react";
import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { Head } from "@inertiajs/react";

import BannerForm from "./Partials/BannerForm";
import BrandingForm from "./Partials/BrandingForm";
import FooterSettingsForm from "./Partials/FooterSettingsForm";
import ChatLinksForm from "./Partials/ChatLinksForm";
import DeliveryChargeForm from "./Partials/DeliveryChargeForm";
import FaqForm from "./Partials/FaqForm";
import ContactInfoForm from "./Partials/ContactInfoForm";
import AboutSettingsForm from "./Partials/AboutSettingsForm";
import CtaSettingsForm from "./Partials/CtaSettingsForm";
import CustomerAuthSettingsForm from "./Partials/CustomerAuthSettingsForm";
import SmtpSettingsForm from "./Partials/SmtpSettingsForm";

import { DeliveryCharge, WebsiteSetting } from "./types";

interface Props {
    settings: WebsiteSetting;
    deliveryCharges: DeliveryCharge[];
    messengerLink?: string;
    whatsappLink?: string;
}

const TABS = [
    { id: "branding",  label: "Branding" },
    { id: "social",    label: "Social & Footer" },
    { id: "delivery",  label: "Delivery" },
    { id: "content",   label: "Content" },
    { id: "system",    label: "System" },
] as const;

type TabId = typeof TABS[number]["id"];

export default function Index({ settings, deliveryCharges, messengerLink, whatsappLink }: Props) {
    const [activeTab, setActiveTab] = useState<TabId>("branding");

    return (
        <Master
            title="Website"
            head={<Header title="Website Settings" showUserMenu={true} />}
        >
            <Head title="Website Settings" />

            <div className="p-2 md:p-6 max-w-8xl mx-auto">
                {/* Tab Bar */}
                <div className="flex gap-1 bg-gray-900 rounded-xl p-1 mb-6 overflow-x-auto scrollbar-hide">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                                activeTab === tab.id
                                    ? "bg-[#2DE3A7] text-black shadow-sm"
                                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Panels */}
                <div className="space-y-6">
                    {activeTab === "branding" && (
                        <>
                            <BannerForm settings={settings} />
                            <BrandingForm settings={settings} />
                        </>
                    )}

                    {activeTab === "social" && (
                        <>
                            <FooterSettingsForm settings={settings} />
                            <ChatLinksForm
                                messengerLink={messengerLink}
                                whatsappLink={whatsappLink}
                            />
                        </>
                    )}

                    {activeTab === "delivery" && (
                        <DeliveryChargeForm charges={deliveryCharges} />
                    )}

                    {activeTab === "content" && (
                        <>
                            <FaqForm faqs={settings.faqs || []} />
                            <ContactInfoForm settings={settings} />
                            <AboutSettingsForm settings={settings} />
                            <CtaSettingsForm settings={settings} />
                        </>
                    )}

                    {activeTab === "system" && (
                        <>
                            <CustomerAuthSettingsForm settings={settings} />
                            <SmtpSettingsForm settings={settings} />
                        </>
                    )}
                </div>
            </div>
        </Master>
    );
}
