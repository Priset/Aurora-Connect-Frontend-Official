import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/config/api.config';
import {
    ServiceOffer,
    CreateServiceOfferDto,
    UpdateServiceOfferDto,
} from '@/interfaces/auroraDb';
import { useAuthHeaders } from './useAuthHeaders';

export const useOffers = () => {
    const getHeaders = useAuthHeaders();

    const getAll = useCallback(async (): Promise<ServiceOffer[]> => {
        const res = await axios.get<ServiceOffer[]>(API_ROUTES.offers, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const getById = useCallback(async (id: number): Promise<ServiceOffer> => {
        const res = await axios.get<ServiceOffer>(`${API_ROUTES.offers}/${id}`, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const create = useCallback(
        async (data: CreateServiceOfferDto): Promise<ServiceOffer> => {
            const res = await axios.post<ServiceOffer>(API_ROUTES.offers, data, await getHeaders());
            return res.data;
        },
        [getHeaders]
    );

    const update = useCallback(
        async (id: number, data: UpdateServiceOfferDto): Promise<ServiceOffer> => {
            const res = await axios.put<ServiceOffer>(`${API_ROUTES.offers}/${id}`, data, await getHeaders());
            return res.data;
        },
        [getHeaders]
    );

    const updateStatus = useCallback(
        async (id: number, status: number): Promise<ServiceOffer> => {
            const res = await axios.patch<ServiceOffer>(
                `${API_ROUTES.offers}/${id}/status`,
                { status },
                await getHeaders()
            );
            return res.data;
        },
        [getHeaders]
    );

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.offers}/${id}`, await getHeaders());
    }, [getHeaders]);

    return {
        getAll,
        getById,
        create,
        update,
        updateStatus,
        remove,
    };
};
