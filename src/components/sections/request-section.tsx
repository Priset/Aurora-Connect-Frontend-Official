"use client";

import { useEffect, useState } from "react";
import { ServiceRequest, Status, getStatusMap } from "@/interfaces/auroraDb";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useIntl } from "react-intl";

type SectionProps = {
    title: string;
    searchKey: string;
    searchValue: string;
    onSearchChange: (val: string) => void;
    data: ServiceRequest[];
    onClick: (req: ServiceRequest) => void;
    type: "view" | "offer";
    onReview?: (req: ServiceRequest) => void;
    sortKey?: string;
    onSortChange?: (val: string) => void;
    filterStatus?: number | null;
    onFilterStatusChange?: (val: number | null) => void;
    showStatusFilter?: boolean;
    loading?: boolean;
};

const RequestSectionSkeleton = () => (
    <div className="flex flex-col w-full max-w-sm h-[calc(100vh-220px)] bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 shadow-2xl animate-pulse">
        <div className="flex items-center justify-between mb-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-3 border border-white/20">
            <div className="h-4 w-32 bg-white/20 backdrop-blur-sm rounded" />
            <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full" />
        </div>
        <div className="flex flex-col gap-2 mb-3">
            <div className="flex items-center gap-2">
                <div className="h-8 w-[120px] bg-white/20 backdrop-blur-sm rounded" />
                <div className="h-8 w-[160px] bg-white/20 backdrop-blur-sm rounded" />
            </div>
            <div className="h-8 w-full bg-white/20 backdrop-blur-sm rounded" />
        </div>
        <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">
            {[...Array(4)].map((_, idx) => (
                <div key={idx} className="p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 space-y-2">
                    <div className="h-4 w-3/4 bg-white/20 backdrop-blur-sm rounded" />
                    <div className="h-3 w-1/2 bg-white/20 backdrop-blur-sm rounded" />
                    <div className="h-2 w-1/3 bg-white/20 backdrop-blur-sm rounded" />
                    <div className="h-4 w-20 bg-gradient-to-r from-blue-500/60 to-purple-500/60 rounded-full mt-2" />
                </div>
            ))}
        </div>
    </div>
);

