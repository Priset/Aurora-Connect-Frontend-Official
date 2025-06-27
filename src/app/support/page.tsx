'use client';

import { useEffect, useRef, useState } from 'react';
import { useAiSupportChats } from '@/hooks/useAiSupportChats';
import { useAiSupportMessages } from '@/hooks/useAiSupportMessages';
import { MessageBubble } from '@/components/support/message-bubble';
import { MessageInput } from '@/components/support/message-input';
import { Loader } from '@/components/ui/loader';
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

                if (!activeChat) {
                    activeChat = await createChat({ user_id: profile.id });
                }

                setChatId(activeChat.id);

                const loadedMessages = await getByChatId(activeChat.id);
                setMessages(loadedMessages);
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
            <h1 className="text-2xl font-display font-bold text-neutral-100">
                ¡Hola! Soy Aurora, tu asistente de soporte técnico
            </h1>

            <div className="bg-neutral-200 border border-[--neutral-300] rounded-2xl shadow-lg p-6 w-full flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
                {loading ? (
                    <div className="w-full flex justify-center items-center py-10">
                        <Loader />
                    </div>
                ) : (
                    messages.map((msg, idx) => (
                        <MessageBubble key={idx} role={msg.role} content={msg.content} />
                    ))
                )}
                <div ref={bottomRef} />

                {isTyping && (
                    <div className="flex items-start gap-2 bg-[--neutral-100] text-[--foreground] w-fit px-4 py-2 rounded-lg animate-pulse">
                        Aurora está escribiendo...<span className="dot-typing ml-2" />
                    </div>
                )}
            </div>

            <div className="w-full bg-neutral-200 border border-[--neutral-300] rounded-2xl shadow-lg p-4">
                <MessageInput onSend={handleSend} disabled={!chatId || loading} />
            </div>
        </div>
    );
}
