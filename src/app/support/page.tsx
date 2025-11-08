'use client';

import { useEffect, useRef, useState } from 'react';
import { useAiSupportChats } from '@/hooks/useAiSupportChats';
import { useAiSupportMessages } from '@/hooks/useAiSupportMessages';
import { MessageBubble } from '@/components/support/message-bubble';
import { MessageInput } from '@/components/support/message-input';

import { AiSupportMessage } from '@/interfaces/auroraDb';
import { useAuth } from '@/hooks/useAuth';

export default function SupportPage() {
    const [loading, setLoading] = useState(true);
    const [chatId, setChatId] = useState<number | null>(null);
    const [messages, setMessages] = useState<AiSupportMessage[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { profile } = useAuth();
    const { getAll: getChats, create: createChat } = useAiSupportChats();
    const { getByChatId, chatWithAI } = useAiSupportMessages();
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!profile?.id) return;

        const initializeChat = async () => {
            setLoading(true);
            try {
                const chats = await getChats();
                let activeChat = chats[0];
                let isNewChat = false;

                if (!activeChat) {
                    activeChat = await createChat({});
                    isNewChat = true;
                }

                setChatId(activeChat.id);

                const loadedMessages = await getByChatId(activeChat.id);
                
                if (isNewChat && loadedMessages.length === 0) {
                    const welcomeMessage: AiSupportMessage = {
                        id: -999,
                        chat_id: activeChat.id,
                        content: '¡Hola! 👋 Soy **Aurora**, tu asistente virtual de soporte para Aurora Connect.\n\nEstoy aquí para ayudarte con:\n- Dudas sobre cómo usar la plataforma\n- Sugerencias de precios para servicios técnicos\n- Información sobre funcionalidades\n\n¿En qué puedo ayudarte hoy?',
                        role: 'asistente',
                        status: 1,
                        sent_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };
                    setMessages([welcomeMessage]);
                } else {
                    setMessages(loadedMessages);
                }
            } catch (err) {
                console.error('Error al cargar el chat de soporte:', err);
            } finally {
                setLoading(false);
            }
        };

        initializeChat();
    }, [profile?.id, getChats, createChat, getByChatId]);

    useEffect(() => {
        if (!loading) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading]);

    const handleSend = async (content: string) => {
        if (!chatId) return;

        const userMessage: AiSupportMessage = {
            id: -1,
            chat_id: chatId,
            content,
            role: 'usuario',
            status: 1,
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);

        try {
            const response = await chatWithAI(chatId, content);
            const aiMessage: AiSupportMessage = {
                id: -2,
                chat_id: chatId,
                content: response,
                role: 'asistente',
                status: 1,
                sent_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            console.error('Error al enviar mensaje a la IA:', err);
        } finally {
            setIsTyping(false);
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full flex flex-col gap-8">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-2xl font-display font-bold text-white">
                        ¡Hola! Soy Aurora
                    </h1>
                    <p className="text-white/70 text-sm">
                        Tu asistente de soporte técnico inteligente
                    </p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6 w-full flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
                {loading ? (
                    <div className="w-full flex justify-center items-center py-10">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-[--secondary-default]/10 rounded-full">
                                <svg className="w-8 h-8 text-[--secondary-default] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <p className="text-white/70 text-sm">Iniciando conversación...</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <MessageBubble key={idx} role={msg.role} content={msg.content} />
                    ))
                )}
                <div ref={bottomRef} />

                {isTyping && (
                    <div className="flex items-start gap-3 bg-white/10 backdrop-blur-sm text-white w-fit px-4 py-3 rounded-lg border border-white/20">
                        <div className="p-1 bg-[--secondary-default]/20 rounded-full">
                            <svg className="w-4 h-4 text-[--secondary-default]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Aurora</span>
                            <span className="text-xs text-white/60">está escribiendo<span className="dot-typing ml-1" /></span>
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-4">
                <MessageInput onSend={handleSend} disabled={!chatId || loading} />
            </div>
        </div>
    );
}
