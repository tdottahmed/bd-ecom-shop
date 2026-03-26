import React from 'react';
import { Truck, ShieldCheck, Clock, Headphones } from 'lucide-react';

const features = [
    {
        icon: Truck,
        title: 'Free Shipping',
        description: 'On all orders over RM 100',
        bgColor: 'bg-indigo-50',
        iconColor: 'text-indigo-600',
    },
    {
        icon: ShieldCheck,
        title: 'Secure Payment',
        description: '100% secure payment',
        bgColor: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
    {
        icon: Clock,
        title: '24/7 Support',
        description: 'Dedicated support',
        bgColor: 'bg-amber-50',
        iconColor: 'text-amber-600',
    },
    {
        icon: Headphones,
        title: 'Money-Back',
        description: '30 days guarantee',
        bgColor: 'bg-rose-50',
        iconColor: 'text-rose-600',
    },
];

const FeaturesSection: React.FC = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                    <div
                        key={index}
                        className="group flex items-center p-5 sm:p-6 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition-all duration-300 ease-out hover:-translate-y-1"
                    >
                        <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center ${feature.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                            <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-base font-semibold text-slate-800">{feature.title}</h3>
                            <p className="text-sm text-slate-500 mt-1">{feature.description}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FeaturesSection;
