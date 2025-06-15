"use client";

import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetOverlay,
} from "@/components/ui/sheet";
import { TechnicianProfile, TechnicianProfileSlideProps } from "@/interfaces/auroraDb";
import { useTechnicians } from "@/hooks/useTechnicians";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, User as UserIcon } from "lucide-react";

export function TechnicianProfileSlide({ isOpen, onClose, technicianId }: TechnicianProfileSlideProps) {
    const { getPublicById } = useTechnicians();
    const [technician, setTechnician] = useState<TechnicianProfile | null>(null);

    useEffect(() => {
        if (!isOpen || !technicianId) return;

        (async () => {
            try {
                const tech = await getPublicById(technicianId);
                setTechnician(tech);
            } catch (error) {
                console.error("Error al obtener técnico:", error);
            }
        })();
    }, [technicianId, isOpen, getPublicById]);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetOverlay className="bg-black/50 z-[50]" />
            <SheetContent
                side="right"
                className="w-full max-w-sm bg-white dark:bg-[--neutral-100] text-[--foreground] border-l border-[--neutral-300] shadow-xl z-[60]"
            >
                <SheetHeader className="mb-4">
                    <SheetTitle className="text-lg font-bold">Perfil del Técnico</SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground">
                        Información general
                    </SheetDescription>
                </SheetHeader>

                {technician && technician.user && (
                    <div className="space-y-5">
                        {/* Info básica */}
                        <div className="flex items-center gap-4 border-b border-[--neutral-300] pb-4">
                            <Avatar className="w-16 h-16">
                                <AvatarFallback className="bg-[--secondary-default] text-white text-lg">
                                    <UserIcon className="w-6 h-6" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-base font-semibold leading-snug">
                                    {technician.user.name} {technician.user.last_name}
                                </p>
                                <p className="text-sm text-muted-foreground">Técnico registrado</p>
                            </div>
                        </div>

                        {/* Experiencia */}
                        <div>
                            <p className="text-sm font-semibold mb-1">Experiencia</p>
                            <p className="text-sm text-muted-foreground">
                                {technician.experience || "No proporcionada."}
                            </p>
                        </div>

                        {/* Años de experiencia */}
                        <div>
                            <p className="text-sm font-semibold mb-1">Años de experiencia</p>
                            <p className="text-sm text-muted-foreground">
                                {technician.years_experience
                                    ? `${technician.years_experience} años`
                                    : "No especificado"}
                            </p>
                        </div>

                        {/* Valoraciones */}
                        <div>
                            <p className="text-sm font-semibold mb-1">Valoraciones</p>
                            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                                {technician.service_reviews?.length ? (
                                    technician.service_reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="bg-neutral-100 border border-[--neutral-300] rounded-lg p-3"
                                        >
                                            <p className="text-sm italic text-muted-foreground mb-1">
                                                &quot;{review.comment || "Sin comentario"}&quot;
                                            </p>
                                            <div className="flex items-center gap-1">
                                                {[...Array(review.rating)].map((_, idx) => (
                                                    <Star
                                                        key={idx}
                                                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                                                    />
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
            </SheetContent>
        </Sheet>
    );
}
