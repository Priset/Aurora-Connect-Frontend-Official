import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/config/api.config';
import {
    ChatMessage,
    CreateChatMessageDto,
    UpdateChatMessageDto,
} from '@/interfaces/auroraDb';
import { useAuthHeaders } from './useAuthHeaders';

export const useChatMessages = () => {
    const getHeaders = useAuthHeaders();

    const getAllForChat = useCallback(async (chatId: number): Promise<ChatMessage[]> => {
        const res = await axios.get<ChatMessage[]>(
            `${API_ROUTES.chatMessages}?chatId=${chatId}`,
            await getHeaders()
        );
        return res.data;
    }, [getHeaders]);

    const getById = useCallback(async (id: number): Promise<ChatMessage> => {
        const res = await axios.get<ChatMessage>(`${API_ROUTES.chatMessages}/${id}`, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const create = useCallback(async (data: CreateChatMessageDto): Promise<ChatMessage> => {
        const res = await axios.post<ChatMessage>(API_ROUTES.chatMessages, data, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const update = useCallback(async (id: number, data: UpdateChatMessageDto): Promise<ChatMessage> => {
        const res = await axios.put<ChatMessage>(`${API_ROUTES.chatMessages}/${id}`, data, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.chatMessages}/${id}`, await getHeaders());
    }, [getHeaders]);

    return {
        getAllForChat,
        getById,
        create,
        update,
        remove,
    };
};
