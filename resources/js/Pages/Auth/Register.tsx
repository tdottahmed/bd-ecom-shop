import InputError from "@/Components/Ui/InputError";
import InputLabel from "@/Components/Ui/InputLabel";
import TextInput from "@/Components/Ui/TextInput";
import ModernAuthLayout from "@/Layouts/ModernAuthLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Loader2 } from "lucide-react";

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
            subtitle="Join us today and discover a world of possibilities."
            quote="Our journey started with a simple idea: making shopping effortless and delightful for everyone."
        >
            <Head title="Register" />

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Full Name" className="mb-2 text-gray-700 block text-sm font-medium" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        placeholder="Enter your full name"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2DE3A7]/50 focus:border-[#2DE3A7] transition-all bg-gray-50/50 hover:bg-gray-50"
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="mb-2 text-gray-700 block text-sm font-medium" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Enter your email"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
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
                        placeholder="Create a strong password"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2DE3A7]/50 focus:border-[#2DE3A7] transition-all bg-gray-50/50 hover:bg-gray-50"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="mb-2 text-gray-700 block text-sm font-medium" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                        onChange={(e) => setData("password_confirmation", e.target.value)}
                        required
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2DE3A7]/50 focus:border-[#2DE3A7] transition-all bg-gray-50/50 hover:bg-gray-50"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
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
                                Creating account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-2">
                <p className="text-gray-600 font-medium">Already have an account?</p>
                <Link
                    href={route("login")}
                    className="font-semibold text-[#2DE3A7] hover:text-[#22c996] transition-colors"
                >
                    Sign in here
                </Link>
            </div>
        </ModernAuthLayout>
    );
}
