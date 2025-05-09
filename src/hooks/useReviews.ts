import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/config/api.config';
import {
    ServiceReview,
    CreateServiceReviewDto,
    UpdateServiceReviewDto,
} from '@/interfaces/auroraDb';
import { useAuth0 } from '@auth0/auth0-react';

export const useReviews = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getAll = useCallback(async (): Promise<ServiceReview[]> => {
        const token = await getAccessTokenSilently();
        const res = await axios.get<ServiceReview[]>(API_ROUTES.reviews, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }, [getAccessTokenSilently]);

    const getById = useCallback(async (id: number): Promise<ServiceReview> => {
        const token = await getAccessTokenSilently();
        const res = await axios.get<ServiceReview>(`${API_ROUTES.reviews}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }, [getAccessTokenSilently]);

    const create = useCallback(
        async (data: CreateServiceReviewDto): Promise<ServiceReview> => {
            const token = await getAccessTokenSilently();
            const res = await axios.post<ServiceReview>(API_ROUTES.reviews, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        },
        [getAccessTokenSilently]
    );

    const update = useCallback(
        async (id: number, data: UpdateServiceReviewDto): Promise<ServiceReview> => {
            const token = await getAccessTokenSilently();
            const res = await axios.put<ServiceReview>(`${API_ROUTES.reviews}/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        },
        [getAccessTokenSilently]
    );

    const remove = useCallback(async (id: number): Promise<void> => {
        const token = await getAccessTokenSilently();
        await axios.delete(`${API_ROUTES.reviews}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }, [getAccessTokenSilently]);

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    };
};
