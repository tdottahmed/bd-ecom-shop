import InputError from "@/Components/Ui/InputError";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import ModernAuthLayout from "@/Layouts/ModernAuthLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("password.email"));
    };

    return (
        <ModernAuthLayout
            title="Reset Password"
            subtitle="Enter your email address and we'll send you a link to reset your password."
            quote="Security is not just about protection, it's about providing peace of mind."
        >
            <Head title="Forgot Password" />

            {status && (
                <div className="mb-6 rounded-xl bg-emerald-50/50 p-4 border border-emerald-100 flex items-start gap-3">
                    <div className="text-emerald-500 mt-0.5">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-sm font-medium text-emerald-800">
                        {status}
                    </div>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="mb-2 text-gray-700 block text-sm font-medium" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Enter your registered email"
                        autoComplete="email"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2DE3A7]/50 focus:border-[#2DE3A7] transition-all bg-gray-50/50 hover:bg-gray-50"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-[#0C1311] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C1311] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                Sending link...
                            </>
                        ) : (
                            "Send Reset Link"
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center">
                <Link
                    href={route("login")}
                    className="flex items-center gap-2 font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to log in
                </Link>
            </div>
        </ModernAuthLayout>
    );
}
