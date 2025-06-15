"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import { useSocket } from "@/hooks/useSocket";
import { ServiceRequest, Status, StatusMap } from "@/interfaces/auroraDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, MessageCircle, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RequestDialog } from "@/components/dialogs/request-dialog";
import { RequestViewDialog } from "@/components/dialogs/requests-view-dialog";
import { ClientChatDialog } from "@/components/dialogs/client-chat-dialog"; // ✅ Reutilizamos el mismo componente de chat

type SectionProps = {
    title: string;
    searchKey: keyof typeof initialSearch;
    searchValue: string;
    onSearchChange: (val: string) => void;
    data: ServiceRequest[];
    onClick: (req: ServiceRequest) => void;
};

const initialSearch = {
    created: "",
    offers: "",
    progress: "",
    closed: "",
};

const Section = ({
                     title,
                     searchValue,
                     onSearchChange,
                     data,
                     onClick,
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
                        day: "numeric",
                    });

                    return (
                        <div
                            key={req.id}
                            onClick={() => onClick(req)}
                            className="bg-white border border-[--neutral-300] rounded-lg p-3 cursor-pointer hover:shadow-md transition"
                        >
                            <p className="text-sm font-semibold mb-1">{req.description}</p>
                            <div className="text-xs text-muted-foreground mb-1">
                                Cliente: {req.client?.name} {req.client?.last_name}
                            </div>
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

const SkeletonCard = () => (
    <div className="bg-white border border-[--neutral-300] rounded-lg p-3 animate-pulse space-y-2">
        <div className="h-4 bg-[--neutral-300] rounded w-2/3" />
        <div className="h-3 bg-[--neutral-300] rounded w-1/2" />
        <div className="h-3 bg-[--neutral-300] rounded w-1/4" />
        <div className="h-2 bg-[--neutral-300] rounded w-1/3" />
        <div className="h-5 bg-[--secondary-default]/50 rounded w-24 mt-2" />
    </div>
);

const SkeletonSection = ({ title }: { title: string }) => (
    <div className="flex flex-col w-full max-w-sm h-[calc(100vh-220px)] bg-neutral-100 rounded-xl border border-[--neutral-300] p-4 overflow-hidden">
        <h3 className="text-sm font-semibold mb-3">{title}</h3>
        <div className="flex items-center gap-2 mb-3">
            <div className="h-9 w-9 bg-[--neutral-300] rounded" />
            <div className="flex-1 h-9 bg-[--neutral-300] rounded" />
            <div className="h-4 w-4 bg-[--neutral-300] rounded-full" />
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
            {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    </div>
);

export default function TechnicianHomePage() {
    const { profile } = useAuth();
    const { getAllForTechnicians } = useRequests();

    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [chatOpen, setChatOpen] = useState(false); // ✅ Chat
    const [search, setSearch] = useState(initialSearch);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"edit" | "view">("edit");
    const [loading, setLoading] = useState(true);

    const openDialog = (req: ServiceRequest, mode: "edit" | "view") => {
        setSelectedRequest(req);
        setDialogMode(mode);
        setDialogOpen(true);
    };

    const newRequests = useMemo(
        () =>
            requests.filter(
                (r) => r.status === Status.PENDIENTE && r.description.toLowerCase().includes(search.created.toLowerCase())
            ),
        [requests, search]
    );

    const offerRequests = useMemo(() => {
        if (!profile?.technicianProfile?.id) return [];
        return requests.filter(
            (r) =>
                r.serviceOffers?.some(
                    (offer) =>
                        offer.technician_id === profile.technicianProfile!.id &&
                        [
                            Status.CONTRAOFERTA_POR_TECNICO,
                            Status.ACEPTADO_POR_TECNICO,
                            Status.RECHAZADO_POR_TECNICO,
                        ].includes(offer.status)
                ) &&
                r.description.toLowerCase().includes(search.offers.toLowerCase())
        );
    }, [requests, profile, search]);

    const inProgressRequests = useMemo(() => {
        if (!profile?.technicianProfile?.id) return [];
        return requests.filter(
            (r) =>
                r.serviceOffers?.some(
                    (offer) =>
                        offer.technician_id === profile.technicianProfile!.id &&
                        [
                            Status.ACEPTADO_POR_TECNICO,
                            Status.CONTRAOFERTA_POR_TECNICO,
                            Status.RECHAZADO_POR_TECNICO,
                            Status.RECHAZADO_POR_CLIENTE,
                            Status.ACEPTADO_POR_CLIENTE,
                            Status.CHAT_ACTIVO,
                        ].includes(offer.status)
                ) &&
                r.description.toLowerCase().includes(search.progress.toLowerCase())
        );
    }, [requests, profile, search]);

    const closedRequests = useMemo(() => {
        if (!profile?.technicianProfile?.id) return [];
        return requests.filter(
            (r) =>
                r.status === Status.FINALIZADO_CON_VALORACION &&
                r.serviceOffers?.some((offer) => offer.technician_id === profile.technicianProfile!.id) &&
                r.description.toLowerCase().includes(search.closed.toLowerCase())
        );
    }, [requests, profile, search]);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const data = await getAllForTechnicians();
            setRequests(data);
        } catch (err) {
            console.error("Error al obtener solicitudes:", err);
        } finally {
            setLoading(false);
        }
    };

    useSocket(
        (newRequest) => setRequests((prev) => [newRequest, ...prev]),
        (updatedRequest) => setRequests((prev) => prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r)))
    );

    return (
        <main className="px-6 md:px-10 py-6">
            <h1 className="text-2xl font-display font-bold text-white mb-6">Gestión de Solicitudes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {loading ? (
                    <>
                        <SkeletonSection title="Solicitudes nuevas" />
                        <SkeletonSection title="Ofertas enviadas" />
                        <SkeletonSection title="Progreso de la solicitud" />
                        <SkeletonSection title="Solicitudes cerradas" />
                    </>
                ) : (
                    <>
                        <Section
                            title="Solicitudes nuevas"
                            searchKey="created"
                            searchValue={search.created}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, created: val }))}
                            data={newRequests}
                            onClick={(r) => openDialog(r, "edit")}
                        />
                        <Section
                            title="Ofertas enviadas"
                            searchKey="offers"
                            searchValue={search.offers}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, offers: val }))}
                            data={offerRequests}
                            onClick={(r) => openDialog(r, "view")}
                        />
                        <Section
                            title="Progreso de la solicitud"
                            searchKey="progress"
                            searchValue={search.progress}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, progress: val }))}
                            data={inProgressRequests}
                            onClick={(r) => openDialog(r, "view")}
                        />
                        <Section
                            title="Solicitudes cerradas"
                            searchKey="closed"
                            searchValue={search.closed}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, closed: val }))}
                            data={closedRequests}
                            onClick={(r) => openDialog(r, "view")}
                        />
                    </>
                )}
            </div>

            {selectedRequest && dialogMode === "edit" && (
                <RequestDialog
                    isOpen={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    request={selectedRequest}
                    onActionComplete={loadRequests}
                />
            )}

            {selectedRequest && dialogMode === "view" && (
                <RequestViewDialog
                    isOpen={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    request={selectedRequest}
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
