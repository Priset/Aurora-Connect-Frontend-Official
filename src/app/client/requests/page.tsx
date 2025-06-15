"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import { useSocket } from "@/hooks/useSocket";
import { ServiceRequest, Status, StatusMap } from "@/interfaces/auroraDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, MessageCircle, Filter, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RequestViewDialog } from "@/components/dialogs/requests-view-dialog";
import { ClientOfferDialog } from "@/components/dialogs/client-offer-dialog";
import { ClientChatDialog } from "@/components/dialogs/client-chat-dialog";

type SectionProps = {
    title: string;
    searchKey: keyof typeof initialSearch;
    searchValue: string;
    onSearchChange: (val: string) => void;
    data: ServiceRequest[];
    onClick: (req: ServiceRequest) => void;
    type: "view" | "offer";
};

const initialSearch = {
    created: "",
    offers: "",
    progress: "",
    closed: ""
};

const Section = ({
                     title,
                     searchValue,
                     onSearchChange,
                     data,
                     onClick
                 }: SectionProps) => (
    <div className="flex flex-col w-full max-w-sm h-[calc(100vh-220px)] bg-neutral-100 rounded-xl border border-[--neutral-300] p-4 overflow-hidden">
        <h3 className="text-sm font-semibold mb-3">{title}</h3>
        <div className="flex items-center gap-2 mb-3">
            <Button size="icon" variant="ghost" type="button">
                <Filter className="w-4 h-4" />
            </Button>
            <Input
                placeholder="Buscar..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="text-sm"
            />
            <Tooltip>
                <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent
                    side="top"
                    className="z-50 bg-neutral-700 text-white border border-[--neutral-300] rounded-md shadow-sm text-xs px-3 py-1"
                >
                    Puedes utilizar el campo de búsqueda<br />para filtrar las solicitudes por descripción.
                </TooltipContent>
            </Tooltip>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
            {data.length > 0 ? (
                data.map((req) => {
                    const createdAt = new Date(req.created_at).toLocaleDateString("es-BO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    });

                    return (
                        <div
                            key={req.id}
                            onClick={() => onClick(req)}
                            className="bg-white border border-[--neutral-300] rounded-lg p-3 cursor-pointer hover:shadow-md transition"
                        >
                            <p className="text-sm font-semibold mb-1">{req.description}</p>
                            <div className="text-xs text-muted-foreground">
                                Precio: Bs. {req.offered_price.toFixed(2)}
                            </div>
                            <div className="text-[10px] text-muted-foreground italic">
                                Creado: {createdAt}
                            </div>
                            <Badge className="text-xs mt-2" style={{ backgroundColor: StatusMap[req.status as keyof typeof StatusMap].color }}>
                                {StatusMap[req.status as keyof typeof StatusMap].label}
                            </Badge>
                        </div>
                    );
                })
            ) : (
                <p className="text-xs text-muted-foreground">Sin resultados.</p>
            )}
        </div>
    </div>
);

const SectionSkeleton = () => (
    <div className="flex flex-col w-full max-w-sm h-[calc(100vh-220px)] bg-neutral-100 rounded-xl border border-[--neutral-300] p-4">
        <div className="h-4 w-2/3 bg-[--neutral-300] rounded mb-4 animate-pulse" />
        <div className="flex gap-2 mb-3">
            <div className="h-9 w-9 bg-[--neutral-200] rounded animate-pulse" />
            <div className="flex-1 h-9 bg-[--neutral-200] rounded animate-pulse" />
            <div className="h-9 w-9 bg-[--neutral-200] rounded animate-pulse" />
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
            {[...Array(4)].map((_, idx) => (
                <div key={idx} className="p-4 bg-white rounded-lg border border-[--neutral-300] animate-pulse space-y-2">
                    <div className="h-4 w-3/4 bg-[--neutral-200] rounded" />
                    <div className="h-3 w-1/2 bg-[--neutral-200] rounded" />
                    <div className="h-2 w-1/3 bg-[--neutral-200] rounded" />
                    <div className="h-4 w-24 bg-[--secondary-default] rounded-full mt-2" />
                </div>
            ))}
        </div>
    </div>
);

export default function ClientRequestsPage() {
    const { profile } = useAuth();
    const { getAll } = useRequests();

    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [dialogType, setDialogType] = useState<"view" | "offer" | null>(null);
    const [chatOpen, setChatOpen] = useState(false);
    const [search, setSearch] = useState(initialSearch);
    const [loading, setLoading] = useState(true);

    const openDialog = (type: "view" | "offer", request: ServiceRequest) => {
        setSelectedRequest(request);
        setDialogType(type);
    };

    const closeDialog = () => {
        setSelectedRequest(null);
        setDialogType(null);
    };

    const loadRequests = async () => {
        if (!profile) return;
        setLoading(true);
        try {
            const data = await getAll();
            const filtered = data.filter((r) => r.client_id === profile.id);
            setRequests(filtered);
        } catch (err) {
            console.error("Error al obtener solicitudes:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
    }, [profile]);

    useSocket(
        (newRequest) => {
            if (newRequest.client_id === profile?.id) {
                setRequests((prev) => [newRequest, ...prev]);
            }
        },
        (updatedRequest) => {
            if (updatedRequest.client_id === profile?.id) {
                setRequests((prev) =>
                    prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
                );
            }
        }
    );

    const created = requests.filter(
        (r) => r.status === Status.PENDIENTE && r.description.toLowerCase().includes(search.created.toLowerCase())
    );

    const offers = requests.filter(
        (r) =>
            r.serviceOffers?.some((offer) =>
                [Status.CONTRAOFERTA_POR_TECNICO, Status.ACEPTADO_POR_TECNICO, Status.RECHAZADO_POR_TECNICO].includes(offer.status)
            ) && r.description.toLowerCase().includes(search.offers.toLowerCase())
    );

    const progress = requests.filter(
        (r) =>
            [
                Status.ACEPTADO_POR_TECNICO,
                Status.CONTRAOFERTA_POR_TECNICO,
                Status.RECHAZADO_POR_TECNICO,
                Status.RECHAZADO_POR_CLIENTE,
                Status.ACEPTADO_POR_CLIENTE,
                Status.CHAT_ACTIVO
            ].includes(r.status) && r.description.toLowerCase().includes(search.progress.toLowerCase())
    );

    const closed = requests.filter(
        (r) => r.status === Status.FINALIZADO_CON_VALORACION && r.description.toLowerCase().includes(search.closed.toLowerCase())
    );

    return (
        <main className="px-6 md:px-10 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-display font-bold text-white">Gestión de Solicitudes</h1>
                <Button
                    className="bg-[--secondary-default] text-white hover:bg-[--secondary-hover] px-4 py-2 active:bg-[--secondary-pressed] transition"
                    onClick={() => window.location.href = "/client/home"}
                >
                    <Plus className="w-4 h-4 mr-1" />
                    Nueva Solicitud
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {loading ? (
                    <>
                        <SectionSkeleton />
                        <SectionSkeleton />
                        <SectionSkeleton />
                        <SectionSkeleton />
                    </>
                ) : (
                    <>
                        <Section
                            title="Solicitudes Creadas"
                            searchKey="created"
                            searchValue={search.created}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, created: val }))}
                            data={created}
                            onClick={(r) => openDialog("view", r)}
                            type="view"
                        />
                        <Section
                            title="Ofertas entrantes"
                            searchKey="offers"
                            searchValue={search.offers}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, offers: val }))}
                            data={offers}
                            onClick={(r) => openDialog("offer", r)}
                            type="offer"
                        />
                        <Section
                            title="Progreso de la solicitud"
                            searchKey="progress"
                            searchValue={search.progress}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, progress: val }))}
                            data={progress}
                            onClick={(r) => openDialog("view", r)}
                            type="view"
                        />
                        <Section
                            title="Solicitudes cerradas"
                            searchKey="closed"
                            searchValue={search.closed}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, closed: val }))}
                            data={closed}
                            onClick={(r) => openDialog("view", r)}
                            type="view"
                        />
                    </>
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
                    onActionComplete={loadRequests}
                />
            )}
            <ClientChatDialog isOpen={chatOpen} onClose={() => setChatOpen(false)} />

            {!chatOpen && (
                <Button
                    size="icon"
                    className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-[--primary-default] text-white hover:opacity-90"
                    onClick={() => setChatOpen(true)}
                >
                    <MessageCircle className="w-5 h-5" />
                </Button>
            )}
        </main>
    );
}
