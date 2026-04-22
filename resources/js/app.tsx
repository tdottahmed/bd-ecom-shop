import "../css/app.css";
import "./bootstrap";

import { createInertiaApp, router } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import { applyThemeColors, type ThemeColors } from "./Utils/themeColors";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} | ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const initial = props.initialPage?.props
            ?.themeColors as ThemeColors | undefined;
        if (initial) {
            applyThemeColors(initial);
        }

        router.on("navigate", (event) => {
            const next = event.detail.page?.props
                ?.themeColors as ThemeColors | undefined;
            if (next) {
                applyThemeColors(next);
            }
        });

        root.render(<App {...props} />);
    },
    progress: {
        delay: 250,
        color: "#2DE3A7",
        includeCSS: true,
        showSpinner: true,
    },
});
