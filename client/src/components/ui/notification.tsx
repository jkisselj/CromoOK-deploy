import { useState, useEffect } from "react";
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useNotification, Notification } from "@/context/NotificationContext";

const notificationVariants = cva(
    "pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full",
    {
        variants: {
            variant: {
                success: "bg-background border-green-500 text-foreground",
                error: "bg-background border-destructive text-foreground",
                warning: "bg-background border-yellow-500 text-foreground",
                info: "bg-background border-blue-500 text-foreground",
            }
        },
        defaultVariants: {
            variant: "info",
        },
    }
);

const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertTriangle className="h-5 w-5 text-destructive" />,
    warning: <AlertCircle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
};

interface NotificationItemProps extends VariantProps<typeof notificationVariants> {
    notification: Notification;
    onClose: () => void;
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {
    const [progress, setProgress] = useState(100);
    const duration = notification.duration || 5000;

    useEffect(() => {
        if (duration <= 0) return;

        const step = 10;
        const decrement = (step / duration) * 100;
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev <= 0) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - decrement;
            });
        }, step);

        return () => {
            clearInterval(interval);
        };
    }, [duration]);

    return (
        <div
            className={cn(
                notificationVariants({ variant: notification.type }),
                "mb-2 flex flex-col"
            )}
            role="alert"
            data-state="open"
        >
            <div className="flex p-4 items-start">
                <div className="flex-shrink-0">
                    {icons[notification.type]}
                </div>
                <div className="ml-3 flex-1">
                    <div className="text-sm font-medium">
                        {notification.title}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                        {notification.message}
                    </div>
                </div>
                <button
                    type="button"
                    className="ml-4 flex-shrink-0 inline-flex rounded-md text-muted-foreground opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={onClose}
                >
                    <span className="sr-only">Close</span>
                    <X className="h-4 w-4" />
                </button>
            </div>
            {notification.duration && notification.duration > 0 && (
                <div className="h-1 bg-muted">
                    <div
                        className={cn(
                            "h-full transition-[width] ease-linear",
                            notification.type === "success" && "bg-green-500",
                            notification.type === "error" && "bg-destructive",
                            notification.type === "warning" && "bg-yellow-500",
                            notification.type === "info" && "bg-blue-500"
                        )}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
}

export function NotificationsContainer() {
    const { notifications, removeNotification } = useNotification();

    return (
        <div
            aria-live="assertive"
            className="fixed inset-0 flex items-start justify-end px-4 py-6 pointer-events-none z-50"
        >
            <div className="w-full flex flex-col items-end space-y-2 sm:items-end">
                {notifications.map((notification) => (
                    <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>
        </div>
    );
}