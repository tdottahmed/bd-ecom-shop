import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { Head, useForm } from "@inertiajs/react";
import Card from "@/Components/Ui/Card";
import TextInput from "@/Components/Ui/TextInput";
import TextArea from "@/Components/Ui/TextArea";
import InputLabel from "@/Components/Ui/InputLabel";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import InputError from "@/Components/Ui/InputError";
import Toggle from "@/Components/Ui/Toggle";
import { FormEventHandler } from "react";

interface Props {
    settings: {
        meta_pixel_enabled: string;
        meta_pixel_id: string;
        meta_pixel_access_token: string;
        meta_pixel_test_code: string;
        google_tag_manager_enabled: string;
        google_tag_manager_container_id: string;
    };
}

export default function Index({ settings }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        meta_pixel_enabled: settings.meta_pixel_enabled === "1",
        meta_pixel_id: settings.meta_pixel_id || "",
        meta_pixel_access_token: settings.meta_pixel_access_token || "",
        meta_pixel_test_code: settings.meta_pixel_test_code || "",
        google_tag_manager_enabled: settings.google_tag_manager_enabled === "1",
        google_tag_manager_container_id:
            settings.google_tag_manager_container_id || "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("admin.marketing.update"));
    };

    return (
        <Master
            title="Marketing"
            head={<Header title="Marketing" showUserMenu={true} />}
        >
            <Head title="Marketing" />
            <div className="p-2">
                <div className="max-w-7xl mx-auto space-y-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Meta Pixel Section */}
                        <Card>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#2DE3A7]">
                                    Meta Pixel
                                </h2>
                                <Toggle
                                    name="meta_pixel_enabled"
                                    checked={data.meta_pixel_enabled}
                                    onChange={(e) =>
                                        setData(
                                            "meta_pixel_enabled",
                                            e.target.checked,
                                        )
                                    }
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <InputLabel
                                        htmlFor="meta_pixel_id"
                                        value="Pixel ID"
                                        required
                                    />
                                    <TextInput
                                        id="meta_pixel_id"
                                        name="meta_pixel_id"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.meta_pixel_id}
                                        onChange={(e) =>
                                            setData(
                                                "meta_pixel_id",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter your Meta Pixel ID"
                                        disabled={!data.meta_pixel_enabled}
                                    />
                                    <InputError
                                        message={errors.meta_pixel_id}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="meta_pixel_access_token"
                                        value="Access Token (optional)"
                                    />
                                    <TextArea
                                        id="meta_pixel_access_token"
                                        name="meta_pixel_access_token"
                                        value={data.meta_pixel_access_token}
                                        onChange={(e) =>
                                            setData(
                                                "meta_pixel_access_token",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter your Meta Pixel Access Token"
                                        disabled={!data.meta_pixel_enabled}
                                        rows={3}
                                    />
                                    <InputError
                                        message={errors.meta_pixel_access_token}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="meta_pixel_test_code"
                                        value="Test Code (optional)"
                                    />
                                    <TextInput
                                        id="meta_pixel_test_code"
                                        name="meta_pixel_test_code"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={data.meta_pixel_test_code}
                                        onChange={(e) =>
                                            setData(
                                                "meta_pixel_test_code",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter test code"
                                        disabled={!data.meta_pixel_enabled}
                                    />
                                    <InputError
                                        message={errors.meta_pixel_test_code}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Google Tag Manager Section */}
                        <Card>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-[#2DE3A7]">
                                    Google TAG Manager
                                </h2>
                                <Toggle
                                    name="google_tag_manager_enabled"
                                    checked={data.google_tag_manager_enabled}
                                    onChange={(e) =>
                                        setData(
                                            "google_tag_manager_enabled",
                                            e.target.checked,
                                        )
                                    }
                                />
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <InputLabel
                                        htmlFor="google_tag_manager_container_id"
                                        value="Container ID"
                                        required
                                    />
                                    <TextInput
                                        id="google_tag_manager_container_id"
                                        name="google_tag_manager_container_id"
                                        type="text"
                                        className="mt-1 block w-full"
                                        value={
                                            data.google_tag_manager_container_id
                                        }
                                        onChange={(e) =>
                                            setData(
                                                "google_tag_manager_container_id",
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Enter your Google Tag Manager Container ID (e.g., GTM-XXXXXXX)"
                                        disabled={
                                            !data.google_tag_manager_enabled
                                        }
                                    />
                                    <InputError
                                        message={
                                            errors.google_tag_manager_container_id
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </Card>

                        <div className="flex items-center justify-end pt-4">
                            <PrimaryButton
                                className="w-auto justify-center max-w-md"
                                disabled={processing}
                            >
                                {processing ? "Saving..." : "Save Settings"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </Master>
    );
}
