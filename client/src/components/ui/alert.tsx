import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-600/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600",
        warning:
          "border-yellow-600/50 text-yellow-600 dark:border-yellow-500 [&>svg]:text-yellow-600",
        info:
          "border-blue-600/50 text-blue-600 dark:border-blue-500 [&>svg]:text-blue-600",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & {
    icon?: React.ReactNode;
  }
>(({ className, variant, icon, children, ...props }, ref) => {
  const getDefaultIcon = () => {
    if (!icon) {
      switch (variant) {
        case "destructive":
          return <AlertTriangle className="h-4 w-4" />;
        case "success":
          return <CheckCircle className="h-4 w-4" />;
        case "warning":
          return <AlertTriangle className="h-4 w-4" />;
        case "info":
          return <Info className="h-4 w-4" />;
        default:
          return null;
      }
    }
    return icon;
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {getDefaultIcon()}
      {children}
    </div>
  );
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };