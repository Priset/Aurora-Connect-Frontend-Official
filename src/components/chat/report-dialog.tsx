"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { useReports, CreateReportDto } from "@/hooks/useReports";
import { reportSchema, ReportData } from "@/lib/validations";
import { useFormValidation } from "@/hooks/useFormValidation";

interface ReportDialogProps {
    isOpen: boolean;
    onClose: () => void;
    chatId: number;
    reportedUserId: number;
    reportedUserName: string;
}

export function ReportDialog({
    isOpen,
    onClose,
    chatId,
    reportedUserId,
    reportedUserName,
}: ReportDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { create } = useReports();
    const { handleValidationError, handleSuccess } = useFormValidation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<ReportData>({
        resolver: zodResolver(reportSchema),
        mode: "onChange",
        defaultValues: {
            reason: undefined,
            description: "",
        },
    });

    const reason = watch("reason");

    const onSubmit = async (data: ReportData) => {
        setIsSubmitting(true);
        try {
            const payload: CreateReportDto = {
                chatId,
                reportedUserId,
                reason: data.reason,
                description: data.description,
            };

            await create(payload);
            handleSuccess("Reporte enviado correctamente. El chat ha sido cerrado.");
            reset();
            onClose();
        } catch (error) {
            console.error("Error al enviar reporte:", error);
            handleValidationError("Error al enviar el reporte. Inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const reasonOptions = [
        { value: "harassment", label: "Acoso o intimidación" },
        { value: "inappropriate_language", label: "Lenguaje inapropiado" },
        { value: "unprofessional_behavior", label: "Comportamiento no profesional" },
        { value: "other", label: "Otro" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl p-6">
                <DialogHeader className="text-center">
                    <div className="flex justify-center mb-2">
                        <AlertTriangle className="w-12 h-12 text-red-400 animate-pulse" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-white">
                        Reportar Usuario
                    </DialogTitle>
                    <p className="text-sm text-white/70 mt-2">
                        Reportar a <strong className="text-white">{reportedUserName}</strong> por comportamiento inapropiado
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">
                            Razón del reporte
                        </label>
                        <Select
                            value={reason}
                            onValueChange={(value) => setValue("reason", value as "harassment" | "inappropriate_language" | "unprofessional_behavior" | "other")}
                        >
                            <SelectTrigger className="bg-white/20 backdrop-blur-sm border border-white/30 text-white">
                                <SelectValue placeholder="Selecciona una razón" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/10 backdrop-blur-md border border-white/20">
                                {reasonOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/20">
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.reason && (
                            <p className="text-sm text-red-400">{errors.reason.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">
                            Descripción detallada
                        </label>
                        <Textarea
                            {...register("description")}
                            placeholder="Describe el comportamiento inapropiado..."
                            rows={4}
                            className="bg-white/20 backdrop-blur-sm border border-white/30 focus:ring-red-400/50 rounded-lg text-white placeholder:text-white/70"
                        />
                        {errors.description && (
                            <p className="text-sm text-red-400">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30 transition-all duration-200"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !reason}
                            className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-200 hover:scale-105"
                        >
                            {isSubmitting ? "Enviando..." : "Enviar Reporte"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}