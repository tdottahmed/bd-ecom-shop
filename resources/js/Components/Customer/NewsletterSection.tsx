import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const NewsletterSection: React.FC = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 border border-slate-100 shadow-[0_20px_40px_rgba(15,23,42,0.06)] py-12 px-6 sm:px-12 md:py-16 text-center">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-sky-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mb-6">
                    <Mail className="w-8 h-8 text-indigo-500" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Stay updated & Get 10% off</h2>
                <p className="text-slate-500 text-lg mb-8 max-w-lg mx-auto font-light">
                    Subscribe to our newsletter and be the first to know about new arrivals, special promotions, and exclusive offers.
                </p>

                <form onSubmit={handleSubmit} className="w-full max-w-md relative">
                    <div className="relative flex items-center">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address..."
                            required
                            className="w-full pl-6 pr-32 py-4 rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-2 bottom-2 bg-slate-900 hover:bg-slate-800 text-white px-6 rounded-full font-medium flex items-center transition-all duration-300 group disabled:opacity-50"
                            disabled={subscribed}
                        >
                            {subscribed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                            ) : (
                                <>
                                    <span>Subscribe</span>
                                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewsletterSection;
