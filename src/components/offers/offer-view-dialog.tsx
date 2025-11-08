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
            <DialogContent className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-6 space-y-4">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex justify-center mb-2">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full" />
                        </div>
                        <div className="h-6 w-2/3 bg-white/20 backdrop-blur-sm rounded mx-auto" />
                        <div className="h-4 w-1/2 bg-white/20 backdrop-blur-sm rounded mx-auto" />
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-center">
                            <div className="flex justify-center mb-2">
                                <div className="p-3 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full backdrop-blur-sm">
                                    <BadgeCheck className="w-8 h-8 text-blue-400" />
                                </div>
                            </div>
                            <DialogTitle className="text-xl font-bold text-center text-white">
                                {formatMessage({ id: "offer_view_title" })}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-white/70 mt-1 text-center">
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
