import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip";

interface ThemeToggleProps {
    variant?: "dropdown" | "toggle" | "icon";
    showTooltip?: boolean;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon";
}

export function ThemeToggle({ 
    variant = "dropdown", 
    showTooltip = false,
    className = "",
    size = "icon"
}: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();

    if (variant === "toggle") {
        const buttonContent = (
            <Button
                variant="ghost"
                size={size}
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className={`relative size-9 group-data-[collapsible=icon]:size-7 ${className}`}
            >
                <Sun className="absolute size-5 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0 group-data-[collapsible=icon]:size-4" />
                <Moon className="absolute size-5 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100 group-data-[collapsible=icon]:size-4" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        );

        if (showTooltip) {
            return (
                <Tooltip>
                    <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
                    <TooltipContent side="right">
                        <p>Change theme</p>
                    </TooltipContent>
                </Tooltip>
            );
        }

        return buttonContent;
    }

    if (variant === "icon") {
        return (
            <Button
                variant="ghost"
                size={size}
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className={`${className}`}
            >
                <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size={size} className={`h-8 w-8 md:h-9 md:w-9 border-border ${className}`}>
                    <Sun className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[8rem] rounded-md">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                    <Sun className="h-4 w-4 mr-2" />
                    <span>Light</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                    <Moon className="h-4 w-4 mr-2" />
                    <span>Dark</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="h-4 w-4 mr-2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                        />
                    </svg>
                    <span>System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
