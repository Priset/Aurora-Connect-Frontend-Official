"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChats";
import { Chat, Status } from "@/interfaces/auroraDb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MessageCircle, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TechnicianChatWindow } from "@/components/chat/technician-chat-window";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const TechnicianChatDialog = ({ isOpen, onClose }: Props) => {
    const { getAll } = useChats();
    const { profile } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [filtered, setFiltered] = useState<Chat[]>([]);
    const [search, setSearch] = useState("");
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [chatKey, setChatKey] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const { remove } = useChats();

    const refreshChats = async () => {
        if (!profile?.technicianProfile?.id) return;
        try {
            const all = await getAll();
            const myChats = all.filter(
                (chat) =>
                    chat.technician_id === profile.technicianProfile!.id &&
                    [Status.CHAT_ACTIVO, Status.FINALIZADO, Status.CALIFICADO].includes(chat.status)
            );
            setChats(myChats);
            setFiltered(myChats);

        } catch (err) {
            console.error("❌ Error al refrescar chats:", err);
        }
    };

    useEffect(() => {
        if (!isOpen || !profile?.technicianProfile?.id) return;
        setIsLoading(true);
        refreshChats().finally(() => setIsLoading(false));
    }, [isOpen, profile?.technicianProfile?.id]);

    useEffect(() => {
        const lowerSearch = search.toLowerCase();
        const filteredChats = chats.filter((chat) =>
            chat.client?.name?.toLowerCase().includes(lowerSearch) ||
            chat.client?.last_name?.toLowerCase().includes(lowerSearch)
        );
        setFiltered(filteredChats);
    }, [search, chats]);

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-6 right-6 w-[360px] h-[400px] bg-white dark:bg-[--neutral-100] shadow-2xl rounded-xl border border-[--primary-default] z-50 flex flex-col overflow-hidden">
            <div className="bg-[--secondary-default] text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold truncate">
                    <MessageCircle className="w-4 h-4" />
                    Chats Activos
                </div>
                <button
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                    <XIcon className="w-4 h-4 text-white" />
                </button>
            </div>

            <div className="px-4 py-3 border-b border-[--neutral-300]">
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar cliente..."
                    className="text-sm bg-[--neutral-200] border-[--neutral-300] placeholder:text-[--neutral-600] focus:ring-[--secondary-default] rounded-lg"
                />
            </div>

            {isLoading ? (
                <div className="flex-1 px-4 py-3 space-y-3 animate-pulse">
                    {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="h-12 bg-[--neutral-300] rounded-lg" />
                    ))}
                </div>
            ) : (
                <ScrollArea className="flex-1 px-4 py-2">
                    {filtered.length > 0 ? (
                        filtered.map((chat) => {
                            const lastMessage = chat.messages?.[chat.messages.length - 1];
                            const formattedTime = lastMessage
                                ? new Date(lastMessage.sent_at).toLocaleTimeString("es-BO", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "Sin mensajes";

                            return (
                                <div
                                    key={chat.id}
                                    onClick={() => {
                                        setActiveChat(chat);
                                        setChatKey((prev) => prev + 1);
                                    }}
                                    className={cn(
                                        "p-3 bg-neutral-300 border border-[--neutral-300] rounded-lg cursor-pointer hover:shadow-sm transition-all mb-2 relative",
                                        activeChat?.id === chat.id &&
                                        "border-[--secondary-default] ring-1 ring-[--secondary-default]"
                                    )}
                                >
                                    <p className="text-sm font-semibold text-[--primary-default]">
                                        {chat.client?.name} {chat.client?.last_name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {lastMessage
                                            ? lastMessage.message.slice(0, 60) +
                                            (lastMessage.message.length > 60 ? "..." : "")
                                            : "Sin mensajes"}
                                    </p>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                        Último mensaje: {formattedTime}
                                    </p>

                                    {[Status.FINALIZADO, Status.CALIFICADO].includes(chat.status) && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-3 right-3 text-[--error] hover:bg-[--error-hover] active:bg-error-pressed"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="max-w-sm">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Eliminar chat?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción eliminará el chat de forma permanente. No se puede
                                                        deshacer.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={async () => {
                                                            try {
                                                                await remove(chat.id);
                                                                refreshChats();
                                                                toast.success("Chat eliminado correctamente.");
                                                            } catch (err) {
                                                                console.error("❌ Error al eliminar chat:", err);
                                                                toast.error("Error al eliminar el chat. Intenta de nuevo.");
                                                            }
                                                        }}
                                                    >
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-sm text-muted-foreground text-center mt-4">
                            No se encontraron chats.
                        </p>
                    )}
                </ScrollArea>
            )}

            {activeChat && (
                <TechnicianChatWindow
                    key={chatKey}
                    chat={activeChat}
                    onClose={() => {
                        setActiveChat(null);
                        refreshChats();
                    }}
                />
            )}
        </div>
    );
};
