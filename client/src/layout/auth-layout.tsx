import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ThemeWatcher } from "@/hooks/use-theme";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ThemeWatcher />
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-[400px]">
        <div className="bg-card border rounded-lg shadow-sm p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold mb-2">SceneHunter</h1>
            <p className="text-muted-foreground">Find and book perfect locations</p>
          </div>
          <div className="space-y-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
