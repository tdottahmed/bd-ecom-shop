import forms from '@tailwindcss/forms';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                inter: ['Inter', ...defaultTheme.fontFamily.sans],
                display: ['"Playfair Display"', 'Georgia', 'serif'],
            },
            colors: {
                luxury: {
                    accent: '#6366f1',
                },
            },
            boxShadow: {
                luxury: '0 20px 50px rgba(0,0,0,0.05)',
                'luxury-lg': '0 24px 60px rgba(0,0,0,0.12)',
            },
            backgroundImage: {
                'luxury-page':
                    'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            },
        },
    },

    plugins: [forms],
};
