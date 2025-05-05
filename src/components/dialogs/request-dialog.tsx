import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { RequestDialogProps, Status } from "@/interfaces/auroraDb";
import { useOffers } from "@/hooks/useOffers";
import { useRequests } from "@/hooks/useRequests";
import { useAuth } from "@/hooks/useAuth";
import { CheckCircle } from "lucide-react";

export function RequestDialog({ isOpen, onClose, request }: RequestDialogProps) {
    const { profile } = useAuth();
    const { create: createOffer, updateStatus: updateOfferStatus } = useOffers();
    const { updateStatus } = useRequests();
    const [showOfferInput, setShowOfferInput] = useState(false);
    const [newPrice, setNewPrice] = useState("");
    const [offerReason, setOfferReason] = useState("");

    const handleAccept = async () => {
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
            toast.success("✅ Solicitud aceptada.");
            onClose();
        } catch (err) {
            toast.error("❌ Error al aceptar la solicitud.");
            console.error(err);
        }
    };

    const handleReject = async () => {
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
            toast.success("🛑 Solicitud rechazada.");
            onClose();
        } catch (err) {
            toast.error("❌ Error al rechazar la solicitud.");
            console.error(err);
        }
    };

    const handleSubmitOffer = async () => {
        const price = parseFloat(newPrice);
        if (isNaN(price) || price <= 0) {
            toast.error("❌ Ingresa un precio válido.");
            return;
        }
        if (offerReason.trim() === "") {
            toast.error("❌ Describe la razón de tu contraoferta.");
            return;
        }

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
            toast.success("📤 Contraoferta enviada.");
            onClose();
        } catch (err) {
            toast.error("❌ Error al enviar contraoferta.");
            console.error(err);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md bg-white dark:bg-[--neutral-100] text-[--foreground] rounded-xl p-6 space-y-4">

                <DialogHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <CheckCircle className="w-12 h-12 text-[--secondary-default]" />
                    </div>

                    <DialogTitle className="text-xl font-bold">
                        Solicitud #{request.id}
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

                {showOfferInput && (
                    <div className="w-full space-y-2">
                        <label className="text-sm font-medium">Describa la razón</label>
                        <Input
                            type="text"
                            value={offerReason}
                            onChange={(e) => setOfferReason(e.target.value)}
                            placeholder="Ej: Puedo hacerlo pero requiere más materiales"
                            className="bg-white dark:bg-[--neutral-200]"
                        />
                        <label className="text-sm font-medium">Nuevo precio (Bs.)</label>
                        <Input
                            type="number"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            placeholder="Ej: 200"
                            className="bg-white dark:bg-[--neutral-200]"
                        />
                        <Button
                            onClick={handleSubmitOffer}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            Enviar contraoferta
                        </Button>
                    </div>
                )}

                {!showOfferInput && (
                    <div className="w-full flex flex-col items-center gap-4">
                        <div className="flex gap-3 w-full max-w-xs">
                            <Button
                                onClick={handleAccept}
                                className="bg-green-500 hover:bg-green-600 text-white flex-1"
                            >
                                Aceptar Solicitud
                            </Button>
                            <Button
                                onClick={handleReject}
                                className="bg-red-500 hover:bg-red-600 text-white flex-1"
                            >
                                Rechazar Solicitud
                            </Button>
                        </div>
                        <Button
                            onClick={() => setShowOfferInput(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white w-[220px]"
                        >
                            Ofertar nuevo precio
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
