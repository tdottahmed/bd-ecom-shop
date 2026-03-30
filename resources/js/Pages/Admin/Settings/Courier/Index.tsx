import Header from "@/Components/Layouts/Header";
import Master from "@/Layouts/Master";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Card, { CardContent } from "@/Components/Ui/Card";
import { TruckIcon, PackageIcon, ZapIcon, InfoIcon } from "lucide-react";

interface Props {
    credentials: {
        pathao_user?: string;
        pathao_password?: string;
        pathao_client_id?: string;
        pathao_client_secret?: string;
        pathao_store_id?: string;
        steadfast_user?: string;
        steadfast_password?: string;
        steadfast_api_key?: string;
        steadfast_secret_key?: string;
        redx_phone?: string;
        redx_password?: string;
    };
}

export default function Index({ credentials }: Props) {
    const { data, setData, post, processing } = useForm({
        pathao_user:          credentials.pathao_user          || "",
        pathao_password:      credentials.pathao_password      || "",
        pathao_client_id:     credentials.pathao_client_id     || "",
        pathao_client_secret: credentials.pathao_client_secret || "",
        pathao_store_id:      credentials.pathao_store_id      || "",
        steadfast_user:       credentials.steadfast_user       || "",
        steadfast_password:   credentials.steadfast_password   || "",
        steadfast_api_key:    credentials.steadfast_api_key    || "",
        steadfast_secret_key: credentials.steadfast_secret_key || "",
        redx_phone:           credentials.redx_phone           || "",
        redx_password:        credentials.redx_password        || "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.courier.update"));
    };

    const Field = ({
        id, label, value, onChange, type = "text", placeholder,
    }: {
        id: string; label: string; value: string;
        onChange: (v: string) => void; type?: string; placeholder?: string;
    }) => (
        <div>
            <InputLabel htmlFor={id} value={label} />
            <TextInput
                id={id}
                name={id}
                type={type}
                className="mt-1 block w-full"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );

    return (
        <Master
            title="Courier Settings"
            head={<Header title="Courier Settings" showUserMenu={true} />}
        >
            <Head title="Courier Settings" />
            <div className="p-6 max-w-4xl mx-auto">
                <form onSubmit={submit} className="space-y-6">

                    {/* ── Pathao ───────────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <div className="flex items-center gap-3 border-b border-[#1E2826] pb-3 mb-1">
                                <div className="p-2 rounded-lg bg-[#2DE3A7]/10">
                                    <TruckIcon size={18} className="text-[#2DE3A7]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Pathao Courier</h3>
                                    <p className="text-xs text-gray-500">OAuth2 credentials from Pathao merchant portal</p>
                                </div>
                            </div>

                            {/* OAuth2 credentials */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    id="pathao_client_id"
                                    label="Client ID"
                                    value={data.pathao_client_id}
                                    onChange={(v) => setData("pathao_client_id", v)}
                                    placeholder="From Pathao merchant portal"
                                />
                                <Field
                                    id="pathao_client_secret"
                                    label="Client Secret"
                                    value={data.pathao_client_secret}
                                    type="password"
                                    onChange={(v) => setData("pathao_client_secret", v)}
                                />
                                <Field
                                    id="pathao_user"
                                    label="Username / Email"
                                    value={data.pathao_user}
                                    onChange={(v) => setData("pathao_user", v)}
                                />
                                <Field
                                    id="pathao_password"
                                    label="Password"
                                    value={data.pathao_password}
                                    type="password"
                                    onChange={(v) => setData("pathao_password", v)}
                                />
                                <Field
                                    id="pathao_store_id"
                                    label="Store ID"
                                    value={data.pathao_store_id}
                                    onChange={(v) => setData("pathao_store_id", v)}
                                    placeholder="Numeric store ID from Pathao"
                                />
                            </div>

                            {/* Webhook info */}
                            <div className="flex items-start gap-2 bg-[#0C1311] border border-[#1E2826] rounded-lg p-3 text-xs text-gray-400">
                                <InfoIcon size={13} className="text-[#2DE3A7] shrink-0 mt-0.5" />
                                <span>
                                    Register this webhook URL in your Pathao merchant panel to receive live status updates:{" "}
                                    <code className="text-[#2DE3A7] bg-[#1E2826] px-1.5 py-0.5 rounded">
                                        {window.location.origin}/webhooks/pathao
                                    </code>
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── Steadfast ────────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <div className="flex items-center gap-3 border-b border-[#1E2826] pb-3 mb-1">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <PackageIcon size={18} className="text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Steadfast Courier</h3>
                                    <p className="text-xs text-gray-500">API key from Steadfast portal (packzy.com)</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    id="steadfast_user"
                                    label="Username / Email"
                                    value={data.steadfast_user}
                                    onChange={(v) => setData("steadfast_user", v)}
                                />
                                <Field
                                    id="steadfast_password"
                                    label="Password"
                                    value={data.steadfast_password}
                                    type="password"
                                    onChange={(v) => setData("steadfast_password", v)}
                                />
                                <Field
                                    id="steadfast_api_key"
                                    label="API Key"
                                    value={data.steadfast_api_key}
                                    onChange={(v) => setData("steadfast_api_key", v)}
                                />
                                <Field
                                    id="steadfast_secret_key"
                                    label="Secret Key"
                                    value={data.steadfast_secret_key}
                                    type="password"
                                    onChange={(v) => setData("steadfast_secret_key", v)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* ── RedX ─────────────────────────────────────────────── */}
                    <Card>
                        <CardContent className="p-6 space-y-5">
                            <div className="flex items-center gap-3 border-b border-[#1E2826] pb-3 mb-1">
                                <div className="p-2 rounded-lg bg-red-500/10">
                                    <ZapIcon size={18} className="text-red-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">RedX Courier</h3>
                                    <p className="text-xs text-gray-500">Phone & password from RedX merchant account</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field
                                    id="redx_phone"
                                    label="Phone Number"
                                    value={data.redx_phone}
                                    onChange={(v) => setData("redx_phone", v)}
                                />
                                <Field
                                    id="redx_password"
                                    label="Password"
                                    value={data.redx_password}
                                    type="password"
                                    onChange={(v) => setData("redx_password", v)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <PrimaryButton disabled={processing}>
                            {processing ? "Saving…" : "Save Changes"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Master>
    );
}
