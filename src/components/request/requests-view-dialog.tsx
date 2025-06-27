import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { RequestDialogProps, getStatusMap } from "@/interfaces/auroraDb";
import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useIntl } from "react-intl";

export function RequestViewDialog({ isOpen, onClose, request }: RequestDialogProps) {
    const [isLoading, setIsLoading] = useState(true);
    const { formatMessage } = useIntl();
    const intl = useIntl();
    const StatusMap = getStatusMap(intl);

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(false);
    }, [isOpen]);

    const createdAt = new Date(request.created_at).toLocaleDateString("es-BO", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    const updatedAt = new Date(request.updated_at).toLocaleDateString("es-BO", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md bg-neutral-100 dark:bg-[--neutral-100] text-[--foreground] rounded-xl p-6 space-y-4">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex justify-center mb-2">
                            <div className="w-12 h-12 bg-[--neutral-300] rounded-full" />
                        </div>
                        <div className="h-6 w-2/3 bg-[--neutral-300] rounded mx-auto" />
                        <div className="h-4 w-1/2 bg-[--neutral-300] rounded mx-auto" />

                        <div className="space-y-2">
                            <div className="h-4 w-1/3 bg-[--neutral-300] rounded mx-auto" />
                            <div className="h-3 w-2/3 bg-[--neutral-300] rounded mx-auto" />
                            <div className="h-3 w-1/2 bg-[--neutral-300] rounded mx-auto" />
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-center">
                            <div className="flex justify-center mb-2">
                                <BadgeCheck className="w-12 h-12 text-[--secondary-default]" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-center">
                                {formatMessage({ id: "request_view_title" })}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-1 text-center">
                                Solicitud: #{request.id}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="text-sm space-y-2 text-center">
                            <p><strong>{formatMessage({ id: "request_view_client" })}</strong> {request.client?.name} {request.client?.last_name}</p>
                            <p><strong>{formatMessage({ id: "request_view_description" })}</strong> {request.description}</p>
                            <p><strong>{formatMessage({ id: "request_view_price" })}</strong> Bs. {request.offered_price?.toFixed(2)}</p>
                            <p><strong>{formatMessage({ id: "request_view_status" })}</strong>{" "}
                                <Badge
                                    className="text-xs text-neutral-100"
                                    style={{ backgroundColor: StatusMap[request.status as keyof typeof StatusMap].color }}
                                >
                                    {StatusMap[request.status as keyof typeof StatusMap].label}
                                </Badge>
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                                {formatMessage({ id: "request_view_created"})} {createdAt}
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                                {formatMessage({ id: "request_view_updated"})} {updatedAt}
                            </p>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
