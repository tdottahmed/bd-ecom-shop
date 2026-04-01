import React from 'react';

export default function AuthSocialLogin({ type = "Login" }: { type?: "Login" | "Signup" }) {
    return (
        <div className="mt-8">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-white text-gray-400 font-medium">Or {type} with</span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
                <a
                    href="#"
                    className="w-full inline-flex justify-center items-center py-3.5 px-4 border border-gray-200 rounded-2xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2DE3A7] transition-all"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                </a>

                <a
                    href="#"
                    className="w-full inline-flex justify-center items-center py-3.5 px-4 border border-gray-200 rounded-2xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2DE3A7] transition-all"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M22.5 12.067c0-5.803-4.701-10.504-10.5-10.504-5.798 0-10.5 4.701-10.5 10.504 0 5.239 3.824 9.58 8.86 10.378v-7.34H7.695v-3.038h2.665V9.418c0-2.628 1.564-4.083 3.966-4.083 1.146 0 2.348.204 2.348.204v2.583h-1.321c-1.303 0-1.71.808-1.71 1.637v1.947h2.909l-.465 3.038h-2.444v7.34c5.035-.797 8.859-5.14 8.859-10.378z" fill="#1877F2"/>
                    </svg>
                    Facebook
                </a>
            </div>
        </div>
    );
}
