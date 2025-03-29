import { Outlet, Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full border-b py-3 px-4 md:px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-lg md:text-xl">SceneHunter</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <div className="bg-card border rounded-lg shadow-sm p-6 md:p-8">
            <Outlet />
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground hover:underline transition-colors">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 px-4 md:px-6 text-center text-xs text-muted-foreground border-t">
        <p>© {new Date().getFullYear()} SceneHunter. All rights reserved.</p>
      </footer>
    </div>
  );
}
