import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeStore {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeStore>()(
    persist(
        (set) => ({
            theme: "system",
            setTheme: (theme) => {
                const root = window.document.documentElement;

                root.classList.remove("light", "dark");

                if (theme === "system") {
                    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                        .matches
                        ? "dark"
                        : "light";
                    root.classList.add(systemTheme);
                } else {
                    root.classList.add(theme);
                }

                set({ theme });
            },
        }),
        {
            name: "theme-store",
        }
    )
);

export function ThemeWatcher() {
    const { theme, setTheme } = useTheme();
    
    useEffect(() => {
        setTheme(theme);
        
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        
        const updateTheme = () => {
            if (theme === "system") {
                const root = window.document.documentElement;
                root.classList.remove("light", "dark");
                root.classList.add(mediaQuery.matches ? "dark" : "light");
            }
        };
        
        mediaQuery.addEventListener("change", updateTheme);
        
        return () => {
            mediaQuery.removeEventListener("change", updateTheme);
        };
    }, [theme, setTheme]);
    
    return null;
}