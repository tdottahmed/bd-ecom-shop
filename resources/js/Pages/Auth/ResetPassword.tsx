import InputError from '@/Components/Ui/InputError';
import InputLabel from '@/Components/Ui/InputLabel';
import TextInput from '@/Components/Ui/TextInput';
import ModernAuthLayout from '@/Layouts/ModernAuthLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { Loader2 } from 'lucide-react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <ModernAuthLayout
            title="Create new password"
            subtitle="Your new password must be different from previous used passwords."
            quote="Secure access restored. Welcome back to a safer experience."
        >
            <Head title="Reset Password" />

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" className="mb-2 text-gray-700 block text-sm font-medium" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Enter your email"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2DE3A7]/50 focus:border-[#2DE3A7] transition-all bg-gray-50/50 hover:bg-gray-50"
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="New Password" className="mb-2 text-gray-700 block text-sm font-medium" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-[#2DE3A7]/50 focus:border-[#2DE3A7] transition-all bg-gray-50/50 hover:bg-gray-50"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Confirm New Password" className="mb-2 text-gray-700 block text-sm font-medium" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
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
                                Resetting...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </div>
            </form>
            
            <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-center">
                <Link
                    href={route("login")}
                    className="font-semibold text-[#2DE3A7] hover:text-[#22c996] transition-colors"
                >
                    Back to Log in
                </Link>
            </div>
        </ModernAuthLayout>
    );
}
