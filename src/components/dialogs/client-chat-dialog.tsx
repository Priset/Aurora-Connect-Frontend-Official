"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChats";
import { Chat, Status } from "@/interfaces/auroraDb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MessageCircle } from "lucide-react";
import { ClientChatWindow } from "@/components/chat/client-chat-window";
import {Button} from "@/components/ui/button";

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

    useEffect(() => {
        if (!isOpen || !profile) return;

        const loadChats = async () => {
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
            }
        };

        loadChats();
    }, [getAll, isOpen, profile]);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        const filteredChats = chats.filter((chat) =>
            `${chat.technician?.user?.name || ""} ${chat.technician?.user?.last_name || ""}`
                .toLowerCase()
                .includes(lowerSearch)
        );
        setFiltered(filteredChats);
    }, [search, chats]);

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 w-[360px] h-[400px] bg-white dark:bg-[--neutral-100] shadow-2xl rounded-xl border border-[--primary-default] z-50 flex flex-col">
            {activeChat ? (
                <>
                    <ClientChatWindow
                        key={`chat-${chatKey}`}
                        chat={activeChat}
                        onClose={() => {
                            setActiveChat(null);
                            setChatKey(Date.now());
                        }}
                    />
                </>
            ) : (
                <>
                    <div className="bg-[--primary-default] text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            <h2 className="font-semibold text-sm">Tus chats activos</h2>
                        </div>
                        <Button
                            onClick={onClose}
                            className="text-white hover:text-[--neutral-200] active:text-[--neutral-400] transition-colors text-lg font-bold"
                        >
                            &times;
                        </Button>
                    </div>

                    <div className="p-3 border-b border-[--neutral-300]">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por técnico..."
                            className="text-sm"
                        />
                    </div>

                    <ScrollArea className="flex-1 p-3 space-y-2 bg-[--neutral-100] overflow-y-auto">
                        {filtered.length === 0 ? (
                            <p className="text-sm text-muted-foreground px-2 py-3">
                                No se encontraron chats.
                            </p>
                        ) : (
                            <ul className="space-y-2 pt-2">
                                {filtered.map((chat) => {
                                    const technicianName = `${chat.technician?.user?.name || "Técnico"} ${chat.technician?.user?.last_name || ""}`;
                                    const lastMessage = chat.messages?.[0]?.message || "Sin mensajes aún.";
                                    return (
                                        <li
                                            key={chat.id}
                                            className="rounded-lg px-4 py-3 bg-[--neutral-300] hover:bg-[--neutral-600] cursor-pointer transition text-[--foreground]"
                                            onClick={() => {
                                                setActiveChat(null);
                                                setTimeout(() => {
                                                    setChatKey(Date.now());
                                                    setActiveChat({ ...chat });
                                                }, 0);
                                            }}
                                        >
                                            <div className="font-medium text-sm truncate">{technicianName}</div>
                                            <div className="text-xs text-neutral-900 truncate">{lastMessage}</div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </ScrollArea>
                </>
            )}
        </div>
    );
};
