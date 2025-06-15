"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages } from "@/hooks/useChatMessages";
import { Chat, ChatMessage, CreateChatMessageDto } from "@/interfaces/auroraDb";
import { Input } from "@/components/ui/input";
import { ArrowLeft, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { useSocketChat } from "@/hooks/useSocketChat";

interface Props {
    chat: Chat;
    onClose: () => void;
}

export const ClientChatWindow = ({ chat, onClose }: Props) => {
    const { profile } = useAuth();
    const { getAllForChat, create } = useChatMessages();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chat?.id || !profile?.id) return;

        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const fetched = await getAllForChat(chat.id);
                const sorted = fetched.sort(
                    (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
                );
                setMessages(sorted);
            } catch (e) {
                console.error("❌ Error al cargar mensajes:", e);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [chat.id, profile?.id, getAllForChat]);

    useSocketChat(chat.id, (msg) => {
        setMessages((prev) => {
            const exists = prev.some((m) => m.id === msg.id);
            if (exists) return prev;
            return [...prev, msg].sort(
                (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
            );
        });
    }, !!profile);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    const handleSend = async () => {
        if (!newMessage.trim() || !profile) return;
        try {
            const payload: CreateChatMessageDto = {
                chat_id: chat.id,
                sender_id: profile.id,
                content: newMessage.trim(),
            };
            const created = await create(payload);
            setMessages((prev) => [...prev, created]);
            setNewMessage("");
        } catch (e) {
            if (e instanceof AxiosError) {
                console.error("❌ Error al enviar mensaje:", e.response?.data);
            } else {
                console.error("❌ Error desconocido:", e);
            }
        }
    };

    return (
        <div className="fixed bottom-6 right-6 w-[360px] h-[400px] bg-white dark:bg-[--neutral-100] shadow-2xl rounded-xl border border-[--primary-default] z-50 flex flex-col">
            {/* Header */}
            <div className="bg-[--secondary-default] text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold truncate">
                    <ArrowLeft
                        className="w-4 h-4 cursor-pointer"
                        onClick={onClose}
                    />
                    Chat con {chat.technician?.user?.name} {chat.technician?.user?.last_name}
                </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 bg-[--neutral-100] overflow-y-auto px-3 py-2">
                {isLoading ? (
                    <div className="space-y-3 animate-pulse">
                        {[...Array(5)].map((_, idx) => (
                            <div key={idx} className="h-10 w-3/4 bg-[--neutral-300] rounded-lg" />
                        ))}
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-2 rounded-lg ${
                                msg.sender_id === profile?.id
                                    ? "bg-[--primary-default] text-white self-end"
                                    : "bg-[--neutral-300] text-[--foreground] self-start"
                            }`}
                        >
                            {msg.content}
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[--neutral-300] flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 text-sm"
                />
                <Button
                    onClick={handleSend}
                    className="bg-[--primary-default] text-white hover:bg-[--primary-hover] active:bg-[--primary-pressed] transition"
                >
                    <SendHorizonal className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
