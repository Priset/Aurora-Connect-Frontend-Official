import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/config/api.config';
import {
    Notification,
    CreateNotificationDto,
    UpdateNotificationDto,
} from '@/interfaces/auroraDb';
import { useAuthHeaders } from './useAuthHeaders';

export const useNotifications = () => {
    const getHeaders = useAuthHeaders();

    const getAll = useCallback(async (): Promise<Notification[]> => {
        const res = await axios.get<Notification[]>(API_ROUTES.notifications, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const getById = useCallback(async (id: number): Promise<Notification> => {
        const res = await axios.get<Notification>(`${API_ROUTES.notifications}/${id}`, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const create = useCallback(
        async (data: CreateNotificationDto): Promise<Notification> => {
            const res = await axios.post<Notification>(API_ROUTES.notifications, data, await getHeaders());
            return res.data;
        },
        [getHeaders]
    );

    const update = useCallback(
        async (id: number, data: UpdateNotificationDto): Promise<Notification> => {
            const res = await axios.put<Notification>(
                `${API_ROUTES.notifications}/${id}`,
                data,
                await getHeaders()
            );
            return res.data;
        },
        [getHeaders]
    );

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.notifications}/${id}`, await getHeaders());
    }, [getHeaders]);

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    };
};
