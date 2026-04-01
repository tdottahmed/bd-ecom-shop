import Checkbox from "@/Components/Ui/Checkbox";
import AuthTextInput from "@/Components/Auth/AuthTextInput";
import AuthButton from "@/Components/Auth/AuthButton";
import AuthSocialLogin from "@/Components/Auth/AuthSocialLogin";
import ModernAuthLayout from "@/Layouts/ModernAuthLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

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
            title={isAdminLogin ? "Admin Login" : "Welcome Back"}
            subtitle={isAdminLogin ? "Sign in to access the control panel." : "Please login to your account"}
            quote={isAdminLogin ? "Simplify your e-commerce management with our user-friendly admin dashboard." : "Experience the best shopping platform tailored just for you."}
            quoteAuthor={isAdminLogin ? "" : undefined}
        >
            <Head title="Log in" />

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
                        placeholder="Email address"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                        error={errors.email}
                    />
                </div>

                <div>
                    <AuthTextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                        error={errors.password}
                    />
                </div>

                <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                           <Checkbox
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData("remember", e.target.checked)}
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                            Remember me
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="pt-6">
                    <AuthButton type="submit" processing={processing}>
                        Login
                    </AuthButton>
                </div>
            </form>

            {!isAdminLogin && (
                <>
                    <AuthSocialLogin type="Login" />
                    <div className="mt-8 text-center text-sm font-medium text-gray-400">
                        Don't have an account?{" "}
                        <Link
                            href={route("register")}
                            className="text-[#2DE3A7] hover:text-[#22c996] transition-colors"
                        >
                            Signup
                        </Link>
                    </div>
                </>
            )}
        </ModernAuthLayout>
    );
}
