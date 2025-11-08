import { useCallback } from 'react';
import axios from 'axios';
import { useAuthHeaders } from './useAuthHeaders';

export interface CreateReportDto {
    chatId: number;
    reportedUserId: number;
    reason: 'harassment' | 'inappropriate_language' | 'unprofessional_behavior' | 'other';
    description: string;
}

export interface Report {
    id: number;
    content: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export const useReports = () => {
    const getHeaders = useAuthHeaders();

    const create = useCallback(async (data: CreateReportDto) => {
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`, data, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const getAll = useCallback(async (): Promise<Report[]> => {
        const res = await axios.get<Report[]>(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reports`, await getHeaders());
        return res.data;
    }, [getHeaders]);

    return {
        create,
        getAll,
    };
};