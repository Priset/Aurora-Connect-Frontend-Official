"use client";

import {useCallback, useEffect, useMemo, useState} from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import { useSocket } from "@/hooks/useSocket";
import { ServiceRequest, Status } from "@/interfaces/auroraDb";
import { RequestDialog } from "@/components/technician/request-dialog";
import { RequestViewDialog } from "@/components/dialogs/requests-view-dialog";
import { RequestSection } from "@/components/sections/request-section";
import { useIntl } from "react-intl";

const initialSearch = {
    created: "",
    offers: "",
    progress: "",
    closed: "",
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
                r.status === Status.FINALIZADO &&
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
        loadRequests();
    }, [loadRequests]);

    useSocket(
        (newRequest) => setRequests((prev) => [newRequest, ...prev]),
        (updatedRequest) => setRequests((prev) => prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r)))
    );

    return (
        <main className="px-6 md:px-10 py-6">
            <h1 className="text-2xl font-display font-bold text-white mb-6">
                {formatMessage({ id: "technician_requests_title" })}
            </h1>

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
                        />
                        <RequestSection
                            title={formatMessage({ id: "technician_requests_sent" }) + " (" + offerRequests.length + ")"}
                            searchKey="offers"
                            searchValue={search.offers}
                            onSearchChange={(val) => setSearch((prev) => ({ ...prev, offers: val }))}
                            data={offerRequests}
                            onClick={(r) => openDialog(r, "view")}
                            type="view"
                            sortKey={sorts.offers}
                            onSortChange={(val) => setSorts((prev) => ({ ...prev, offers: val }))}
                            showStatusFilter={false}
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
        </main>
    );
}
