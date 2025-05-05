import { useCallback } from 'react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import {
    User,
    CreateUserDto,
    UpdateUserDto,
} from '@/interfaces/auroraDb'

export const useUsers = () => {
    const getAll = useCallback(async (): Promise<User[]> => {
        const res = await axios.get<User[]>(API_ROUTES.users)
        return res.data
    }, [])

    const getById = useCallback(async (id: number): Promise<User> => {
        const res = await axios.get<User>(`${API_ROUTES.users}/${id}`)
        return res.data
    }, [])

    const create = useCallback(async (data: CreateUserDto): Promise<User> => {
        const res = await axios.post<User>(API_ROUTES.users, data)
        return res.data
    }, [])

    const update = useCallback(
        async (id: number, data: UpdateUserDto): Promise<User> => {
            const res = await axios.put<User>(`${API_ROUTES.users}/${id}`, data)
            return res.data
        },
        []
    )

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.users}/${id}`)
    }, [])

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    }
}
