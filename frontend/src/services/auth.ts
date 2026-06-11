import axios from "axios";

const API_URL = "http://127.0.0.1:8000/auth";

export const registerUser = async (data: {
    username: string;
    email: string;
    password: string;
}) => {
    return axios.post(
        `${API_URL}/register`,
        data
    );
};

export const loginUser = async (
    username: string,
    password: string
) => {
    const formData = new URLSearchParams();

    formData.append("username", username);
    formData.append("password", password);

    const response = await axios.post(
        `${API_URL}/login`,
        formData,
        {
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            }
        }
    );

    return response.data;
};

export const getUsernameFromToken = () => {
    const token =
        localStorage.getItem("token");

    if (!token) {
        return null;
    }

    try {
        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        return payload.sub;
    } catch {
        return null;
    }
};