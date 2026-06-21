import type { Config } from "tailwindcss";

const config = {
    darkMode: "class",

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
                input: "var(--color-input)",
                navbar: "var(--color-navbar)",
                backCup: "var(--color-backCup)",
                cupHover: "var(--color-cupHover)",
                liquid: "var(--color-liquid)",

            },
            fontFamily: {
                iranyekan: ['iranyekan']
            }
        },
    },

    plugins: [],
};

export default config;
