import { useCallback } from "react";
import axios from "axios";
import { API_ROUTES } from "@/config/api.config";
import {
    TechnicianProfile,
    CreateTechnicianProfileDto,
    UpdateTechnicianProfileDto,
} from "@/interfaces/auroraDb";
import { useAuth0 } from "@auth0/auth0-react";

export const useTechnicians = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getAll = useCallback(async (): Promise<TechnicianProfile[]> => {
        const res = await axios.get<TechnicianProfile[]>(API_ROUTES.technicians);
        return res.data;
    }, []);

    const getById = useCallback(async (id: number): Promise<TechnicianProfile> => {
        const token = await getAccessTokenSilently();
        const res = await axios.get<TechnicianProfile>(`${API_ROUTES.technicians}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }, [getAccessTokenSilently]);

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
        const token = await getAccessTokenSilently();
        const res = await axios.post<TechnicianProfile>(API_ROUTES.technicians, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }, [getAccessTokenSilently]);

    const update = useCallback(async (id: number, data: UpdateTechnicianProfileDto): Promise<TechnicianProfile> => {
        const token = await getAccessTokenSilently();
        const res = await axios.patch<TechnicianProfile>(`${API_ROUTES.technicians}/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }, [getAccessTokenSilently]);

    const remove = useCallback(async (id: number): Promise<void> => {
        const token = await getAccessTokenSilently();
        await axios.delete(`${API_ROUTES.technicians}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }, [getAccessTokenSilently]);

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
