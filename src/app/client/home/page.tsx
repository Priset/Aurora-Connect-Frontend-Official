"use client";

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useRequests } from "@/hooks/useRequests";
import { useChats } from "@/hooks/useChats";
import {Status, Chat, TechnicianProfile} from "@/interfaces/auroraDb";
import { cn } from "@/lib/utils";
import { ServiceRequest } from "@/interfaces/auroraDb";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusMap } from "@/interfaces/auroraDb";
import {useTechnicians} from "@/hooks/useTechnicians";
import { TechnicianProfileSlide } from "@/components/technician/technician-profile-slide";
import {Star} from "lucide-react";

type TechnicianWithRating = TechnicianProfile & { avgRating: number };

interface RequestForm {
    description: string;
    offeredPrice: number;
}

export default function ClientHomePage() {
    const { user } = useAuth0();
    const { profile } = useAuth();
    const { create, getAll } = useRequests();
    const [clientId, setClientId] = useState<number | null>(null);
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { getAll: getAllChats } = useChats();
    const [chats, setChats] = useState<Chat[]>([]);
    const { getAllPublic } = useTechnicians();
    const [topTechnicians, setTopTechnicians] = useState<TechnicianWithRating[]>([]);
    const [selectedTechnicianId, setSelectedTechnicianId] = useState<number | null>(null);
    const [isTechnicianOpen, setIsTechnicianOpen] = useState(false);

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

    useEffect(() => {
        if (!clientId) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const reqs = await getAll();
                setRequests(reqs.filter((r) => r.client_id === clientId));

                const allChats = await getAllChats();
                const recentChats = allChats
                    .filter((chat) => chat.client_id === clientId)
                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5);
                setChats(recentChats);

                const allTechs = await getAllPublic();
                const rated = allTechs
                    .filter(t => t.service_reviews && t.service_reviews.length > 0)
                    .map(t => {
                        const ratings = t.service_reviews.map(r => r.rating);
                        const avg = ratings.reduce((acc, val) => acc + val, 0) / ratings.length;
                        return { ...t, avgRating: avg };
                    })
                    .sort((a, b) => {
                        if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
                        return b.service_reviews.length - a.service_reviews.length;
                    })
                    .slice(0, 3);

                setTopTechnicians(rated);
            } catch (err) {
                console.error("Error al cargar datos del cliente:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [clientId]);

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            const data = await getAll();
            const filtered = data.filter((r) => r.client_id === profile?.id);
            setTimeout(() => {
                setRequests(filtered);
                setIsLoading(false);
            }, 500);
        } catch (err) {
            console.error("Error al cargar solicitudes:", err);
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
    const finalizedCount = requests.filter((r) => r.status === Status.FINALIZADO).length;

    return (
        <main className="px-4 sm:px-6 md:px-10 py-8 space-y-10 w-full">
            {isLoading ? (
                <div className="h-10 w-1/2 bg-[--neutral-300] rounded-lg animate-pulse" />
            ) : (
                user && (
                    <h1 className="text-2xl font-display font-bold text-white">
                        Bienvenido, {user.name?.split(" ")[0] || "Usuario"}!
                    </h1>
                )
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="p-6 bg-neutral-200 border border-[--neutral-300] rounded-2xl shadow-lg space-y-4 animate-pulse">
                            <div className="h-6 w-2/3 bg-[--neutral-300] rounded" />
                            <div className="h-4 w-full bg-[--neutral-200] rounded" />
                            <div className="h-28 w-full bg-[--neutral-200] rounded" />
                            <div className="h-12 w-1/2 bg-[--secondary-default] rounded-full" />
                        </div>
                    ) : (
                        <Card className="rounded-2xl p-6 bg-neutral-200 text-[--foreground] border border-[--neutral-300] shadow-lg">
                            <h2 className="text-2xl font-display font-bold text-[--primary-default] pb-1 border-b-2 border-[--primary-default] w-fit">
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
                                        className="bg-[--secondary-default] hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] text-white transition transform hover:scale-105 active:scale-95"
                                    >
                                        Enviar Solicitud
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {isLoading ? (
                        <div className="h-32 w-full bg-[--neutral-200] rounded-xl animate-pulse" />
                    ) : (
                        <Card className="p-6 bg-neutral-200 border border-[--neutral-300] shadow-lg">
                            <h3 className="text-lg font-semibold text-[--primary-default] pb-1 border-b-2 border-[--primary-default] w-fit mb-4">
                                Ranking de los mejores técnicos del momento
                            </h3>
                            {topTechnicians.length ? (
                                <div className="space-y-3">
                                    {topTechnicians.map((tech, idx) => (
                                        <Card
                                            key={tech.id}
                                            onClick={() => {
                                                setSelectedTechnicianId(tech.id);
                                                setIsTechnicianOpen(true);
                                            }}
                                            className="p-3 bg-white border border-[--neutral-300] rounded-lg shadow-sm transition-transform hover:scale-95"
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <p className="text-sm font-semibold text-[--foreground]">
                                                    #{idx + 1} {tech.user.name} {tech.user.last_name}
                                                </p>
                                                <span className="text-xs text-muted-foreground">
                                                    {tech.service_reviews.length} valoraciones
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((val) => (
                                                    <Star
                                                        key={val}
                                                        className={`w-4 h-4 ${
                                                            val <= Math.round(tech.avgRating)
                                                                ? "text-yellow-400 fill-yellow-400"
                                                                : "text-neutral-300"
                                                        }`}
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm text-muted-foreground">
                                                    {tech.avgRating.toFixed(1)}/5.0
                                                </span>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">Aún no hay técnicos calificados.</p>
                            )}
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    {isLoading ? (
                        <div className="h-16 w-full bg-[--neutral-300] rounded-lg animate-pulse" />
                    ) : (
                        <Card className="bg-neutral-200 border border-[--neutral-300] shadow-lg px-4 py-2">
                            <div className="flex items-center gap-4">
                                <Badge className="px-3 py-1 text-xs rounded-full bg-[--tertiary-dark] text-neutral-100 transition transform hover:scale-105">
                                    Solicitudes Creadas: {createdCount}
                                </Badge>
                                <Badge className="px-3 py-1 text-xs rounded-full bg-[--tertiary-dark] text-neutral-100 transition transform hover:scale-105">
                                    Solicitudes Finalizadas: {finalizedCount}
                                </Badge>
                            </div>
                        </Card>
                    )}

                    {isLoading ? (
                        [...Array(2)].map((_, idx) => (
                            <div key={idx} className="h-20 w-full bg-[--neutral-300] rounded-lg animate-pulse" />
                        ))
                    ) : (
                        <Card className="p-4 bg-neutral-200 border border-[--neutral-300] shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-[--primary-default] pb-1 border-b-2 border-[--primary-default] w-fit">
                                    Últimos Chats
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {chats.length > 0 ? (
                                    chats.map((chat) => (
                                        <Card
                                            key={chat.id}
                                            className="p-3 bg-white border border-[--neutral-300] shadow-sm transition-transform hover:scale-95"
                                        >
                                            <p className="text-sm font-medium text-[--foreground]">
                                                Chat con {chat.technician?.user?.name}{" "}{chat.technician?.user?.last_name}
                                            </p>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(chat.created_at).toLocaleString("es-BO", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                              </span>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No hay chats recientes.</p>
                                )}
                            </CardContent>
                        </Card>

                    )}

                    {isLoading ? (
                        [...Array(2)].map((_, idx) => (
                            <div key={idx} className="h-20 w-full bg-[--neutral-300] rounded-lg animate-pulse" />
                        ))
                    ) : (
                        <Card className="p-4 bg-neutral-200 border border-[--neutral-300] shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-[--primary-default] pb-1 border-b-2 border-[--primary-default] w-fit">
                                    Estado de últimas solicitudes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[...requests]
                                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                    .slice(0, 5)
                                    .map((req) => (
                                        <Card key={req.id} className="p-3 bg-white border border-[--neutral-300] shadow-sm transition-transform hover:scale-95">
                                            <p className="text-sm font-medium text-[--foreground]">
                                                “{req.description}”
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                                <span>
                                                    Creado el{" "}
                                                    {new Date(req.created_at).toLocaleDateString("es-BO", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        year: "numeric"
                                                    })}
                                                </span>
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
                    )}
                </div>
            </div>

            {selectedTechnicianId !== null && (
                <TechnicianProfileSlide
                    isOpen={isTechnicianOpen}
                    onClose={() => setIsTechnicianOpen(false)}
                    technicianId={selectedTechnicianId}
                />
            )}
        </main>
    );
}
