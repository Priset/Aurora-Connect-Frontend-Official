"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import { ServiceRequest, Status, StatusMap } from "@/interfaces/auroraDb";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { MessageCircle, Menu, Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RequestViewDialog } from "@/components/dialogs/requests-view-dialog";
import { ClientOfferDialog } from "@/components/dialogs/client-offer-dialog";

export default function ClientRequestsPage() {
    const { user, profile } = useAuth();
    const { getAll } = useRequests();

    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [dialogType, setDialogType] = useState<"view" | "offer" | null>(null);

    useEffect(() => {
        if (!profile) return;

        getAll()
            .then((data) => {
                const filtered = data.filter((r) => r.client_id === profile.id);
                setRequests(filtered);
            })
            .catch((err) => console.error("Error al obtener solicitudes:", err));
    }, [profile]);

    const openDialog = (type: "view" | "offer", request: ServiceRequest) => {
        setSelectedRequest(request);
        setDialogType(type);
    };

    const closeDialog = () => {
        setSelectedRequest(null);
        setDialogType(null);
    };

    const createdRequests = requests.filter(r => r.status === Status.PENDIENTE);
    const offerRequests = requests.filter(r =>
        r.serviceOffers?.some((offer) =>
            [Status.CONTRAOFERTA_POR_TECNICO, Status.ACEPTADO_POR_TECNICO].includes(offer.status)
        )
    );
    const statusRequests = requests.filter(r =>
        [
            Status.ACEPTADO_POR_TECNICO,
            Status.CONTRAOFERTA_POR_TECNICO,
            Status.RECHAZADO_POR_TECNICO,
            Status.RECHAZADO_POR_CLIENTE,
            Status.ACEPTADO_POR_CLIENTE,
            Status.CHAT_ACTIVO,
            Status.FINALIZADO_CON_VALORACION
        ].includes(r.status)
    );

    return (
        <div className="min-h-screen flex flex-col bg-[--neutral-400]">
            <header className="bg-[--primary-default] text-white px-6 h-20 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="text-white p-0 hover:bg-transparent">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-display font-bold tracking-wide">
                        AURORA CONNECT
                    </h1>
                </div>

                {user && (
                    <UserMenu
                        userName={user.name || "Usuario"}
                        userPictureUrl={user.picture || undefined}
                    />
                )}
            </header>

            {/* SECCIÓN 1: Solicitudes Creadas */}
            <div className="text-[--foreground] font-semibold text-lg px-6 pt-6 pb-2">
                Solicitudes creadas
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 px-6 pb-4">
                {createdRequests.map((req) => (
                    <div
                        key={req.id}
                        onClick={() => openDialog("view", req)}
                        className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
                    >
                        <Wrench className="w-5 h-5 text-[--secondary-default] mb-1" />
                        <div className="text-sm font-semibold mb-1">{req.description}</div>
                        <div className="text-xs text-muted-foreground">
                            Bs. {req.offered_price.toFixed(2)}
                        </div>
                    </div>
                ))}
                {createdRequests.length === 0 && (
                    <p className="text-sm text-muted-foreground">No hay solicitudes creadas.</p>
                )}
            </div>

            {/* SECCIÓN 2: Ofertas de técnicos */}
            <div className="text-[--foreground] font-semibold text-lg px-6 pt-6 pb-2">
                Ofertas de técnicos
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 px-6 pb-4">
                {offerRequests.map((req) => {
                    const offer = req.serviceOffers?.[0];
                    return (
                        <div
                            key={req.id}
                            onClick={() => openDialog("offer", req)}
                            className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
                        >
                            <div className="text-sm font-semibold mb-1">{req.description}</div>
                            <div className="text-xs text-muted-foreground mb-1">
                                {offer?.message || "Sin mensaje del técnico"}
                            </div>
                            <div className="text-xs text-muted-foreground mb-1">
                                Precio propuesto: <strong>Bs. {offer?.proposed_price?.toFixed(2) || "0.00"}</strong>
                            </div>
                        </div>
                    );
                })}
                {offerRequests.length === 0 && (
                    <p className="text-sm text-muted-foreground">No hay ofertas de técnicos aún.</p>
                )}
            </div>

            {/* SECCIÓN 3: Estado de solicitudes */}
            <div className="text-[--foreground] font-semibold text-lg px-6 pt-6 pb-2">
                Estado de solicitudes
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 px-6 pb-16">
                {statusRequests.map((req) => (
                    <div
                        key={req.id}
                        onClick={() => openDialog("view", req)}
                        className="bg-white rounded-xl shadow p-4 cursor-pointer hover:shadow-lg transition"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <div className="text-sm font-semibold">{req.description}</div>
                            <Badge color={StatusMap[req.status as Status].color}>
                                {StatusMap[req.status as Status].label}
                            </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Precio ofertado: Bs. {req.offered_price.toFixed(2)}
                        </div>
                    </div>
                ))}
                {statusRequests.length === 0 && (
                    <p className="text-sm text-muted-foreground">No hay actualizaciones aún.</p>
                )}
            </div>

            {selectedRequest && dialogType === "view" && (
                <RequestViewDialog
                    isOpen={true}
                    onClose={closeDialog}
                    request={selectedRequest}
                />
            )}
            {selectedRequest && dialogType === "offer" && (
                <ClientOfferDialog
                    isOpen={true}
                    onClose={closeDialog}
                    request={selectedRequest}
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
