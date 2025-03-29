import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Login from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:p-6 bg-muted/40">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-4 pb-6">
          <Login mode="login" />

          <div className="text-center text-sm mt-6">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>

          <div className="text-xs text-center text-muted-foreground mt-3">
            By signing in, you agree to our
            <Link to="/terms" className="underline mx-1 hover:text-foreground">
              Terms of Service
            </Link>
            and
            <Link to="/privacy" className="underline ml-1 hover:text-foreground">
              Privacy Policy
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
