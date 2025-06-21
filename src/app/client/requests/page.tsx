"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import { useSocket } from "@/hooks/useSocket";
import {Chat, ServiceRequest, Status} from "@/interfaces/auroraDb";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { RequestSection } from "@/components/sections/request-section";
import { RequestViewDialog } from "@/components/dialogs/requests-view-dialog";
import { ClientOfferDialog } from "@/components/client/client-offer-dialog";
import { ReviewDialog } from "@/components/review/review-dialog";

const initialSearch = {
    created: "",
    offers: "",
    progress: "",
    closed: ""
};

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
    const [dialogType, setDialogType] = useState<"view" | "offer" | "review" | null>(null);
    const [search, setSearch] = useState(initialSearch);
    const [loading, setLoading] = useState(true);

    const [sorts, setSorts] = useState({
        created: "",
        offers: "",
        progress: "",
        closed: ""
    });

    const [progressStatusFilter, setProgressStatusFilter] = useState<number | null>(null);

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

    const sortData = (data: ServiceRequest[], key: string) => {
        switch (key) {
            case "date_asc":
                return [...data].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            case "date_desc":
                return [...data].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            case "price_asc":
                return [...data].sort((a, b) => a.offered_price - b.offered_price);
            case "price_desc":
                return [...data].sort((a, b) => b.offered_price - a.offered_price);
            case "az":
                return [...data].sort((a, b) => a.description.localeCompare(b.description));
            case "za":
                return [...data].sort((a, b) => b.description.localeCompare(a.description));
            default:
                return data;
        }
    };

    const created = sortData(
        requests.filter(
            (r) =>
                r.status === Status.PENDIENTE &&
                r.description.toLowerCase().includes(search.created.toLowerCase())
        ),
        sorts.created
    );

    const offers = sortData(
        requests.filter(
            (r) =>
                r.serviceOffers?.some((offer) =>
                    [Status.CONTRAOFERTA_POR_TECNICO, Status.ACEPTADO_POR_TECNICO, Status.RECHAZADO_POR_TECNICO].includes(offer.status)
                ) &&
                r.description.toLowerCase().includes(search.offers.toLowerCase())
        ),
        sorts.offers
    );

    const progress = sortData(
        requests.filter(
            (r) =>
                [
                    Status.ACEPTADO_POR_TECNICO,
                    Status.CONTRAOFERTA_POR_TECNICO,
                    Status.RECHAZADO_POR_TECNICO,
                    Status.RECHAZADO_POR_CLIENTE,
                    Status.ACEPTADO_POR_CLIENTE,
                    Status.CHAT_ACTIVO
                ].includes(r.status) &&
                (progressStatusFilter === null || r.status === progressStatusFilter) &&
                r.description.toLowerCase().includes(search.progress.toLowerCase())
        ),
        sorts.progress
    );

    const closed = sortData(
        requests.filter(
            (r) =>
                [Status.FINALIZADO, Status.CALIFICADO].includes(r.status) &&
                r.description.toLowerCase().includes(search.closed.toLowerCase())
        ),
        sorts.closed
    );

    return (
        <main className="px-6 md:px-10 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-display font-bold text-white">Gestión de Solicitudes</h1>
                <Button
                    className="bg-[--secondary-default] text-white hover:bg-[--secondary-hover] px-4 py-2 active:bg-[--secondary-pressed] transition transform hover:scale-105 active:scale-95"
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
                        <RequestSection
                            title="Solicitudes Creadas"
                            searchKey="created"
                            searchValue={search.created}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, created: val }))}
                            data={created}
                            onClick={(r) => openDialog("view", r)}
                            type="view"
                            sortKey={sorts.created}
                            onSortChange={(val) => setSorts((prev) => ({ ...prev, created: val }))}
                            showStatusFilter={false}
                        />
                        <RequestSection
                            title="Ofertas entrantes"
                            searchKey="offers"
                            searchValue={search.offers}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, offers: val }))}
                            data={offers}
                            onClick={(r) => openDialog("offer", r)}
                            type="offer"
                            sortKey={sorts.offers}
                            onSortChange={(val) => setSorts((prev) => ({ ...prev, offers: val }))}
                            showStatusFilter={false}
                        />
                        <RequestSection
                            title="Progreso de la solicitud"
                            searchKey="progress"
                            searchValue={search.progress}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, progress: val }))}
                            data={progress}
                            onClick={(r) => openDialog("view", r)}
                            type="view"
                            sortKey={sorts.progress}
                            onSortChange={(val) => setSorts((prev) => ({ ...prev, progress: val }))}
                            showStatusFilter={true}
                            filterStatus={progressStatusFilter}
                            onFilterStatusChange={setProgressStatusFilter}
                        />
                        <RequestSection
                            title="Solicitudes cerradas"
                            searchKey="closed"
                            searchValue={search.closed}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, closed: val }))}
                            data={closed}
                            onClick={(r) => {
                                setSelectedRequest(r);
                                setDialogType("view");
                            }}
                            type="view"
                            onReview={(r) => {
                                setSelectedRequest(r);
                                setDialogType("review");
                            }}
                            sortKey={sorts.closed}
                            onSortChange={(val) => setSorts((prev) => ({ ...prev, closed: val }))}
                            showStatusFilter={false}
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

            {selectedRequest && dialogType === "review" && (
                <ReviewDialog
                    isOpen={true}
                    chat={{ request_id: selectedRequest.id } as Chat}
                    onClose={() => {
                        setSelectedRequest(null);
                        setDialogType(null);
                        loadRequests();
                    }}
                />
            )}
        </main>
    );
}
