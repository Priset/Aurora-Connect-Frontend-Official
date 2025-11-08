"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useReviews } from "@/hooks/useReviews";
import { Chat } from "@/interfaces/auroraDb";
import { cn } from "@/lib/utils";
import { useIntl } from "react-intl";
import { reviewSchema, ReviewData } from "@/lib/validations";
import { useFormValidation } from "@/hooks/useFormValidation";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    chat: Chat;
    onReviewComplete?: () => void;
}

export function ReviewDialog({ isOpen, onClose, chat, onReviewComplete }: Props) {
    const { profile } = useAuth();
    const { create } = useReviews();
    const [isLoading, setIsLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { formatMessage } = useIntl();
    const { handleValidationError, handleSuccess } = useFormValidation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<ReviewData>({
        resolver: zodResolver(reviewSchema),
        mode: "onChange",
        defaultValues: {
            rating: 0,
            comment: "",
        },
    });

    const rating = watch("rating");

    useEffect(() => {
        if (isOpen) {
            setIsLoading(false);
            reset();
        }
    }, [isOpen, reset]);

    const onSubmit = async (data: ReviewData) => {
        if (!profile) return;

        const payload = {
            request_id: chat.request_id,
            rating: data.rating,
            comment: data.comment || "",
        };

        setSubmitting(true);
        try {
            await create(payload);
            handleSuccess(formatMessage({ id: "review_success" }));
            onReviewComplete?.();
            onClose();
        } catch (error) {
            console.error("❌ Error al enviar valoración:", error);
            handleValidationError(formatMessage({ id: "review_error" }));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-6 space-y-4">
                {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="flex justify-center mb-2">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full" />
                        </div>
                        <div className="h-6 w-2/3 bg-white/20 backdrop-blur-sm rounded mx-auto" />
                        <div className="h-4 w-1/2 bg-white/20 backdrop-blur-sm rounded mx-auto" />
                        <div className="h-4 w-3/4 bg-white/20 backdrop-blur-sm rounded mx-auto" />
                    </div>
                ) : (
                    <>
                        <DialogHeader className="text-center">
                            <div className="flex justify-center mb-2">
                                <div className="p-3 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full backdrop-blur-sm">
                                    <Star className="w-8 h-8 text-yellow-400" />
                                </div>
                            </div>
                            <DialogTitle className="text-xl font-bold text-center text-white">
                                {formatMessage({ id: "review_title" })}
                            </DialogTitle>
                        </DialogHeader>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="flex justify-center gap-1">
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <Star
                                        key={val}
                                        onClick={() => setValue("rating", val)}
                                        className={cn(
                                            "w-8 h-8 cursor-pointer transition",
                                            val <= rating
                                                ? "text-yellow-400 fill-yellow-400"
                                                : "text-neutral-400"
                                        )}
                                    />
                                ))}
                            </div>
                            {errors.rating && (
                                <p className="text-sm text-red-500 text-center">{errors.rating.message}</p>
                            )}

                            <Textarea
                                {...register("comment")}
                                placeholder={formatMessage({ id: "review_comment_placeholder" })}
                                className="text-sm bg-white/20 backdrop-blur-sm border border-white/30 focus:ring-yellow-400/50 rounded-lg text-white placeholder:text-white/70"
                                rows={3}
                            />
                            {errors.comment && (
                                <p className="text-sm text-red-500">{errors.comment.message}</p>
                            )}

                            <Button
                                type="submit"
                                disabled={rating === 0 || submitting}
                                className="w-full bg-gradient-to-r from-yellow-500/80 to-orange-500/80 hover:from-yellow-600/80 hover:to-orange-600/80 backdrop-blur-sm text-white rounded-lg transition-all duration-200 hover:scale-105 border border-white/20"
                            >
                                {formatMessage({ id: "review_submit" })}
                            </Button>
                        </form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
