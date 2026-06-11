import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

import { useState } from "react";

import { createTask } from "../services/tasks";

const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#1e1e1e",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};

interface Props {
    open: boolean;
    handleClose: () => void;
    refreshTasks: () => void;
    boardId: number;
}

function CreateTaskModal({
    open,
    handleClose,
    refreshTasks,
    boardId,
}: Props) {
    const [formData, setFormData] =
        useState({
            title: "",
            description: "",
            completed: "new",
        });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            await createTask({
                ...formData,
                board_id: boardId,
            });

            refreshTasks();

            handleClose();
        } catch (error) {
            console.error(error);
        }
    };

    const [completed, setCompleted] =
    useState("new");
    

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            <Box sx={style}>
                <Typography
                    variant="h5"
                    sx={{ mb: 3 }}
                >
                    Create Task
                </Typography>

                <form
                    onSubmit={handleSubmit}
                >
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        margin="normal"
                        onChange={handleChange}
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        margin="normal"
                        onChange={handleChange}
                    />

                    <TextField
                        select
                        fullWidth
                        label="Status"
                        value={completed}
                        onChange={(e) =>
                            setCompleted(e.target.value)
                        }
                        margin="normal"
                    >
                        <MenuItem value="new">
                            New
                        </MenuItem>

                        <MenuItem value="in_progress">
                            In Progress
                        </MenuItem>

                        <MenuItem value="completed">
                            Completed
                        </MenuItem>
                    </TextField>

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{ mt: 2 }}
                    >
                        Create
                    </Button>
                </form>
            </Box>
        </Modal>
    );
}

export default CreateTaskModal;