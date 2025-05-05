import { useCallback } from 'react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import {
    Chat,
    CreateChatDto,
    UpdateChatDto
} from '@/interfaces/auroraDb'

export const useChats = () => {
    const getAll = useCallback(async (): Promise<Chat[]> => {
        const res = await axios.get<Chat[]>(API_ROUTES.chats)
        return res.data
    }, [])

    const getById = useCallback(async (id: number): Promise<Chat> => {
        const res = await axios.get<Chat>(`${API_ROUTES.chats}/${id}`)
        return res.data
    }, [])

    const create = useCallback(async (data: CreateChatDto): Promise<Chat> => {
        const res = await axios.post<Chat>(API_ROUTES.chats, data)
        return res.data
    }, [])

    const update = useCallback(async (id: number, data: UpdateChatDto): Promise<Chat> => {
        const res = await axios.put<Chat>(`${API_ROUTES.chats}/${id}`, data)
        return res.data
    }, [])

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.chats}/${id}`)
    }, [])

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    }
}
