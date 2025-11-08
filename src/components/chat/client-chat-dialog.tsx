"use client";

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
import {useCallback, useEffect, useState} from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChats } from "@/hooks/useChats";
import { Chat, Status } from "@/interfaces/auroraDb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {MessageCircle, Trash2, XIcon} from "lucide-react";
import { ClientChatWindow } from "@/components/chat/client-chat-window";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ReviewDialog } from "@/components/review/review-dialog";
import { useIntl } from "react-intl";

interface Props {
    isOpen: boolean;
    onCloseAction: () => void;
}

export const ClientChatDialog = ({ isOpen, onCloseAction }: Props) => {
    const { getAll } = useChats();
    const { profile } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [filtered, setFiltered] = useState<Chat[]>([]);
    const [search, setSearch] = useState("");
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [chatKey, setChatKey] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChatForReview, setSelectedChatForReview] = useState<Chat | null>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const { remove } = useChats();
    const { formatMessage } = useIntl();

    const refreshChats = useCallback(async () => {
        if (!profile?.id) return;
        try {
            const all = await getAll();
            const myChats = all.filter(
                (chat) =>
                    chat.client_id === profile.id &&
                    (chat.status === Status.CHAT_ACTIVO || chat.status === Status.FINALIZADO || chat.status === Status.CALIFICADO)
            );
            setChats(myChats);
            setFiltered(myChats);
        } catch (err) {
            console.error("❌ Error al refrescar chats:", err);
        }
    }, [getAll, profile?.id]);

    useEffect(() => {
        if (!isOpen || !profile?.id) return;
        setIsLoading(true);
        refreshChats().finally(() => setIsLoading(false));
    }, [isOpen, profile?.id, refreshChats]);

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
        <>
            {!activeChat && (
                <div className="fixed bottom-6 right-6 w-[360px] h-[400px] bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 z-50 flex flex-col overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 backdrop-blur-sm text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-semibold truncate">
                        <MessageCircle className="w-4 h-4" />
                        {formatMessage({ id: "client_chat_title" })}
                    </div>
                    <button
                        onClick={onCloseAction}
                        aria-label="Cerrar"
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                    >
                        <XIcon className="w-4 h-4 text-white" />
                    </button>
                </div>

                <div className="px-4 py-3 border-b border-white/10">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={formatMessage({ id: "client_chat_search_placeholder" })}
                        className="text-sm bg-white/20 backdrop-blur-sm border-white/30 placeholder:text-white/70 focus:ring-blue-400/50 rounded-lg text-white"
                    />
                </div>

                {isLoading ? (
                    <div className="flex-1 px-4 py-3 space-y-3 animate-pulse">
                        {[...Array(3)].map((_, idx) => (
                            <div key={idx} className="h-12 bg-white/20 backdrop-blur-sm rounded-lg" />
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
                                    : formatMessage({ id: "client_chat_no_messages" });

                                return (
                                    <div
                                        key={chat.id}
                                        onClick={() => {
                                            setActiveChat(chat);
                                            setChatKey((prev) => prev + 1);
                                        }}
                                        className={cn(
                                            "p-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg cursor-pointer hover:bg-white/30 hover:scale-[1.02] transition-all duration-200 mb-2 relative",
                                            activeChat?.id === chat.id &&
                                            "border-blue-400/50 ring-1 ring-blue-400/30 bg-white/30"
                                        )}
                                    >
                                        <p className="text-sm font-semibold text-white">
                                            {chat.technician?.user?.name}{" "}
                                            {chat.technician?.user?.last_name}
                                        </p>
                                        <p className="text-xs text-white/70 truncate">
                                            {lastMessage ? lastMessage.message.slice(0, 60) + (lastMessage.message.length > 60 ? "..." : "") : formatMessage({ id: "client_chat_no_messages" })}
                                        </p>
                                        <p className="text-[10px] text-white/60 mt-1">
                                            {formatMessage({ id: "client_chat_last_message_label" })} {formattedTime}
                                        </p>

                                        {chat.status === Status.FINALIZADO && (
                                            <Button
                                                className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-md hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:scale-105"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedChatForReview(chat);
                                                    setIsReviewOpen(true);
                                                }}
                                            >
                                                {formatMessage({ id: "client_chat_button_review" })}
                                            </Button>
                                        )}

                                        {chat.status === Status.CALIFICADO && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute top-3 right-3 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 hover:scale-105"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="max-w-sm">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>
                                                            {formatMessage({ id: "client_chat_delete_title" })}
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            {formatMessage({ id: "client_chat_delete_description" })}
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>
                                                            {formatMessage({ id: "client_chat_delete_cancel" })}
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={async () => {
                                                                try {
                                                                    await remove(chat.id);
                                                                    refreshChats();
                                                                    toast.success(formatMessage({ id: "client_chat_deleted_success" }));
                                                                } catch (err) {
                                                                    console.error("❌ Error al eliminar chat:", err);
                                                                    toast.error(formatMessage({ id: "client_chat_deleted_error" }));
                                                                }
                                                            }}
                                                        >
                                                            {formatMessage({ id: "client_chat_delete_confirm" })}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-white/70 text-center mt-4">
                                {formatMessage({ id: "client_chat_empty" })}
                            </p>
                        )}
                    </ScrollArea>
                )}

                </div>
            )}

            {activeChat && (
                <ClientChatWindow
                    key={chatKey}
                    chat={activeChat}
                    onClose={() => {
                        setActiveChat(null);
                        refreshChats();
                    }}
                />
            )}

            {selectedChatForReview && (
                <ReviewDialog
                    isOpen={isReviewOpen}
                    chat={selectedChatForReview}
                    onClose={() => {
                        setIsReviewOpen(false);
                        setSelectedChatForReview(null);
                        refreshChats();
                    }}
                />
            )}
        </>
    );
};
