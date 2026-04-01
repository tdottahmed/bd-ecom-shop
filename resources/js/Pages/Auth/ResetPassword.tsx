import AuthTextInput from '@/Components/Auth/AuthTextInput';
import AuthButton from '@/Components/Auth/AuthButton';
import ModernAuthLayout from '@/Layouts/ModernAuthLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEventHandler } from 'react';

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

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <AuthTextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Registered email address"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        error={errors.email}
                    />
                </div>

                <div>
                    <AuthTextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        placeholder="New password"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                    />
                </div>

                <div>
                    <AuthTextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        error={errors.password_confirmation}
                    />
                </div>

                <div className="pt-6">
                    <AuthButton type="submit" processing={processing}>
                        Reset Password
                    </AuthButton>
                </div>
            </form>
            
            <div className="mt-8 text-center text-sm font-medium text-gray-400">
                <Link
                    href={route("login")}
                    className="text-[#2DE3A7] hover:text-[#22c996] transition-colors"
                >
                    Back to Log in
                </Link>
            </div>
        </ModernAuthLayout>
    );
}
