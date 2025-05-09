import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import {ServiceRequest} from "@/interfaces/auroraDb";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;

export const useSocket = (
    onNewRequest: (data: ServiceRequest) => void,
    onRequestUpdated: (data: ServiceRequest) => void
) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const socket = io(SOCKET_URL, { transports: ["websocket"] });

        socket.on("connect", () => {
            console.log("✅ Conectado al WebSocket");
        });

        socket.on("new-service-request", (data) => {
            console.log("🆕 Nueva solicitud:", data);
            onNewRequest(data);
        });

        socket.on("service-request-updated", (data) => {
            console.log("🔄 Solicitud actualizada:", data);
            onRequestUpdated(data);
        });

        socketRef.current = socket;

        return () => {
            socket.disconnect();
        };
    }, [onNewRequest, onRequestUpdated]);
};
