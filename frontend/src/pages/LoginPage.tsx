import React, { useState } from "react";
import { loginUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/NotificationContext";

function LoginPage() {
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            const data = await loginUser(
                formData.username,
                formData.password
            );

            localStorage.setItem(
                "token",
                data.access_token
            );

            showNotification("Login success", "success");

            navigate("/");
        } catch (error) {
            console.error(error);

            showNotification("Login failed", "error");
        }
    };

    return (
        <div>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                />

                <br />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <br />

                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

export default LoginPage;