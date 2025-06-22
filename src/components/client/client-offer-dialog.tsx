import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {BadgeCheck} from "lucide-react";
import {RequestDialogProps, Status} from "@/interfaces/auroraDb";
import {useRequests} from "@/hooks/useRequests";
import {toast} from "sonner";
import {useState, useEffect} from "react";
import {TechnicianProfileSlide} from "@/components/technician/technician-profile-slide";
import {useIntl} from "react-intl";

export function ClientOfferDialog({isOpen, onClose, request, onActionComplete}: RequestDialogProps) {
    const {updateStatus} = useRequests();
    const [showProfile, setShowProfile] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const offer = request.serviceOffers?.[0];
    const {formatMessage} = useIntl();

    useEffect(() => {
        if (!isOpen) return;
        setIsLoading(false);
    }, [isOpen]);

    const handleAccept = async () => {
        if (!offer) return;
        setIsProcessing(true);
        try {
            await updateStatus(request.id, Status.ACEPTADO_POR_CLIENTE);
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
        if (!offer) return;
        setIsProcessing(true);
        try {
            await updateStatus(request.id, Status.RECHAZADO_POR_CLIENTE);
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
                className="w-full max-w-md bg-white dark:bg-[--neutral-100] text-[--foreground] rounded-xl p-6 space-y-4">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex justify-center mb-2">
                            <div className="w-12 h-12 bg-[--neutral-300] rounded-full"/>
                        </div>
                        <div className="h-6 w-2/3 bg-[--neutral-300] rounded mx-auto"/>
                        <div className="h-4 w-1/2 bg-[--neutral-300] rounded mx-auto"/>

                        <div className="space-y-2">
                            <div className="h-4 w-1/3 bg-[--neutral-300] rounded mx-auto"/>
                            <div className="h-3 w-2/3 bg-[--neutral-300] rounded mx-auto"/>
                            <div className="h-3 w-1/2 bg-[--neutral-300] rounded mx-auto"/>
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="h-10 w-full bg-[--neutral-300] rounded"/>
                            <div className="h-10 w-full bg-[--neutral-300] rounded"/>
                            <div className="h-10 w-full bg-[--neutral-300] rounded"/>
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-center">
                            <div className="flex justify-center mb-2">
                                <BadgeCheck className="w-12 h-12 text-[--secondary-default]"/>
                            </div>
                            <DialogTitle className="text-xl font-bold">
                                {formatMessage({id: "client_offer_title"})}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-muted-foreground">
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
                                        className="flex-1 py-2 bg-[--success-default] hover:bg-[--success-hover] active:bg-[--success-pressed] text-white text-sm font-medium transition transform hover:scale-105 active:scale-95"
                                    >
                                        {formatMessage({id: "client_offer_accept"})}
                                    </Button>
                                    <Button
                                        onClick={handleReject}
                                        disabled={isProcessing}
                                        className="flex-1 py-2 bg-[--error-default] hover:bg-[--error-hover] active:bg-[--error-pressed] text-white text-sm font-medium transition transform hover:scale-105 active:scale-95"
                                    >
                                        {formatMessage({id: "client_offer_reject"})}
                                    </Button>
                                </div>
                                <Button
                                    onClick={handleViewProfile}
                                    className="w-full py-2 bg-[--secondary-default] hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] text-white text-sm font-medium mt-2 transition transform hover:scale-105 active:scale-95"
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
