import { useCallback } from 'react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import {
    AiSupportChat,
    CreateAiSupportChatDto,
    UpdateAiSupportChatDto
} from '@/interfaces/auroraDb'

export const useAiSupportChats = () => {
    const getAll = useCallback(async (): Promise<AiSupportChat[]> => {
        const res = await axios.get<AiSupportChat[]>(API_ROUTES.aiSupportChats)
        return res.data
    }, [])

    const getById = useCallback(async (id: number): Promise<AiSupportChat> => {
        const res = await axios.get<AiSupportChat>(`${API_ROUTES.aiSupportChats}/${id}`)
        return res.data
    }, [])

    const create = useCallback(async (data: CreateAiSupportChatDto): Promise<AiSupportChat> => {
        const res = await axios.post<AiSupportChat>(API_ROUTES.aiSupportChats, data)
        return res.data
    }, [])

    const update = useCallback(async (id: number, data: UpdateAiSupportChatDto): Promise<AiSupportChat> => {
        const res = await axios.put<AiSupportChat>(`${API_ROUTES.aiSupportChats}/${id}`, data)
        return res.data
    }, [])

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.aiSupportChats}/${id}`)
    }, [])

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    }
}
