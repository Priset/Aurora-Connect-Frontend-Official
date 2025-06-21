import { useCallback } from 'react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import {
    User,
    CreateUserDto,
    UpdateUserDto,
} from '@/interfaces/auroraDb'
import {useAuth0} from "@auth0/auth0-react";

export const useUsers = () => {
    const { getAccessTokenSilently } = useAuth0();

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
            const token = await getAccessTokenSilently();

            const res = await axios.patch<User>(`${API_ROUTES.users}/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return res.data;
        },
        [getAccessTokenSilently]
    );

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
