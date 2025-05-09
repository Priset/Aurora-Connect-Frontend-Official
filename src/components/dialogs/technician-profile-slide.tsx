import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {TechnicianProfile, User, ServiceReview, TechnicianProfileSlideProps} from "@/interfaces/auroraDb";
import { useTechnicians } from "@/hooks/useTechnicians";
import { useUsers } from "@/hooks/useUsers";
import { useReviews } from "@/hooks/useReviews";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, User as UserIcon } from "lucide-react";

type ExtendedUser = User & { picture?: string };

export function TechnicianProfileSlide({ isOpen, onClose, technicianId }: TechnicianProfileSlideProps) {
    const { getById: getTechById } = useTechnicians();
    const { getById: getUserById } = useUsers();
    const { getAll } = useReviews();

    const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
    const [user, setUser] = useState<ExtendedUser | null>(null);
    const [reviews, setReviews] = useState<ServiceReview[]>([]);

    useEffect(() => {
        if (!technicianId) return;

        (async () => {
            const tech = await getTechById(technicianId);
            const usr = await getUserById(tech.user_id);
            const allReviews = await getAll();
            const filteredReviews = allReviews.filter(r => r.technician_id === tech.id);

            setTechnician(tech);
            setUser(usr);
            setReviews(filteredReviews);
        })();
    }, [technicianId]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="w-full max-w-2xl sm:ml-auto bg-white dark:bg-[--neutral-100] rounded-xl p-6 overflow-y-auto"
                style={{ height: "100vh", right: 0 }}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Perfil del Técnico</DialogTitle>
                </DialogHeader>

                {user && technician && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="w-20 h-20">
                                {user.picture ? (
                                    <AvatarImage src={user.picture} alt="Foto del técnico" />
                                ) : (
                                    <AvatarFallback className="bg-[--secondary-default] text-white">
                                        <UserIcon className="w-6 h-6" />
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <div>
                                <p className="text-lg font-semibold">{user.name} {user.last_name}</p>
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
                                {reviews.length > 0 ? reviews.map((review) => (
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
                                )) : (
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
