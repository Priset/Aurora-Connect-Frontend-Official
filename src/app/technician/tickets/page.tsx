"use client";

import { useEffect, useState, useMemo } from "react";
import { useTickets, Ticket } from "@/hooks/useTickets";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Search, Filter, Calendar, DollarSign, User, CheckCircle, AlertCircle, PlayCircle, Wrench, Award } from "lucide-react";
import { Status, getStatusMap } from "@/interfaces/auroraDb";
import { useIntl } from "react-intl";

export default function TechnicianTicketsPage() {
    const { profile } = useAuth();
    const { getAll } = useTickets();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const intl = useIntl();
    const StatusMap = getStatusMap(intl);

    useEffect(() => {
        if (!profile?.id) return;

        const loadTickets = async () => {
            setLoading(true);
            try {
                const data = await getAll();
                setTickets(data);
            } catch (error) {
                console.error("Error al cargar tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        loadTickets();
    }, [profile, getAll]);

    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const matchesSearch = ticket.request?.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                ticket.id.toString().includes(searchTerm) ||
                                ticket.request?.client?.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === "all" || ticket.status.toString() === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [tickets, searchTerm, statusFilter]);

    const activeTickets = filteredTickets.filter(t => t.status !== Status.FINALIZADO && t.status !== Status.ELIMINADO);
    const closedTickets = filteredTickets.filter(t => t.status === Status.FINALIZADO);

    const getStatusColor = (status: number) => {
        const statusInfo = StatusMap[status as Status];
        return statusInfo?.color || "#6B7280";
    };

    const getStatusLabel = (status: number) => {
        const statusInfo = StatusMap[status as Status];
        return statusInfo?.label || "Desconocido";
    };

    if (loading) {
        return (
            <main className="px-4 sm:px-6 md:px-10 py-8 space-y-6 w-full">
                {/* Header Skeleton */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm animate-pulse">
                        <div className="w-8 h-8 bg-white/20 rounded" />
                    </div>
                    <div className="h-8 w-56 bg-white/20 backdrop-blur-sm rounded animate-pulse" />
                    <div className="h-6 w-20 bg-white/20 backdrop-blur-sm rounded-full animate-pulse" />
                </div>

                {/* Filters Skeleton */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-xl animate-pulse">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 h-10 bg-white/20 backdrop-blur-sm rounded" />
                        <div className="w-48 h-10 bg-white/20 backdrop-blur-sm rounded" />
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="w-full bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20 animate-pulse">
                    <div className="grid grid-cols-2 gap-1">
                        <div className="h-10 bg-white/20 backdrop-blur-sm rounded" />
                        <div className="h-10 bg-white/20 backdrop-blur-sm rounded" />
                    </div>
                </div>

                {/* Tickets Skeleton */}
                <div className="space-y-4">
                    {[...Array(3)].map((_, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl animate-pulse">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                                        <div className="w-5 h-5 bg-white/30 rounded" />
                                    </div>
                                    <div className="h-6 w-36 bg-white/20 backdrop-blur-sm rounded" />
                                </div>
                                <div className="h-6 w-24 bg-white/20 backdrop-blur-sm rounded-full" />
                            </div>
                            <div className="space-y-3">
                                <div className="h-10 w-full bg-white/20 backdrop-blur-sm rounded-lg" />
                                <div className="h-4 w-32 bg-white/20 backdrop-blur-sm rounded" />
                                <div className="h-16 w-full bg-white/20 backdrop-blur-sm rounded-lg" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-10 bg-white/20 backdrop-blur-sm rounded-lg" />
                                    <div className="h-10 bg-white/20 backdrop-blur-sm rounded-lg" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        );
    }

    return (
        <main className="px-4 sm:px-6 md:px-10 py-8 space-y-6 w-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Wrench className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-display font-bold text-white">
                    Mis Tickets de Trabajo
                </h1>
                <Badge className="bg-white/20 text-white border border-white/30 backdrop-blur-sm">
                    {tickets.length} tickets
                </Badge>
            </div>

            {/* Filtros */}
            <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
                            <Input
                                placeholder="Buscar por cliente, descripción o ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/50 focus:border-[--secondary-default] transition-colors"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
                                <Filter className="w-4 h-4 text-white" />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-48 bg-white/10 backdrop-blur-sm border-white/20 text-white focus:border-orange-400 transition-colors">
                                    <SelectValue placeholder="Filtrar por estado" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/20">
                                    <SelectItem value="all" className="text-white hover:bg-white/10">Todos los estados</SelectItem>
                                    <SelectItem value={Status.ACEPTADO_POR_TECNICO.toString()} className="text-white hover:bg-white/10">Aceptado</SelectItem>
                                    <SelectItem value={Status.ACEPTADO_POR_CLIENTE.toString()} className="text-white hover:bg-white/10">En progreso</SelectItem>
                                    <SelectItem value={Status.CHAT_ACTIVO.toString()} className="text-white hover:bg-white/10">Chat activo</SelectItem>
                                    <SelectItem value={Status.FINALIZADO.toString()} className="text-white hover:bg-white/10">Finalizado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
                    <TabsTrigger 
                        value="active" 
                        className="data-[state=active]:bg-[--secondary-default] data-[state=active]:text-white text-white/80 transition-all duration-200 flex items-center gap-2"
                    >
                        <PlayCircle className="w-4 h-4" />
                        En Progreso ({activeTickets.length})
                    </TabsTrigger>
                    <TabsTrigger 
                        value="closed"
                        className="data-[state=active]:bg-[--secondary-default] data-[state=active]:text-white text-white/80 transition-all duration-200 flex items-center gap-2"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Completados ({closedTickets.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4 mt-6">
                    {activeTickets.length === 0 ? (
                        <Card className="p-8 text-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20">
                            <div className="p-4 bg-[--secondary-default]/10 rounded-full w-fit mx-auto mb-4">
                                <AlertCircle className="w-12 h-12 text-[--secondary-default]" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                No hay trabajos en progreso
                            </h3>
                            <p className="text-white/70">
                                Tus trabajos activos aparecerán aquí cuando aceptes solicitudes de clientes.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {activeTickets.map((ticket) => (
                                <Card key={ticket.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl hover:from-white/15 hover:to-white/10 transition-all duration-300 hover:scale-[1.02]">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg font-semibold text-white flex items-center gap-3">
                                                <div className="p-2 bg-[--secondary-default]/20 rounded-lg">
                                                    <Wrench className="w-5 h-5 text-[--secondary-default]" />
                                                </div>
                                                Trabajo #{ticket.id}
                                            </CardTitle>
                                            <Badge 
                                                className="text-white border-0 shadow-sm"
                                                style={{ backgroundColor: getStatusColor(ticket.status) }}
                                            >
                                                {getStatusLabel(ticket.status)}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 mb-2 bg-white/5 p-2 rounded-lg">
                                                <div className="p-1 bg-blue-500/20 rounded">
                                                    <User className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <span className="text-sm font-semibold text-white">Cliente:</span>
                                                <span className="text-sm text-blue-400">
                                                    {ticket.request?.client?.name} {ticket.request?.client?.last_name}
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-white flex items-center gap-2">
                                                <div className="w-2 h-2 bg-[--secondary-default] rounded-full"></div>
                                                Descripción del trabajo:
                                            </h4>
                                            <p className="text-sm text-white/90 bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                                                {ticket.request?.description}
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                                                <div className="p-1 bg-green-500/20 rounded">
                                                    <DollarSign className="w-4 h-4 text-green-400" />
                                                </div>
                                                <span className="text-sm font-semibold text-white">Precio:</span>
                                                <span className="text-sm font-bold text-green-400">
                                                    Bs. {ticket.request?.offered_price?.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                                                <div className="p-1 bg-purple-500/20 rounded">
                                                    <Calendar className="w-4 h-4 text-purple-400" />
                                                </div>
                                                <span className="text-sm font-semibold text-white">Iniciado:</span>
                                                <span className="text-sm text-purple-400">
                                                    {new Date(ticket.created_at).toLocaleDateString("es-BO")}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="closed" className="space-y-4 mt-6">
                    {closedTickets.length === 0 ? (
                        <Card className="p-8 text-center bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20">
                            <div className="p-4 bg-green-500/10 rounded-full w-fit mx-auto mb-4">
                                <Award className="w-12 h-12 text-green-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">
                                No hay trabajos completados
                            </h3>
                            <p className="text-white/70">
                                Tus trabajos finalizados aparecerán aquí.
                            </p>
                        </Card>
                    ) : (
                        <div className="grid gap-4">
                            {closedTickets.map((ticket) => (
                                <Card key={ticket.id} className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm border border-white/20 shadow-lg opacity-80 hover:opacity-100 transition-all duration-300">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg font-semibold text-white flex items-center gap-3">
                                                <div className="p-2 bg-green-500/20 rounded-lg">
                                                    <Award className="w-5 h-5 text-green-400" />
                                                </div>
                                                Trabajo #{ticket.id}
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Badge className="bg-green-500 text-white border-0 shadow-sm">
                                                    Completado
                                                </Badge>
                                                {ticket.closed_at && (
                                                    <div className="flex items-center gap-1 text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(ticket.closed_at).toLocaleDateString("es-BO")}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 mb-2 bg-white/5 p-2 rounded-lg">
                                                <div className="p-1 bg-blue-500/20 rounded">
                                                    <User className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <span className="text-sm font-semibold text-white">Cliente:</span>
                                                <span className="text-sm text-blue-400">
                                                    {ticket.request?.client?.name} {ticket.request?.client?.last_name}
                                                </span>
                                            </div>
                                            <h4 className="font-semibold text-white flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                Descripción del trabajo:
                                            </h4>
                                            <p className="text-sm text-white/90 bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                                                {ticket.request?.description}
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                                                <div className="p-1 bg-green-500/20 rounded">
                                                    <DollarSign className="w-4 h-4 text-green-400" />
                                                </div>
                                                <span className="text-sm font-semibold text-white">Ganancia:</span>
                                                <span className="text-sm font-bold text-green-400">
                                                    Bs. {ticket.request?.offered_price?.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 bg-white/5 p-2 rounded-lg">
                                                <div className="p-1 bg-purple-500/20 rounded">
                                                    <Calendar className="w-4 h-4 text-purple-400" />
                                                </div>
                                                <span className="text-sm font-semibold text-white">Completado:</span>
                                                <span className="text-sm text-purple-400">
                                                    {ticket.closed_at ? new Date(ticket.closed_at).toLocaleDateString("es-BO") : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </main>
    );
}