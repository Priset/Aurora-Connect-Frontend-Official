"use client";

import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from "@/components/ui/alert-dialog";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useRequests } from "@/hooks/useRequests";
import { Chat, ChatMessage, CreateChatMessageDto, Status } from "@/interfaces/auroraDb";
import { Input } from "@/components/ui/input";
import { ArrowLeft, SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";
import { useSocketChat } from "@/hooks/useSocketChat";
import {cn} from "@/lib/utils";
import { useIntl } from "react-intl";

interface Props {
    chat: Chat;
    onClose: () => void;
}

export const ClientChatWindow = ({ chat, onClose }: Props) => {
    const { profile } = useAuth();
    const isFinalizing = chat.status === Status.FINALIZADO || chat.status === Status.CALIFICADO;
    const { getAllForChat, create } = useChatMessages();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showDialog, setShowDialog] = useState(false);
    const { finalizeRequest } = useRequests();
    const { formatMessage } = useIntl();

    useEffect(() => {
        if (!chat?.id || !profile?.id) return;

        const fetchMessages = async () => {
            setIsLoading(true);
            try {
                const fetched = await getAllForChat(chat.id);
                const sorted = fetched.sort(
                    (a, b) => Date.parse(a.sent_at) - Date.parse(b.sent_at)
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
                (a, b) => Date.parse(a.sent_at) - Date.parse(b.sent_at)
            );
        });
    }, !!profile);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    const handleSend = async () => {
        if (!newMessage.trim() || !profile || isSending) return;

        setIsSending(true);
        try {
            const payload: CreateChatMessageDto = {
                chatId: chat.id,
                senderId: profile.id,
                message: newMessage.trim(),
            };
            await create(payload);
            setNewMessage("");
        } catch (e) {
            if (e instanceof AxiosError) {
                console.error("❌ Error al enviar mensaje:", e.response?.data);
            } else {
                console.error("❌ Error desconocido:", e);
            }
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 w-[360px] h-[400px] bg-white dark:bg-[--neutral-100] shadow-2xl rounded-xl border border-[--primary-default] z-50 flex flex-col">
            <div className="bg-[--secondary-default] text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold truncate">
                    <ArrowLeft
                        className="w-4 h-4 cursor-pointer"
                        onClick={onClose}
                    />
                    {formatMessage({id: "client_chat_with" })} {chat.technician?.user?.name} {chat.technician?.user?.last_name}
                </div>
                <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                    <AlertDialogTrigger asChild>
                        <Button
                            className="text-neutral-950 text-xs font-medium px-3 py-1 rounded-md bg-error hover:bg-error-hover active:bg-error-pressed transition-colors"
                            onClick={() => setShowDialog(true)}
                        >
                            {formatMessage({id: "client_chat_finalize_button" })}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white dark:bg-[--neutral-100]">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-[--primary-default]">
                                {formatMessage({id: "client_chat_finalize_title" })}
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <p className="text-sm text-muted-foreground">
                            {formatMessage({id: "client_chat_finalize_description" })}
                        </p>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="rounded-md bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 transition-colors">
                                {formatMessage({id: "client_chat_cancel" })}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async () => {
                                    try {
                                        setShowDialog(false);

                                        await finalizeRequest(chat.request_id);

                                        setTimeout(onClose, 400);
                                    } catch (e) {
                                        console.error("❌ Error al finalizar:", e);
                                    }
                                }}
                                className="bg-error text-white hover:bg-error-hover active:bg-error-pressed rounded-md"
                            >
                                {formatMessage({id: "client_chat_finalize_button" })}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>


            <div className="flex-1 bg-[--neutral-100] overflow-y-auto px-3 py-2">
                {isLoading ? (
                    <div className="space-y-3 animate-pulse">
                        {[...Array(5)].map((_, idx) => (
                            <div key={idx} className="h-10 w-3/4 bg-[--neutral-300] rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {messages.map((msg) => {
                            const isMine = msg.sender_id === profile?.id;
                            const formattedTime = new Date(msg.sent_at).toLocaleTimeString("es-BO", {
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            return (
                                <div key={msg.id} className="flex flex-col">
                                    <div
                                        className={cn(
                                            "max-w-[80%] px-4 py-2 rounded-xl text-sm",
                                            isMine
                                                ? "bg-[--primary-default] text-white self-end rounded-br-none"
                                                : "bg-[--neutral-300] text-[--foreground] self-start rounded-bl-none"
                                        )}
                                    >
                                        {msg.message}
                                    </div>
                                    <span
                                        className={cn(
                                            "text-[10px] text-muted-foreground mt-1",
                                            isMine ? "self-end pr-1" : "self-start pl-1"
                                        )}
                                    >
                                        {formattedTime}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-[--neutral-300] flex gap-2 items-center bg-white dark:bg-[--neutral-100]">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={formatMessage({id: "client_chat_input_placeholder" })}
                    disabled={isFinalizing}
                    className="flex-1 text-sm bg-[--neutral-200] border border-[--neutral-300] focus:ring-[--secondary-default] rounded-lg disabled:opacity-50"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                />
                <Button
                    onClick={handleSend}
                    disabled={isFinalizing}
                    className="bg-[--secondary-default] text-white hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] transition rounded-lg px-3 py-2 disabled:opacity-50"
                >
                    <SendHorizonal className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
};
