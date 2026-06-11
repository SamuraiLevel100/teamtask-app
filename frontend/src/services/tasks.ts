import api from "../api/axios";

export const getTasksByBoard = async (
    boardId: number
) => {
    const response = await api.get(
        `/tasks/board/${boardId}`
    );

    return response.data;
};

export const createTask = async (
    taskData: any
) => {
    const response = await api.post(
        `/tasks/`,
        taskData
    );

    return response.data;
};

export const deleteTask = async (
    id: number
) => {
    return api.delete(
        `/tasks/${id}`
    );
};

export const updateTask = async (
    id: number,
    taskData: any
) => {
    const response = await api.put(
        `/tasks/${id}`,
        taskData
    );

    return response.data;
};