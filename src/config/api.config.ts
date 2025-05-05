export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ROUTES = {
    users: `${API_BASE_URL}/api/users`,
    requests: `${API_BASE_URL}/api/service-requests`,
    offers: `${API_BASE_URL}/api/service-offers`,
    reviews: `${API_BASE_URL}/api/reviews`,
    tickets: `${API_BASE_URL}/api/tickets`,
    notifications: `${API_BASE_URL}/api/notifications`,
    chats: `${API_BASE_URL}/api/chats`,
    chatMessages: `${API_BASE_URL}/api/chat-messages`,
    aiSupportChats: `${API_BASE_URL}/api/ai-support-chats`,
    aiSupportMessages: `${API_BASE_URL}/api/ai-support-messages`,
    technicians: `${API_BASE_URL}/api/technician-profiles`,
    auth: `${API_BASE_URL}/api/auth`,
};
