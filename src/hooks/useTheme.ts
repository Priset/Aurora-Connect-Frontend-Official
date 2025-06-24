import {useEffect} from "react";

export function useTheme(theme: "light" | "dark") {
    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark" || saved === "light") {
            const root = document.documentElement;
            root.classList.toggle("dark", saved === "dark");
        }
    }, []);
}
