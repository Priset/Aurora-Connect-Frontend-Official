"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChats";
import { Chat, Status } from "@/interfaces/auroraDb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {MessageCircle, XIcon} from "lucide-react";
import { ClientChatWindow } from "@/components/chat/client-chat-window";
import { Button } from "@/components/ui/button";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const ClientChatDialog = ({ isOpen, onClose }: Props) => {
    const { getAll } = useChats();
    const { profile } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [filtered, setFiltered] = useState<Chat[]>([]);
    const [search, setSearch] = useState("");
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [chatKey, setChatKey] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !profile) return;

        const loadChats = async () => {
            setIsLoading(true);
            try {
                const all = await getAll();
                const myChats = all.filter(
                    (chat) =>
                        chat.client_id === profile.id &&
                        chat.status === Status.CHAT_ACTIVO
                );
                setChats(myChats);
                setFiltered(myChats);
            } catch (err) {
                console.error("❌ Error al obtener chats activos:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadChats();
    }, [getAll, isOpen, profile]);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        const filteredChats = chats.filter((chat) =>
            chat.technician?.user?.name.toLowerCase().includes(lowerSearch) ||
            chat.technician?.user?.last_name.toLowerCase().includes(lowerSearch)
        );
        setFiltered(filteredChats);
    }, [search, chats]);

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 w-[360px] h-[400px] bg-white dark:bg-[--neutral-100] shadow-2xl rounded-xl border border-[--primary-default] z-50 flex flex-col">
            <div className="bg-[--secondary-default] text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold truncate">
                    <MessageCircle className="w-4 h-4" />
                    Chats Activos
                </div>
                <Button
                    size="icon"
                    onClick={onClose}
                    className="bg-secondary-light hover:bg-[--secondary-hover] text-[--foreground] transition"
                >
                    <XIcon className="w-4 h-4" />
                </Button>
            </div>

            {isLoading ? (
                <div className="flex-1 px-4 py-3 space-y-3 animate-pulse">
                    {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="h-12 bg-[--neutral-300] rounded-lg" />
                    ))}
                </div>
            ) : (
                <ScrollArea className="flex-1 px-4 py-3">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar técnico..."
                        className="mb-3 text-sm"
                    />
                    {filtered.length > 0 ? (
                        filtered.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => {
                                    setActiveChat(chat);
                                    setChatKey((prev) => prev + 1);
                                }}
                                className="p-3 bg-white border border-[--neutral-300] rounded-lg cursor-pointer hover:shadow-md transition"
                            >
                                <p className="text-sm font-semibold">
                                    {chat.technician?.user?.name} {chat.technician?.user?.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Último mensaje: {new Date(chat.updated_at).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">No se encontraron chats.</p>
                    )}
                </ScrollArea>
            )}

            {activeChat && (
                <ClientChatWindow
                    key={chatKey}
                    chat={activeChat}
                    onClose={() => setActiveChat(null)}
                />
            )}
        </div>
    );
};
