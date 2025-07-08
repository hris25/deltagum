import { create } from "zustand";

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],

  addNotification: (notification) => {
    const id = `notification-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove après la durée spécifiée
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, newNotification.duration);
    }
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id
      ),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },
}));

// Hook personnalisé pour les notifications
export const useNotifications = () => {
  const {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
  } = useNotificationStore();

  const showSuccess = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    addNotification({ type: "success", title, message, ...options });
  };

  const showError = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    addNotification({ type: "error", title, message, ...options });
  };

  const showWarning = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    addNotification({ type: "warning", title, message, ...options });
  };

  const showInfo = (
    title: string,
    message?: string,
    options?: Partial<Notification>
  ) => {
    addNotification({ type: "info", title, message, ...options });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};
