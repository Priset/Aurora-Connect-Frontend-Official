import { useCallback } from 'react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import {
    Notification,
    CreateNotificationDto,
    UpdateNotificationDto,
} from '@/interfaces/auroraDb'

export const useNotifications = () => {
    const getAll = useCallback(async (): Promise<Notification[]> => {
        const res = await axios.get<Notification[]>(API_ROUTES.notifications)
        return res.data
    }, [])

    const getById = useCallback(async (id: number): Promise<Notification> => {
        const res = await axios.get<Notification>(`${API_ROUTES.notifications}/${id}`)
        return res.data
    }, [])

    const create = useCallback(
        async (data: CreateNotificationDto): Promise<Notification> => {
            const res = await axios.post<Notification>(API_ROUTES.notifications, data)
            return res.data
        },
        []
    )

    const update = useCallback(
        async (id: number, data: UpdateNotificationDto): Promise<Notification> => {
            const res = await axios.put<Notification>(
                `${API_ROUTES.notifications}/${id}`,
                data
            )
            return res.data
        },
        []
    )

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.notifications}/${id}`)
    }, [])

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    }
}
