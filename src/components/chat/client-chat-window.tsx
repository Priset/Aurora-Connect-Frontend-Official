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
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chat?.id || !profile?.id) return;

        let mounted = true;

        const fetchMessages = async () => {
            try {
                const fetched = await getAllForChat(chat.id);
                console.log("📨 Mensajes obtenidos para chat", chat.id, fetched); // DEBUG
                const sorted = fetched.sort(
                    (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
                );
                if (mounted) setMessages(sorted);
            } catch (e) {
                console.error("❌ Error al cargar mensajes:", e);
            }
        };

        // Aseguramos 100ms para esperar perfil/token estable
        const timeout = setTimeout(fetchMessages, 100);

        return () => {
            mounted = false;
            setMessages([]);
            clearTimeout(timeout);
        };
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
        const timeout = setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 30);
        return () => clearTimeout(timeout);
    }, [messages.length]);

    const handleSend = async () => {
        if (!newMessage.trim() || !profile) return;
        try {
            const payload: CreateChatMessageDto = {
                chatId: chat.id,
                senderId: profile.id,
                message: newMessage.trim(),
            };
            const created = await create(payload);
            setMessages((prev) =>
                [...prev, created].sort(
                    (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
                )
            );
            setNewMessage("");
        } catch (e) {
            console.error("❌ Error al enviar:", (e as AxiosError).message);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 w-[360px] h-[400px] bg-white dark:bg-[--neutral-100] shadow-2xl rounded-xl border border-[--primary-default] z-50 flex flex-col">
            {/* Header */}
            <div className="bg-[--secondary-default] text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold truncate">
                    <ArrowLeft
                        onClick={onClose}
                        className="w-4 h-4 cursor-pointer text-white hover:text-[--neutral-200] active:text-[--neutral-400] transition-colors"
                    />
                    {chat.technician?.user?.name} {chat.technician?.user?.last_name}
                </div>
            </div>

            {/* Mensajes */}
            <div className="flex-1 bg-[--neutral-100] overflow-y-auto px-3 py-2" style={{ scrollBehavior: "smooth" }}>
                <div className="flex flex-col gap-1">
                    {messages.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aún no hay mensajes.</p>
                    ) : (
                        <>
                            {messages.map((msg) => {
                                const isClient = profile?.id === msg.sender_id;
                                return (
                                    <div
                                        key={msg.id}
                                        className={`px-4 py-2 rounded-xl text-sm max-w-[80%] whitespace-pre-wrap break-words my-1 ${
                                            isClient
                                                ? "bg-[--secondary-default] text-white self-end ml-auto"
                                                : "bg-[--neutral-300] text-[--foreground] self-start mr-auto"
                                        }`}
                                    >
                                        {msg.message}
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[--neutral-300] flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Escribe un mensaje..."
                    className="text-sm"
                />
                <Button
                    size="icon"
                    onClick={handleSend}
                    className="bg-[--secondary-default] hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] text-white transition-colors"
                >
                    <SendHorizonal className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
