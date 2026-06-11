import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
} from "@mui/material";

import { useState } from "react";

import { createBoard } from "../services/boards";

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
    refreshBoards: () => void;
}

function CreateBoardModal({
    open,
    handleClose,
    refreshBoards,
}: Props) {
    const [title, setTitle] =
        useState("");

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            await createBoard(title);

            refreshBoards();

            handleClose();

            setTitle("");
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
                    Create Board
                </Typography>

                <form
                    onSubmit={handleSubmit}
                >
                    <TextField
                        fullWidth
                        label="Board title"
                        value={title}
                        onChange={(e) =>
                            setTitle(
                                e.target.value
                            )
                        }
                    />

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

export default CreateBoardModal;