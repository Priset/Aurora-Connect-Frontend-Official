import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RequestDialogProps, StatusMap } from "@/interfaces/auroraDb";
import { BadgeCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function RequestViewDialog({ isOpen, onClose, request }: RequestDialogProps) {
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
                <DialogHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <BadgeCheck className="w-12 h-12 text-[--secondary-default]" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-center">
                        Detalles de la solicitud
                    </DialogTitle>
                </DialogHeader>

                <div className="text-sm space-y-2 text-center">
                    <p><strong>Cliente:</strong> {request.client?.name} {request.client?.last_name}</p>
                    <p><strong>Descripción:</strong> {request.description}</p>
                    <p><strong>Precio ofertado:</strong> Bs. {request.offered_price?.toFixed(2)}</p>
                    <p>
                        <strong>Estado:</strong>{" "}
                        <Badge
                            className="text-xs"
                            style={{ backgroundColor: StatusMap[request.status as keyof typeof StatusMap].color }}
                        >
                            {StatusMap[request.status as keyof typeof StatusMap].label}
                        </Badge>
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                        Creado: {createdAt}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                        Última actualización: {updatedAt}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
