import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/config/api.config';
import {
    AiSupportMessage,
    CreateAiSupportMessageDto,
    UpdateAiSupportMessageDto
} from '@/interfaces/auroraDb';
import { useAuthHeaders } from './useAuthHeaders';

export const useAiSupportMessages = () => {
    const getHeaders = useAuthHeaders();

    const getAll = useCallback(async (): Promise<AiSupportMessage[]> => {
        const res = await axios.get<AiSupportMessage[]>(API_ROUTES.aiSupportMessages, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const getById = useCallback(async (id: number): Promise<AiSupportMessage> => {
        const res = await axios.get<AiSupportMessage>(`${API_ROUTES.aiSupportMessages}/${id}`, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const create = useCallback(async (data: CreateAiSupportMessageDto): Promise<AiSupportMessage> => {
        const res = await axios.post<AiSupportMessage>(API_ROUTES.aiSupportMessages, data, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const update = useCallback(async (id: number, data: UpdateAiSupportMessageDto): Promise<AiSupportMessage> => {
        const res = await axios.put<AiSupportMessage>(`${API_ROUTES.aiSupportMessages}/${id}`, data, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.aiSupportMessages}/${id}`, await getHeaders());
    }, [getHeaders]);

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    };
};
