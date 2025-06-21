"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { BadgeCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useReviews } from "@/hooks/useReviews";
import { Chat } from "@/interfaces/auroraDb";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    chat: Chat;
}

export function ReviewDialog({ isOpen, onClose, chat }: Props) {
    const { profile } = useAuth();
    const { create } = useReviews();
    const [isLoading, setIsLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsLoading(false);
            setRating(0);
            setComment("");
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        if (!profile) return;

        if (!chat.request_id || !chat.technician_id || !profile.id || !rating) {
            toast.error("Por favor completa todos los campos obligatorios.");
            return;
        }

        const payload = {
            request_id: chat.request_id,
            technician_id: chat.technician_id,
            rating,
            comment,
        };

        setSubmitting(true);
        try {
            await create(payload);
            toast.success("Valoración enviada correctamente.");
            onClose();
        } catch (error) {
            console.error("❌ Error al enviar valoración:", error);
            toast.error("Hubo un error al enviar la valoración.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md bg-neutral-100 dark:bg-[--neutral-100] text-[--foreground] rounded-xl p-6 space-y-4">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex justify-center mb-2">
                            <div className="w-12 h-12 bg-[--neutral-300] rounded-full" />
                        </div>
                        <div className="h-6 w-2/3 bg-[--neutral-300] rounded mx-auto" />
                        <div className="h-4 w-1/2 bg-[--neutral-300] rounded mx-auto" />
                        <div className="h-4 w-3/4 bg-[--neutral-300] rounded mx-auto" />
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-center">
                            <div className="flex justify-center mb-2">
                                <BadgeCheck className="w-12 h-12 text-[--secondary-default]" />
                            </div>
                            <DialogTitle className="text-xl font-bold text-center">
                                Califica al Técnico
                            </DialogTitle>
                        </DialogHeader>

                        <div className="flex justify-center gap-1">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <Star
                                    key={val}
                                    onClick={() => setRating(val)}
                                    className={cn(
                                        "w-8 h-8 cursor-pointer transition",
                                        val <= rating
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-neutral-400"
                                    )}
                                />
                            ))}
                        </div>

                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Escribe un comentario (opcional)..."
                            className="text-sm bg-white border border-[--neutral-300] focus:ring-[--secondary-default] rounded-lg"
                            rows={3}
                        />

                        <Button
                            onClick={handleSubmit}
                            disabled={rating === 0 || submitting}
                            className="w-full bg-[--secondary-default] hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] text-white rounded-lg"
                        >
                            Enviar Calificación
                        </Button>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
