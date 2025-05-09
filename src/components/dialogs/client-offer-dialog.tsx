import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";
import { RequestDialogProps, Status } from "@/interfaces/auroraDb";
import { useRequests } from "@/hooks/useRequests";
import { toast } from "sonner";
import {useState} from "react";
import {TechnicianProfileSlide} from "@/components/dialogs/technician-profile-slide";

export function ClientOfferDialog({ isOpen, onClose, request, onActionComplete }: RequestDialogProps) {
    const { updateStatus } = useRequests();
    const [showProfile, setShowProfile] = useState(false);
    const offer = request.serviceOffers?.[0];

    const handleAccept = async () => {
        if (!offer) return;
        try {
            await updateStatus(request.id, Status.ACEPTADO_POR_CLIENTE);
            toast.success("✅ Oferta aceptada.");
            onActionComplete?.();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("❌ Error al aceptar la oferta.");
        }
    };

    const handleReject = async () => {
        if (!offer) return;
        try {
            await updateStatus(request.id, Status.RECHAZADO_POR_CLIENTE);
            toast.success("🛑 Oferta rechazada.");
            onActionComplete?.();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("❌ Error al rechazar la oferta.");
        }
    };

    const handleViewProfile = () => {
        if (!offer?.technician_id) {
            toast.error("No se encontró al técnico.");
            return;
        }
        setShowProfile(true);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md bg-white dark:bg-[--neutral-100] text-[--foreground] rounded-xl p-6 space-y-4">
                <DialogHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <BadgeCheck className="w-12 h-12 text-[--secondary-default]" />
                    </div>
                    <DialogTitle className="text-xl font-bold">
                        Oferta de Técnico
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Revisa la solicitud y selecciona una acción
                    </DialogDescription>
                </DialogHeader>

                <div className="text-sm space-y-2 text-center">
                    <p><strong>Solicitud:</strong> {request.description}</p>
                    <p><strong>Mensaje del técnico:</strong> {offer?.message || "Sin mensaje"}</p>
                    <p><strong>Precio propuesto:</strong> Bs. {offer?.proposed_price?.toFixed(2) || "0.00"}</p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                    <div className="flex justify-between gap-2">
                        <Button onClick={handleAccept} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                            Aceptar Oferta
                        </Button>
                        <Button onClick={handleReject} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                            Rechazar Oferta
                        </Button>
                    </div>
                    <Button onClick={handleViewProfile} className="bg-[--secondary-default] hover:opacity-90 text-white w-full">
                        Ver Perfil del Técnico
                    </Button>
                </div>
            </DialogContent>
            {offer?.technician_id && (
                <TechnicianProfileSlide
                    isOpen={showProfile}
                    onClose={() => setShowProfile(false)}
                    technicianId={offer.technician_id}
                />
            )}
        </Dialog>
    );
}
