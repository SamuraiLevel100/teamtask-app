import {
    Box,
    Button,
    Modal,
    TextField,
    Typography,
} from "@mui/material";

import { useState } from "react";

import {
    loginUser,
    registerUser,
} from "../services/auth";

import { useNotification } from "./NotificationContext";

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
}

function AuthModal({
    open,
    handleClose,
}: Props) {
    const { showNotification } = useNotification();

    const [isLogin, setIsLogin] =
        useState(true);

    const [formData, setFormData] =
        useState({
            username: "",
            email: "",
            password: "",
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
            if (isLogin) {
                const data =
                    await loginUser(
                        formData.username,
                        formData.password
                    );

                localStorage.setItem(
                    "token",
                    data.access_token
                );

                console.log(
                    "NEW TOKEN:",
                    data.access_token
                );

                showNotification("Login success", "success");
            } else {
                await registerUser(formData);

                showNotification(
                    "Registration success",
                    "success"
                );

                const data =
                    await loginUser(
                        formData.username,
                        formData.password
                    );

                localStorage.setItem(
                    "token",
                    data.access_token
                );
            }

            window.location.reload();
        } catch (error) {
            console.error(error);

            showNotification("Authentication error", "error");
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
                    {isLogin
                        ? "Login"
                        : "Register"}
                </Typography>

                <form
                    onSubmit={handleSubmit}
                >
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        margin="normal"
                        onChange={handleChange}
                    />

                    {!isLogin && (
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            margin="normal"
                            onChange={
                                handleChange
                            }
                        />
                    )}

                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        name="password"
                        margin="normal"
                        onChange={handleChange}
                    />

                    <Button
                        fullWidth
                        variant="contained"
                        type="submit"
                        sx={{
                            mt: 2,
                        }}
                    >
                        {isLogin
                            ? "Login"
                            : "Register"}
                    </Button>
                </form>

                <Button
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() =>
                        setIsLogin(
                            !isLogin
                        )
                    }
                >
                    {isLogin
                        ? "No account? Register"
                        : "Already have account? Login"}
                </Button>
            </Box>
        </Modal>
    );
}

export default AuthModal;