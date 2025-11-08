import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {BadgeCheck} from "lucide-react";
import {RequestDialogProps, Status} from "@/interfaces/auroraDb";
import {useRequests} from "@/hooks/useRequests";
import {toast} from "sonner";
import {useState, useEffect} from "react";
import {TechnicianProfileSlide} from "@/components/technician/technician-profile-slide";
import {useIntl} from "react-intl";
import { useNotifications } from "@/hooks/useNotifications";

export function ClientOfferDialog({isOpen, onClose, request, onActionComplete}: RequestDialogProps) {
    const {updateStatus} = useRequests();
    const [showProfile, setShowProfile] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const offer = request.serviceOffers?.[0];
    const {formatMessage} = useIntl();
    const { create: createNotification } = useNotifications();

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(false);
    }, [isOpen]);

    const handleAccept = async () => {
        if (!offer || !offer.technician?.user?.id) {
            toast.error("No se pudo identificar al técnico para enviar notificación.");
            return;
        }
        setIsProcessing(true);
        try {
            await updateStatus(request.id, Status.ACEPTADO_POR_CLIENTE);
            await createNotification({
                user_id: offer.technician.user.id,
                content: `El cliente aceptó tu oferta para la solicitud #${request.id}`,
            });
            toast.success(formatMessage({id: "client_offer_accept_success"}));
            onActionComplete?.();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(formatMessage({id: "client_offer_accept_error"}));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!offer || !offer.technician?.user?.id) {
            toast.error("No se pudo identificar al técnico para enviar notificación.");
            return;
        }
        setIsProcessing(true);
        try {
            await updateStatus(request.id, Status.RECHAZADO_POR_CLIENTE);
            await createNotification({
                user_id: offer.technician.user.id,
                content: `El cliente rechazó tu oferta para la solicitud #${request.id}`,
            });
            toast.success(formatMessage({id: "client_offer_reject_success"}));
            onActionComplete?.();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(formatMessage({id: "client_offer_reject_error"}));
        } finally {
            setIsProcessing(false);
        }
    };

    const handleViewProfile = () => {
        if (!offer?.technician_id) {
            toast.error(formatMessage({id: "client_offer_no_technician"}));
            return;
        }
        setShowProfile(true);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-6 space-y-4">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex justify-center mb-2">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full"/>
                        </div>
                        <div className="h-6 w-2/3 bg-white/20 backdrop-blur-sm rounded mx-auto"/>
                        <div className="h-4 w-1/2 bg-white/20 backdrop-blur-sm rounded mx-auto"/>

                        <div className="space-y-2">
                            <div className="h-4 w-1/3 bg-white/20 backdrop-blur-sm rounded mx-auto"/>
                            <div className="h-3 w-2/3 bg-white/20 backdrop-blur-sm rounded mx-auto"/>
                            <div className="h-3 w-1/2 bg-white/20 backdrop-blur-sm rounded mx-auto"/>
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="h-10 w-full bg-white/20 backdrop-blur-sm rounded"/>
                            <div className="h-10 w-full bg-white/20 backdrop-blur-sm rounded"/>
                            <div className="h-10 w-full bg-white/20 backdrop-blur-sm rounded"/>
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-center">
                            <div className="flex justify-center mb-2">
                                <div className="p-3 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full backdrop-blur-sm">
                                    <BadgeCheck className="w-8 h-8 text-green-400"/>
                                </div>
                            </div>
                            <DialogTitle className="text-xl font-bold text-white">
                                {formatMessage({id: "client_offer_title"})}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-white/70">
                                {formatMessage({id: "client_offer_subtitle"})}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="text-sm space-y-2 text-center">
                            <p><strong>{formatMessage({id: "client_offer_request"})}</strong> {request.description}</p>
                            <p>
                                <strong>{formatMessage({id: "client_offer_message"})}</strong> {offer?.message || formatMessage({id: "client_offer_no_message"})}
                            </p>
                            <p>
                                <strong>{formatMessage({id: "client_offer_price"})}</strong> Bs. {offer?.proposed_price?.toFixed(2) || "0.00"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 pt-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleAccept}
                                        disabled={isProcessing}
                                        className="flex-1 py-2 bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/80 hover:to-emerald-600/80 backdrop-blur-sm text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                                    >
                                        {formatMessage({id: "client_offer_accept"})}
                                    </Button>
                                    <Button
                                        onClick={handleReject}
                                        disabled={isProcessing}
                                        className="flex-1 py-2 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-600/80 hover:to-red-700/80 backdrop-blur-sm text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                                    >
                                        {formatMessage({id: "client_offer_reject"})}
                                    </Button>
                                </div>
                                <Button
                                    onClick={handleViewProfile}
                                    className="w-full py-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 backdrop-blur-sm text-white text-sm font-medium mt-2 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                                >
                                    {formatMessage({id: "client_offer_view_profile"})}
                                </Button>
                            </div>
                        </div>
                    </>
                )}
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
