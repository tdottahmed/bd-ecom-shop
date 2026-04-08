import CustomerAccountLayout from "@/Layouts/CustomerAccountLayout";
import { useForm } from "@inertiajs/react";

interface ProfileData {
    name: string;
    email: string;
    phone: string;
    address: string;
}

export default function Profile({ user }: { user: ProfileData }) {
    const profileForm = useForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        address: user.address ?? "",
    });

    const passwordForm = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    return (
        <CustomerAccountLayout title="Profile">
            <div className="grid grid-cols-1 gap-8">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        profileForm.put(route("account.profile.update"));
                    }}
                    className="space-y-4"
                >
                    <h2 className="text-lg font-semibold">Profile Information</h2>
                    <input
                        type="text"
                        value={profileForm.data.name}
                        onChange={(e) => profileForm.setData("name", e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2"
                        placeholder="Full name"
                    />
                    <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 bg-gray-50 text-gray-500"
                    />
                    <input
                        type="text"
                        value={profileForm.data.phone}
                        onChange={(e) =>
                            profileForm.setData("phone", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2"
                        placeholder="Phone"
                    />
                    <textarea
                        value={profileForm.data.address}
                        onChange={(e) =>
                            profileForm.setData("address", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2"
                        placeholder="Address"
                        rows={3}
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-brand-primary text-white px-4 py-2"
                    >
                        Save Profile
                    </button>
                </form>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        passwordForm.put(route("account.password.update"), {
                            onSuccess: () =>
                                passwordForm.reset(
                                    "current_password",
                                    "password",
                                    "password_confirmation"
                                ),
                        });
                    }}
                    className="space-y-4"
                >
                    <h2 className="text-lg font-semibold">Change Password</h2>
                    <input
                        type="password"
                        value={passwordForm.data.current_password}
                        onChange={(e) =>
                            passwordForm.setData(
                                "current_password",
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2"
                        placeholder="Current password"
                    />
                    <input
                        type="password"
                        value={passwordForm.data.password}
                        onChange={(e) =>
                            passwordForm.setData("password", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2"
                        placeholder="New password"
                    />
                    <input
                        type="password"
                        value={passwordForm.data.password_confirmation}
                        onChange={(e) =>
                            passwordForm.setData(
                                "password_confirmation",
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border border-gray-200 px-3 py-2"
                        placeholder="Confirm new password"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-brand-primary text-white px-4 py-2"
                    >
                        Update Password
                    </button>
                </form>
            </div>
        </CustomerAccountLayout>
    );
}
