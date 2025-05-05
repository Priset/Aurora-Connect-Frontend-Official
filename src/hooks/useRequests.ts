import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/config/api.config';
import {
    ServiceRequest,
    CreateServiceRequestDto,
    UpdateServiceRequestDto,
} from '@/interfaces/auroraDb';
import { useAuth0 } from '@auth0/auth0-react';

export const useRequests = () => {
    const { getAccessTokenSilently } = useAuth0();

    const authHeaders = async () => ({
        headers: {
            Authorization: `Bearer ${await getAccessTokenSilently()}`,
        },
    });

    const getAll = useCallback(async (): Promise<ServiceRequest[]> => {
        const res = await axios.get<ServiceRequest[]>(
            API_ROUTES.requests,
            await authHeaders()
        );
        return res.data;
    }, [getAccessTokenSilently]);

    const getAllForTechnicians = useCallback(async (): Promise<ServiceRequest[]> => {
        const res = await axios.get<ServiceRequest[]>(
            `${API_ROUTES.requests}/all`,
            await authHeaders()
        );
        return res.data;
    }, [getAccessTokenSilently]);

    const getById = useCallback(async (id: number): Promise<ServiceRequest> => {
        const res = await axios.get<ServiceRequest>(
            `${API_ROUTES.requests}/${id}`,
            await authHeaders()
        );
        return res.data;
    }, [getAccessTokenSilently]);

    const create = useCallback(
        async (data: CreateServiceRequestDto): Promise<ServiceRequest> => {
            const res = await axios.post<ServiceRequest>(
                API_ROUTES.requests,
                data,
                await authHeaders()
            );
            return res.data;
        },
        [getAccessTokenSilently]
    );

    const update = useCallback(
        async (id: number, data: UpdateServiceRequestDto): Promise<ServiceRequest> => {
            const res = await axios.put<ServiceRequest>(
                `${API_ROUTES.requests}/${id}`,
                data,
                await authHeaders()
            );
            return res.data;
        },
        [getAccessTokenSilently]
    );

    const updateStatus = useCallback(
        async (id: number, status: number): Promise<ServiceRequest> => {
            const res = await axios.patch<ServiceRequest>(
                `${API_ROUTES.requests}/${id}/status`,
                { status },
                await authHeaders()
            );
            return res.data;
        },
        [getAccessTokenSilently]
    );

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.requests}/${id}`, await authHeaders());
    }, [getAccessTokenSilently]);

    return {
        getAll,
        getAllForTechnicians,
        getById,
        create,
        update,
        updateStatus,
        remove,
    };
};
