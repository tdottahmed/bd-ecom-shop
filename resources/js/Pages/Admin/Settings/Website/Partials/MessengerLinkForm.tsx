import React from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "sonner";

import Card, {
    CardContent,
    CardHeader,
    CardTitle,
} from "@/Components/Ui/Card";
import TextInput from "@/Components/Ui/TextInput";
import InputLabel from "@/Components/Ui/InputLabel";
import InputError from "@/Components/Ui/InputError";

interface MessengerLinkFormProps {
    messengerLink?: string;
}

const MessengerLinkForm: React.FC<MessengerLinkFormProps> = ({
    messengerLink,
}) => {
    const { data, setData, post, processing, errors } = useForm({
        type: "messenger",
        messenger_link: messengerLink || "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("admin.website.update"), {
            preserveScroll: true,
            onSuccess: () =>
                toast.success("Messenger link updated successfully"),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>Messenger Link</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <InputLabel
                                htmlFor="messenger_link"
                                value="Messenger Link"
                            />
                            <TextInput
                                id="messenger_link"
                                name="messenger_link"
                                type="url"
                                className="mt-1 block w-full"
                                value={data.messenger_link}
                                onChange={(e) =>
                                    setData("messenger_link", e.target.value)
                                }
                                placeholder="https://m.me/your-page or https://facebook.com/your-page"
                            />
                            <InputError
                                message={errors.messenger_link}
                                className="mt-2"
                            />
                            <p className="text-gray-400 text-sm mt-2">
                                Enter your Facebook Messenger link. This will be
                                applied to the messenger icon in the frontend
                                header.
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-[#2DE3A7] text-black font-semibold px-6 py-2 rounded-lg hover:bg-[#26c28f] transition-colors disabled:opacity-50"
                        >
                            {processing ? "Saving..." : "Save Messenger Link"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
};

export default MessengerLinkForm;

