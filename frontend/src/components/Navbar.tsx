import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
} from "@mui/material";

import { useState } from "react";

import AuthModal from "./AuthModal";
import {getUsernameFromToken,} from "../services/auth";

function Navbar() {
    const token =
        localStorage.getItem("token");

    const username =
        getUsernameFromToken();

    const [open, setOpen] =
        useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");

        window.location.reload();
    };

    const avatarLetter =
        username
            ? username
                .charAt(0)
                .toUpperCase()
            : "?";

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        sx={{
                            flexGrow: 1,
                        }}
                    >
                        TeamTask
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                        }}
                    >
                        {!token ? (
                            <>
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        setOpen(
                                            true
                                        )
                                    }
                                    sx={{
                                        bgcolor:
                                            "#333",
                                        "&:hover":
                                            {
                                                bgcolor:
                                                    "#ffd700",
                                                color:
                                                    "#000",
                                            },
                                    }}
                                >
                                    Login
                                </Button>

                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        setOpen(
                                            true
                                        )
                                    }
                                    sx={{
                                        bgcolor:
                                            "#333",
                                        "&:hover":
                                            {
                                                bgcolor:
                                                    "#ffd700",
                                                color:
                                                    "#000",
                                            },
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        ) : (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                }}
                            >
                                <Avatar
                                    sx={{
                                        bgcolor: "#ffd700",
                                        color: "#000",
                                        width: 38,
                                        height: 38,
                                        fontWeight: 700,
                                    }}
                                >
                                    {avatarLetter}
                                </Avatar>

                                <Typography
                                    sx={{
                                        fontWeight: 500,
                                    }}
                                >
                                    {username}
                                </Typography>

                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            <AuthModal
                open={open}
                handleClose={() =>
                    setOpen(false)
                }
            />
        </>
    );
}

export default Navbar;