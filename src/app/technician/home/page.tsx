"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import {ServiceRequest, Status, StatusMap} from "@/interfaces/auroraDb";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import {Menu, Wrench, MessageCircle, Badge} from "lucide-react";
import {RequestDialog} from "@/components/dialogs/request-dialog";

export default function TechnicianHomePage() {
    const { user } = useAuth();
    const { getAllForTechnicians } = useRequests();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const newRequests = requests.filter(
        (r) => r.status === Status.PENDIENTE
    );

    const inProgressRequests = requests.filter(
        (r) =>
            r.status === Status.ACEPTADO_POR_TECNICO ||
            r.status === Status.CONTRAOFERTA_POR_TECNICO ||
            r.status === Status.ACEPTADO_POR_CLIENTE ||
            r.status === Status.CHAT_ACTIVO
    );
    const [dialogOpen, setDialogOpen] = useState(false);

    const openDialog = (req: ServiceRequest) => {
        setSelectedRequest(req);
        setDialogOpen(true);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            const res = await getAllForTechnicians();
            setRequests(res);
        } catch (err) {
            console.error("Error al cargar solicitudes:", err);
        }
    };

    return (
        <div className="min-h-screen bg-[--neutral-400] pb-16 text-[--foreground]">
            <header className="bg-[--primary-default] text-white px-4 h-16 flex items-center justify-between shadow">
                <Button size="icon" variant="ghost">
                    <Menu className="h-5 w-5" />
                </Button>
                <div className="flex-1" />
                {user && (
                    <UserMenu
                        userName={user.name || "Técnico"}
                        userPictureUrl={user.picture}
                    />
                )}
            </header>

            <section className="px-6 py-6">
                <h2 className="text-lg font-bold mb-4">Solicitudes nuevas</h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                    {newRequests.map((request) => (
                        <div
                            key={request.id}
                            onClick={() => openDialog(request)}
                            className="cursor-pointer bg-[--neutral-100] rounded-xl shadow-md p-4 border border-[--neutral-300] hover:shadow-lg transition"
                        >
                            <div className="flex items-center gap-3">
                                <Wrench className="w-5 h-5 text-[--secondary-default]" />
                                <p className="text-sm font-semibold">
                                    {request.description}
                                </p>
                            </div>
                            <div className="text-xs text-muted-foreground ml-8">
                                {request.client?.name} {request.client?.last_name}
                            </div>
                            <div className="text-sm font-semibold ml-8 mt-1">
                                Bs. {request.offered_price?.toFixed(2) || "0.00"}
                            </div>
                        </div>
                    ))}
                    {newRequests.length === 0 && (
                        <p className="text-sm text-muted-foreground">No hay nuevas solicitudes.</p>
                    )}
                </div>
            </section>

            <section className="px-6 pb-8">
                <h2 className="text-lg font-bold mb-4">Solicitudes en progreso</h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">
                    {inProgressRequests.map((request) => (
                        <div
                            key={request.id}
                            onClick={() => openDialog(request)}
                            className="cursor-pointer bg-[--neutral-100] rounded-xl shadow-md p-4 border border-[--neutral-300] hover:shadow-lg transition"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold">{request.description}</p>
                                <Badge color={StatusMap[request.status as Status].color}>
                                    {StatusMap[request.status as Status].label}
                                </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {request.client?.name} {request.client?.last_name}
                            </div>
                            <div className="text-sm font-semibold mt-1">
                                Bs. {request.offered_price?.toFixed(2) || "0.00"}
                            </div>
                        </div>
                    ))}
                    {inProgressRequests.length === 0 && (
                        <p className="text-sm text-muted-foreground">No hay solicitudes en progreso.</p>
                    )}
                </div>
            </section>

            {selectedRequest && (
                <RequestDialog
                    isOpen={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    request={selectedRequest}
                    onActionComplete={loadRequests}
                />
            )}

            <Button
                size="icon"
                className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-[--primary-default] text-white hover:opacity-90"
            >
                <MessageCircle className="w-5 h-5" />
            </Button>
        </div>
    );
}
