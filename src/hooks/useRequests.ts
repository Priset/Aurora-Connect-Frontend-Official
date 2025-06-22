import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/config/api.config';
import {
    ServiceRequest,
    CreateServiceRequestDto,
    UpdateServiceRequestDto,
} from '@/interfaces/auroraDb';
import { useAuthHeaders } from './useAuthHeaders';

export const useRequests = () => {
    const getHeaders = useAuthHeaders();

    const getAll = useCallback(async (): Promise<ServiceRequest[]> => {
        const res = await axios.get<ServiceRequest[]>(
            API_ROUTES.requests,
            await getHeaders()
        );
        return res.data;
    }, [getHeaders]);

    const getAllForTechnicians = useCallback(async (): Promise<ServiceRequest[]> => {
        const res = await axios.get<ServiceRequest[]>(
            `${API_ROUTES.requests}/all`,
            await getHeaders()
        );
        return res.data;
    }, [getHeaders]);

    const getById = useCallback(async (id: number): Promise<ServiceRequest> => {
        const res = await axios.get<ServiceRequest>(
            `${API_ROUTES.requests}/${id}`,
            await getHeaders()
        );
        return res.data;
    }, [getHeaders]);

    const create = useCallback(
        async (data: CreateServiceRequestDto): Promise<ServiceRequest> => {
            const res = await axios.post<ServiceRequest>(
                API_ROUTES.requests,
                data,
                await getHeaders()
            );
            return res.data;
        },
        [getHeaders]
    );

    const update = useCallback(
        async (id: number, data: UpdateServiceRequestDto): Promise<ServiceRequest> => {
            const res = await axios.put<ServiceRequest>(
                `${API_ROUTES.requests}/${id}`,
                data,
                await getHeaders()
            );
            return res.data;
        },
        [getHeaders]
    );

    const updateStatus = useCallback(
        async (id: number, status: number): Promise<ServiceRequest> => {
            const res = await axios.patch<ServiceRequest>(
                `${API_ROUTES.requests}/${id}/status`,
                { status },
                await getHeaders()
            );
            return res.data;
        },
        [getHeaders]
    );

    const finalizeRequest = useCallback(
        async (id: number): Promise<void> => {
            await axios.patch(`${API_ROUTES.requests}/${id}/finalize`, {}, await getHeaders());
        },
        [getHeaders]
    );

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.requests}/${id}`, await getHeaders());
    }, [getHeaders]);

    return {
        getAll,
        getAllForTechnicians,
        getById,
        create,
        update,
        updateStatus,
        finalizeRequest,
        remove,
    };
};
