import { useCallback } from 'react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import {
    ChatMessage,
    CreateChatMessageDto,
    UpdateChatMessageDto
} from '@/interfaces/auroraDb'

export const useChatMessages = () => {
    const getAll = useCallback(async (): Promise<ChatMessage[]> => {
        const res = await axios.get<ChatMessage[]>(API_ROUTES.chatMessages)
        return res.data
    }, [])

    const getById = useCallback(async (id: number): Promise<ChatMessage> => {
        const res = await axios.get<ChatMessage>(`${API_ROUTES.chatMessages}/${id}`)
        return res.data
    }, [])

    const create = useCallback(async (data: CreateChatMessageDto): Promise<ChatMessage> => {
        const res = await axios.post<ChatMessage>(API_ROUTES.chatMessages, data)
        return res.data
    }, [])

    const update = useCallback(async (id: number, data: UpdateChatMessageDto): Promise<ChatMessage> => {
        const res = await axios.put<ChatMessage>(`${API_ROUTES.chatMessages}/${id}`, data)
        return res.data
    }, [])

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.chatMessages}/${id}`)
    }, [])

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    }
}
