import { useCallback } from "react";
import axios from "axios";
import { API_ROUTES } from "@/config/api.config";
import {
    TechnicianProfile,
    CreateTechnicianProfileDto,
    UpdateTechnicianProfileDto,
} from "@/interfaces/auroraDb";
import { useAuthHeaders } from "./useAuthHeaders";

export const useTechnicians = () => {
    const getHeaders = useAuthHeaders();

    const getAll = useCallback(async (): Promise<TechnicianProfile[]> => {
        const res = await axios.get<TechnicianProfile[]>(API_ROUTES.technicians, await getHeaders());
        return res.data;
    }, [getHeaders]);

    const getById = useCallback(async (id: number): Promise<TechnicianProfile> => {
        const res = await axios.get<TechnicianProfile>(
            `${API_ROUTES.technicians}/${id}`,
            await getHeaders()
        );
        return res.data;
    }, [getHeaders]);

    const getAllPublic = useCallback(async (): Promise<TechnicianProfile[]> => {
        const res = await axios.get<TechnicianProfile[]>(API_ROUTES.techniciansPublic);
        return res.data;
    }, []);

    const getPublicById = useCallback(async (id: number): Promise<TechnicianProfile> => {
        const res = await axios.get<TechnicianProfile>(`${API_ROUTES.techniciansPublic}/${id}`, {
            withCredentials: false,
        });
        return res.data;
    }, []);

    const create = useCallback(async (data: CreateTechnicianProfileDto): Promise<TechnicianProfile> => {
        const res = await axios.post<TechnicianProfile>(
            API_ROUTES.technicians,
            data,
            await getHeaders()
        );
        return res.data;
    }, [getHeaders]);

    const update = useCallback(async (id: number, data: UpdateTechnicianProfileDto): Promise<TechnicianProfile> => {
        const res = await axios.patch<TechnicianProfile>(
            `${API_ROUTES.technicians}/${id}`,
            data,
            await getHeaders()
        );
        return res.data;
    }, [getHeaders]);

    const remove = useCallback(async (id: number): Promise<void> => {
        await axios.delete(`${API_ROUTES.technicians}/${id}`, await getHeaders());
    }, [getHeaders]);

    return {
        getAll,
        getById,
        getAllPublic,
        getPublicById,
        create,
        update,
        remove,
    };
};
