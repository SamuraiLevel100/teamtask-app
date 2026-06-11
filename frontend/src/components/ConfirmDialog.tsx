import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    severity?: "error" | "warning" | "info";
}

function ConfirmDialog({
    open,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "OK",
    cancelText = "Cancel",
    severity = "warning",
}: ConfirmDialogProps) {
    const getButtonColor = () => {
        switch (severity) {
            case "error":
                return "error";
            case "warning":
                return "warning";
            default:
                return "primary";
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{ fontWeight: "bold" }}>
                {title}
            </DialogTitle>
            {message && (
                <DialogContent>
                    {message}
                </DialogContent>
            )}
            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={getButtonColor()}
                    autoFocus
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;
