import { useCallback } from 'react';
import axios from 'axios';
import { API_ROUTES } from '@/config/api.config';
import {
  ServiceTicket,
  CreateServiceTicketDto,
  UpdateServiceTicketDto,
} from '@/interfaces/auroraDb';
import { useAuthHeaders } from './useAuthHeaders';

export const useTickets = () => {
  const getHeaders = useAuthHeaders();

  const getAll = useCallback(async (): Promise<ServiceTicket[]> => {
    const res = await axios.get<ServiceTicket[]>(API_ROUTES.tickets, await getHeaders());
    return res.data;
  }, [getHeaders]);

  const getById = useCallback(async (id: number): Promise<ServiceTicket> => {
    const res = await axios.get<ServiceTicket>(`${API_ROUTES.tickets}/${id}`, await getHeaders());
    return res.data;
  }, [getHeaders]);

  const create = useCallback(
      async (data: CreateServiceTicketDto): Promise<ServiceTicket> => {
        const res = await axios.post<ServiceTicket>(API_ROUTES.tickets, data, await getHeaders());
        return res.data;
      },
      [getHeaders]
  );

  const createFromRequest = useCallback(
      async (requestId: number): Promise<ServiceTicket> => {
        const res = await axios.post<ServiceTicket>(
            `${API_ROUTES.tickets}/from-request/${requestId}`,
            {},
            await getHeaders()
        );
        return res.data;
      },
      [getHeaders]
  );

  const update = useCallback(
      async (id: number, data: UpdateServiceTicketDto): Promise<ServiceTicket> => {
        const res = await axios.put<ServiceTicket>(`${API_ROUTES.tickets}/${id}`, data, await getHeaders());
        return res.data;
      },
      [getHeaders]
  );

  const remove = useCallback(async (id: number): Promise<void> => {
    await axios.delete(`${API_ROUTES.tickets}/${id}`, await getHeaders());
  }, [getHeaders]);

  return {
    getAll,
    getById,
    create,
    createFromRequest,
    update,
    remove,
  };
};
