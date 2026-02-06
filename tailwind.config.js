/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1', // Indigo-500
                    600: '#4f46e5', // Indigo-600 (Main Action)
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                slate: {
                    50: '#f8fafc', // Background
                    100: '#f1f5f9',
                    200: '#e2e8f0', // Borders
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569', // Secondary Text
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a', // Primary Text
                }
            }
        },
    },
    plugins: [],
}
