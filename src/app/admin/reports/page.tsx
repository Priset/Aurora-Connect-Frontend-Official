"use client";

import { useEffect, useState } from "react";
import { useReports, Report } from "@/hooks/useReports";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, User } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function AdminReportsPage() {
    const { profile } = useAuth();
    const { getAll } = useReports();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profile?.id || profile.role !== "admin") return;

        const loadReports = async () => {
            setLoading(true);
            try {
                const data = await getAll();
                setReports(data);
            } catch (error) {
                console.error("Error al cargar reportes:", error);
            } finally {
                setLoading(false);
            }
        };

        loadReports();
    }, [profile, getAll]);

    const parseReportContent = (content: string) => {
        const lines = content.split('\n');
        const reportData: {
            reportedBy?: string;
            reportedUser?: string;
            reason?: string;
            description?: string;
            chatId?: string;
            requestId?: string;
        } = {};
        
        lines.forEach(line => {
            if (line.includes('Reportado por:')) {
                reportData.reportedBy = line.replace('Reportado por:', '').trim();
            } else if (line.includes('Usuario reportado:')) {
                reportData.reportedUser = line.replace('Usuario reportado:', '').trim();
            } else if (line.includes('Razón:')) {
                reportData.reason = line.replace('Razón:', '').trim();
            } else if (line.includes('Descripción:')) {
                reportData.description = line.replace('Descripción:', '').trim();
            } else if (line.includes('Chat ID:')) {
                reportData.chatId = line.replace('Chat ID:', '').trim();
            } else if (line.includes('Solicitud ID:')) {
                reportData.requestId = line.replace('Solicitud ID:', '').trim();
            }
        });
        
        return reportData;
    };

    const getReasonLabel = (reason?: string) => {
        if (!reason) return 'No especificado';
        const reasonMap: { [key: string]: string } = {
            'harassment': 'Acoso o intimidación',
            'inappropriate_language': 'Lenguaje inapropiado',
            'unprofessional_behavior': 'Comportamiento no profesional',
            'other': 'Otro'
        };
        return reasonMap[reason] || reason;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl mx-6 md:mx-10 mt-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full">
                        <Loader2 className="animate-spin h-8 w-8 text-red-400" />
                    </div>
                    <span className="text-white/70 text-sm">Cargando reportes...</span>
                </div>
            </div>
        );
    }

    return (
        <main className="px-6 md:px-10 py-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-6 shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-white">
                        Reportes de Comportamiento
                    </h1>
                    <div className="ml-auto flex items-center gap-3">
                        <Badge className="bg-gradient-to-r from-red-500/80 to-orange-500/80 text-white px-3 py-1 rounded-full border border-white/20">
                            {reports.length} reportes
                        </Badge>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-white/70">Sistema de Reportes</span>
                        </div>
                    </div>
                </div>
            </div>

            {reports.length === 0 ? (
                <Card className="p-8 text-center bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full">
                            <AlertTriangle className="w-12 h-12 text-green-400" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        No hay reportes
                    </h3>
                    <p className="text-white/70">
                        No se han recibido reportes de comportamiento inapropiado.
                    </p>
                </Card>
            ) : (
                <div className="space-y-4">
                    {reports.map((report) => {
                        const reportData = parseReportContent(report.content);
                        
                        return (
                            <Card key={report.id} className="bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl hover:bg-white/15 transition-all duration-200">
                                <CardHeader className="pb-3 bg-gradient-to-r from-red-600/10 to-orange-600/10 backdrop-blur-sm rounded-t-xl">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                                            <div className="p-1 bg-red-500/20 rounded-full">
                                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                            </div>
                                            Reporte #{report.id}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                            <Badge className={`text-white backdrop-blur-sm border border-white/20 ${
                                                report.status === 0 
                                                    ? 'bg-gradient-to-r from-red-500/80 to-orange-500/80' 
                                                    : 'bg-gradient-to-r from-gray-500/80 to-gray-600/80'
                                            }`}>
                                                {report.status === 0 ? "Activo" : "Procesado"}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full">
                                                <Clock className="w-3 h-3" />
                                                {new Date(report.created_at).toLocaleString("es-BO")}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 bg-blue-500/20 rounded-full">
                                                    <User className="w-4 h-4 text-blue-400" />
                                                </div>
                                                <span className="text-sm font-semibold text-white">
                                                    Reportado por:
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/80 ml-6">
                                                {reportData.reportedBy || 'No especificado'}
                                            </p>
                                        </div>
                                        
                                        <div className="space-y-2 bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1 bg-red-500/20 rounded-full">
                                                    <AlertTriangle className="w-4 h-4 text-red-400" />
                                                </div>
                                                <span className="text-sm font-semibold text-white">
                                                    Usuario reportado:
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/80 ml-6">
                                                {reportData.reportedUser || 'No especificado'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <span className="text-sm font-semibold text-white">
                                            Razón:
                                        </span>
                                        <Badge className="ml-2 bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white border border-white/20">
                                            {getReasonLabel(reportData.reason)}
                                        </Badge>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <span className="text-sm font-semibold text-white">
                                            Descripción:
                                        </span>
                                        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                                            <p className="text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
                                                {reportData.description || 'Sin descripción'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-4 text-xs text-white/60 pt-2 border-t border-white/20 bg-white/5 backdrop-blur-sm rounded-lg p-2">
                                        <span className="bg-white/10 px-2 py-1 rounded-full">Chat ID: {reportData.chatId || 'N/A'}</span>
                                        <span className="bg-white/10 px-2 py-1 rounded-full">Solicitud ID: {reportData.requestId || 'N/A'}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </main>
    );
}