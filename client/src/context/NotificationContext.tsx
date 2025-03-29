import React, { createContext, useState, useContext, useCallback } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, "id">) => string;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = useCallback((notification: Omit<Notification, "id">) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newNotification = { ...notification, id };

        setNotifications(prev => [...prev, newNotification]);

        if (notification.duration && notification.duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, notification.duration);
        }

        return id;
    }, []);

    const removeNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const clearAllNotifications = useCallback(() => {
        setNotifications([]);
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                removeNotification,
                clearAllNotifications
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};