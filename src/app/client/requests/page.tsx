"use client";

import {useCallback, useEffect, useState} from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import { useSocket } from "@/hooks/useSocket";
import {Chat, ServiceRequest, Status} from "@/interfaces/auroraDb";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Sparkles } from "lucide-react";
import { RequestSection } from "@/components/sections/request-section";
import { RequestViewDialog } from "@/components/request/requests-view-dialog";
import { ClientOfferDialog } from "@/components/client/client-offer-dialog";
import { ReviewDialog } from "@/components/review/review-dialog";
import { useIntl } from "react-intl"

const initialSearch = {
    created: "",
    offers: "",
    progress: "",
    closed: ""
};

export default function ClientRequestsPage() {
    const { profile } = useAuth();
    const { getAll } = useRequests();
    const { formatMessage } = useIntl();
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

    const loadRequests = useCallback(async () => {
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
    }, [getAll, profile]);

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);

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
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-white">
                        {formatMessage({ id: "client_requests_title" })}
                    </h1>
                </div>
                <Button
                    className="bg-[--secondary-default] text-white hover:bg-[--secondary-hover] px-4 py-2 active:bg-[--secondary-pressed] transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
                    onClick={() => window.location.href = "/client/home"}
                >
                    <div className="p-1 bg-white/20 rounded">
                        <Plus className="w-4 h-4" />
                    </div>
                    {formatMessage({ id: "client_requests_new_button" })}
                    <Sparkles className="w-4 h-4" />
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <RequestSection
                    title={formatMessage({ id: "client_requests_section_created" }) + " (" + created.length + ")"}
                    searchKey="created"
                    searchValue={search.created}
                    onSearchChange={(val) => setSearch((prev) => ({ ...prev, created: val }))}
                    data={created}
                    onClick={(r) => openDialog("view", r)}
                    type="view"
                    sortKey={sorts.created}
                    onSortChange={(val) => setSorts((prev) => ({ ...prev, created: val }))}
                    showStatusFilter={false}
                    loading={loading}
                />
                <RequestSection
                    title={formatMessage({ id: "client_requests_section_offers" }) + " (" + offers.length + ")"}
                    searchKey="offers"
                    searchValue={search.offers}
                    onSearchChange={(val) => setSearch((prev) => ({ ...prev, offers: val }))}
                    data={offers}
                    onClick={(r) => openDialog("offer", r)}
                    type="offer"
                    sortKey={sorts.offers}
                    onSortChange={(val) => setSorts((prev) => ({ ...prev, offers: val }))}
                    showStatusFilter={false}
                    loading={loading}
                />
                <RequestSection
                    title={formatMessage({ id: "client_requests_section_progress" }) + " (" + progress.length + ")"}
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
                    loading={loading}
                />
                <RequestSection
                    title={formatMessage({ id: "client_requests_section_closed" }) + " (" + closed.length + ")"}
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
                    loading={loading}
                />
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
