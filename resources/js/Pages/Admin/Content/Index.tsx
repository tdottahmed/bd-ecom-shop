import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { Head } from "@inertiajs/react";
import BlogSettingsForm from "@/Pages/Admin/Settings/Website/Partials/BlogSettingsForm";
import ContactInfoForm from "@/Pages/Admin/Settings/Website/Partials/ContactInfoForm";
import AboutSettingsForm from "@/Pages/Admin/Settings/Website/Partials/AboutSettingsForm";
import CtaSettingsForm from "@/Pages/Admin/Settings/Website/Partials/CtaSettingsForm";
import type { WebsiteSetting } from "@/Pages/Admin/Settings/Website/types";

interface Props {
    settings: WebsiteSetting;
}

export default function Index({ settings }: Props) {
    return (
        <Master
            title="Content Settings"
            head={<Header title="Content Settings" showUserMenu={true} />}
        >
            <Head title="Content Settings" />

            <div className="p-2 md:p-6 max-w-8xl mx-auto space-y-6">
                <BlogSettingsForm settings={settings} />
                <ContactInfoForm settings={settings} />
                <AboutSettingsForm settings={settings} />
                <CtaSettingsForm settings={settings} />
            </div>
        </Master>
    );
}
