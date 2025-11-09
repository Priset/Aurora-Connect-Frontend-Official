"use client";

import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {Star, Send, TrendingUp, MessageCircle, FileText, Award, Users, Clock} from "lucide-react";
import { useIntl } from "react-intl";
import { serviceRequestSchema, ServiceRequestData } from "@/lib/validations";

type TechnicianWithRating = TechnicianProfile & { avgRating: number };

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
    } = useForm<ServiceRequestData>({
        resolver: zodResolver(serviceRequestSchema),
        mode: "onChange",
        defaultValues: {
            description: "",
            offeredPrice: 0,
        },
    });

    useEffect(() => {
        if (user && profile?.id) {
            setClientId(profile.id);
        }
    }, [user, profile]);

    useEffect(() => {
        if (!clientId || !profile?.id) return;

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
    }, [clientId, profile?.id, getAll, getAllChats, getAllPublic]);

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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: ServiceRequestData) => {
        if (!clientId) {
            toast.error(formatMessage({ id: "client_home_error_no_client" }));
            return;
        }

        setIsSubmitting(true);
        try {
            const req = await create({
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
        } finally {
            setIsSubmitting(false);
        }
    };

    const createdCount = requests.length;
    const finalizedCount = requests.filter((r) => r.status === Status.FINALIZADO).length;

    return (
        <main className="px-4 sm:px-6 md:px-10 py-8 space-y-10 w-full">
            {isLoading ? (
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm animate-pulse">
                        <div className="w-8 h-8 bg-white/20 rounded" />
                    </div>
                    <div className="h-8 w-64 bg-white/20 backdrop-blur-sm rounded animate-pulse" />
                </div>
            ) : (
                user && (
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                            <Users className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-display font-bold text-white">
                            {formatMessage(
                                { id: "client_home_welcome" },
                                { name: profile?.name?.split(" ")[0] || user.name?.split(" ")[0] || "User" }
                            )}
                        </h1>
                    </div>
                )
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                    {isLoading ? (
                        <div className="rounded-2xl p-6 bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl space-y-4 animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                    <div className="w-6 h-6 bg-white/30 rounded" />
                                </div>
                                <div className="h-8 w-48 bg-white/20 backdrop-blur-sm rounded" />
                            </div>
                            <div className="h-px w-full bg-white/20 backdrop-blur-sm" />
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-white/20 backdrop-blur-sm rounded" />
                                    <div className="h-24 w-full bg-white/20 backdrop-blur-sm rounded-lg" />
                                </div>
                                <div className="space-y-2 w-1/2">
                                    <div className="h-4 w-24 bg-white/20 backdrop-blur-sm rounded" />
                                    <div className="h-10 w-full bg-white/20 backdrop-blur-sm rounded" />
                                </div>
                                <div className="h-px w-full bg-white/20 backdrop-blur-sm" />
                                <div className="flex justify-end">
                                    <div className="h-10 w-32 bg-gradient-to-r from-blue-500/60 to-purple-500/60 rounded" />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Card className="rounded-2xl p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm text-white border border-white/20 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-[--secondary-default]/20 rounded-lg">
                                    <Send className="w-6 h-6 text-[--secondary-default]" />
                                </div>
                                <h2 className="text-2xl font-display font-bold text-white">
                                    {formatMessage({ id: "client_home_create_request_title" })}
                                </h2>
                            </div>

                            <Separator />

                            <form className="grid gap-6" onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-semibold text-white flex items-center gap-2"
                                    >
                                        <FileText className="w-4 h-4 text-[--secondary-default]" />
                                        {formatMessage({ id: "client_home_form_description_label" })}
                                    </label>
                                    <Textarea
                                        id="description"
                                        {...register("description", { required: true })}
                                        placeholder={formatMessage({ id: "client_home_form_description_placeholder" })}
                                        rows={4}
                                        className={cn(
                                            "w-full resize-none rounded-lg border bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white",
                                            "placeholder:text-white/50 shadow-sm transition-all duration-200 border-white/20",
                                            "focus:outline-none focus:ring-2 focus:ring-[--secondary-default] focus:bg-white/15"
                                        )}
                                    />
                                    {errors.description && (
                                        <p className="text-sm font-medium text-error">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 w-1/2">
                                    <label
                                        htmlFor="offered_price"
                                        className="block text-sm font-semibold text-white flex items-center gap-2"
                                    >
                                        <div className="p-1 bg-green-500/20 rounded">
                                            <span className="text-green-400 text-xs font-bold">Bs</span>
                                        </div>
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
                                            "w-full rounded-lg border bg-white/10 backdrop-blur-sm px-4 py-2 text-sm text-white",
                                            "placeholder:text-white/50 shadow-sm transition-all duration-200 border-white/20",
                                            "focus:outline-none focus:ring-2 focus:ring-[--secondary-default] focus:bg-white/15"
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
                                        disabled={!clientId || isSubmitting}
                                        className="bg-[--secondary-default] hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] text-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                        {isSubmitting ? "Enviando..." : formatMessage({ id: "client_home_form_submit_button" })}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    )}

                    {isLoading ? (
                        <div className="p-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                    <div className="w-5 h-5 bg-white/30 rounded" />
                                </div>
                                <div className="h-6 w-40 bg-white/20 backdrop-blur-sm rounded" />
                            </div>
                            <div className="space-y-3">
                                {[...Array(3)].map((_, idx) => (
                                    <div key={idx} className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-white/30 rounded-full" />
                                                <div className="h-4 w-32 bg-white/30 rounded" />
                                            </div>
                                            <div className="h-4 w-16 bg-white/30 rounded" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="w-4 h-4 bg-white/30 rounded" />
                                            ))}
                                            <div className="h-4 w-12 bg-white/30 rounded ml-2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Card className="p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-yellow-500/20 rounded-lg">
                                    <Award className="w-5 h-5 text-yellow-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white">
                                    {formatMessage({ id: "client_home_top_techs_title" })}
                                </h3>
                            </div>
                            {topTechnicians.length ? (
                                <div className="space-y-3">
                                    {topTechnicians.map((tech, idx) => (
                                        <Card
                                            key={tech.id}
                                            onClick={() => {
                                                setSelectedTechnicianId(tech.id);
                                                setIsTechnicianOpen(true);
                                            }}
                                            className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white/15 cursor-pointer"
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <div className="text-sm font-semibold text-white flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                                        {idx + 1}
                                                    </div>
                                                    {tech.user.name} {tech.user.last_name}
                                                </div>
                                                <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
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
                                                <span className="ml-2 text-sm text-yellow-400 font-semibold">
                                                    {tech.avgRating.toFixed(1)}/5.0
                                                </span>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="p-3 bg-yellow-500/10 rounded-full w-fit mx-auto mb-2">
                                        <Award className="w-8 h-8 text-yellow-400" />
                                    </div>
                                    <p className="text-sm text-white/70">
                                        {formatMessage({ id: "client_home_top_techs_empty" })}
                                    </p>
                                </div>
                            )}
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    {isLoading ? (
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 shadow-xl animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-24 bg-white/20 backdrop-blur-sm rounded-full" />
                                <div className="h-8 w-28 bg-white/20 backdrop-blur-sm rounded-full" />
                            </div>
                        </div>
                    ) : (
                        <Card className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl px-4 py-3">
                            <div className="flex items-center gap-4">
                                <Badge className="px-4 py-2 text-sm rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    {formatMessage({id: "client_home_stats_created"})} {createdCount}
                                </Badge>
                                <Badge className="px-4 py-2 text-sm rounded-full bg-green-500/20 text-green-300 border border-green-400/30 transition-all duration-200 transform hover:scale-105 flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    {formatMessage({ id: "client_home_stats_finalized" })} {finalizedCount}
                                </Badge>
                            </div>
                        </Card>
                    )}

                    {isLoading ? (
                        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                    <div className="w-5 h-5 bg-white/30 rounded" />
                                </div>
                                <div className="h-6 w-32 bg-white/20 backdrop-blur-sm rounded" />
                            </div>
                            <div className="space-y-3">
                                {[...Array(3)].map((_, idx) => (
                                    <div key={idx} className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-3 h-3 bg-white/30 rounded" />
                                            <div className="h-4 w-40 bg-white/30 rounded" />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="w-3 h-3 bg-white/30 rounded" />
                                            <div className="h-3 w-32 bg-white/30 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Card className="p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-white flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-lg">
                                        <MessageCircle className="w-5 h-5 text-blue-400" />
                                    </div>
                                    {formatMessage({ id: "client_home_last_chats_title" })}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {chats.length > 0 ? (
                                    chats.map((chat) => (
                                        <Card
                                            key={chat.id}
                                            className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white/15"
                                        >
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="p-1 bg-blue-500/20 rounded">
                                                    <MessageCircle className="w-3 h-3 text-blue-400" />
                                                </div>
                                                <p className="text-sm font-semibold text-white">
                                                    {formatMessage({id: "client_home_chat_with"})} {chat.technician?.user?.name}{" "}{chat.technician?.user?.last_name}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-white/60">
                                                <Clock className="w-3 h-3" />
                                                {new Date(chat.created_at).toLocaleString("es-BO", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="text-center py-4">
                                        <div className="p-3 bg-blue-500/10 rounded-full w-fit mx-auto mb-2">
                                            <MessageCircle className="w-8 h-8 text-blue-400" />
                                        </div>
                                        <p className="text-sm text-white/70">
                                            {formatMessage({ id: "client_home_no_chats" })}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    )}

                    {isLoading ? (
                        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                    <div className="w-5 h-5 bg-white/30 rounded" />
                                </div>
                                <div className="h-6 w-40 bg-white/20 backdrop-blur-sm rounded" />
                            </div>
                            <div className="space-y-3">
                                {[...Array(3)].map((_, idx) => (
                                    <div key={idx} className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                                        <div className="flex items-start gap-2 mb-2">
                                            <div className="w-3 h-3 bg-white/30 rounded mt-0.5" />
                                            <div className="h-4 w-full bg-white/30 rounded" />
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1">
                                                <div className="w-3 h-3 bg-white/30 rounded" />
                                                <div className="h-3 w-24 bg-white/30 rounded" />
                                            </div>
                                            <div className="h-4 w-16 bg-white/30 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <Card className="p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl">
                            <CardHeader>
                                <CardTitle className="text-base font-semibold text-white flex items-center gap-3">
                                    <div className="p-2 bg-purple-500/20 rounded-lg">
                                        <FileText className="w-5 h-5 text-purple-400" />
                                    </div>
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
                                            className="p-3 bg-white/10 backdrop-blur-sm border border-white/20 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-white/15 cursor-pointer"
                                        >
                                            <div className="flex items-start gap-2 mb-2">
                                                <div className="p-1 bg-purple-500/20 rounded mt-0.5">
                                                    <FileText className="w-3 h-3 text-purple-400" />
                                                </div>
                                                <p className="text-sm font-medium text-white flex-1">
                                                    &#34;{req.description}&#34;
                                                </p>
                                            </div>
                                            <div className="flex items-center justify-between text-xs mt-2">
                                                <div className="flex items-center gap-1 text-white/60">
                                                    <Clock className="w-3 h-3" />
                                                    <span>
                                                        {formatMessage({id: "client_home_request_created_on"})}{" "}
                                                        {new Date(req.created_at).toLocaleDateString("es-BO", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric"
                                                        })}
                                                    </span>
                                                </div>
                                                <Badge
                                                    className="text-white border-0 shadow-sm"
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
