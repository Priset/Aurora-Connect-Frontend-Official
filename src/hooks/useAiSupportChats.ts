import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/config/api.config';
import {
    AiSupportChat,
    CreateAiSupportChatDto,
    UpdateAiSupportChatDto
} from '@/interfaces/auroraDb';
import { useAuthHeaders } from './useAuthHeaders';

export const useAiSupportChats = () => {
    const getHeaders = useAuthHeaders();

    const getAll = useCallback(async (): Promise<AiSupportChat[]> => {
        const res = await axios.get<AiSupportChat[]>(API_ROUTES.aiSupportChats, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const getById = useCallback(async (id: number): Promise<AiSupportChat> => {
        const res = await axios.get<AiSupportChat>(`${API_ROUTES.aiSupportChats}/${id}`, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const create = useCallback(async (data: CreateAiSupportChatDto): Promise<AiSupportChat> => {
        const res = await axios.post<AiSupportChat>(API_ROUTES.aiSupportChats, data, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const update = useCallback(async (id: number, data: UpdateAiSupportChatDto): Promise<AiSupportChat> => {
        const res = await axios.put<AiSupportChat>(`${API_ROUTES.aiSupportChats}/${id}`, data, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.aiSupportChats}/${id}`, await getHeaders());
    }, [getHeaders]);

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    };
};
