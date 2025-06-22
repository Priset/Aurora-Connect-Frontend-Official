import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Notification } from "@/interfaces/auroraDb";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL!;

export const useSocketNotifications = (
    userId: number | null,
    onNewNotification: (notification: Notification) => void
) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        if (!userId) return;

        const socket = io(SOCKET_URL, { transports: ["websocket"] });

        socket.on("connect", () => {
            console.log("🔔 Conectado al WebSocket de notificaciones");
        });

        socket.on(`notification:${userId}`, (notification: Notification) => {
            console.log("📩 Nueva notificación:", notification);
            onNewNotification(notification);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, [userId, onNewNotification]);
};
