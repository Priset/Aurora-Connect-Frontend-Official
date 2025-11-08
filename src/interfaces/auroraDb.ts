import { IntlShape } from "react-intl";

export interface User {
    id: number;
    auth0_id: string;
    name: string;
    last_name: string;
    email: string;
    role: 'client' | 'technician' | 'admin';
    status: number;
    created_at: string;
    updated_at: string;
}

export interface CreateUserDto {
    auth0_id: string;
    name: string;
    last_name: string;
    email: string;
    role: 'client' | 'technician' | 'admin';
}

export interface UpdateUserDto {
    name?: string;
    last_name?: string;
    email?: string;
    role?: 'client' | 'technician' | 'admin';
    status?: number;
}

export interface TechnicianProfile {
    id: number;
    user_id: number;
    experience?: string;
    years_experience?: number;
    status: number;
    created_at: string;
    updated_at: string;
    user: User;
    service_reviews: ServiceReview[];
}

export interface CreateTechnicianProfileDto {
    experience?: string;
    years_experience: number;
}

export interface UpdateTechnicianProfileDto {
    experience?: string;
    years_experience?: number;
    status?: number;
}

export interface ServiceRequest {
    id: number;
    client_id: number;
    description: string;
    offered_price: number;
    status: number;
    created_at: string;
    updated_at: string;
    client?: {
        name: string;
        last_name: string;
    };
    serviceOffers?: ServiceOffer[];
}

export interface CreateServiceRequestDto {
    client_id: number;
    description: string;
    offeredPrice: number;
}

export interface UpdateServiceRequestDto {
    description?: string;
    offeredPrice?: number;
    status?: number;
}

export interface ServiceOffer {
    id: number;
    request_id: number;
    technician_id: number;
    message?: string;
    proposed_price?: number;
    status: number;
    created_at: string;
    updated_at: string;
    technician: {
        user: User;
    };
}

export interface CreateServiceOfferDto {
    requestId: number;
    message?: string;
    proposedPrice?: number;
}

export interface UpdateServiceOfferDto {
    message?: string;
    proposedPrice?: number;
    status?: number;
}

export interface ServiceReview {
    id: number;
    request_id: number;
    reviewer_id: number;
    technician_id: number;
    comment?: string;
    rating: number;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface CreateServiceReviewDto {
    request_id: number;
    technician_id: number;
    comment?: string;
    rating: number;
    status?: number;
}

export interface UpdateServiceReviewDto {
    comment?: string;
    rating?: number;
    status?: number;
}

export interface ServiceTicket {
    id: number;
    request_id: number;
    status: number;
    created_at: string;
    closed_at?: string;
    updated_at: string;
}

export interface CreateServiceTicketDto {
    request_id: number;
    status?: number;
}

export interface UpdateServiceTicketDto {
    status?: number;
    closed_at?: string;
}

export interface Chat {
    id: number;
    request_id: number;
    client_id: number;
    technician_id: number;
    status: number;
    created_at: string;
    updated_at: string;

    technician?: {
        id: number;
        user_id: number;
        experience?: string;
        years_experience?: number;
        status: number;
        created_at: string;
        updated_at: string;
        user: {
            id: number;
            name: string;
            last_name: string;
        }
    };

    client?: {
        id: number;
        name: string;
        last_name: string;
    };

    messages?: ChatMessage[];
    request?: {
        id: number;
        description: string;
        offered_price: number;
        status: number;
        created_at: string;
    };
}

export interface CreateChatDto {
    request_id: number;
    client_id: number;
    technician_id: number;
    status?: number;
}

export interface UpdateChatDto {
    status?: number;
}

export interface ChatMessage {
    id: number;
    chat_id: number;
    sender_id: number;
    message: string;
    status: number;
    sent_at: string;
    updated_at: string;
}

export interface CreateChatMessageDto {
    chatId: number;
    message: string;
    status?: number;
}

export interface UpdateChatMessageDto {
    message?: string;
    status?: number;
}

export interface AiSupportChat {
    id: number;
    user_id: number;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface CreateAiSupportChatDto {
    status?: number;
}

export interface UpdateAiSupportChatDto {
    status?: number;
}

export interface AiSupportMessage {
    id: number;
    chat_id: number;
    role: 'usuario' | 'asistente';
    content: string;
    status: number;
    sent_at: string;
    updated_at: string;
}

export interface CreateAiSupportMessageDto {
    chat_id: number;
    role: 'usuario' | 'asistente';
    content: string;
    status?: number;
}

export interface UpdateAiSupportMessageDto {
    content?: string;
    status?: number;
}

export interface Notification {
    id: number;
    user_id: number;
    content: string;
    status: number;
    created_at: string;
    updated_at: string;
}

export interface CreateNotificationDto {
    user_id: number;
    content: string;
    status?: number;
}

export interface UpdateNotificationDto {
    content?: string;
    status?: number;
}

export interface RequestDialogProps {
    isOpen: boolean;
    onClose: () => void;
    request: ServiceRequest;
    onActionComplete?: () => void;
}

export interface TechnicianProfileSlideProps {
    isOpen: boolean;
    onClose: () => void;
    technicianId: number;
}

export enum Status {
    DESHABILITADO = 0,
    HABILITADO = 1,
    PENDIENTE = 2,
    RECHAZADO_POR_TECNICO = 3,
    CONTRAOFERTA_POR_TECNICO = 4,
    ACEPTADO_POR_TECNICO = 5,
    RECHAZADO_POR_CLIENTE = 6,
    ACEPTADO_POR_CLIENTE = 7,
    CHAT_ACTIVO = 8,
    FINALIZADO = 9,
    CALIFICADO = 10,
    ELIMINADO = 11,
}

export const getStatusMap = (intl: IntlShape): Record<Status, { label: string; color: string }> => ({
    [Status.DESHABILITADO]: { label: intl.formatMessage({ id: "status_disabled" }), color: "#9CA3AF" },
    [Status.HABILITADO]: { label: intl.formatMessage({ id: "status_enabled" }), color: "#10B981" },
    [Status.PENDIENTE]: { label: intl.formatMessage({ id: "status_pending" }), color: "#F59E0B" },
    [Status.RECHAZADO_POR_TECNICO]: { label: intl.formatMessage({ id: "status_rejected_by_technician" }), color: "#EF4444" },
    [Status.CONTRAOFERTA_POR_TECNICO]: { label: intl.formatMessage({ id: "status_counter_offer_by_technician" }), color: "#6366F1" },
    [Status.ACEPTADO_POR_TECNICO]: { label: intl.formatMessage({ id: "status_accepted_by_technician" }), color: "#3B82F6" },
    [Status.RECHAZADO_POR_CLIENTE]: { label: intl.formatMessage({ id: "status_rejected_by_client" }), color: "#F87171" },
    [Status.ACEPTADO_POR_CLIENTE]: { label: intl.formatMessage({ id: "status_accepted_by_client" }), color: "#34D399" },
    [Status.CHAT_ACTIVO]: { label: intl.formatMessage({ id: "status_chat_active" }), color: "#0EA5E9" },
    [Status.FINALIZADO]: { label: intl.formatMessage({ id: "status_finished" }), color: "#8B5CF6" },
    [Status.CALIFICADO]: { label: intl.formatMessage({ id: "status_rated" }), color: "#948f10" },
    [Status.ELIMINADO]: { label: intl.formatMessage({ id: "status_deleted" }), color: "#6B7280" },
});
