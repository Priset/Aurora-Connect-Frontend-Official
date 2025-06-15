import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { RequestDialogProps, Status } from "@/interfaces/auroraDb";
import { useOffers } from "@/hooks/useOffers";
import { useRequests } from "@/hooks/useRequests";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, BadgeCheck } from "lucide-react";

export function RequestDialog({ isOpen, onClose, request, onActionComplete }: RequestDialogProps) {
    const { profile } = useAuth();
    const { create: createOffer, updateStatus: updateOfferStatus } = useOffers();
    const { updateStatus } = useRequests();
    const [showOfferInput, setShowOfferInput] = useState(false);
    const [newPrice, setNewPrice] = useState("");
    const [offerReason, setOfferReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) {
            setShowOfferInput(false);
            setNewPrice("");
            setOfferReason("");
            setIsProcessing(false);
        }
        setIsLoading(false); // Simula la carga inicial
    }, [isOpen]);

    const handleAccept = async () => {
        setIsProcessing(true);
        try {
            const offer = await createOffer({
                requestId: request.id,
                technician_id: profile!.id,
                proposedPrice: request.offered_price,
                status: Status.ACEPTADO_POR_TECNICO,
                message: "El técnico ha aceptado esta solicitud.",
            });
            await updateStatus(request.id, Status.ACEPTADO_POR_TECNICO);
            await updateOfferStatus(offer.id, Status.ACEPTADO_POR_TECNICO);
            onActionComplete?.();
            toast.success("Solicitud aceptada.");
            onClose();
        } catch (err) {
            toast.error("Error al aceptar la solicitud.");
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        setIsProcessing(true);
        try {
            const offer = await createOffer({
                requestId: request.id,
                technician_id: profile!.id,
                proposedPrice: request.offered_price,
                status: Status.RECHAZADO_POR_TECNICO,
                message: "El técnico ha rechazado esta solicitud.",
            });
            await updateStatus(request.id, Status.RECHAZADO_POR_TECNICO);
            await updateOfferStatus(offer.id, Status.RECHAZADO_POR_TECNICO);
            onActionComplete?.();
            toast.success("Solicitud rechazada.");
            onClose();
        } catch (err) {
            toast.error("Error al rechazar la solicitud.");
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmitOffer = async () => {
        const price = parseFloat(newPrice);
        if (isNaN(price) || price <= 0) {
            toast.error("Ingresa un precio válido.");
            return;
        }
        if (offerReason.trim() === "") {
            toast.error("Describe la razón de tu contraoferta.");
            return;
        }

        setIsProcessing(true);
        try {
            const offer = await createOffer({
                requestId: request.id,
                technician_id: profile!.id,
                proposedPrice: price,
                status: Status.CONTRAOFERTA_POR_TECNICO,
                message: offerReason,
            });
            await updateStatus(request.id, Status.CONTRAOFERTA_POR_TECNICO);
            await updateOfferStatus(offer.id, Status.CONTRAOFERTA_POR_TECNICO);
            onActionComplete?.();
            toast.success("Contraoferta enviada.");
            onClose();
        } catch (err) {
            toast.error("Error al enviar contraoferta.");
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md bg-white dark:bg-[--neutral-100] text-[--foreground] rounded-xl p-6 space-y-4">
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

                        <div className="space-y-3 pt-4">
                            <div className="h-10 w-full bg-[--neutral-300] rounded" />
                            <div className="h-10 w-full bg-[--neutral-300] rounded" />
                            <div className="h-10 w-full bg-[--neutral-300] rounded" />
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-center">
                            <div className="flex justify-center mb-2">
                                <BadgeCheck className="w-12 h-12 text-[--secondary-default]" />
                            </div>
                            <DialogTitle className="text-xl font-bold">
                                Solicitud nueva
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
                                Revisa la solicitud y selecciona una acción
                            </DialogDescription>
                        </DialogHeader>

                        <div className="text-sm space-y-2 text-center">
                            <p><strong>Cliente:</strong> {request.client?.name} {request.client?.last_name}</p>
                            <p><strong>Descripción:</strong> {request.description}</p>
                            <p><strong>Precio ofertado:</strong> Bs. {request.offered_price?.toFixed(2)}</p>
                        </div>

                        {showOfferInput ? (
                            <div className="space-y-3 pt-4">
                                <Input
                                    type="text"
                                    value={offerReason}
                                    onChange={(e) => setOfferReason(e.target.value)}
                                    placeholder="Motivo de tu contraoferta"
                                    className="bg-white dark:bg-[--neutral-200] text-sm"
                                />
                                <Input
                                    type="number"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    placeholder="Nuevo precio (Bs.)"
                                    className="bg-white dark:bg-[--neutral-200] text-sm"
                                />
                                <Button
                                    onClick={handleSubmitOffer}
                                    disabled={isProcessing}
                                    className="w-full py-2 bg-[--secondary-default] hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] text-white text-sm font-medium"
                                >
                                    Enviar contraoferta
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3 pt-4">
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleAccept}
                                        disabled={isProcessing}
                                        className="flex-1 py-2 bg-[--success-default] hover:bg-[--success-hover] active:bg-[--success-pressed] text-white text-sm font-medium"
                                    >
                                        Aceptar Solicitud
                                    </Button>
                                    <Button
                                        onClick={handleReject}
                                        disabled={isProcessing}
                                        className="flex-1 py-2 bg-[--error-default] hover:bg-[--error-hover] active:bg-[--error-pressed] text-white text-sm font-medium"
                                    >
                                        Rechazar Solicitud
                                    </Button>
                                </div>
                                <Button
                                    onClick={() => setShowOfferInput(true)}
                                    disabled={isProcessing}
                                    className="w-full py-2 bg-[--secondary-default] hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] text-white text-sm font-medium mt-2"
                                >
                                    Ofertar nuevo precio
                                </Button>
                            </div>
                        )}

                        {showOfferInput && (
                            <Button
                                onClick={() => setShowOfferInput(false)}
                                className="bg-neutral-100 absolute top-4 left-4 text-[--secondary-default] hover:text-[--secondary-hover] transition"
                                aria-label="Volver"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        )}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
