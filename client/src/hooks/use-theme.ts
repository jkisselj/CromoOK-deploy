import { create } from "zustand";
import { persist } from "zustand/middleware";

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

                // Добавляем класс для отключения анимации
                root.classList.add("no-transition");

                // Удаляем существующие темы
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

                // Форсируем перерасчет стилей
                void root.offsetHeight;

                // Удаляем класс, отключающий анимацию
                root.classList.remove("no-transition");

                set({ theme });
            },
        }),
        {
            name: "theme-store",
        }
    )
);