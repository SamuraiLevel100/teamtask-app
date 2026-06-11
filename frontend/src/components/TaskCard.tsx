import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    // Button,
    Chip,
    Stack,
    IconButton,
    // Box,
} from "@mui/material";

type Props = {
    task: any;
    onDelete: (id: number) => void;
    onEdit: (task: any) => void;
    onOpen: (task: any) => void;
    canUpdate?: boolean;
    canDelete?: boolean;
};

function TaskCard({
    task,
    onDelete,
    onEdit,
    onOpen,
    canUpdate,
    canDelete,
}: Props) {
    // const getStatusColor = (
    //     status: string
    // ) => {
    //     switch (status) {
    //         case "completed":
    //             return "success";

    //         case "in_progress":
    //             return "warning";

    //         default:
    //             return "error";
    //     }
    // };

    const statusConfig: any = {
        none: {
            label: "Non",
            sx: {
                backgroundColor: "#808080",
                color: "#ffffff",
            },
        },

        new: {
            label: "New",
            sx: {
                backgroundColor: "#1976d2",
                color: "#ffffff",
            },
        },

        in_progress: {
            label: "In Progress",
            sx: {
                backgroundColor: "#fbc02d",
                color: "#000000",
            },
        },

        completed: {
            label: "Completed",
            sx: {
                backgroundColor: "#2e7d32",
                color: "#ffffff",
            },
        },
    };

    return (
        <Card
                onClick={() => onOpen(task)}
            sx={{
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent:
                    "space-between",
            }}
        >
            <CardContent>
                <Stack
                    direction="row"
                    sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                    >
                        {task.title}
                    </Typography>

                    <Chip
                        label={
                            statusConfig[
                                task.completed
                            ]?.label || "Non"
                        }
                        sx={{
                            mt: 1,
                            ...(
                                statusConfig[
                                    task.completed
                                ]?.sx || {
                                    backgroundColor:
                                        "#808080",
                                    color: "#ffffff",
                                }
                            ),
                        }}
                    />
                </Stack>

                <Typography
                    sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",

                        display: "-webkit-box",
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: "vertical",

                        minHeight: 100,
                        maxHeight: 100,
                        color: task.description
                            ? "inherit"
                            : "text.secondary",

                        fontStyle: task.description
                            ? "normal"
                            : "italic",
                    }}
                >
                    {task.description?.trim()
                        ? task.description
                        : "Description not provided..."}
                </Typography>
                
            </CardContent>

            <CardActions
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
                    mt: 2,
                }}
            >
                {canUpdate ? (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();

                            onEdit(task);
                        }}
                        sx={{
                            backgroundColor: "#1f5295",
                            color: "white",

                            "&:hover": {
                                backgroundColor: "#266ec6",
                            },
                        }}
                    >
                        <EditIcon />
                    </IconButton>
                ) : null}

                {canDelete ? (
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();

                            onDelete(task.id);
                        }}
                        sx={{
                            backgroundColor: "#810202",
                            color: "white",

                            "&:hover": {
                                backgroundColor: "#bd0404",
                            },
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                ) : null}
            </CardActions>
        </Card>
    );
}

export default TaskCard;