export const RequestSection = ({
                                   title,
                                   searchValue,
                                   onSearchChange,
                                   data,
                                   onReview,
                                   onSortChange,
                                   showStatusFilter,
                                   onFilterStatusChange,
                                   onClick,
                                   loading = false
                               }: SectionProps) => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const intl = useIntl();
    const { formatMessage } = useIntl();
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const StatusMap = getStatusMap(intl);

    useEffect(() => {
        setPage(1);
    }, [data]);

    if (loading) {
        return <RequestSectionSkeleton />;
    }

    return (
        <div className="flex flex-col w-full max-w-sm h-[calc(100vh-220px)] bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    {title}
                </h3>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <div className="p-1 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-200">
                            <Info className="w-4 h-4 text-blue-400 cursor-pointer" />
                        </div>
                    </TooltipTrigger>
                    <TooltipContent
                        side="top"
                        className="z-50 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-md shadow-xl text-xs px-3 py-2 whitespace-pre-line"
                    >
                        {formatMessage({ id: "requests_tooltip" })}
                    </TooltipContent>
                </Tooltip>
            </div>

            <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2">
                    <Select onValueChange={(val) => onSortChange?.(val)}>
                        <SelectTrigger className="h-8 px-2 py-1 text-xs bg-white/20 backdrop-blur-sm border border-white/30 rounded-md w-[120px] text-white">
                            <SelectValue
                                placeholder={formatMessage({ id: "requests_sort_by" })}
                            />
                        </SelectTrigger>
                        <SelectContent className="bg-white/10 backdrop-blur-md border border-white/20 text-sm shadow-xl z-50">
                            <SelectItem value="-1">
                                {formatMessage({ id: "requests_sort_by" })}
                            </SelectItem>
                            <SelectItem value="date_asc">
                                {formatMessage({ id: "requests_sort_date_asc" })}
                            </SelectItem>
                            <SelectItem value="date_desc">
                                {formatMessage({ id: "requests_sort_date_desc" })}
                            </SelectItem>
                            <SelectItem value="price_asc">
                                {formatMessage({ id: "requests_sort_price_asc" })}
                            </SelectItem>
                            <SelectItem value="price_desc">
                                {formatMessage({ id: "requests_sort_price_desc" })}
                            </SelectItem>
                            <SelectItem value="az">
                                {formatMessage({ id: "requests_sort_az" })}
                            </SelectItem>
                            <SelectItem value="za">
                                {formatMessage({ id: "requests_sort_za" })}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {showStatusFilter && (
                        <Select
                            onValueChange={(val) =>
                                onFilterStatusChange?.(val === "-1" ? null : parseInt(val))
                            }
                        >
                            <SelectTrigger className="h-8 px-2 py-1 text-xs bg-white/20 backdrop-blur-sm border border-white/30 rounded-md w-[160px] truncate overflow-hidden text-white">
                                <SelectValue
                                    placeholder={formatMessage({ id: "requests_status" })}
                                />
                            </SelectTrigger>
                            <SelectContent className="bg-white/10 backdrop-blur-md border border-white/20 text-sm shadow-xl z-50">
                                <SelectItem value="-1">
                                    {formatMessage({ id: "requests_status_all" })}
                                </SelectItem>
                                {Object.entries(StatusMap)
                                    .filter(([key]) => {
                                        const id = Number(key);
                                        return ![
                                            Status.ELIMINADO,
                                            Status.CALIFICADO,
                                            Status.FINALIZADO,
                                            Status.HABILITADO,
                                            Status.DESHABILITADO,
                                            Status.PENDIENTE,
                                        ].includes(id);
                                    })
                                    .map(([key, value]) => (
                                        <SelectItem key={key} value={key}>
                                            {value.label}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>

                <Input
                    placeholder={formatMessage({ id: "requests_search_placeholder" })}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="text-sm bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:ring-blue-400/50"
                />
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                {paginatedData.length > 0 ? (
                    paginatedData.map((req) => {
                        const createdAt = new Date(req.created_at).toLocaleDateString("es-BO", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                        });

                        return (
                            <div
                                key={req.id}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:bg-white/15 hover:shadow-lg"
                                onClick={() => onClick(req)}
                            >
                                <p className="text-sm font-semibold text-white mb-2">
                                    {req.description} <span className="text-xs text-white/60">(#{req.id})</span>
                                </p>
                                <div className="text-xs text-green-400 font-medium mb-1">
                                    {formatMessage({ id: "requests_price_prefix"})} {req.offered_price.toFixed(2)}
                                </div>
                                <div className="text-[10px] text-white/60 italic mb-2">
                                    {formatMessage({ id: "requests_created_prefix"})} {createdAt}
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <Badge
                                        className="text-neutral-100 text-xs"
                                        style={{ backgroundColor: StatusMap[req.status as keyof typeof StatusMap].color }}
                                    >
                                        {StatusMap[req.status as keyof typeof StatusMap].label}
                                    </Badge>
                                    {req.status === Status.FINALIZADO && onReview && (
                                        <Button
                                            className="text-xs bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/80 hover:to-emerald-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-md transition-all duration-200 hover:scale-105 border border-white/20"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onReview(req);
                                            }}
                                        >
                                            {formatMessage({ id: "requests_review_button" })}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Info className="w-6 h-6 text-white/50" />
                        </div>
                        <p className="text-xs text-white/70">
                            {formatMessage({ id: "requests_no_results" })}
                        </p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-3 text-xs bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10">
                    <Button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 backdrop-blur-sm h-7 px-3 text-xs text-white disabled:opacity-50 transition-all duration-200 hover:scale-105 border border-white/20"
                    >
                        {formatMessage({ id: "requests_prev" })}
                    </Button>
                    <span className="text-white/70 font-medium">
                        {formatMessage({ id: "requests_pagination" }, { page, totalPages })}
                    </span>
                    <Button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 backdrop-blur-sm h-7 px-3 text-xs text-white disabled:opacity-50 transition-all duration-200 hover:scale-105 border border-white/20"
                    >
                        {formatMessage({ id: "requests_next" })}
                    </Button>
                </div>
            )}
        </div>
    );
};
