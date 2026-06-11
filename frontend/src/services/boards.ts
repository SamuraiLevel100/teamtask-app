import api from "../api/axios";

export const getBoards = async () => {
    const response = await api.get(
        `/boards/`
    );

    return response.data;
};

export const createBoard = async (
    title: string
) => {
    const response = await api.post(
        `/boards/`,
        { title }
    );

    return response.data;
};

export const deleteBoard = async (
    id: number
) => {
    return api.delete(
        `/boards/${id}`
    );
};