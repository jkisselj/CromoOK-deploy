import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="relative size-9 group-data-[collapsible=icon]:size-7"
                >
                    <Sun className="absolute size-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0 group-data-[collapsible=icon]:size-4" />
                    <Moon className="absolute size-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100 group-data-[collapsible=icon]:size-4" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
                <p>Change theme</p>
            </TooltipContent>
        </Tooltip>
    );
}
