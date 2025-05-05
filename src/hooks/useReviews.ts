import { useCallback } from 'react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import {
    ServiceReview,
    CreateServiceReviewDto,
    UpdateServiceReviewDto,
} from '@/interfaces/auroraDb'

export const useReviews = () => {
    const getAll = useCallback(async (): Promise<ServiceReview[]> => {
        const res = await axios.get<ServiceReview[]>(API_ROUTES.reviews)
        return res.data
    }, [])

    const getById = useCallback(async (id: number): Promise<ServiceReview> => {
        const res = await axios.get<ServiceReview>(`${API_ROUTES.reviews}/${id}`)
        return res.data
    }, [])

    const create = useCallback(
        async (data: CreateServiceReviewDto): Promise<ServiceReview> => {
            const res = await axios.post<ServiceReview>(API_ROUTES.reviews, data)
            return res.data
        },
        []
    )

    const update = useCallback(
        async (id: number, data: UpdateServiceReviewDto): Promise<ServiceReview> => {
            const res = await axios.put<ServiceReview>(
                `${API_ROUTES.reviews}/${id}`,
                data
            )
            return res.data
        },
        []
    )

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.reviews}/${id}`)
    }, [])

    return {
        getAll,
        getById,
        create,
        update,
        remove,
    }
}
