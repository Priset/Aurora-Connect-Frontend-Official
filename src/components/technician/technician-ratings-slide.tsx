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
            <SheetOverlay className="bg-black/60 backdrop-blur-sm z-[50]" />
            <SheetContent
                side="right"
                className="w-full max-w-sm bg-white/10 backdrop-blur-xl border-l border-white/20 shadow-2xl z-[60] text-white"
            >
                <SheetHeader className="mb-4 bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full">
                            <Star className="w-5 h-5 text-yellow-400" />
                        </div>
                        <SheetTitle className="text-lg font-bold text-white">
                            {formatMessage({ id: "technician_ratings_title" })}
                        </SheetTitle>
                    </div>
                    <SheetDescription className="text-sm text-white/70">
                        {formatMessage({ id: "technician_ratings_description" })}
                    </SheetDescription>
                </SheetHeader>

                {isLoading ? (
                    <div className="space-y-3 animate-pulse">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-14 bg-white/20 backdrop-blur-sm rounded-lg" />
                        ))}
                    </div>
                ) : reviews.length > 0 ? (
                    <div className="space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-1 custom-scrollbar">
                        {reviews.map((review, index) => (
                            <div
                                key={review.id}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 hover:bg-white/15 transition-all duration-200 hover:scale-[1.02]"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <Star
                                                key={val}
                                                className={`w-4 h-4 ${
                                                    val <= review.rating
                                                        ? "text-yellow-400 fill-yellow-400"
                                                        : "text-white/30"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">
                                        #{index + 1}
                                    </div>
                                </div>
                                <p className="text-sm italic text-white/80 leading-relaxed">
                                    &quot;{review.comment || formatMessage({ id: "technician_ratings_no_comment"})}&quot;
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center mt-4">
                        <div className="flex justify-center mb-3">
                            {[1, 2, 3, 4, 5].map((val) => (
                                <Star key={val} className="w-6 h-6 text-white/20" />
                            ))}
                        </div>
                        <p className="text-sm text-white/70">
                            {formatMessage({ id: "technician_ratings_no_reviews" })}
                        </p>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};
