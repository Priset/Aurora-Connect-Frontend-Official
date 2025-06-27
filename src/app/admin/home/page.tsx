'use client';

import {useEffect, useState, useMemo, useCallback} from "react";
import {useRequests} from "@/hooks/useRequests";
import {ServiceRequest, Status} from "@/interfaces/auroraDb";
import {RequestViewDialog} from "@/components/request/requests-view-dialog";
import {RequestSection} from "@/components/sections/request-section";
import {useIntl} from "react-intl";

const initialSearch = {
    created: "",
    offers: "",
    progress: "",
    closed: "",
};

const SectionSkeleton = () => (
    <div
        className="flex flex-col w-full max-w-sm h-[calc(100vh-220px)] bg-neutral-100 rounded-xl border border-[--neutral-300] p-4">
        <div className="h-4 w-2/3 bg-[--neutral-300] rounded mb-4 animate-pulse"/>
        <div className="flex gap-2 mb-3">
            <div className="h-9 w-9 bg-[--neutral-200] rounded animate-pulse"/>
            <div className="flex-1 h-9 bg-[--neutral-200] rounded animate-pulse"/>
            <div className="h-9 w-9 bg-[--neutral-200] rounded animate-pulse"/>
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
            {[...Array(4)].map((_, idx) => (
                <div key={idx}
                     className="p-4 bg-white rounded-lg border border-[--neutral-300] animate-pulse space-y-2">
                    <div className="h-4 w-3/4 bg-[--neutral-200] rounded"/>
                    <div className="h-3 w-1/2 bg-[--neutral-200] rounded"/>
                    <div className="h-2 w-1/3 bg-[--neutral-200] rounded"/>
                    <div className="h-4 w-24 bg-[--secondary-default] rounded-full mt-2"/>
                </div>
            ))}
        </div>
    </div>
);

export default function AdminHomePage() {
    const {formatMessage} = useIntl();
    const {getAllForTechnicians} = useRequests();
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [search, setSearch] = useState(initialSearch);
    const [sorts, setSorts] = useState(initialSearch);
    const [progressStatusFilter, setProgressStatusFilter] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const openDialog = (req: ServiceRequest) => {
        setSelectedRequest(req);
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
    };

    const newRequests = useMemo(() => {
        const filtered = requests.filter(
            (r) => r.status === Status.PENDIENTE && r.description.toLowerCase().includes(search.created.toLowerCase())
        );
        return sortData(filtered, sorts.created);
    }, [requests, search.created, sorts.created]);

    const offerRequests = useMemo(() => {
        const filtered = requests.filter(
            (r) => r.serviceOffers && r.serviceOffers.length > 0 &&
                r.description.toLowerCase().includes(search.offers.toLowerCase())
        );
        return sortData(filtered, sorts.offers);
    }, [requests, search.offers, sorts.offers]);

    const inProgressRequests = useMemo(() => {
        const progressStatuses = [
            Status.ACEPTADO_POR_CLIENTE,
            Status.ACEPTADO_POR_TECNICO,
            Status.CONTRAOFERTA_POR_TECNICO,
            Status.RECHAZADO_POR_CLIENTE,
            Status.RECHAZADO_POR_TECNICO,
            Status.CHAT_ACTIVO
        ];
        const filtered = requests.filter(
            (r) => progressStatuses.includes(r.status) &&
                r.description.toLowerCase().includes(search.progress.toLowerCase())
        );
        const filteredByStatus = progressStatusFilter !== null
            ? filtered.filter((r) => r.status === progressStatusFilter)
            : filtered;
        return sortData(filteredByStatus, sorts.progress);
    }, [requests, search.progress, sorts.progress, progressStatusFilter]);

    const closedRequests = useMemo(() => {
        const filtered = requests.filter(
            (r) =>
                [Status.FINALIZADO, Status.CALIFICADO].includes(r.status) &&
                r.description.toLowerCase().includes(search.closed.toLowerCase())
        );
        return sortData(filtered, sorts.closed);
    }, [requests, search.closed, sorts.closed]);

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

    return (
        <main className="px-6 md:px-10 py-6">
            <h1 className="text-2xl font-display font-bold text-white mb-6">
                {formatMessage({id: "admin_requests_title"})}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {loading ? (
                    <>
                        <SectionSkeleton/>
                        <SectionSkeleton/>
                        <SectionSkeleton/>
                        <SectionSkeleton/>
                    </>
                ) : (
                    <>
                        <RequestSection
                            title={formatMessage({id: "admin_requests_new"}) + ` (${newRequests.length})`}
                            searchKey="created"
                            searchValue={search.created}
                            onSearchChange={(val) => setSearch((p) => ({...p, created: val}))}
                            data={newRequests}
                            onClick={openDialog}
                            type="view"
                            sortKey={sorts.created}
                            onSortChange={(val) => setSorts((p) => ({...p, created: val}))}
                        />
                        <RequestSection
                            title={formatMessage({id: "admin_requests_offers"}) + ` (${offerRequests.length})`}
                            searchKey="offers"
                            searchValue={search.offers}
                            onSearchChange={(val) => setSearch((p) => ({...p, offers: val}))}
                            data={offerRequests}
                            onClick={openDialog}
                            type="view"
                            sortKey={sorts.offers}
                            onSortChange={(val) => setSorts((p) => ({...p, offers: val}))}
                        />
                        <RequestSection
                            title={formatMessage({id: "admin_requests_progress"}) + ` (${inProgressRequests.length})`}
                            searchKey="progress"
                            searchValue={search.progress}
                            onSearchChange={(val) => setSearch((p) => ({...p, progress: val}))}
                            data={inProgressRequests}
                            onClick={openDialog}
                            type="view"
                            sortKey={sorts.progress}
                            onSortChange={(val) => setSorts((p) => ({...p, progress: val}))}
                            showStatusFilter
                            filterStatus={progressStatusFilter}
                            onFilterStatusChange={setProgressStatusFilter}
                        />
                        <RequestSection
                            title={formatMessage({id: "admin_requests_closed"}) + ` (${closedRequests.length})`}
                            searchKey="closed"
                            searchValue={search.closed}
                            onSearchChange={(val) => setSearch((p) => ({...p, closed: val}))}
                            data={closedRequests}
                            onClick={openDialog}
                            type="view"
                            sortKey={sorts.closed}
                            onSortChange={(val) => setSorts((p) => ({...p, closed: val}))}
                        />
                    </>
                )}
            </div>

            {selectedRequest && (
                <RequestViewDialog
                    isOpen={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    request={selectedRequest}
                />
            )}
        </main>
    );
}
