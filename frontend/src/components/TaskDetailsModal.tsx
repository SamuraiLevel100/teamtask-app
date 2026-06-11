import DeleteIcon from "@mui/icons-material/Delete";

import EditIcon from "@mui/icons-material/Edit";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    // Button,
    Box,
    Chip,
    IconButton,
} from "@mui/material";

type Props = {
    open: boolean;
    handleClose: () => void;
    task: any;
    onDelete: (id: number) => void;
    onEdit: (task: any) => void;
    canUpdate?: boolean;
    canDelete?: boolean;
};

function TaskDetailsModal({
    open,
    handleClose,
    task,
    onDelete,
    onEdit,
    canUpdate,
    canDelete,
}: Props) {
    if (!task) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {task.title}
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mb: 3 }}>
                    <Chip
                        label={
                            task.completed === "completed"
                                ? "Completed"
                                : task.completed === "in_progress"
                                ? "In Progress"
                                : task.completed === "new"
                                ? "New"
                                : "None"
                        }
                        color={
                            task.completed === "completed"
                                ? "success"
                                : task.completed === "in_progress"
                                ? "warning"
                                : "default"
                        }
                    />
                </Box>

                <Typography
                    variant="body1"
                    sx={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",

                        color: task.description?.trim()
                            ? "inherit"
                            : "text.secondary",

                        fontStyle: task.description?.trim()
                            ? "normal"
                            : "italic",
                    }}
                >
                    {task.description?.trim()
                        ? task.description
                        : "Description not provided..."}
                </Typography>
            </DialogContent>

            <DialogActions
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    pb: 2,
                    pr: 3,
                }}
            >

                {canUpdate ? (
                    <IconButton
                        onClick={() => {
                            onEdit(task);
                        }}
                        sx={{
                            backgroundColor: "#1e3a5f",
                            color: "white",

                            "&:hover": {
                                backgroundColor: "#2f5f99",
                            },
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                ) : (
                    <IconButton disabled>
                        <EditIcon />
                    </IconButton>
                )}

                {canDelete ? (
                    <IconButton
                        onClick={() => {
                            onDelete(task.id);

                            handleClose();
                        }}
                        sx={{
                            backgroundColor: "#5c0000",
                            color: "white",

                            "&:hover": {
                                backgroundColor: "#a30000",
                            },
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                ) : (
                    <IconButton disabled>
                        <DeleteIcon />
                    </IconButton>
                )}

            </DialogActions>
        </Dialog>
    );
}

export default TaskDetailsModal;