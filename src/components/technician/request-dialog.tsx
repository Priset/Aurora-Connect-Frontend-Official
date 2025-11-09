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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RequestDialogProps, Status } from "@/interfaces/auroraDb";
import { useOffers } from "@/hooks/useOffers";
import { useRequests } from "@/hooks/useRequests";
import { ArrowLeft, BadgeCheck } from "lucide-react";
import { useIntl } from "react-intl";
import { useNotifications } from "@/hooks/useNotifications";
import { createServiceOfferSchema, ServiceOfferData } from "@/lib/validations";
import { useFormValidation } from "@/hooks/useFormValidation";

export function RequestDialog({ isOpen, onClose, request, onActionComplete }: RequestDialogProps) {
    const { create: createOffer, updateStatus: updateOfferStatus } = useOffers();
    const { updateStatus } = useRequests();
    const [showOfferInput, setShowOfferInput] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { formatMessage } = useIntl();
    const { create: createNotification } = useNotifications();
    const { handleValidationError, handleSuccess } = useFormValidation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ServiceOfferData>({
        resolver: zodResolver(createServiceOfferSchema(request.offered_price)),
        mode: "onChange",
        defaultValues: {
            message: "",
            proposedPrice: request.offered_price + 1,
        },
    });

    useEffect(() => {
        if (!isOpen) {
            setShowOfferInput(false);
            setIsProcessing(false);
            reset();
        } else {
            setValue("proposedPrice", request.offered_price + 1);
        }
        setIsLoading(false);
    }, [isOpen, reset, setValue, request.offered_price]);

    const handleAccept = async () => {
        setIsProcessing(true);
        try {
            const offer = await createOffer({
                requestId: request.id,
                proposedPrice: request.offered_price,
                message: "El técnico ha aceptado esta solicitud.",
            });
            await updateStatus(request.id, Status.ACEPTADO_POR_TECNICO);
            await updateOfferStatus(offer.id, Status.ACEPTADO_POR_TECNICO);
            await createNotification({
                user_id: request.client_id,
                content: `📢 Tu solicitud #${request.id} fue aceptada por el técnico.`,
                status: Status.DESHABILITADO,
            });
            onActionComplete?.();
            toast.success(formatMessage({ id: "request_dialog_accepted" }));
            onClose();
        } catch (err) {
            toast.error(formatMessage({ id: "request_dialog_accept_error" }));
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
                proposedPrice: request.offered_price,
                message: "El técnico ha rechazado esta solicitud.",
            });
            await updateStatus(request.id, Status.RECHAZADO_POR_TECNICO);
            await updateOfferStatus(offer.id, Status.RECHAZADO_POR_TECNICO);
            onActionComplete?.();
            toast.success(formatMessage({ id: "request_dialog_rejected" }));
            onClose();
        } catch (err) {
            toast.error(formatMessage({ id: "request_dialog_reject_error" }));
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const onSubmitOffer = async (data: ServiceOfferData) => {
        setIsProcessing(true);
        try {
            const offer = await createOffer({
                requestId: request.id,
                proposedPrice: data.proposedPrice,
                message: data.message,
            });
            await updateStatus(request.id, Status.CONTRAOFERTA_POR_TECNICO);
            await updateOfferStatus(offer.id, Status.CONTRAOFERTA_POR_TECNICO);
            await createNotification({
                user_id: request.client_id,
                content: `Has recibido una contraoferta en la solicitud #${request.id}.`,
                status: Status.DESHABILITADO,
            });
            onActionComplete?.();
            handleSuccess(formatMessage({ id: "request_dialog_offer_sent" }));
            onClose();
        } catch (err) {
            handleValidationError(formatMessage({ id: "request_dialog_offer_error" }));
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

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

                        <div className="space-y-2">
                            <div className="h-4 w-1/3 bg-white/20 backdrop-blur-sm rounded mx-auto" />
                            <div className="h-3 w-2/3 bg-white/20 backdrop-blur-sm rounded mx-auto" />
                            <div className="h-3 w-1/2 bg-white/20 backdrop-blur-sm rounded mx-auto" />
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="h-10 w-full bg-white/20 backdrop-blur-sm rounded" />
                            <div className="h-10 w-full bg-white/20 backdrop-blur-sm rounded" />
                            <div className="h-10 w-full bg-white/20 backdrop-blur-sm rounded" />
                        </div>
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-center">
                            <div className="flex justify-center mb-2">
                                <div className="p-3 bg-gradient-to-r from-orange-500/30 to-red-500/30 rounded-full backdrop-blur-sm">
                                    <BadgeCheck className="w-8 h-8 text-orange-400" />
                                </div>
                            </div>
                            <DialogTitle className="text-xl font-bold text-white">
                                {formatMessage({ id: "request_dialog_title" })}
                            </DialogTitle>
                            <DialogDescription className="text-sm text-white/70">
                                {formatMessage({ id: "request_dialog_description" })}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="text-sm space-y-2 text-center">
                            <p><strong>
                                {formatMessage({ id: "request_dialog_client" })}
                            </strong> {request.client?.name} {request.client?.last_name}</p>
                            <p><strong>{formatMessage({ id: "request_dialog_description_label" })}</strong> {request.description}</p>
                            <p><strong>
                                {formatMessage({ id: "request_dialog_price_label" })}
                            </strong> Bs. {request.offered_price?.toFixed(2)}</p>
                        </div>

                        {showOfferInput ? (
                            <form onSubmit={handleSubmit(onSubmitOffer)} className="space-y-3 pt-4">
                                <Input
                                    {...register("message")}
                                    placeholder={formatMessage({ id: "request_dialog_offer_reason" })}
                                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:ring-orange-400/50 text-sm"
                                />
                                {errors.message && (
                                    <p className="text-sm text-red-400">{errors.message.message}</p>
                                )}
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register("proposedPrice", { valueAsNumber: true })}
                                    placeholder={formatMessage({ id: "request_dialog_offer_price" })}
                                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:ring-orange-400/50 text-sm"
                                />
                                {errors.proposedPrice && (
                                    <p className="text-sm text-red-400">{errors.proposedPrice.message}</p>
                                )}
                                <Button
                                    type="submit"
                                    disabled={isProcessing}
                                    className="w-full py-2 bg-gradient-to-r from-orange-500/80 to-red-500/80 hover:from-orange-600/80 hover:to-red-600/80 backdrop-blur-sm text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                                >
                                    {formatMessage({ id: "request_dialog_send_offer" })}
                                </Button>
                            </form>
                        ) : (
                            <div className="flex flex-col gap-3 pt-4">
                                <div className="flex gap-3">
                                    <Button
                                        onClick={handleAccept}
                                        disabled={isProcessing}
                                        className="flex-1 py-2 bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/80 hover:to-emerald-600/80 backdrop-blur-sm text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                                    >
                                        {formatMessage({ id: "request_dialog_accept" })}
                                    </Button>
                                    <Button
                                        onClick={handleReject}
                                        disabled={isProcessing}
                                        className="flex-1 py-2 bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-600/80 hover:to-red-700/80 backdrop-blur-sm text-white text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                                    >
                                        {formatMessage({ id: "request_dialog_reject" })}
                                    </Button>
                                </div>
                                <Button
                                    onClick={() => setShowOfferInput(true)}
                                    disabled={isProcessing}
                                    className="w-full py-2 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 backdrop-blur-sm text-white text-sm font-medium mt-2 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20"
                                >
                                    {formatMessage({ id: "request_dialog_counter_offer_btn" })}
                                </Button>
                            </div>
                        )}

                        {showOfferInput && (
                            <Button
                                onClick={() => setShowOfferInput(false)}
                                className="bg-white/20 backdrop-blur-sm absolute top-4 left-4 text-white hover:text-white/80 hover:bg-white/30 transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/30"
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
