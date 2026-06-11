import React, { useState } from "react";
import { registerUser } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/NotificationContext";

function RegisterPage() {
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
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
            await registerUser(formData);

            showNotification("Registration successful", "success");

            navigate("/login");
        } catch (error) {
            console.error(error);

            showNotification("Registration failed", "error");
        }
    };

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={handleChange}
                />

                <br />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
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
                    Register
                </button>
            </form>
        </div>
    );
}

export default RegisterPage;