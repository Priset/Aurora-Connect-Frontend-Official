"use client";

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import { Status } from "@/interfaces/auroraDb";
import {cn} from "@/lib/utils";
import { ServiceRequest } from "@/interfaces/auroraDb";
import {Badge} from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusMap } from "@/interfaces/auroraDb";
import { Skeleton } from "@/components/ui/skeleton";

interface RequestForm {
    description: string;
    offeredPrice: number;
}

export default function ClientHomePage() {
    const { user } = useAuth0();
    const router = useRouter();
    const { profile } = useAuth();
    const { create, getAll } = useRequests();
    const [clientId, setClientId] = useState<number | null>(null);
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RequestForm>();

    useEffect(() => {
        if (user && profile?.id) {
            setClientId(profile.id);
            loadRequests();
        }
    }, [user, profile]);

    const loadRequests = async () => {
        try {
            const data = await getAll();
            const filtered = data.filter((r) => r.client_id === profile?.id);
            setRequests(filtered);
        } catch (err) {
            console.error("Error al cargar solicitudes:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: RequestForm) => {
        if (!clientId) {
            toast.error("No se encontró el cliente autenticado.");
            return;
        }

        try {
            await create({
                client_id: clientId,
                description: data.description,
                offeredPrice: data.offeredPrice,
            });

            toast.success("Solicitud enviada correctamente");
            reset();
            loadRequests();
        } catch (err) {
            console.error("❌ Error:", err);
            toast.error("Error al enviar solicitud");
        }
    };

    const createdCount = requests.length;
    const finalizedCount = requests.filter((r) => r.status === Status.FINALIZADO_CON_VALORACION).length;

    return (
        <main className="px-4 sm:px-6 md:px-10 py-8 space-y-10 w-full">
            {user && (
                <h1 className="text-2xl font-display font-bold text-white">
                    Bienvenido, {user.name?.split(" ")[0] || "Usuario"}!
                </h1>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                <div className="space-y-6">
                    <Card className="rounded-2xl p-6 bg-neutral-200 text-[--foreground] border border-[--neutral-300] shadow-lg">
                        <h2 className="text-2xl font-display font-bold mb-6 text-[--primary-default]">
                            Crear nueva solicitud
                        </h2>

                        <Separator />

                        <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-2">
                                <label
                                    htmlFor="description"
                                    className="block text-sm font-semibold text-[--primary-default]"
                                >
                                    Describe tu problema
                                </label>
                                <Textarea
                                    id="description"
                                    {...register("description", { required: true })}
                                    placeholder="Escribe con detalle lo que ocurre..."
                                    rows={4}
                                    className={cn(
                                        "w-full resize-none rounded-lg border bg-white px-4 py-2 text-sm text-[--foreground]",
                                        "placeholder:text-muted-foreground shadow-sm transition-colors",
                                        "focus:outline-none focus:ring-1 focus:ring-[--secondary-default]"
                                    )}
                                />
                                {errors.description && (
                                    <p className="text-sm font-medium text-error">
                                        * Este campo es obligatorio.
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 w-1/2">
                                <label
                                    htmlFor="offered_price"
                                    className="block text-sm font-semibold text-[--primary-default]"
                                >
                                    Precio ofertado (Bs.)
                                </label>
                                <Input
                                    id="offered_price"
                                    type="number"
                                    step="0.01"
                                    placeholder="Ej: 150"
                                    {...register("offeredPrice", {
                                        required: true,
                                        valueAsNumber: true,
                                        min: 1,
                                    })}
                                    className={cn(
                                        "w-full rounded-lg border bg-white px-4 py-2 text-sm text-[--foreground]",
                                        "placeholder:text-muted-foreground shadow-sm transition-colors",
                                        "focus:outline-none focus:ring-1 focus:ring-[--secondary-default]"
                                    )}
                                />
                                {errors.offeredPrice && (
                                    <p className="text-sm font-medium text-error">
                                        * Precio inválido. Ingresa un valor mayor a 0.
                                    </p>
                                )}
                            </div>

                            <Separator />

                            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
                                <Button
                                    type="submit"
                                    disabled={!clientId}
                                    className="bg-[--secondary-default] hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] text-white transition"
                                >
                                    Buscar Técnico
                                </Button>
                                <Button
                                    type="button"
                                    className="bg-[--secondary-default] hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] text-white transition"
                                    onClick={() => router.push("/client/requests")}
                                >
                                    Ver mis Solicitudes
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card className="p-6 bg-neutral-200 border border-[--neutral-300] shadow-lg">
                        <h3 className="text-lg font-semibold mb-4 text-[--primary-default]">
                            Ranking de los mejores técnicos del momento
                        </h3>
                        <p className="text-sm text-muted-foreground">Próximamente...</p>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-neutral-200 border border-[--neutral-300] shadow-lg px-4 py-2">
                        {isLoading ? (
                            <Skeleton className="h-8 w-full rounded-md" />
                        ) : (
                            <div className="flex items-center gap-4">
                                <Badge className="px-3 py-1 text-xs rounded-full bg-[--tertiary-default] text-[--primary-default]">
                                    Solicitudes Creadas: {createdCount}
                                </Badge>
                                <Badge className="px-3 py-1 text-xs rounded-full bg-[--tertiary-default] text-[--primary-default]">
                                    Solicitudes Finalizadas: {finalizedCount}
                                </Badge>
                            </div>
                        )}
                    </Card>

                    <Card className="p-4 bg-neutral-200 border border-[--neutral-300] shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-[--primary-default]">
                                Últimos Chats
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isLoading
                                ? [...Array(2)].map((_, idx) => (
                                    <Skeleton key={idx} className="h-16 w-full rounded-md" />
                                ))
                                : [...Array(2)].map((_, idx) => (
                                    <Card key={idx} className="p-3 bg-white border border-[--neutral-300] shadow-sm">
                                        <p className="text-sm font-medium text-[--foreground]">
                                            Chat con Juan Mecanico
                                        </p>
                                        <span className="text-xs text-muted-foreground">03/06/2025</span>
                                    </Card>
                                ))}
                        </CardContent>
                    </Card>

                    <Card className="p-4 bg-neutral-200 border border-[--neutral-300] shadow-lg">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-[--primary-default]">
                                Estado de últimas solicitudes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isLoading
                                ? [...Array(2)].map((_, idx) => (
                                    <Skeleton key={idx} className="h-16 w-full rounded-md" />
                                ))
                                : requests.slice(0, 2).map((req) => (
                                    <Card key={req.id} className="p-3 bg-white border border-[--neutral-300] shadow-sm">
                                        <p className="text-sm font-medium text-[--foreground]">
                                            “{req.description}”
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                            <span>Creado el {new Date(req.created_at).toLocaleDateString()}</span>
                                            <Badge
                                                className="text-white"
                                                variant="default"
                                                style={{
                                                    backgroundColor: StatusMap[req.status as Status].color,
                                                }}
                                            >
                                                {StatusMap[req.status as Status].label}
                                            </Badge>
                                        </div>
                                    </Card>
                                ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
