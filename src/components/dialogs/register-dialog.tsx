"use client";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

export interface RegisterDialogProps {
    role: "client" | "technician";
    onClose: (result?: RegisterFormData) => void;
}

export interface RegisterFormData {
    name: string;
    last_name: string;
    experience?: string;
    years_experience?: number;
    role: "client" | "technician";
}

export function RegisterDialog({ role, onClose }: RegisterDialogProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>();

    const submit = (data: RegisterFormData) => {
        const payload: RegisterFormData = {
            ...data,
            role,
        };

        if (role === "client") {
            delete payload.experience;
            delete payload.years_experience;
        } else {
            payload.years_experience = Number(payload.years_experience || 0);
        }

        onClose(payload);
    };

    return (
        <Dialog open onOpenChange={() => onClose()}>
            <DialogContent className="max-w-md bg-[--neutral-100] text-[--foreground] border border-[--neutral-300] rounded-2xl shadow-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-display text-[--primary-default]">
                        Registro como {role === "client" ? "Cliente" : "Técnico"}
                    </DialogTitle>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit(submit)}
                    className="space-y-4 py-4 px-1"
                    id="register-form"
                >
                    <Input
                        placeholder="Nombre"
                        className="bg-[--neutral-200] border border-[--neutral-400] text-[--foreground] focus:ring-[--primary-default]"
                        {...register("name", { required: true })}
                    />
                    {errors.name && (
                        <p className="text-sm text-[--error-default]">Requerido</p>
                    )}

                    <Input
                        placeholder="Apellido"
                        className="bg-[--neutral-200] border border-[--neutral-400] text-[--foreground] focus:ring-[--primary-default]"
                        {...register("last_name", { required: true })}
                    />
                    {errors.last_name && (
                        <p className="text-sm text-[--error-default]">Requerido</p>
                    )}

                    {role === "technician" && (
                        <>
                            <Textarea
                                placeholder="Experiencia"
                                className="bg-[--neutral-200] border border-[--neutral-400] text-[--foreground] focus:ring-[--primary-default]"
                                {...register("experience")}
                            />
                            <Input
                                placeholder="Años de experiencia"
                                type="number"
                                min={0}
                                className="bg-[--neutral-200] border border-[--neutral-400] text-[--foreground] focus:ring-[--primary-default]"
                                {...register("years_experience", {
                                    valueAsNumber: true,
                                    min: 0,
                                })}
                            />
                        </>
                    )}
                </form>

                <DialogFooter className="flex justify-end gap-2 pt-4">
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-[--foreground] hover:bg-[--neutral-300]"
                        onClick={() => onClose()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="register-form"
                        className="bg-[--primary-default] text-white hover:bg-[--primary-hover] transition"
                    >
                        Registrarse
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
