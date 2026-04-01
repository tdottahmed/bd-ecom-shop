import PrimaryButton from "@/Components/Actions/PrimaryButton";
import Checkbox from "@/Components/Ui/Checkbox";
import InputError from "@/Components/Ui/InputError";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import ModernAuthLayout from "@/Layouts/ModernAuthLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Loader2 } from "lucide-react";

export default function Login({
    status,
    canResetPassword,
    isAdminLogin = false,
}: {
    status?: string;
    canResetPassword: boolean;
    isAdminLogin?: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route(isAdminLogin ? "admin.login.store" : "login.store"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <ModernAuthLayout
            title={isAdminLogin ? "Admin Login" : "Welcome back"}
            subtitle={isAdminLogin ? "Sign in to access the control panel." : "Welcome back! Please enter your details."}
            quote={isAdminLogin ? "Streamline your operations with our advanced admin tools." : "Experience the best shopping platform tailored just for you."}
        >
            <Head title="Log in" />

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
                    <InputLabel htmlFor="email" value="Email" className="mb-2 text-gray-700 block text-sm font-medium" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Enter your email"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2DE3A7]/50 focus:border-[#2DE3A7] transition-all bg-gray-50/50 hover:bg-gray-50"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password" className="mb-2 text-gray-700 block text-sm font-medium" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2DE3A7]/50 focus:border-[#2DE3A7] transition-all bg-gray-50/50 hover:bg-gray-50"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between mt-6">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                           <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData("remember", e.target.checked)}
                                className="w-5 h-5 border-gray-300 rounded text-[#0C1311] focus:ring-[#2DE3A7]/50"
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm font-semibold text-[#0C1311] hover:text-[#2DE3A7] transition-colors"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-base font-semibold text-white bg-[#0C1311] hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0C1311] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                Signing in...
                            </>
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </div>
            </form>

            {!isAdminLogin && (
                <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <p className="text-gray-600 font-medium">Don't have an account?</p>
                    <Link
                        href={route("register")}
                        className="font-semibold text-[#2DE3A7] hover:text-[#22c996] transition-colors"
                    >
                        Create an account
                    </Link>
                </div>
            )}
        </ModernAuthLayout>
    );
}
