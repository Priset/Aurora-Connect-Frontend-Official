"use client";

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import { UserMenu } from "@/components/layout/user-menu";
import {Menu} from "lucide-react";

interface RequestForm {
    description: string;
    offeredPrice: number;
}

export default function ClientHomePage() {
    const { user } = useAuth0();
    const router = useRouter();
    const { profile } = useAuth();
    const { create } = useRequests();

    const [clientId, setClientId] = useState<number | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RequestForm>();

    useEffect(() => {
        if (user && profile?.id) {
            setClientId(profile.id);
        }
    }, [user, profile]);

    const onSubmit = async (data: RequestForm) => {
        if (!clientId) {
            toast.error("No se encontró el cliente autenticado.", {
                description: "Inicia sesión nuevamente o contacta soporte.",
            });
            return;
        }

        try {
            await create({
                client_id: clientId,
                description: data.description,
                offeredPrice: data.offeredPrice,
            });

            toast.success("Solicitud enviada correctamente", {
                description: "Un técnico responderá en breve.",
            });
            reset();
        } catch (err) {
            console.error("❌ Error al enviar solicitud:", err);
            toast.error("Error al enviar solicitud", {
                description: "Intenta nuevamente más tarde.",
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[--neutral-200] text-[--foreground]">
            <header className="bg-[--primary-default] text-white px-6 h-20 flex items-center justify-between shadow-xl">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" className="text-white p-0 hover:bg-transparent">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-xl font-display font-bold tracking-wide">
                        AURORA CONNECT
                    </h1>
                </div>

                {user && (
                    <UserMenu
                        userName={user.name || "Usuario"}
                        userPictureUrl={user.picture || undefined}
                    />
                )}
            </header>

            <section className="px-6 py-6">
                <div className="max-w-5xl mx-auto">
                    <img
                        src="/assets/carrusel_1.png"
                        alt="Reparación técnica"
                        className="w-full max-h-64 object-cover rounded-xl shadow-md"
                    />
                </div>
            </section>

            <section className="px-6 pb-10 w-full max-w-3xl mx-auto">
                <Card className="rounded-xl shadow-xl p-6 bg-[--neutral-100] text-[--foreground] border border-[--neutral-300]">
                    <h2 className="text-xl font-semibold mb-6 text-[--primary-default]">
                        Crear nueva solicitud
                    </h2>

                    <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="description">
                                Describe tu problema
                            </label>
                            <Textarea
                                id="description"
                                {...register("description", { required: true })}
                                placeholder="Escribe con detalle lo que ocurre..."
                                rows={4}
                                className="bg-white dark:bg-[--neutral-200] text-[--foreground]"
                            />
                            {errors.description && (
                                <p className="text-sm text-error-default mt-1">Este campo es obligatorio.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="offered_price">
                                Precio ofertado (Bs.)
                            </label>
                            <Input
                                id="offered_price"
                                type="number"
                                step="0.01"
                                placeholder="Ej: 150.00"
                                {...register("offeredPrice", {
                                    required: true,
                                    valueAsNumber: true,
                                    min: 1,
                                })}
                                className="bg-white dark:bg-[--neutral-200] text-[--foreground]"
                            />
                            {errors.offeredPrice && (
                                <p className="text-sm text-error-default mt-1">Precio inválido.</p>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 mt-4 flex-wrap">
                            <Button
                                type="submit"
                                disabled={!clientId}
                                className="bg-[--primary-default] hover:bg-[--primary-hover] text-white"
                            >
                                Buscar Técnico
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="border-[--secondary-default] text-[--secondary-default] hover:bg-[--neutral-200]"
                                onClick={() => router.push("/client/requests")}
                            >
                                Ver mis Solicitudes
                            </Button>
                        </div>
                    </form>
                </Card>
            </section>
        </div>
    );
}
