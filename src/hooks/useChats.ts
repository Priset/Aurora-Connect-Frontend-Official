import { useCallback } from 'react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import {
    Chat,
    CreateChatDto,
    UpdateChatDto
} from '@/interfaces/auroraDb'
import { useAuth0 } from '@auth0/auth0-react';

export const useChats = () => {
    const { getAccessTokenSilently } = useAuth0();

    const authHeaders = async () => ({
        headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`
        }
    });

    const getAll = useCallback(async (): Promise<Chat[]> => {
        const res = await axios.get<Chat[]>(API_ROUTES.chats, await authHeaders());
        return res.data;
    }, [authHeaders]);

    const getById = useCallback(async (id: number): Promise<Chat> => {
        const res = await axios.get<Chat>(`${API_ROUTES.chats}/${id}`, await authHeaders());
        return res.data;
    }, [authHeaders]);

    const create = useCallback(async (data: CreateChatDto): Promise<Chat> => {
        const res = await axios.post<Chat>(API_ROUTES.chats, data, await authHeaders());
        return res.data;
    }, [authHeaders]);

    const update = useCallback(async (id: number, data: UpdateChatDto): Promise<Chat> => {
        const res = await axios.put<Chat>(`${API_ROUTES.chats}/${id}`, data, await authHeaders());
        return res.data;
    }, [authHeaders]);

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.chats}/${id}`, await authHeaders());
    }, [authHeaders]);

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    };
}
