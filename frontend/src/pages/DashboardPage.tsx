import {
    Typography,
    Box,
    Button,
    Grid,
    CircularProgress,
} from "@mui/material";

import {
    useEffect,
    useState,
} from "react";

import MainLayout from "../layouts/MainLayout";

import BoardSidebar from "../components/BoardSidebar";

import TaskCard from "../components/TaskCard";

import CreateTaskModal from "../components/CreateTaskModal";

import EditTaskModal from "../components/EditTaskModal";

import TaskDetailsModal from "../components/TaskDetailsModal";

import CreateBoardModal from "../components/CreateBoardModal";

import BoardMembersDrawer from "../components/BoardMembersDrawer";

import {
    getTasksByBoard,
    deleteTask,
} from "../services/tasks";

import {
    getBoards,
    deleteBoard,
} from "../services/boards";

import {
    getBoardMembers,
    type MemberPermissions,
} from "../services/boardMembers";

import { useNotification } from "../components/NotificationContext";

function DashboardPage() {

    const token =
        localStorage.getItem("token");

    const [loading, setLoading] =
        useState(true);

    const [ownedBoards, setOwnedBoards] =
        useState<any[]>([]);

    const [invitedBoards, setInvitedBoards] =
        useState<any[]>([]);

    const [selectedBoard, setSelectedBoard] =
        useState<any>(null);

    const [currentBoardPermissions, setCurrentBoardPermissions] =
        useState<MemberPermissions | null>(null);

    const [tasks, setTasks] =
        useState<any[]>([]);

    const [filter, setFilter] =
        useState("all");

    const [open, setOpen] =
        useState(false);

    const [editOpen, setEditOpen] =
        useState(false);

    const [detailsOpen, setDetailsOpen] =
        useState(false);

    const [selectedTask, setSelectedTask] =
        useState<any>(null);

    const { showNotification } = useNotification();
    
    const [boardModalOpen, setBoardModalOpen] =
        useState(false);

    const [membersDrawerOpen, setMembersDrawerOpen] = 
        useState(false);

    const loadBoards = async () => {
        try {

            const data =
                await getBoards();

            console.log(
                "LOADED BOARDS:",
                data
            );
            const owned = data.owned_boards || [];
            const invited = (data.invited_boards || []).filter(
                (board: any) =>
                    !owned.some(
                        (ownedBoard: any) =>
                            ownedBoard.id === board.id
                    )
            );

            setOwnedBoards(owned);
            setInvitedBoards(invited);

            const allBoards = [
                ...owned,
                ...invited,
            ];

            setSelectedBoard((prevSelectedBoard: any) => {
                if (allBoards.length === 0) {
                    return null;
                }

                if (!prevSelectedBoard) {
                    return allBoards[0];
                }

                const selectedStillExists = allBoards.some(
                    (b: any) => b.id === prevSelectedBoard.id
                );

                return selectedStillExists
                    ? prevSelectedBoard
                    : allBoards[0];
            });

        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteBoard = async (
        id: number
    ) => {
        try {
            await deleteBoard(id);

            if (selectedBoard?.id === id) {
                setSelectedBoard(null);
                setTasks([]);
            }

            await loadBoards();
        } catch (error) {
            console.error(error);
        }
    };

    const decodeJwtPayload = (token: string | null) => {
        if (!token) return null;

        try {
            const payload = token.split(".")[1];
            const padded = payload.padEnd(
                payload.length + (4 - (payload.length % 4)) % 4,
                "="
            );
            const decoded = atob(
                padded.replace(/-/g, "+").replace(/_/g, "/")
            );
            return JSON.parse(decoded);
        } catch {
            return null;
        }
    };

    const currentUsername =
        decodeJwtPayload(token)?.sub;

    const loadTasks = async (
        boardId: number
    ) => {
        try {

            setLoading(true);

            const data =
                await getTasksByBoard(
                    boardId
                );

            setTasks(data);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadBoardPermissions = async (
        boardId: number
    ) => {
        try {
            const members =
                await getBoardMembers(
                    boardId
                );

            if (!currentUsername) {
                setCurrentBoardPermissions(null);
                return;
            }

            const currentMember = members.find(
                (member: any) =>
                    member.username ===
                    currentUsername
            );

            setCurrentBoardPermissions(
                currentMember?.permissions ||
                    null
            );
        } catch (error) {
            console.error(error);
            setCurrentBoardPermissions(null);
        }
    };

    useEffect(() => {

        if (token) {
            loadBoards();
        }

    }, [token]);

    useEffect(() => {

        if (selectedBoard) {
            loadTasks(
                selectedBoard.id
            );
            loadBoardPermissions(
                selectedBoard.id
            );
        }

    }, [selectedBoard]);

    const handleDelete = async (
        id: number
    ) => {
        if (
            !currentBoardPermissions ||
            !currentBoardPermissions.can_delete
        ) {
            showNotification(
                "You do not have permission to delete tasks on this board",
                "warning"
            );
            return;
        }

        try {
            await deleteTask(id);

            if (selectedBoard) {
                loadTasks(
                    selectedBoard.id
                );
            }
        } catch (error) {
            console.error(error);
            showNotification(
                "Failed to delete the task. Check permissions or try again.",
                "error"
            );
        }
    };

    const handleEdit = (
        task: any
    ) => {
        if (
            !currentBoardPermissions ||
            !currentBoardPermissions.can_update
        ) {
            showNotification(
                "You do not have permission to edit tasks on this board",
                "warning"
            );
            return;
        }

        setSelectedTask(task);

        setDetailsOpen(false);

        setEditOpen(true);
    };

    const handleOpenTask = (
        task: any
    ) => {
        setSelectedTask(task);
        setDetailsOpen(true);
    };

    return (
        <MainLayout>

            {!token ? (

                <Box
                    sx={{
                        flexGrow: 1,
                        p: 3,

                        overflowY: "auto",
                        overflowX: "hidden",

                        height: "calc(100vh - 64px)",
                    }}
                >
                    <Typography variant="h4">

                        Please log in to manage tasks

                    </Typography>
                </Box>

            ) : (

                <Box
                    sx={{
                        display: "flex",
                        height:
                            "calc(100vh - 90px)",
                    }}
                >

                    <BoardSidebar
                        ownedBoards={ownedBoards}
                        invitedBoards={invitedBoards}
                        selectedBoard={
                            selectedBoard
                        }
                        onSelectBoard={
                            setSelectedBoard
                        }
                        onCreateBoard={() =>
                            setBoardModalOpen(true)
                        }
                        onDeleteBoard={handleDeleteBoard}
                    />

                    <Box
                        sx={{
                            flexGrow: 1,
                            p: 3,
                            overflowY:
                                "auto",
                        }}
                    >

                        {!selectedBoard ? (

                            <Typography
                                variant="h5"
                            >
                                Create your first board
                            </Typography>

                        ) : (

                            <>

                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "center",
                                        mb: 4,
                                    }}
                                >

                                    <Typography
                                        variant="h4"
                                    >
                                        {
                                            selectedBoard.title
                                        }
                                    </Typography>

                                    <Box
                                        sx={{
                                            display:
                                                "flex",
                                            gap: 2,
                                        }}
                                    >
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                setOpen(
                                                    true
                                                )
                                            }
                                            disabled={
                                                !currentBoardPermissions ||
                                                !currentBoardPermissions.can_create
                                            }
                                        >
                                            Create Task
                                        </Button>

                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() =>
                                                setMembersDrawerOpen(true)
                                            }
                                        >
                                            Members
                                        </Button>
                                    </Box>

                                </Box>

                                <Box
                                    sx={{
                                        display:
                                            "flex",
                                        gap: 2,
                                        mb: 4,
                                    }}
                                >

                                    <Button
                                        variant={
                                            filter ===
                                            "all"
                                                ? "contained"
                                                : "outlined"
                                        }
                                        onClick={() =>
                                            setFilter(
                                                "all"
                                            )
                                        }
                                    >
                                        All
                                    </Button>

                                    <Button
                                        variant={
                                            filter ===
                                            "new"
                                                ? "contained"
                                                : "outlined"
                                        }
                                        onClick={() =>
                                            setFilter(
                                                "new"
                                            )
                                        }
                                    >
                                        New
                                    </Button>

                                    <Button
                                        variant={
                                            filter ===
                                            "in_progress"
                                                ? "contained"
                                                : "outlined"
                                        }
                                        onClick={() =>
                                            setFilter(
                                                "in_progress"
                                            )
                                        }
                                    >
                                        In Progress
                                    </Button>

                                    <Button
                                        variant={
                                            filter ===
                                            "completed"
                                                ? "contained"
                                                : "outlined"
                                        }
                                        onClick={() =>
                                            setFilter(
                                                "completed"
                                            )
                                        }
                                    >
                                        Completed
                                    </Button>

                                </Box>

                                {loading ? (

                                    <CircularProgress />

                                ) : (

                                    <Grid
                                        container
                                        spacing={3}
                                    >
                                        {tasks
                                            .filter(
                                                (
                                                    task
                                                ) => {

                                                    if (
                                                        filter ===
                                                        "all"
                                                    ) {
                                                        return true;
                                                    }

                                                    return (
                                                        task.completed ===
                                                        filter
                                                    );
                                                }
                                            )
                                            .map(
                                                (
                                                    task
                                                ) => (
                                                    <Grid
                                                        size={{
                                                            xs: 12,
                                                            md: 6,
                                                            lg: 4,
                                                        }}
                                                        key={task.id}
                                                    >
                                                        <TaskCard
                                                            task={
                                                                task
                                                            }
                                                            onDelete={
                                                                handleDelete
                                                            }
                                                            onEdit={
                                                                handleEdit
                                                            }
                                                            onOpen={
                                                                handleOpenTask
                                                            }
                                                            canUpdate={
                                                                currentBoardPermissions?.can_update
                                                            }
                                                            canDelete={
                                                                currentBoardPermissions?.can_delete
                                                            }
                                                        />
                                                    </Grid>
                                                )
                                            )}
                                    </Grid>

                                )}

                            </>

                        )}

                    </Box>

                </Box>

            )}

            <CreateBoardModal
                open={boardModalOpen}
                handleClose={() =>
                    setBoardModalOpen(false)
                }
                refreshBoards={() =>
                    loadBoards()
                }
            />

            <CreateTaskModal
                open={open}
                handleClose={() =>
                    setOpen(false)
                }
                refreshTasks={() =>
                    loadTasks(
                        selectedBoard.id
                    )
                }
                boardId={selectedBoard?.id}
            />

            <EditTaskModal
                open={editOpen}
                handleClose={() =>
                    setEditOpen(false)
                }
                refreshTasks={() =>
                    loadTasks(
                        selectedBoard.id
                    )
                }
                task={selectedTask}
            />

            <TaskDetailsModal
                open={detailsOpen}
                handleClose={() =>
                    setDetailsOpen(false)
                }
                task={selectedTask}
                onDelete={handleDelete}
                onEdit={handleEdit}
                canUpdate={
                    currentBoardPermissions?.can_update
                }
                canDelete={
                    currentBoardPermissions?.can_delete
                }
            />

            <BoardMembersDrawer
                open={membersDrawerOpen}
                onClose={() =>
                    setMembersDrawerOpen(
                        false
                    )
                }
                boardId={
                    selectedBoard?.id
                }
                refreshBoards={() =>
                    loadBoards()
                }
            />

        </MainLayout>
    );
}

export default DashboardPage;