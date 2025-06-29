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
};

export const RequestSection = ({
                                   title,
                                   searchValue,
                                   onSearchChange,
                                   data,
                                   onReview,
                                   onSortChange,
                                   showStatusFilter,
                                   onFilterStatusChange,
                                   onClick
                               }: SectionProps) => {
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;
    const intl = useIntl();
    const { formatMessage } = useIntl();
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const StatusMap = getStatusMap(intl);

    useEffect(() => {
        setPage(1);
    }, [data]);

    return (
        <div className="flex flex-col w-full max-w-sm h-[calc(100vh-220px)] bg-neutral-100 rounded-xl border border-[--neutral-300] p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">{title}</h3>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-muted-foreground cursor-pointer ml-1" />
                    </TooltipTrigger>
                    <TooltipContent
                        side="top"
                        className="z-50 bg-neutral-700 text-neutral-950 border border-[--neutral-300] rounded-md shadow-sm text-xs px-3 py-1 whitespace-pre-line"
                    >
                        {formatMessage({ id: "requests_tooltip" })}
                    </TooltipContent>
                </Tooltip>
            </div>

            <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center gap-2">
                    <Select onValueChange={(val) => onSortChange?.(val)}>
                        <SelectTrigger className="h-8 px-2 py-1 text-xs border rounded-md w-[120px]">
                            <SelectValue
                                placeholder={formatMessage({ id: "requests_sort_by" })}
                            />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-100 border border-[--neutral-300] text-sm shadow-md z-50">
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
                            <SelectTrigger className="h-8 px-2 py-1 text-xs border rounded-md w-[160px] truncate overflow-hidden">
                                <SelectValue
                                    placeholder={formatMessage({ id: "requests_status" })}
                                />
                            </SelectTrigger>
                            <SelectContent className="bg-neutral-100 border border-[--neutral-300] text-sm shadow-md z-50">
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
                    className="text-sm"
                />
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1">
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
                                className="bg-neutral-400 border border-[--neutral-300] rounded-lg p-3 cursor-pointer transform transition-transform hover:scale-95 hover:shadow-md"
                                onClick={() => onClick(req)}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <p className="text-sm font-semibold">
                                        {req.description} <span className="text-xs text-muted-foreground">(#{req.id})</span>
                                    </p>
                                    {req.status === Status.FINALIZADO && onReview && (
                                        <Button
                                            className="text-xs bg-[--secondary-default] text-neutral-100 px-3 py-1 rounded-md hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] transition"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onReview(req);
                                            }}
                                        >
                                            {formatMessage({ id: "requests_review_button" })}
                                        </Button>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {formatMessage({ id: "requests_price_prefix"})} {req.offered_price.toFixed(2)}
                                </div>
                                <div className="text-[10px] text-muted-foreground italic">
                                    {formatMessage({ id: "requests_created_prefix"})} {createdAt}
                                </div>
                                <Badge
                                    className="text-neutral-100 text-xs mt-2"
                                    style={{ backgroundColor: StatusMap[req.status as keyof typeof StatusMap].color }}
                                >
                                    {StatusMap[req.status as keyof typeof StatusMap].label}
                                </Badge>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-xs text-muted-foreground">
                        {formatMessage({ id: "requests_no_results" })}
                    </p>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-3 text-xs">
                    <Button
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        className="bg-secondary hover:bg-secondary-hover active:bg-secondary-pressed h-7 px-2 text-xs text-neutral-100"
                    >
                        {formatMessage({ id: "requests_prev" })}
                    </Button>
                    <span className="text-muted-foreground">
                        {formatMessage({ id: "requests_pagination" }, { page, totalPages })}
                    </span>
                    <Button
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                        className="bg-secondary hover:bg-secondary-hover active:bg-secondary-pressed h-7 px-2 text-xs text-neutral-100"
                    >
                        {formatMessage({ id: "requests_next" })}
                    </Button>
                </div>
            )}
        </div>
    );
};
