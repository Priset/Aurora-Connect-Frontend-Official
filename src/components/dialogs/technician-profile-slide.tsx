import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TechnicianProfile, TechnicianProfileSlideProps } from "@/interfaces/auroraDb";
import { useTechnicians } from "@/hooks/useTechnicians";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, User as UserIcon } from "lucide-react";

export function TechnicianProfileSlide({ isOpen, onClose, technicianId }: TechnicianProfileSlideProps) {
    const { getPublicById } = useTechnicians();
    const [technician, setTechnician] = useState<TechnicianProfile | null>(null);

    useEffect(() => {
        if (!technicianId) return;

        (async () => {
            try {
                const tech = await getPublicById(technicianId);
                setTechnician(tech);
            } catch (error) {
                console.error("Error al obtener técnico:", error);
            }
        })();
    }, [technicianId, getPublicById]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="w-full max-w-2xl sm:ml-auto bg-white dark:bg-[--neutral-100] rounded-xl p-6 overflow-y-auto"
                style={{ height: "100vh", right: 0 }}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Perfil del Técnico</DialogTitle>
                    <DialogDescription>Información del perfil</DialogDescription>
                </DialogHeader>

                {technician && technician.user && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20">
                                <AvatarFallback className="bg-[--secondary-default] text-white">
                                    <UserIcon className="w-6 h-6" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-lg font-semibold">
                                    {technician.user.name} {technician.user.last_name}
                                </p>
                                <p className="text-sm text-muted-foreground">Técnico registrado</p>
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold mb-2">Experiencia</p>
                            <p className="text-sm text-muted-foreground">
                                {technician.experience || "No proporcionada."}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold mb-2">Años de experiencia</p>
                            <p className="text-sm text-muted-foreground">
                                {technician.years_experience ? `${technician.years_experience} años` : "No especificado"}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold mb-2">Valoraciones</p>
                            <div className="space-y-4">
                                {technician.service_reviews?.length ? (
                                    technician.service_reviews.map((review) => (
                                        <div key={review.id} className="p-3 border rounded-lg bg-[--card] text-[--card-foreground]">
                                            <p className="text-sm italic text-muted-foreground">
                                                &quot;{review.comment || "Sin comentario"}&quot;
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                {[...Array(review.rating)].map((_, idx) => (
                                                    <Star key={idx} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">Aún no tiene valoraciones.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
