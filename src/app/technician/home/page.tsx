"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import { useSocket } from "@/hooks/useSocket";
import { ServiceRequest, Status, ServiceOffer  } from "@/interfaces/auroraDb";
import { RequestDialog } from "@/components/technician/request-dialog";
import { RequestViewDialog } from "@/components/request/requests-view-dialog";
import { useOffers } from "@/hooks/useOffers";
import { OfferViewDialog } from "@/components/offers/offer-view-dialog";
import { RequestSection } from "@/components/sections/request-section";
import { useIntl } from "react-intl";

const initialSearch = {
    created: "",
    offers: "",
    progress: "",
    closed: "",
};



export default function TechnicianHomePage() {
    const { profile } = useAuth();
    const { getAllForTechnicians } = useRequests();
    const { formatMessage } = useIntl();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [search, setSearch] = useState(initialSearch);
    const [sorts, setSorts] = useState(initialSearch);
    const [progressStatusFilter, setProgressStatusFilter] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMode, setDialogMode] = useState<"edit" | "view">("edit");
    const [loading, setLoading] = useState(true);
    const [selectedOffer, setSelectedOffer] = useState<ServiceOffer | null>(null);
    const [offerDialogOpen, setOfferDialogOpen] = useState(false);
    const { getById: getOfferById } = useOffers();

    const openDialog = (req: ServiceRequest, mode: "edit" | "view") => {
        setSelectedRequest(req);
        setDialogMode(mode);
        setDialogOpen(true);
    };

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
    }

    const newRequests = useMemo(() => {
        const filtered = requests.filter(
            (r) =>
                r.status === Status.PENDIENTE &&
                r.description.toLowerCase().includes(search.created.toLowerCase())
        );
        return sortData(filtered, sorts.created);
    }, [requests, search, sorts.created]);

    const offerRequests = useMemo(() => {
        if (!profile?.technicianProfile?.id) return [];
        const filtered = requests.filter(
            (r) =>
                r.serviceOffers?.some(
                    (offer) =>
                        offer.technician_id === profile.technicianProfile!.id &&
                        [
                            Status.CONTRAOFERTA_POR_TECNICO,
                            Status.ACEPTADO_POR_TECNICO,
                            Status.RECHAZADO_POR_TECNICO,
                            Status.RECHAZADO_POR_CLIENTE,
                        ].includes(offer.status)
                ) &&
                r.description.toLowerCase().includes(search.offers.toLowerCase())
        );
        return sortData(filtered, sorts.offers);
    }, [requests, profile, search, sorts.offers]);

    const inProgressRequests = useMemo(() => {
        if (!profile?.technicianProfile?.id) return [];
        const filtered = requests.filter(
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
        const filteredByStatus = progressStatusFilter !== null
            ? filtered.filter((r) => r.status === progressStatusFilter)
            : filtered;

        return sortData(filteredByStatus, sorts.progress);
    }, [requests, profile, search, sorts.progress, progressStatusFilter]);

    const closedRequests = useMemo(() => {
        if (!profile?.technicianProfile?.id) return [];
        const filtered = requests.filter(
            (r) =>
                (r.status === Status.FINALIZADO || r.status === Status.CALIFICADO) &&
                r.serviceOffers?.some((offer) => offer.technician_id === profile.technicianProfile!.id) &&
                r.description.toLowerCase().includes(search.closed.toLowerCase())
        );
        return sortData(filtered, sorts.closed);
    }, [requests, profile, search, sorts.closed]);

    const loadRequests = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getAllForTechnicians();
            setRequests(data);
        } catch (err) {
            console.error("Error al obtener solicitudes:", err);
        } finally {
            setLoading(false);
        }
    }, [getAllForTechnicians]);

    useEffect(() => {
        if (profile?.id) {
            loadRequests();
        }
    }, [loadRequests, profile?.id]);

    useSocket(
        (newRequest) => setRequests((prev) => [newRequest, ...prev]),
        (updatedRequest) => setRequests((prev) => prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r)))
    );

    return (
        <main className="px-6 md:px-10 py-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-display font-bold text-white">
                    {formatMessage({ id: "technician_requests_title" })}
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <RequestSection
                    title={formatMessage({ id: "technician_requests_new" }) + " (" + newRequests.length + ")"}
                    searchKey="created"
                    searchValue={search.created}
                    onSearchChange={(val) => setSearch((prev) => ({ ...prev, created: val }))}
                    data={newRequests}
                    onClick={(r) => openDialog(r, "edit")}
                    type="view"
                    sortKey={sorts.created}
                    onSortChange={(val) => setSorts((prev) => ({ ...prev, created: val }))}
                    showStatusFilter={false}
                    loading={loading}
                />
                <RequestSection
                    title={formatMessage({ id: "technician_requests_sent" }) + " (" + offerRequests.length + ")"}
                    searchKey="offers"
                    searchValue={search.offers}
                    onSearchChange={(val) => setSearch((prev) => ({ ...prev, offers: val }))}
                    data={offerRequests}
                    onClick={async (req) => {
                        const offer = req.serviceOffers?.find(
                            (o) => o.technician_id === profile?.technicianProfile?.id
                        );
                        if (!offer) return;
                        try {
                            const fullOffer = await getOfferById(offer.id);
                            setSelectedOffer(fullOffer);
                            setOfferDialogOpen(true);
                        } catch (err) {
                            console.error("❌ Error al abrir oferta:", err);
                        }
                    }}
                    type="offer"
                    sortKey={sorts.offers}
                    onSortChange={(val) => setSorts((prev) => ({ ...prev, offers: val }))}
                    showStatusFilter={false}
                    loading={loading}
                />
                <RequestSection
                    title={formatMessage({ id: "technician_requests_progress" }) + " (" + inProgressRequests.length + ")"}
                    searchKey="progress"
                    searchValue={search.progress}
                    onSearchChange={(val) => setSearch((prev) => ({ ...prev, progress: val }))}
                    data={inProgressRequests}
                    onClick={(r) => openDialog(r, "view")}
                    type="view"
                    sortKey={sorts.progress}
                    onSortChange={(val) => setSorts((prev) => ({ ...prev, progress: val }))}
                    showStatusFilter={true}
                    filterStatus={progressStatusFilter}
                    onFilterStatusChange={setProgressStatusFilter}
                    loading={loading}
                />
                <RequestSection
                    title={formatMessage({ id: "technician_requests_closed" }) + " (" + closedRequests.length + ")"}
                    searchKey="closed"
                    searchValue={search.closed}
                    onSearchChange={(val) => setSearch((prev) => ({ ...prev, closed: val }))}
                    data={closedRequests}
                    onClick={(r) => openDialog(r, "view")}
                    type="view"
                    sortKey={sorts.closed}
                    onSortChange={(val) => setSorts((prev) => ({ ...prev, closed: val }))}
                    showStatusFilter={false}
                    loading={loading}
                />
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

            {selectedOffer && (
                <OfferViewDialog
                    isOpen={offerDialogOpen}
                    onClose={() => {
                        setOfferDialogOpen(false);
                        setSelectedOffer(null);
                    }}
                    offer={selectedOffer}
                />
            )}
        </main>
    );
}
