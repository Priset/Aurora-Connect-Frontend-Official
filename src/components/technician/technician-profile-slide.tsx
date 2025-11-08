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
import { useIntl } from "react-intl";

export function TechnicianProfileSlide({ isOpen, onClose, technicianId }: TechnicianProfileSlideProps) {
    const { getPublicById } = useTechnicians();
    const [technician, setTechnician] = useState<TechnicianProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { formatMessage } = useIntl();

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
            <SheetOverlay className="bg-black/60 backdrop-blur-sm z-[50]" />
            <SheetContent
                side="right"
                className="w-full max-w-sm bg-white/10 backdrop-blur-xl border-l border-white/20 shadow-2xl z-[60] text-white flex flex-col overflow-hidden"
            >
                <SheetHeader className="mb-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-4 border border-white/20 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full">
                            <UserIcon className="w-5 h-5 text-blue-400" />
                        </div>
                        <SheetTitle className="text-lg font-bold text-white">
                            {formatMessage({ id: "technician_profile_title" })}
                        </SheetTitle>
                    </div>
                    <SheetDescription className="text-sm text-white/70">
                        {formatMessage({ id: "technician_profile_description" })}
                    </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto pr-2">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex items-center gap-4 border-b border-white/20 pb-4">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-2/3 bg-white/20 backdrop-blur-sm rounded" />
                                <div className="h-3 w-1/3 bg-white/20 backdrop-blur-sm rounded" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 w-1/3 bg-white/20 backdrop-blur-sm rounded" />
                            <div className="h-3 w-full bg-white/20 backdrop-blur-sm rounded" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 w-1/3 bg-white/20 backdrop-blur-sm rounded" />
                            <div className="h-3 w-1/4 bg-white/20 backdrop-blur-sm rounded" />
                        </div>

                        <div className="space-y-2">
                            <div className="h-4 w-1/3 bg-white/20 backdrop-blur-sm rounded" />
                            {[...Array(2)].map((_, idx) => (
                                <div key={idx} className="h-12 w-full bg-white/20 backdrop-blur-sm rounded" />
                            ))}
                        </div>
                    </div>
                ) : (
                    technician && technician.user && (
                        <div className="space-y-5 pb-4">
                            <div className="flex items-center gap-4 border-b border-white/20 pb-4 bg-white/5 backdrop-blur-sm rounded-lg p-4">
                                <Avatar className="w-16 h-16 border-2 border-white/30">
                                    <AvatarFallback className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white text-lg">
                                        <UserIcon className="w-6 h-6" />
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-base font-semibold leading-snug text-white">
                                        {technician.user.name} {technician.user.last_name}
                                    </p>
                                    <p className="text-sm text-white/70">
                                        {formatMessage({ id: "technician_profile_registered" })}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <div className="text-sm font-semibold mb-2 text-white flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    {formatMessage({ id: "technician_profile_experience" })}
                                </div>
                                <p className="text-sm text-white/80 leading-relaxed">
                                    {technician.experience || formatMessage({ id: "technician_profile_experience_none" })}
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <div className="text-sm font-semibold mb-2 text-white flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                    {formatMessage({ id: "technician_profile_years" })}
                                </div>
                                <p className="text-sm text-white/80">
                                    {technician.years_experience
                                        ? `${technician.years_experience} ${formatMessage({ id: "technician_profile_years_suffix" })}`
                                        : formatMessage({ id: "technician_profile_years_none" })}
                                </p>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                                <div className="text-sm font-semibold mb-3 text-white flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    {formatMessage({ id: "technician_profile_reviews" })}
                                </div>
                                <div className="space-y-3">
                                    {technician.service_reviews?.length ? (
                                        technician.service_reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-all duration-200"
                                            >
                                                <p className="text-sm italic text-white/80 mb-2 leading-relaxed">
                                                    &quot;{review.comment || formatMessage({id: "technician_profile_no_comment"})}&quot;
                                                </p>
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
                                            </div>
                                        ))
                                    ) : (
                                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-center">
                                            <Star className="w-8 h-8 text-white/30 mx-auto mb-2" />
                                            <p className="text-sm text-white/70">
                                                {formatMessage({ id: "technician_profile_no_reviews" })}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
