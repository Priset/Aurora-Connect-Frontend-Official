import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/config/api.config';
import {
    ServiceReview,
    CreateServiceReviewDto,
    UpdateServiceReviewDto,
} from '@/interfaces/auroraDb';
import { useAuthHeaders } from './useAuthHeaders';

export const useReviews = () => {
    const getHeaders = useAuthHeaders();

    const getAll = useCallback(async (): Promise<ServiceReview[]> => {
        const res = await axios.get<ServiceReview[]>(API_ROUTES.reviews, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const getById = useCallback(async (id: number): Promise<ServiceReview> => {
        const res = await axios.get<ServiceReview>(`${API_ROUTES.reviews}/${id}`, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const create = useCallback(
        async (data: CreateServiceReviewDto): Promise<ServiceReview> => {
            const res = await axios.post<ServiceReview>(API_ROUTES.reviews, data, await getHeaders());
            return res.data;
        },
        [getHeaders]
    );

    const update = useCallback(
        async (id: number, data: UpdateServiceReviewDto): Promise<ServiceReview> => {
            const res = await axios.put<ServiceReview>(`${API_ROUTES.reviews}/${id}`, data, await getHeaders());
            return res.data;
        },
        [getHeaders]
    );

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.reviews}/${id}`, await getHeaders());
    }, [getHeaders]);

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    };
};
