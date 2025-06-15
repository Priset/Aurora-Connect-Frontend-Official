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
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useState } from "react";

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
    const [activeRole, setActiveRole] = useState<"client" | "technician">(role);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>();

    const submit = (data: RegisterFormData) => {
        const payload: RegisterFormData = {
            ...data,
            role: activeRole,
        };

        if (activeRole === "client") {
            delete payload.experience;
            delete payload.years_experience;
        } else {
            payload.years_experience = Number(payload.years_experience || 0);
        }

        onClose(payload);
    };

    return (
        <Dialog open onOpenChange={() => onClose()}>
            <DialogContent className="max-w-sm w-full bg-neutral-100 border border-[--neutral-300] rounded-2xl px-6 py-8 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-display text-center text-[--primary-default]">
                        {activeRole === "client" ? "Registro de Cliente" : "Registro de Técnico"}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                        Completa los campos para continuar con Aurora Connect.
                    </p>
                </DialogHeader>

                <Tabs value={activeRole} onValueChange={(val) => setActiveRole(val as "client" | "technician")}>
                    <TabsList className="grid grid-cols-2 w-full bg-[--neutral-200] rounded-lg mt-6 mb-6 p-1 gap-2">
                        <TabsTrigger
                            value="client"
                            className="data-[state=active]:bg-[--secondary-default] data-[state=active]:text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                        >
                            Cliente
                        </TabsTrigger>
                        <TabsTrigger
                            value="technician"
                            className="data-[state=active]:bg-[--secondary-default] data-[state=active]:text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                        >
                            Técnico
                        </TabsTrigger>
                    </TabsList>

                    <form
                        onSubmit={handleSubmit(submit)}
                        className="space-y-4 pt-4"
                        id="register-form"
                    >
                        <TabsContent value="client">
                            <div className="space-y-4">
                                <Input
                                    placeholder="Nombre"
                                    className="bg-[--neutral-200] border border-[--neutral-400] placeholder:text-[--neutral-700] focus:ring-[--secondary-default] rounded-lg"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && <p className="text-sm text-[--error-default]">Requerido</p>}

                                <Input
                                    placeholder="Apellido"
                                    className="bg-[--neutral-200] border border-[--neutral-400] placeholder:text-[--neutral-700] focus:ring-[--secondary-default] rounded-lg"
                                    {...register("last_name", { required: true })}
                                />
                                {errors.last_name && <p className="text-sm text-[--error-default]">Requerido</p>}
                            </div>
                        </TabsContent>

                        <TabsContent value="technician">
                            <div className="space-y-4">
                                <Input
                                    placeholder="Nombre"
                                    className="bg-[--neutral-200] border border-[--neutral-400] placeholder:text-[--neutral-700] focus:ring-[--secondary-default] rounded-lg"
                                    {...register("name", { required: true })}
                                />
                                {errors.name && <p className="text-sm text-[--error-default]">Requerido</p>}

                                <Input
                                    placeholder="Apellido"
                                    className="bg-[--neutral-200] border border-[--neutral-400] placeholder:text-[--neutral-700] focus:ring-[--secondary-default] rounded-lg"
                                    {...register("last_name", { required: true })}
                                />
                                {errors.last_name && <p className="text-sm text-[--error-default]">Requerido</p>}

                                <Textarea
                                    placeholder="Experiencia"
                                    className="bg-[--neutral-200] border border-[--neutral-400] placeholder:text-[--neutral-700] focus:ring-[--secondary-default] rounded-lg"
                                    {...register("experience")}
                                />
                                <Input
                                    placeholder="Años de experiencia"
                                    type="number"
                                    min={0}
                                    className="bg-[--neutral-200] border border-[--neutral-400] placeholder:text-[--neutral-700] focus:ring-[--secondary-default] rounded-lg"
                                    {...register("years_experience", {
                                        valueAsNumber: true,
                                        min: 0,
                                    })}
                                />
                            </div>
                        </TabsContent>
                    </form>
                </Tabs>

                <DialogFooter className="flex justify-center gap-4 pt-6">
                    <Button
                        type="button"
                        className="bg-error text-white hover:bg-[--error-hover]  active:bg-[--error-pressed] transition rounded-lg"
                        onClick={() => onClose()}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        form="register-form"
                        className="bg-[--secondary-default] text-white hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] transition rounded-lg px-6"
                    >
                        Registrarse
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
