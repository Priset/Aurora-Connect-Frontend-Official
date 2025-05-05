"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import { ServiceRequest } from "@/interfaces/auroraDb";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, Wrench } from "lucide-react";

export default function ClientRequestsPage() {
    const { user, profile } = useAuth();
    const { getAll } = useRequests();

    const [requests, setRequests] = useState<ServiceRequest[]>([]);

    useEffect(() => {
        if (!profile) return;

        getAll()
            .then((data) => {
                const filtered = data.filter((r) => r.client_id === profile.id);
                setRequests(filtered);
            })
            .catch((err) => console.error("Error al obtener solicitudes:", err));
    }, [profile]);

    return (
        <div className="min-h-screen flex flex-col bg-[--neutral-400]">
            <header className="h-16 px-4 flex items-center justify-between bg-[--primary-default] text-white shadow-md">
                <Button size="icon" variant="ghost">
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="flex-1" />
                {user && (
                    <UserMenu
                        userName={user.name || "Usuario"}
                        userPictureUrl={user.picture}
                    />
                )}
            </header>

            <div className="text-[--foreground] font-semibold text-lg px-6 py-4">
                Solicitudes en progreso
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 px-6 pb-8">
                {requests.map((req) => (
                    <div
                        key={req.id}
                        className="bg-white rounded-xl shadow p-4 flex flex-col items-center"
                    >
                        <Wrench className="w-8 h-8 text-[--secondary-default] mb-2" />
                        <div className="text-center text-[--foreground] text-sm">
                            {req.description}
                        </div>
                    </div>
                ))}
            </div>

            <Button
                size="icon"
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-[--primary-default] text-white hover:opacity-90"
            >
                <MessageCircle className="w-5 h-5" />
            </Button>
        </div>
    );
}
