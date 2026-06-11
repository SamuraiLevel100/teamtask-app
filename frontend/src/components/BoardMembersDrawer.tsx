import {
    Drawer,
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton,
    // Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    FormGroup,
    Checkbox,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    getBoardMembers,
    addBoardMember,
    updateBoardMember,
    removeBoardMember,
    type MemberPermissions,
} from "../services/boardMembers";

type Props = {
    open: boolean;
    onClose: () => void;
    boardId?: number;
    refreshBoards?: () => void;
};

function BoardMembersDrawer({
    open,
    onClose,
    boardId,
    refreshBoards,
}: Props) {

    const [members, setMembers] =
        useState<any[]>([]);

    const [username, setUsername] =
        useState("");

    const [editOpen, setEditOpen] =
        useState(false);
    const [selectedMember, setSelectedMember] =
        useState<any>(null);
    const [selectedPermissions, setSelectedPermissions] =
        useState<MemberPermissions>({
            can_view: true,
            can_create: false,
            can_update: false,
            can_delete: false,
            can_manage_members: false,
        });
    const [addPermissions, setAddPermissions] =
        useState<MemberPermissions>({
            can_view: true,
            can_create: false,
            can_update: false,
            can_delete: false,
            can_manage_members: false,
        });

    const decodeJwtPayload = (token: string) => {
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

    const currentUsername = useMemo(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return null;
        }

        const payload = decodeJwtPayload(token);

        return payload?.sub || null;
    }, []);

    const currentMember = useMemo(
        () =>
            members.find(
                (member) =>
                    member.username === currentUsername
            ),
        [members, currentUsername]
    );

    const canManageMembers = useMemo(
        () =>
            currentMember?.permissions
                ?.can_manage_members ||
            members.some(
                (member) =>
                    member.role === "owner" &&
                    member.username === currentUsername
            ),
        [currentMember, currentUsername, members]
    );

    const loadMembers = async () => {

        try {

            const data =
                await getBoardMembers(
                    boardId!
                );

            setMembers(data);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        if (open && boardId) {
            loadMembers();
        }

    }, [open, boardId]);

    const handleAddMember =
        async () => {

        if (!username.trim()) {
            return;
        }

        try {

            await addBoardMember(
                boardId!,
                username,
                addPermissions
            );

            setUsername("");
            setAddPermissions({
                can_view: true,
                can_create: false,
                can_update: false,
                can_delete: false,
                can_manage_members: false,
            });

            loadMembers();
            refreshBoards?.();

        } catch (error) {

            console.error(error);
        }
    };

    const openEditMember =
        (member: any) => {
            setSelectedMember(member);
            setSelectedPermissions(member.permissions || {
                can_view: true,
                can_create: false,
                can_update: false,
                can_delete: false,
                can_manage_members: false,
            });
            setEditOpen(true);
        };

    const closeEditMember =
        () => {
            setEditOpen(false);
            setSelectedMember(null);
        };

    const handleSaveMember =
        async () => {
            if (!selectedMember) {
                return;
            }

            try {
                await updateBoardMember(
                    selectedMember.id,
                    selectedPermissions
                );

                closeEditMember();
                loadMembers();
                refreshBoards?.();
            } catch (error) {
                console.error(error);
            }
        };

    const handleDeleteMember =
        async (memberId: number) => {

        try {

            await removeBoardMember(
                memberId
            );

            loadMembers();
            refreshBoards?.();

        } catch (error) {

            console.error(error);
        }
    };

    const formatPermissions = (
        permissions: MemberPermissions | undefined
    ) => {
        if (!permissions) {
            return "No permissions";
        }

        const granted: string[] = [];

        if (permissions.can_view) {
            granted.push("view");
        }
        if (permissions.can_create) {
            granted.push("create");
        }
        if (permissions.can_update) {
            granted.push("update");
        }
        if (permissions.can_delete) {
            granted.push("delete");
        }
        if (permissions.can_manage_members) {
            granted.push("manage");
        }

        return granted.length > 0
            ? granted.join(", ")
            : "No permissions";
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
        >
            <Box
                sx={{
                    width: 400,
                    p: 3,
                }}
            >

                <Typography
                    variant="h5"
                    sx={{ mb: 3 }}
                >
                    Board Members
                </Typography>

                {members.some((member) => member.role === "owner") && (
                    <Box sx={{ mb: 2, p: 2, bgcolor: "background.paper", borderRadius: 1 }}>
                        <Typography variant="subtitle1" sx={{ mb: 1 }}>
                            Board Owner
                        </Typography>
                        {members.filter((member) => member.role === "owner").map((member) => (
                            <ListItem key={member.id || "owner"}>
                                <ListItemText
                                    primary={member.username}
                                />
                            </ListItem>
                        ))}
                    </Box>
                )}

                <List>
                    {members
                        .filter((member) => member.role !== "owner")
                        .map((member) => (
                            <ListItem
                                key={member.id}
                                secondaryAction={
                                    canManageMembers ? (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: 1,
                                                alignItems: "center",
                                            }}
                                        >
                                            <IconButton
                                                onClick={() => openEditMember(member)}
                                            >
                                                <EditIcon />
                                            </IconButton>

                                            <IconButton
                                                onClick={() =>
                                                    handleDeleteMember(member.id)
                                                }
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    ) : null
                                }
                            >
                                <ListItemText
                                    primary={member.username}
                                    secondary={formatPermissions(member.permissions)}
                                />
                            </ListItem>
                        ))}
                </List>
                <Dialog
                    open={editOpen}
                    onClose={closeEditMember}
                >
                    <DialogTitle>
                        Edit Member
                    </DialogTitle>
                    <DialogContent>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                minWidth: 320,
                                mt: 1,
                            }}
                        >
                            <TextField
                                label="User"
                                value={selectedMember?.username || ""}
                                disabled
                            />
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedPermissions.can_view}
                                            onChange={(e) =>
                                                setSelectedPermissions(
                                                    prev => ({
                                                        ...prev,
                                                        can_view: e.target.checked,
                                                    })
                                                )
                                            }
                                        />
                                    }
                                    label="View"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedPermissions.can_create}
                                            onChange={(e) =>
                                                setSelectedPermissions(
                                                    prev => ({
                                                        ...prev,
                                                        can_create: e.target.checked,
                                                    })
                                                )
                                            }
                                        />
                                    }
                                    label="Create tasks"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedPermissions.can_update}
                                            onChange={(e) =>
                                                setSelectedPermissions(
                                                    prev => ({
                                                        ...prev,
                                                        can_update: e.target.checked,
                                                    })
                                                )
                                            }
                                        />
                                    }
                                    label="Edit tasks"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedPermissions.can_delete}
                                            onChange={(e) =>
                                                setSelectedPermissions(
                                                    prev => ({
                                                        ...prev,
                                                        can_delete: e.target.checked,
                                                    })
                                                )
                                            }
                                        />
                                    }
                                    label="Delete tasks"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={selectedPermissions.can_manage_members}
                                            onChange={(e) =>
                                                setSelectedPermissions(
                                                    prev => ({
                                                        ...prev,
                                                        can_manage_members: e.target.checked,
                                                    })
                                                )
                                            }
                                        />
                                    }
                                    label="Manage members"
                                />
                            </FormGroup>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeEditMember}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSaveMember}
                        >
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>

                <Box
                    sx={{
                        mt: 4,
                        display: "grid",
                        gap: 1,
                    }}
                >
                    {!canManageMembers && (
                        <Typography
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            Only the board owner or a member with Manage Members permission can add new users.
                        </Typography>
                    )}
                    <TextField
                        fullWidth
                        label="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                        disabled={!canManageMembers}
                    />
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={addPermissions.can_view}
                                    onChange={(e) =>
                                        setAddPermissions(
                                            prev => ({
                                                ...prev,
                                                can_view: e.target.checked,
                                            })
                                        )
                                    }
                                />
                            }
                            label="View"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={addPermissions.can_create}
                                    onChange={(e) =>
                                        setAddPermissions(
                                            prev => ({
                                                ...prev,
                                                can_create: e.target.checked,
                                            })
                                        )
                                    }
                                />
                            }
                            label="Create tasks"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={addPermissions.can_update}
                                    onChange={(e) =>
                                        setAddPermissions(
                                            prev => ({
                                                ...prev,
                                                can_update: e.target.checked,
                                            })
                                        )
                                    }
                                />
                            }
                            label="Edit tasks"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={addPermissions.can_delete}
                                    onChange={(e) =>
                                        setAddPermissions(
                                            prev => ({
                                                ...prev,
                                                can_delete: e.target.checked,
                                            })
                                        )
                                    }
                                />
                            }
                            label="Delete tasks"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={addPermissions.can_manage_members}
                                    onChange={(e) =>
                                        setAddPermissions(
                                            prev => ({
                                                ...prev,
                                                can_manage_members: e.target.checked,
                                            })
                                        )
                                    }
                                />
                            }
                            label="Manage members"
                        />
                    </FormGroup>
                    <Button
                        variant="contained"
                        onClick={handleAddMember}
                        disabled={!canManageMembers}
                    >
                        Add Member
                    </Button>
                </Box>

            </Box>
        </Drawer>
    );
}

export default BoardMembersDrawer;