import {
    Box,
    Typography,
    List,
    ListItemButton,
    ListItemText,
    Divider,
    IconButton,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";

type Props = {
    ownedBoards: any[];
    invitedBoards: any[];
    selectedBoard: any;
    onSelectBoard: (board: any) => void;
    onCreateBoard: () => void;
    onDeleteBoard: (id: number) => void;
};

function BoardSidebar({
    ownedBoards,
    invitedBoards,
    selectedBoard,
    onSelectBoard,
    onCreateBoard,
    onDeleteBoard,
}: Props) {
    const [openConfirm, setOpenConfirm] =
        useState(false);
    const [boardToDelete, setBoardToDelete] =
        useState<any>(null);
    return (
        <Box
            sx={{
                width: 280,
                minWidth: 280,
                maxWidth: 280,

                height: "calc(100vh - 64px)",

                position: "sticky",
                top: 0,

                flexShrink: 0,

                borderRight: "1px solid #333",
                p: 2,

                overflowY: "auto",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 3,
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                    }}
                >
                    Boards
                </Typography>

                <IconButton
                    aria-label="add board"
                    onClick={onCreateBoard}
                    sx={{
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        width: 40,
                        height: 40,

                        "&:hover": {
                            backgroundColor: "#2e7d32",
                        },
                    }}
                >
                    <AddIcon />
                </IconButton>
            </Box>

            <Typography
                sx={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    mb: 1,
                }}
            >
                My Boards
            </Typography>
            <List>
                {ownedBoards.map((board) => (
                    <Box
                        key={board.id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <ListItemButton
                            selected={
                                selectedBoard?.id ===
                                board.id
                            }
                            onClick={() =>
                                onSelectBoard(board)
                            }
                        >
                            <ListItemText
                                primary={board.title}
                            />
                        </ListItemButton>

                        <IconButton
                            color="error"
                            onClick={(e) => {
                                e.stopPropagation();

                                setBoardToDelete(board);
                                setOpenConfirm(true);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}
            </List>

            <Divider sx={{ my: 3 }} />

            <Typography
                sx={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "text.secondary",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    mb: 1,
                }}
            >
                Invited Boards
            </Typography>

            <List>
                {invitedBoards.map((board) => (
                    <Box
                        key={board.id}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <ListItemButton
                            selected={
                                selectedBoard?.id ===
                                board.id
                            }
                            onClick={() =>
                                onSelectBoard(board)
                            }
                        >
                            <ListItemText
                                primary={board.title}
                                secondary="Invited"
                            />
                        </ListItemButton>
                    </Box>
                ))}
            </List>


            <ConfirmDialog
                open={openConfirm}
                title="Delete board?"
                message={`Are you sure you want to delete board "${boardToDelete?.title}"?`}
                confirmText="Delete"
                cancelText="Cancel"
                severity="error"
                onConfirm={() => {
                    if (boardToDelete) {
                        onDeleteBoard(boardToDelete.id);
                    }
                    setOpenConfirm(false);
                    setBoardToDelete(null);
                }}
                onCancel={() => {
                    setOpenConfirm(false);
                    setBoardToDelete(null);
                }}
            />
        </Box>
    );
}

export default BoardSidebar;