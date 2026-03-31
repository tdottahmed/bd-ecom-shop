import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { Head } from "@inertiajs/react";

import BannerForm from "./Partials/BannerForm";
import MessengerLinkForm from "./Partials/MessengerLinkForm";
import DeliveryChargeForm from "./Partials/DeliveryChargeForm";
import BrandingForm from "./Partials/BrandingForm";
import FooterSettingsForm from "./Partials/FooterSettingsForm";
import FaqForm from "./Partials/FaqForm";
import ContactInfoForm from "./Partials/ContactInfoForm";
import AboutSettingsForm from "./Partials/AboutSettingsForm";
import CtaSettingsForm from "./Partials/CtaSettingsForm";

import { DeliveryCharge, WebsiteSetting } from "./types";

interface Props {
    settings: WebsiteSetting;
    deliveryCharges: DeliveryCharge[];
    messengerLink?: string;
}

export default function Index({
    settings,
    deliveryCharges,
    messengerLink,
}: Props) {
    return (
        <Master
            title="Website"
            head={<Header title="Website" showUserMenu={true} />}
        >
            <Head title="Website" />
            <div className="p-2 md:p-6 max-w-8xl mx-auto space-y-6">
                <BannerForm settings={settings} />
                <BrandingForm settings={settings} />
                <FooterSettingsForm settings={settings} />
                <MessengerLinkForm messengerLink={messengerLink} />
                <DeliveryChargeForm charges={deliveryCharges} />
                <FaqForm faqs={settings.faqs || []} />
                <ContactInfoForm settings={settings} />
                <AboutSettingsForm settings={settings} />
                <CtaSettingsForm settings={settings} />
            </div>
        </Master>
    );
}
