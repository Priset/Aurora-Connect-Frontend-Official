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
import {Status, Chat, TechnicianProfile, CreateNotificationDto, ServiceRequest, getStatusMap } from "@/interfaces/auroraDb";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {useTechnicians} from "@/hooks/useTechnicians";
import { TechnicianProfileSlide } from "@/components/technician/technician-profile-slide";
import { RequestViewDialog } from "@/components/request/requests-view-dialog";
import { useNotifications } from "@/hooks/useNotifications";
import {Star} from "lucide-react";
import { useIntl } from "react-intl"

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
    const { formatMessage } = useIntl()
    const intl = useIntl();
    const StatusMap = getStatusMap(intl);
    const { create: createNotification } = useNotifications();
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);

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
    }, [clientId, getAll, getAllChats, getAllPublic]);

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
            toast.error(formatMessage({ id: "client_home_error_no_client" }));
            return;
        }

        try {
            const req = await create({
                client_id: clientId,
                description: data.description,
                offeredPrice: data.offeredPrice,
            });

            const technicians = await getAllPublic();

            if (!technicians.length) {
                console.warn("⚠️ No hay técnicos disponibles para notificar.");
            }

            const notifPayloads: CreateNotificationDto[] = technicians.map((tech) => ({
                user_id: tech.user.id,
                content: `${formatMessage({ id: "client_requests_new_button"})} #${req.id} "${req.description}"`,
            }));

            await Promise.all(notifPayloads.map(createNotification));

            toast.success(formatMessage({ id: "client_home_request_sent" }));
            reset();
            await loadRequests();
        } catch (err) {
            console.error("❌ Error al crear solicitud:", err);
            toast.error(formatMessage({ id: "client_home_error_request_sent" }));
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
                        {formatMessage(
                            { id: "client_home_welcome" },
                            { name: profile?.name?.split(" ")[0] || user.name?.split(" ")[0] || "User" }
                        )}
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
                                {formatMessage({ id: "client_home_create_request_title" })}
                            </h2>

                            <Separator />

                            <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-semibold text-[--primary-default]"
                                    >
                                        {formatMessage({ id: "client_home_form_description_label" })}
                                    </label>
                                    <Textarea
                                        id="description"
                                        {...register("description", { required: true })}
                                        placeholder={formatMessage({ id: "client_home_form_description_placeholder" })}
                                        rows={4}
                                        className={cn(
                                            "w-full resize-none rounded-lg border bg-white px-4 py-2 text-sm text-[--foreground]",
                                            "placeholder:text-muted-foreground shadow-sm transition-colors",
                                            "focus:outline-none focus:ring-1 focus:ring-[--secondary-default]"
                                        )}
                                    />
                                    {errors.description && (
                                        <p className="text-sm font-medium text-error">
                                            {formatMessage({ id: "client_home_form_description_error" })}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 w-1/2">
                                    <label
                                        htmlFor="offered_price"
                                        className="block text-sm font-semibold text-[--primary-default]"
                                    >
                                        {formatMessage({ id: "client_home_form_price_label" })}
                                    </label>
                                    <Input
                                        id="offered_price"
                                        type="number"
                                        step="0.50"
                                        placeholder={formatMessage({ id: "client_home_form_price_placeholder" })}
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
                                            {formatMessage({ id: "client_home_form_price_error" })}
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
                                        {formatMessage({ id: "client_home_form_submit_button" })}
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
                                {formatMessage({ id: "client_home_top_techs_title" })}
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
                                                    {tech.service_reviews.length} {formatMessage({ id: "client_home_top_techs_reviews" })}
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
                                <p className="text-sm text-muted-foreground">
                                    {formatMessage({ id: "client_home_top_techs_empty" })}
                                </p>
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
                                    {formatMessage({id: "client_home_stats_created"})} {createdCount}
                                </Badge>
                                <Badge className="px-3 py-1 text-xs rounded-full bg-[--tertiary-dark] text-neutral-100 transition transform hover:scale-105">
                                    {formatMessage({ id: "client_home_stats_finalized" })} {finalizedCount}
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
                                    {formatMessage({ id: "client_home_last_chats_title" })}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {chats.length > 0 ? (
                                    chats.map((chat) => (
                                        <Card
                                            key={chat.id}
                                            className="p-3 bg-white border border-[--neutral-300] shadow-sm transition-transform hover:scale-95"
                                        >
                                            <p className="text-sm font-semibold text-[--foreground]">
                                                {formatMessage({id: "client_home_chat_with"})} {chat.technician?.user?.name}{" "}{chat.technician?.user?.last_name}
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
                                    <p className="text-sm text-muted-foreground">
                                        {formatMessage({ id: "client_home_no_chats" })}
                                    </p>
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
                                    {formatMessage({ id: "client_home_last_requests_title" })}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[...requests]
                                    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                                    .slice(0, 5)
                                    .map((req) => (
                                        <Card
                                            key={req.id}
                                            onClick={() => {
                                                setSelectedRequest(req);
                                                setIsRequestDialogOpen(true);
                                            }}
                                            className="p-3 bg-white border border-[--neutral-300] shadow-sm transition-transform hover:scale-95"
                                        >
                                            <p className="text-sm font-medium text-[--foreground]">
                                                “{req.description}”
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                                                <span>
                                                    {formatMessage({id: "client_home_request_created_on"})}{" "}
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

            {selectedRequest && (
                <RequestViewDialog
                    isOpen={isRequestDialogOpen}
                    onClose={() => {
                        setIsRequestDialogOpen(false);
                        setSelectedRequest(null);
                    }}
                    request={selectedRequest}
                />
            )}
        </main>
    );
}
