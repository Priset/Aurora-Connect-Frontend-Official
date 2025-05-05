import { useCallback } from 'react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import {
    AiSupportMessage,
    CreateAiSupportMessageDto,
    UpdateAiSupportMessageDto
} from '@/interfaces/auroraDb'

export const useAiSupportMessages = () => {
    const getAll = useCallback(async (): Promise<AiSupportMessage[]> => {
        const res = await axios.get<AiSupportMessage[]>(API_ROUTES.aiSupportMessages)
        return res.data
    }, [])

    const getById = useCallback(async (id: number): Promise<AiSupportMessage> => {
        const res = await axios.get<AiSupportMessage>(`${API_ROUTES.aiSupportMessages}/${id}`)
        return res.data
    }, [])

    const create = useCallback(async (data: CreateAiSupportMessageDto): Promise<AiSupportMessage> => {
        const res = await axios.post<AiSupportMessage>(API_ROUTES.aiSupportMessages, data)
        return res.data
    }, [])

    const update = useCallback(async (id: number, data: UpdateAiSupportMessageDto): Promise<AiSupportMessage> => {
        const res = await axios.put<AiSupportMessage>(`${API_ROUTES.aiSupportMessages}/${id}`, data)
        return res.data
    }, [])

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.aiSupportMessages}/${id}`)
    }, [])

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    }
}
