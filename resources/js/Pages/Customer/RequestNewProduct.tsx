import { Head, useForm, usePage } from "@inertiajs/react";
import CustomerLayout from "@/Layouts/CustomerLayout";
import { useAntiSpam } from "@/Hooks/useAntiSpam";
import {
    Package,
    Send,
    CheckCircle,
    Link as LinkIcon,
    Tag,
    FileText,
    User,
    Mail,
    Phone,
    ShoppingCart,
    DollarSign,
    ChevronRight,
    Home,
} from "lucide-react";
import { Link } from "@inertiajs/react";
import { useEffect } from "react";
import CtaSection from "@/Components/Customer/CtaSection";

interface AuthUser {
    name: string;
    email: string;
    phone?: string | null;
}

interface Props {
    auth_user: AuthUser | null;
}

export default function RequestNewProduct({ auth_user }: Props) {
    const { flash } = usePage().props as any;
    const { honeypot, setHoneypot, validate } = useAntiSpam(3);

    const { data, setData, post, processing, errors, reset } =
        useForm({
            _hp: "",
            customer_name: auth_user?.name ?? "",
            customer_email: auth_user?.email ?? "",
            customer_phone: auth_user?.phone ?? "",
            product_name: "",
            category: "",
            description: "",
            reference_url: "",
            quantity: "1",
            budget: "",
        });

    useEffect(() => {
        if (auth_user) {
            setData("customer_name", auth_user.name);
            setData("customer_email", auth_user.email);
            setData("customer_phone", auth_user.phone ?? "");
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        post(route("new-product-requests.store"), {
            preserveScroll: true,
            onSuccess: () => reset("product_name", "category", "description", "reference_url", "quantity", "budget"),
        });
    };

    const inputClass = (field: string) =>
        `w-full bg-slate-50 border ${
            (errors as any)[field]
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-slate-200 focus:border-brand-primary focus:ring-brand-primary/10"
        } text-slate-800 placeholder-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all`;

    return (
        <CustomerLayout>
            <Head>
                <title>Request a New Product</title>
                <meta
                    name="description"
                    content="Can't find what you're looking for? Request a new product and we'll do our best to source it for you."
                />
            </Head>

            <div className="relative min-h-screen bg-gradient-to-b from-brand-ivory via-white to-slate-50 text-slate-900">
                {/* Background blobs */}
                <div className="pointer-events-none absolute inset-x-0 -top-40 flex justify-center">
                    <div className="h-72 w-[36rem] rounded-full bg-gradient-to-r from-brand-primary via-brand-tint to-brand-success opacity-20 blur-3xl" />
                </div>
                <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-brand-primary/15 blur-3xl" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
                    

                    {/* Hero */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-brand-bg border border-brand-primary/20 text-brand-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4 tracking-wide uppercase">
                            <Package size={12} />
                            Product Request
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
                            Can't find what you need?
                        </h1>
                        <p className="max-w-xl mx-auto text-lg text-slate-500">
                            Tell us what product you're looking for and we'll do our best to source it for you.
                        </p>
                    </div>

                    {/* How it works */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                        {[
                            { step: "1", title: "Submit Request", desc: "Fill out the form with product details" },
                            { step: "2", title: "We Review", desc: "Our team reviews your request within 24–48 hrs" },
                            { step: "3", title: "We Get Back to You", desc: "We'll contact you once we find it" },
                        ].map(({ step, title, desc }) => (
                            <div key={step} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
                                <div className="w-9 h-9 rounded-full bg-brand-bg text-brand-primary font-bold text-sm flex items-center justify-center mx-auto mb-3">
                                    {step}
                                </div>
                                <p className="text-sm font-semibold text-slate-800 mb-1">{title}</p>
                                <p className="text-xs text-slate-400">{desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Success Banner */}
                    {flash?.success && (
                        <div className="mb-8 flex items-start gap-3 bg-brand-success/10 border border-brand-success/25 text-brand-success rounded-2xl px-5 py-4">
                            <CheckCircle size={20} className="mt-0.5 shrink-0" />
                            <p className="text-sm font-medium">{flash.success}</p>
                        </div>
                    )}

                    {/* Form Card */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_22px_55px_rgba(15,23,42,0.10)] overflow-hidden">
                        <div className="bg-gradient-to-r from-brand-primary/5 to-brand-tint/5 border-b border-slate-100 px-8 py-6">
                            <h2 className="text-xl font-bold text-slate-900">Product Request Form</h2>
                            <p className="text-sm text-slate-400 mt-1">All fields marked with * are required</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-8">
                            {/* Honeypot */}
                            <input
                                className="spam-trap opacity-0 absolute -z-50"
                                type="text"
                                name="_hp"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                value={honeypot}
                                onChange={(e) => {
                                    setHoneypot(e.target.value);
                                    setData("_hp", e.target.value);
                                }}
                            />

                            {/* Section: Your Info */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <User size={13} />
                                    Your Information
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label htmlFor="customer_name" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                            <User size={11} /> Full Name *
                                        </label>
                                        <input
                                            id="customer_name"
                                            type="text"
                                            value={data.customer_name}
                                            onChange={(e) => setData("customer_name", e.target.value)}
                                            placeholder="Your full name"
                                            className={inputClass("customer_name")}
                                            disabled={!!auth_user}
                                        />
                                        {errors.customer_name && <p className="text-red-500 text-xs mt-1">{errors.customer_name}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="customer_email" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                            <Mail size={11} /> Email Address *
                                        </label>
                                        <input
                                            id="customer_email"
                                            type="email"
                                            value={data.customer_email}
                                            onChange={(e) => setData("customer_email", e.target.value)}
                                            placeholder="you@email.com"
                                            className={inputClass("customer_email")}
                                            disabled={!!auth_user}
                                        />
                                        {errors.customer_email && <p className="text-red-500 text-xs mt-1">{errors.customer_email}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="customer_phone" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                            <Phone size={11} /> Phone Number
                                        </label>
                                        <input
                                            id="customer_phone"
                                            type="tel"
                                            value={data.customer_phone}
                                            onChange={(e) => setData("customer_phone", e.target.value)}
                                            placeholder="+60 12 345 6789"
                                            className={inputClass("customer_phone")}
                                        />
                                        {errors.customer_phone && <p className="text-red-500 text-xs mt-1">{errors.customer_phone}</p>}
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100" />

                            {/* Section: Product Details */}
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Package size={13} />
                                    Product Details
                                </h3>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label htmlFor="product_name" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                <Package size={11} /> Product Name *
                                            </label>
                                            <input
                                                id="product_name"
                                                type="text"
                                                value={data.product_name}
                                                onChange={(e) => setData("product_name", e.target.value)}
                                                placeholder="e.g. Nike Air Max 270"
                                                className={inputClass("product_name")}
                                            />
                                            {errors.product_name && <p className="text-red-500 text-xs mt-1">{errors.product_name}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="category" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                <Tag size={11} /> Category / Type
                                            </label>
                                            <input
                                                id="category"
                                                type="text"
                                                value={data.category}
                                                onChange={(e) => setData("category", e.target.value)}
                                                placeholder="e.g. Footwear, Electronics"
                                                className={inputClass("category")}
                                            />
                                            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="description" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                            <FileText size={11} /> Description *
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData("description", e.target.value)}
                                            placeholder="Describe the product in detail — brand, model, color, size, specifications, or any other relevant information..."
                                            className={`${inputClass("description")} resize-none`}
                                        />
                                        <p className="text-xs text-slate-400 text-right">{data.description.length}/2000</p>
                                        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="reference_url" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                            <LinkIcon size={11} /> Reference Link
                                        </label>
                                        <input
                                            id="reference_url"
                                            type="url"
                                            value={data.reference_url}
                                            onChange={(e) => setData("reference_url", e.target.value)}
                                            placeholder="https://..."
                                            className={inputClass("reference_url")}
                                        />
                                        <p className="text-xs text-slate-400">Optional — link to the product on another website</p>
                                        {errors.reference_url && <p className="text-red-500 text-xs mt-1">{errors.reference_url}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div className="space-y-1.5">
                                            <label htmlFor="quantity" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                <ShoppingCart size={11} /> Quantity Needed
                                            </label>
                                            <input
                                                id="quantity"
                                                type="number"
                                                min={1}
                                                max={999}
                                                value={data.quantity}
                                                onChange={(e) => setData("quantity", e.target.value)}
                                                className={inputClass("quantity")}
                                            />
                                            {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
                                        </div>

                                        <div className="space-y-1.5">
                                            <label htmlFor="budget" className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                                                <DollarSign size={11} /> Budget (RM)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">RM</span>
                                                <input
                                                    id="budget"
                                                    type="number"
                                                    min={0}
                                                    step="0.01"
                                                    value={data.budget}
                                                    onChange={(e) => setData("budget", e.target.value)}
                                                    placeholder="0.00"
                                                    className={`${inputClass("budget")} pl-11`}
                                                />
                                            </div>
                                            <p className="text-xs text-slate-400">Optional — your estimated budget per unit</p>
                                            {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
                                <p className="text-xs text-slate-400 text-center sm:text-left">
                                    By submitting, you agree to be contacted about your request.
                                </p>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-8 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} />
                                            Submit Request
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <CtaSection />
        </CustomerLayout>
    );
}
