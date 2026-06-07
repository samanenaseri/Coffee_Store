import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",

    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],

    theme: {
        extend: {
            colors: {
                bg: "var(--color-bg)",
                text: "var(--color-text)",
                lightText: "var(--color-lightText)",
                primary: "var(--color-primary)",
                card: "var(--color-card)",
                divider: "var(--color-divider)",
                border: "var(--color-border)",
                hover: "var(--color-hover)",
                secondary: "var(--color-secondary)",
                accent: "var(--color-accent)",
                background: "var(--color-background)",
                cups: "var(--color-cups)",
                delivery: "var(--color-delivery)",
                menu: "var(--color-menu)",
                items: "var(--color-items)",
                testimonial: "var(--color-testimonial)",
            },
            fontFamily: {
                iranyekan: ['iranyekan']
            }
        },
    },

    plugins: [],
};

export default config;
