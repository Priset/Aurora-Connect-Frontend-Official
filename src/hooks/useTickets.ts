import { useCallback } from 'react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import {
  ServiceTicket,
  CreateServiceTicketDto,
  UpdateServiceTicketDto,
} from '@/interfaces/auroraDb'

export const useTickets = () => {
  const getAll = useCallback(async (): Promise<ServiceTicket[]> => {
    const res = await axios.get<ServiceTicket[]>(API_ROUTES.tickets)
    return res.data
  }, [])

  const getById = useCallback(async (id: number): Promise<ServiceTicket> => {
    const res = await axios.get<ServiceTicket>(`${API_ROUTES.tickets}/${id}`)
    return res.data
  }, [])

  const create = useCallback(async (data: CreateServiceTicketDto): Promise<ServiceTicket> => {
    const res = await axios.post<ServiceTicket>(API_ROUTES.tickets, data)
    return res.data
  }, [])

  const createFromRequest = useCallback(async (requestId: number): Promise<ServiceTicket> => {
    const res = await axios.post<ServiceTicket>(`${API_ROUTES.tickets}/from-request/${requestId}`, {})
    return res.data
  }, [])

  const update = useCallback(async (id: number, data: UpdateServiceTicketDto): Promise<ServiceTicket> => {
    const res = await axios.put<ServiceTicket>(`${API_ROUTES.tickets}/${id}`, data)
    return res.data
  }, [])

  const remove = useCallback(async (id: number): Promise<void> => {
    await axios.delete(`${API_ROUTES.tickets}/${id}`)
  }, [])

  return {
    getAll,
    getById,
    create,
    createFromRequest,
    update,
    remove,
  }
}
