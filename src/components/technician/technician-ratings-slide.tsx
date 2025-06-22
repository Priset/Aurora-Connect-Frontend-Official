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
import { Star } from "lucide-react";
import { useTechnicians } from "@/hooks/useTechnicians";
import { useAuth } from "@/hooks/useAuth";
import { useIntl } from "react-intl";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export const TechnicianRatingsSlide = ({ isOpen, onClose }: Props) => {
    const { profile } = useAuth();
    const { getById } = useTechnicians();
    const { formatMessage } = useIntl();
    const [isLoading, setIsLoading] = useState(true);
    const [reviews, setReviews] = useState<
        { id: number; comment?: string; rating: number }[]
    >([]);

    useEffect(() => {
        if (!isOpen || !profile || !profile.technicianProfile) return;

        const techId = profile.technicianProfile.id;

        (async () => {
            setIsLoading(true);
            try {
                const technician = await getById(techId);
                setReviews(technician.service_reviews || []);
            } catch (err) {
                console.error("❌ Error al obtener valoraciones del técnico:", err);
            } finally {
                setIsLoading(false);
            }
        })();
    }, [isOpen, profile, getById]);

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetOverlay className="bg-black/50 z-[50]" />
            <SheetContent
                side="right"
                className="w-full max-w-sm bg-white dark:bg-[--neutral-100] text-[--foreground] border-l border-[--neutral-300] shadow-xl z-[60]"
            >
                <SheetHeader className="mb-4">
                    <SheetTitle className="text-lg font-bold">
                        {formatMessage({ id: "technician_ratings_title" })}
                    </SheetTitle>
                    <SheetDescription className="text-sm text-muted-foreground">
                        {formatMessage({ id: "technician_ratings_description" })}
                    </SheetDescription>
                </SheetHeader>

                {isLoading ? (
                    <div className="space-y-3 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-14 bg-[--neutral-300] rounded-md" />
                        ))}
                    </div>
                ) : reviews.length > 0 ? (
                    <div className="space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-[--neutral-100] border border-[--neutral-300] rounded-lg p-3"
                            >
                                <p className="text-sm italic text-muted-foreground mb-1">
                                    &quot;{review.comment || formatMessage({ id: "technician_ratings_no_comment"})}&quot;
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
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground mt-4">
                        {formatMessage({ id: "technician_ratings_no_reviews" })}
                    </p>
                )}
            </SheetContent>
        </Sheet>
    );
};
