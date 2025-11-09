"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChatMessages } from "@/hooks/useChatMessages";
import { Chat, ChatMessage, CreateChatMessageDto, Status } from "@/interfaces/auroraDb";
import { Input } from "@/components/ui/input";
import { ArrowLeft, SendHorizonal, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AxiosError } from "axios";
import { useSocketChat } from "@/hooks/useSocketChat";
import { cn } from "@/lib/utils";
import {useIntl} from "react-intl";
import { ReportDialog } from "./report-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatMessageSchema, ChatMessageData } from "@/lib/validations";

interface Props {
    chat: Chat;
    onClose: () => void;
}

export const TechnicianChatWindow = ({ chat, onClose }: Props) => {
    const { profile } = useAuth();
    const isFinalizing = chat.status === Status.FINALIZADO || chat.status === Status.CALIFICADO;
    const { getAllForChat, create } = useChatMessages();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [showReportDialog, setShowReportDialog] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { formatMessage } = useIntl();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<ChatMessageData>({
        resolver: zodResolver(chatMessageSchema),
        mode: "onChange",
        defaultValues: {
            message: "",
        },
    });

    const newMessage = watch("message");

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

    useSocketChat(
        chat.id,
        (msg) => {
            setMessages((prev) => {
                const exists = prev.some((m) => m.id === msg.id);
                if (exists) return prev;
                return [...prev, msg].sort(
                    (a, b) => Date.parse(a.sent_at) - Date.parse(b.sent_at)
                );
            });
        },
        !!profile
    );

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    const onSendMessage = async (data: ChatMessageData) => {
        if (!profile || isSending) return;

        setIsSending(true);
        try {
            const payload: CreateChatMessageDto = {
                chatId: chat.id,
                message: data.message.trim(),
            };
            await create(payload);
            reset();
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
        <div className="fixed bottom-6 right-6 w-[360px] h-[400px] bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20 z-50 flex flex-col">

            <div className="bg-gradient-to-r from-orange-600/90 to-red-600/90 backdrop-blur-sm text-white px-3 py-2 rounded-t-xl flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm font-semibold truncate flex-1 min-w-0">
                    <ArrowLeft
                        className="w-4 h-4 cursor-pointer hover:scale-110 transition-transform duration-200 flex-shrink-0"
                        onClick={onClose}
                    />
                    <span className="truncate">{chat.client?.name} {chat.client?.last_name}</span>
                </div>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button
                            size="icon"
                            className="h-7 w-7 text-white rounded-md bg-orange-500/80 hover:bg-orange-600/80 backdrop-blur-sm transition-all duration-200 hover:scale-105 flex-shrink-0"
                            onClick={() => setShowReportDialog(true)}
                            disabled={isFinalizing}
                        >
                            <Flag className="w-3 h-3" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white/10 backdrop-blur-md text-white border border-white/20">
                        <p>Reportar chat</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <div className="flex-1 bg-gradient-to-b from-white/5 to-white/10 overflow-y-auto px-3 py-2">
                {isLoading ? (
                    <div className="space-y-3 animate-pulse">
                        {[...Array(5)].map((_, idx) => (
                            <div key={idx} className="h-10 w-3/4 bg-white/20 backdrop-blur-sm rounded-lg" />
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
                                            "max-w-[80%] px-4 py-2 rounded-xl text-sm backdrop-blur-sm",
                                            isMine
                                                ? "bg-gradient-to-r from-orange-500/80 to-red-500/80 text-white self-end rounded-br-none"
                                                : "bg-white/20 text-white self-start rounded-bl-none"
                                        )}
                                    >
                                        {msg.message}
                                    </div>
                                    <span
                                        className={cn(
                                            "text-[10px] text-white/60 mt-1",
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

            <form onSubmit={handleSubmit(onSendMessage)} className="p-3 border-t border-white/10 flex gap-2 items-start bg-white/5 backdrop-blur-sm">
                <div className="flex-1">
                    <Input
                        {...register("message")}
                        placeholder={formatMessage({id: "client_chat_input_placeholder" })}
                        disabled={isFinalizing}
                        className={`text-sm bg-white/20 backdrop-blur-sm border border-white/30 focus:ring-orange-400/50 rounded-lg disabled:opacity-50 text-white placeholder:text-white/70 ${errors.message ? 'border-red-400' : ''}`}
                    />
                    {errors.message && (
                        <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>
                    )}
                </div>
                <Button
                    type="submit"
                    disabled={isFinalizing || !newMessage?.trim()}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-200 rounded-lg px-3 py-2 disabled:opacity-50 hover:scale-105"
                >
                    <SendHorizonal className="w-4 h-4" />
                </Button>
            </form>
            
            <ReportDialog
                isOpen={showReportDialog}
                onClose={() => setShowReportDialog(false)}
                chatId={chat.id}
                reportedUserId={chat.client?.id || 0}
                reportedUserName={`${chat.client?.name} ${chat.client?.last_name}`}
            />
        </div>
    );
};
