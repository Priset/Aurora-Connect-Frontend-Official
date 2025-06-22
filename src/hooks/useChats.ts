import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/config/api.config';
import {
    Chat,
    CreateChatDto,
    UpdateChatDto
} from '@/interfaces/auroraDb';
import { useAuthHeaders } from './useAuthHeaders';

export const useChats = () => {
    const getHeaders = useAuthHeaders();

    const getAll = useCallback(async (): Promise<Chat[]> => {
        const res = await axios.get<Chat[]>(API_ROUTES.chats, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const getById = useCallback(async (id: number): Promise<Chat> => {
        const res = await axios.get<Chat>(`${API_ROUTES.chats}/${id}`, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const create = useCallback(async (data: CreateChatDto): Promise<Chat> => {
        const res = await axios.post<Chat>(API_ROUTES.chats, data, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const update = useCallback(async (id: number, data: UpdateChatDto): Promise<Chat> => {
        const res = await axios.put<Chat>(`${API_ROUTES.chats}/${id}`, data, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.chats}/${id}`, await getHeaders());
    }, [getHeaders]);

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    };
};
