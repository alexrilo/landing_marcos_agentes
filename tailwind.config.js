/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html",
        "./*.html",
        "./assets/**/*.js"],
    theme: {
        extend: {
            colors: {
                "outline-variant": "#c2c9bb",
                "on-primary-container": "#1a4612",
                "inverse-on-surface": "#eef1ef",
                "secondary": "#525f74",
                "surface-container": "#ebefec",
                "inverse-primary": "#a1d491",
                "inverse-surface": "#2d3130",
                "surface-bright": "#f7faf7",
                "on-tertiary": "#ffffff",
                "on-error": "#ffffff",
                "surface-dim": "#d7dbd8",
                "on-secondary-fixed-variant": "#3a475b",
                "on-tertiary-fixed": "#171d1a",
                "on-primary": "#ffffff",
                "primary-fixed-dim": "#a1d491",
                "on-tertiary-fixed-variant": "#424845",
                "surface-container-highest": "#e0e3e0",
                "on-background": "#181c1b",
                "on-primary-fixed": "#002200",
                "primary-container": "#83b474",
                "surface": "#f7faf7",
                "on-surface": "#181c1b",
                "surface-container-high": "#e6e9e6",
                "on-tertiary-container": "#393e3b",
                "error": "#ba1a1a",
                "tertiary-fixed": "#dfe4e0",
                "tertiary-container": "#a4a9a5",
                "error-container": "#ffdad6",
                "on-secondary-container": "#58657a",
                "on-secondary": "#ffffff",
                "surface-container-lowest": "#ffffff",
                "tertiary": "#5a605d",
                "on-secondary-fixed": "#0e1c2e",
                "on-primary-fixed-variant": "#24501c",
                "background": "#f7faf7",
                "secondary-container": "#d6e3fc",
                "surface-container-low": "#f1f4f1",
                "on-surface-variant": "#42493e",
                "surface-tint": "#3c6932",
                "surface-variant": "#e0e3e0",
                "on-error-container": "#93000a",
                "secondary-fixed": "#d6e3fc",
                "secondary-fixed-dim": "#bac7df",
                "tertiary-fixed-dim": "#c3c8c4",
                "outline": "#72796d",
                "primary": "#3c6932",
                "primary-fixed": "#bcf1ab"
            },
            fontFamily: {
                headline: ["Newsreader", "serif"],
                body: ["Manrope", "sans-serif"],
                label: ["Manrope", "sans-serif"]
            },
            borderRadius: {
                DEFAULT: "0.25rem",
                lg: "0.5rem",
                xl: "0.75rem",
                full: "9999px"
            }
        }
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries')
    ]
};