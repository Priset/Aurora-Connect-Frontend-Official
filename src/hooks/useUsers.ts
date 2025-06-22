import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/config/api.config';
import {
    User,
    CreateUserDto,
    UpdateUserDto,
} from '@/interfaces/auroraDb';
import { useAuthHeaders } from './useAuthHeaders';

export const useUsers = () => {
    const getHeaders = useAuthHeaders();

    const getAll = useCallback(async (): Promise<User[]> => {
        const res = await axios.get<User[]>(API_ROUTES.users, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const getById = useCallback(async (id: number): Promise<User> => {
        const res = await axios.get<User>(`${API_ROUTES.users}/${id}`, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const create = useCallback(async (data: CreateUserDto): Promise<User> => {
        const res = await axios.post<User>(API_ROUTES.users, data, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const update = useCallback(
        async (id: number, data: UpdateUserDto): Promise<User> => {
            const res = await axios.patch<User>(`${API_ROUTES.users}/${id}`, data, await getHeaders());
            return res.data;
        },
        [getHeaders]
    );

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.users}/${id}`, await getHeaders());
    }, [getHeaders]);

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    };
};
