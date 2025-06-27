import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck } from "lucide-react";
import { useIntl } from "react-intl";
import { useEffect, useState } from "react";
import { getStatusMap, ServiceOffer } from "@/interfaces/auroraDb";

interface OfferViewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    offer: ServiceOffer;
}

export function OfferViewDialog({ isOpen, onClose, offer }: OfferViewDialogProps) {
    const [isLoading, setIsLoading] = useState(true);
    const { formatMessage } = useIntl();
    const intl = useIntl();
    const StatusMap = getStatusMap(intl);

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(false);
    }, [isOpen]);

    const createdAt = new Date(offer.created_at).toLocaleDateString("es-BO", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const updatedAt = new Date(offer.updated_at).toLocaleDateString("es-BO", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md bg-neutral-100 text-[--foreground] rounded-xl p-6 space-y-4">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex justify-center mb-2">
                            <div className="w-12 h-12 bg-[--neutral-300] rounded-full" />
                        </div>
                        <div className="h-6 w-2/3 bg-[--neutral-300] rounded mx-auto" />
                        <div className="h-4 w-1/2 bg-[--neutral-300] rounded mx-auto" />
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-center">
                            <div className="flex justify-center mb-2">
                                <BadgeCheck className="w-12 h-12 text-[--secondary-default]" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-center">
                                {formatMessage({ id: "offer_view_title" })}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-1 text-center">
                                Solicitud #{offer.request_id}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="text-sm space-y-2 text-center">
                            <p>
                                <strong>{formatMessage({ id: "request_view_price" })}</strong> Bs.{" "}
                                {(offer.proposed_price ?? 0).toFixed(2)}
                            </p>
                            <p>
                                <strong>{formatMessage({ id: "request_view_status" })}</strong>{" "}
                                <Badge
                                    className="text-xs text-neutral-100"
                                    style={{
                                        backgroundColor:
                                        StatusMap[offer.status as keyof typeof StatusMap].color,
                                    }}
                                >
                                    {StatusMap[offer.status as keyof typeof StatusMap].label}
                                </Badge>
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                                {formatMessage({ id: "request_view_created" })} {createdAt}
                            </p>
                            <p className="text-xs text-muted-foreground italic">
                                {formatMessage({ id: "request_view_updated" })} {updatedAt}
                            </p>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
