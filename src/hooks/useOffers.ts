import { useCallback } from 'react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import {
    ServiceOffer,
    CreateServiceOfferDto,
    UpdateServiceOfferDto,
} from '@/interfaces/auroraDb'
import { useAuth0 } from '@auth0/auth0-react'

export const useOffers = () => {
    const { getAccessTokenSilently } = useAuth0()

    const getAll = useCallback(async (): Promise<ServiceOffer[]> => {
        const res = await axios.get<ServiceOffer[]>(API_ROUTES.offers)
        return res.data
    }, [])

    const getById = useCallback(async (id: number): Promise<ServiceOffer> => {
        const res = await axios.get<ServiceOffer>(`${API_ROUTES.offers}/${id}`)
        return res.data
    }, [])

    const create = useCallback(
        async (data: CreateServiceOfferDto): Promise<ServiceOffer> => {
            const token = await getAccessTokenSilently()
            const res = await axios.post<ServiceOffer>(API_ROUTES.offers, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return res.data
        },
        [getAccessTokenSilently]
    )

    const update = useCallback(
        async (id: number, data: UpdateServiceOfferDto): Promise<ServiceOffer> => {
            const token = await getAccessTokenSilently()
            const res = await axios.put<ServiceOffer>(`${API_ROUTES.offers}/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return res.data
        },
        [getAccessTokenSilently]
    )

    const updateStatus = useCallback(
        async (id: number, status: number): Promise<ServiceOffer> => {
            const token = await getAccessTokenSilently()
            const res = await axios.patch<ServiceOffer>(
                `${API_ROUTES.offers}/${id}/status`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            return res.data
        },
        [getAccessTokenSilently]
    )

    const remove = useCallback(async (id: number): Promise<void> => {
        const token = await getAccessTokenSilently()
        await axios.delete(`${API_ROUTES.offers}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }, [getAccessTokenSilently])

    return {
        getAll,
        getById,
        create,
        update,
        updateStatus,
        remove,
    }
}
