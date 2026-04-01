import AuthTextInput from "@/Components/Auth/AuthTextInput";
import AuthButton from "@/Components/Auth/AuthButton";
import AuthSocialLogin from "@/Components/Auth/AuthSocialLogin";
import ModernAuthLayout from "@/Layouts/ModernAuthLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <ModernAuthLayout
            title="Create an account"
            subtitle="Please enter your details to sign up."
            quote="Our journey started with a simple idea: making shopping effortless and delightful for everyone."
        >
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <AuthTextInput
                        id="name"
                        name="name"
                        value={data.name}
                        placeholder="Full Name"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        error={errors.name}
                    />
                </div>

                <div>
                    <AuthTextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Email address"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        error={errors.email}
                    />
                </div>

                <div>
                    <AuthTextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                        error={errors.password}
                    />
                </div>

                <div>
                    <AuthTextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        required
                        error={errors.password_confirmation}
                    />
                </div>

                <div className="pt-6">
                    <AuthButton type="submit" processing={processing}>
                        Create Account
                    </AuthButton>
                </div>
            </form>

            <AuthSocialLogin type="Signup" />

            <div className="mt-8 text-center text-sm font-medium text-gray-400">
                Already have an account?{" "}
                <Link
                    href={route("login")}
                    className="text-[#2DE3A7] hover:text-[#22c996] transition-colors"
                >
                    Login
                </Link>
            </div>
        </ModernAuthLayout>
    );
}
