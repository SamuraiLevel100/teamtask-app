import api from "../api/axios";

export type MemberPermissions = {
    can_view: boolean;
    can_create: boolean;
    can_update: boolean;
    can_delete: boolean;
    can_manage_members: boolean;
};

export const getBoardMembers =
    async (boardId: number) => {

    const response =
        await api.get(
            `/board-members/${boardId}`
        );

    return response.data;
};

export const addBoardMember =
    async (
        boardId: number,
        username: string,
        permissions: MemberPermissions
    ) => {

    const response =
        await api.post(
            `/board-members/${boardId}`,
            {
                username,
                permissions,
            }
        );

    return response.data;
};

export const updateBoardMember =
    async (
        memberId: number,
        permissions: MemberPermissions
    ) => {

    const response =
        await api.patch(
            `/board-members/${memberId}`,
            { permissions }
        );

    return response.data;
};

export const removeBoardMember =
    async (
        memberId: number
    ) => {

    const response =
        await api.delete(
            `/board-members/${memberId}`
        );

    return response.data;
};