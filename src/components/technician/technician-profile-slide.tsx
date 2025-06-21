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
import {Star, User as UserIcon} from "lucide-react";

export function TechnicianProfileSlide({ isOpen, onClose, technicianId }: TechnicianProfileSlideProps) {
    const { getPublicById } = useTechnicians();
    const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !technicianId) return;

        (async () => {
            setIsLoading(true);
            try {
                const tech = await getPublicById(technicianId);
                setTechnician(tech);
            } catch (error) {
                console.error("Error al obtener técnico:", error);
            } finally {
                setIsLoading(false);
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

                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex items-center gap-4 border-b border-[--neutral-300] pb-4">
                            <div className="w-16 h-16 bg-[--neutral-300] rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-2/3 bg-[--neutral-300] rounded" />
                                <div className="h-3 w-1/3 bg-[--neutral-300] rounded" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 w-1/3 bg-[--neutral-300] rounded" />
                            <div className="h-3 w-full bg-[--neutral-300] rounded" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 w-1/3 bg-[--neutral-300] rounded" />
                            <div className="h-3 w-1/4 bg-[--neutral-300] rounded" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 w-1/3 bg-[--neutral-300] rounded" />
                            {[...Array(2)].map((_, idx) => (
                                <div key={idx} className="h-12 w-full bg-[--neutral-300] rounded" />
                            ))}
                        </div>
                    </div>
                ) : (
                    technician && technician.user && (
                        <div className="space-y-5">
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

                            <div>
                                <p className="text-sm font-semibold mb-1">Experiencia</p>
                                <p className="text-sm text-muted-foreground">
                                    {technician.experience || "No proporcionada."}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-semibold mb-1">Años de experiencia</p>
                                <p className="text-sm text-muted-foreground">
                                    {technician.years_experience
                                        ? `${technician.years_experience} años`
                                        : "No especificado"}
                                </p>
                            </div>

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
                                                    {[1, 2, 3, 4, 5].map((val) => (
                                                        <Star
                                                            key={val}
                                                            className={`w-4 h-4 ${
                                                                val <= review.rating
                                                                    ? "text-yellow-400 fill-yellow-400"
                                                                    : "text-neutral-300"
                                                            }`}
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
                    )
                )}
            </SheetContent>
        </Sheet>
    );
}
