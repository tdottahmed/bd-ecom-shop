import AuthTextInput from "@/Components/Auth/AuthTextInput";
import AuthButton from "@/Components/Auth/AuthButton";
import ModernAuthLayout from "@/Layouts/ModernAuthLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { ArrowLeft } from "lucide-react";

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
                <div className="mb-6 rounded-2xl bg-emerald-50 p-4 border border-emerald-100 flex items-start gap-3">
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

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <AuthTextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Registered email address"
                        autoComplete="email"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        error={errors.email}
                    />
                </div>

                <div className="pt-6">
                    <AuthButton type="submit" processing={processing}>
                        Send Reset Link
                    </AuthButton>
                </div>
            </form>

            <div className="mt-8 text-center">
                <Link
                    href={route("login")}
                    className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to log in
                </Link>
            </div>
        </ModernAuthLayout>
    );
}
