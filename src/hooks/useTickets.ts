import { useCallback } from 'react';
import axios from 'axios';
import { useAuthHeaders } from './useAuthHeaders';

export interface Ticket {
    id: number;
    request_id: number;
    status: number;
    closed_at?: string;
    created_at: string;
    updated_at: string;
    request?: {
        id: number;
        description: string;
        offered_price: number;
        status: number;
        created_at: string;
        client?: {
            id: number;
            name: string;
            last_name: string;
        };
    };
}

export interface CreateTicketDto {
    requestId: number;
    status?: number;
    closedAt?: string;
}

export const useTickets = () => {
    const getHeaders = useAuthHeaders();

    const getAll = useCallback(async (): Promise<Ticket[]> => {
        const res = await axios.get<Ticket[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets`, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const getById = useCallback(async (id: number): Promise<Ticket> => {
        const res = await axios.get<Ticket>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${id}`, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const create = useCallback(async (data: CreateTicketDto): Promise<Ticket> => {
        const res = await axios.post<Ticket>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets`, data, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const createFromRequest = useCallback(async (requestId: number): Promise<Ticket> => {
        const res = await axios.post<Ticket>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/from-request/${requestId}`, {}, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const updateStatus = useCallback(async (id: number, status: number): Promise<Ticket> => {
        const res = await axios.patch<Ticket>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tickets/${id}/status`, { status }, await getHeaders());
        return res.data;
    }, [getHeaders]);

    return {
        getAll,
        getById,
        create,
        createFromRequest,
        updateStatus,
    };
};
