import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { ChatMessage } from "@/interfaces/auroraDb";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL!;

let socket: Socket | null = null;

export const useSocketChat = (
    chatId: number,
    onNewMessage: (msg: ChatMessage) => void,
    enabled: boolean
) => {
    useEffect(() => {
        if (!enabled || !chatId) return;

        if (!socket) {
            socket = io(SOCKET_URL, { transports: ["websocket"] });
        }

        socket.emit("join-chat", chatId);

        socket.on("new-chat-message", (msg: ChatMessage) => {
            if (msg.chat_id === chatId) {
                onNewMessage(msg);
            }
        });

        return () => {
            socket?.off("new-chat-message");
            socket?.emit("leave-chat", chatId);
        };
    }, [chatId, onNewMessage, enabled]);
};
