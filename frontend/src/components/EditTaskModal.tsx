import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import { updateTask } from "../services/tasks";

const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform:
        "translate(-50%, -50%)",
    width: 400,
    bgcolor:
        "background.paper",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
};

type Props = {
    open: boolean;
    handleClose: () => void;
    refreshTasks: () => void;
    task: any;
};

function EditTaskModal({
    open,
    handleClose,
    refreshTasks,
    task,
}: Props) {

    const [formData, setFormData] =
        useState({
            title: "",
            description: "",
            completed: "new",
        });

    useEffect(() => {

        if (task) {

            setFormData({
                title:
                    task.title || "",

                description:
                    task.description || "",

                completed:
                    task.completed || "new",
            });
        }

    }, [task]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        setFormData({
            ...formData,
            [e.target.name]:
                e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();

        try {

            await updateTask(
                task.id,
                formData
            );

            refreshTasks();

            handleClose();

        } catch (error) {

            console.error(error);
        }
    };

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
                    Edit Task
                </Typography>

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        margin="normal"
                        value={
                            formData.title
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        margin="normal"
                        multiline
                        rows={4}
                        value={
                            formData.description
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <TextField
                        select
                        fullWidth
                        label="Status"
                        name="completed"
                        margin="normal"
                        value={
                            formData.completed
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <MenuItem value="none">
                            Non
                        </MenuItem>

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
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        Save
                    </Button>

                </form>
            </Box>
        </Modal>
    );
}

export default EditTaskModal;