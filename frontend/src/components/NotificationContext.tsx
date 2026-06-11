import {
    createContext,
    useContext,
    useState,
} from "react";

import {
    Snackbar,
    Alert,
} from "@mui/material";

type Severity =
    | "success"
    | "error"
    | "warning"
    | "info";

type NotificationContextType = {
    showNotification: (
        message: string,
        severity?: Severity
    ) => void;
};

const NotificationContext =
    createContext<
        NotificationContextType | undefined
    >(undefined);

export const NotificationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {

    const [open, setOpen] =
        useState(false);

    const [message, setMessage] =
        useState("");

    const [severity, setSeverity] =
        useState<Severity>("success");

    const showNotification = (
        text: string,
        type: Severity = "success"
    ) => {

        setMessage(text);

        setSeverity(type);

        setOpen(true);
    };

    return (
        <NotificationContext.Provider
            value={{
                showNotification,
            }}
        >
            {children}

            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() =>
                    setOpen(false)
                }
                anchorOrigin={{
                    vertical: "top",
                    horizontal:
                        "center",
                }}
            >
                <Alert
                    severity={severity}
                    variant="filled"
                    onClose={() =>
                        setOpen(false)
                    }
                >
                    {message}
                </Alert>
            </Snackbar>
        </NotificationContext.Provider>
    );
};

export const useNotification =
    () => {

        const context =
            useContext(
                NotificationContext
            );

        if (!context) {
            throw new Error(
                "useNotification must be used inside NotificationProvider"
            );
        }

        return context;
    };