import { useState } from "react";
import { useForm, ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import GoogleButton from "./google-button";
import supabase from "@/lib/supabaseClient";
import { useAuthContext } from "@/hooks/useAuthContext";

interface PasswordInputProps {
  field: ControllerRenderProps<any, string>;
  label: string;
  placeholder?: string;
  showForgotPassword?: boolean;
}

export const PasswordInput = ({ field, label, placeholder = "••••••••", showForgotPassword = false }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <FormItem>
      <div className="flex justify-between items-center">
        <FormLabel>{label}</FormLabel>
        {showForgotPassword && (
          <Link to="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-primary">
            Forgot password?
          </Link>
        )}
      </div>
      <FormControl>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder={placeholder}
            autoComplete={showForgotPassword ? "current-password" : "new-password"}
            {...field}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const registerSchema = z
  .object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

interface AuthFormProps {
  mode: "login" | "register";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();

  const from = location.state?.from || "/";

  const schema = mode === "login" ? loginSchema : registerSchema;
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: mode === "login" 
      ? {
          email: "",
          password: "",
        } 
      : {
          username: "",
          email: user?.email || "",
          password: "",
          confirmPassword: "",
        },
  });

  async function onSubmit(values: any) {
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const { email, password } = values;
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        navigate(from, { replace: true });
      } else {
        const { email, password, username } = values;

        if (user && user.email === email) {
          const { error: linkError } = await supabase.auth.updateUser({
            password,
          });
          if (linkError) throw linkError;
          navigate("/");
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });

        if (error) throw error;
        if (data.user) {
          navigate("/");
        }
      }
    } catch (err: any) {
      setError(err.message);
      console.error(`${mode === "login" ? "Login" : "Registration"} error:`, err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <div className="mt-4 mb-6 text-center">
        <GoogleButton redirectTo={from} />
      </div>

      <div className="relative text-center text-sm mb-6 after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          {mode === "login" ? "Or continue with email" : "Or register with email"}
        </span>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-md text-sm flex items-start gap-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {mode === "register" && (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="youremail@example.com" 
                    autoComplete="email"
                    type="email" 
                    {...field} 
                    disabled={mode === "register" && !!user?.email}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <PasswordInput 
                field={field} 
                label="Password" 
                showForgotPassword={mode === "login"}
              />
            )}
          />

          {mode === "register" && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <PasswordInput
                  field={field}
                  label="Confirm Password"
                />
              )}
            />
          )}

          <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? 
              (mode === "login" ? "Signing in..." : "Creating account...") : 
              (mode === "login" ? "Sign in" : "Create account")
            }
          </Button>
        </form>
      </Form>
    </div>
  );
}
