import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RequestDialogProps, StatusMap, Status } from "@/interfaces/auroraDb";
import { BadgeCheck } from "lucide-react";

export function RequestViewDialog({ isOpen, onClose, request }: RequestDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md bg-white dark:bg-[--neutral-100] text-[--foreground] rounded-xl p-6 space-y-4">
                <DialogHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <BadgeCheck className="w-12 h-12 text-[--secondary-default]" />
                    </div>
                    <DialogTitle className="text-xl font-bold">
                        Solicitud #{request.id}
                    </DialogTitle>
                </DialogHeader>

                <div className="text-sm space-y-2 text-center">
                    <p><strong>Cliente:</strong> {request.client?.name} {request.client?.last_name}</p>
                    <p><strong>Descripción:</strong> {request.description}</p>
                    <p><strong>Precio ofertado:</strong> Bs. {request.offered_price?.toFixed(2)}</p>
                    <p>
                        <strong>Estado:</strong>{" "}
                        <span className={`font-semibold text-[${StatusMap[request.status as Status].color}]`}>
                            {StatusMap[request.status as Status].label}
                        </span>
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
