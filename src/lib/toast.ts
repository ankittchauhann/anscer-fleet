import { toast } from "sonner";

// Utility functions for different types of notifications
export const showToast = {
    success: (message: string, description?: string) => {
        toast.success(message, {
            description,
            duration: 4000,
        });
    },

    error: (message: string, description?: string) => {
        toast.error(message, {
            description,
            duration: 5000,
            // closeButton: true,
            // cancel: true,
            // unstyled: true,
            // style: {
            //     backgroundColor: "#f8d7da",
            //     color: "#721c24",
            //     padding: "16px",
            //     display: "flex",
            //     alignItems: "center",
            //     gap: "8px",
            //     borderRadius: "8px",
            //     boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            //     fontSize: "16px",
            //     lineHeight: "1.5",
            //     fontWeight: "500",
            //     maxWidth: "400px",
            //     margin: "0 auto",
            //     textAlign: "left",
            //     wordWrap: "break-word",
            // },
        });
    },

    info: (message: string, description?: string) => {
        toast.info(message, {
            description,
            duration: 4000,
        });
    },

    warning: (message: string, description?: string) => {
        toast.warning(message, {
            description,
            duration: 4000,
        });
    },

    loading: (message: string) => {
        return toast.loading(message);
    },

    promise: <T>(
        promise: Promise<T>,
        {
            loading,
            success,
            error,
        }: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: any) => string);
        }
    ) => {
        return toast.promise(promise, {
            loading,
            success,
            error,
        });
    },

    dismiss: (toastId?: string | number) => {
        toast.dismiss(toastId);
    },
};

// Export the raw toast function for custom usage
export { toast };
