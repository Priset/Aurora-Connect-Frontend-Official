"use client";

import {useAuth0} from "@auth0/auth0-react";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {UserMenu} from "@/components/layout/user-menu";
import {Button} from "@/components/ui/button";
import {Bell, Menu, BellRing, X, Sparkles, Zap} from "lucide-react";
import {useIntl} from "react-intl";
import {useCallback, useEffect, useState} from "react";
import {Notification, ServiceRequest} from "@/interfaces/auroraDb";
import {useSocketNotifications} from "@/hooks/useSocketNotifications";
import {useNotifications} from "@/hooks/useNotifications";
import {useRequests} from "@/hooks/useRequests";
import {RequestViewDialog} from "@/components/request/requests-view-dialog";
import {toast} from "sonner";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {useAuth} from "@/hooks/useAuth";

export function NavbarUser() {
    const {user} = useAuth0();
    const {formatMessage} = useIntl();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const {getAll, update, markAllAsRead, clearRead, remove} = useNotifications();
    const {getPublicById} = useRequests();
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const {profile} = useAuth();
    const loadNotifications = useCallback(async () => {
        try {
            const data = await getAll();
            setNotifications(data);
        } catch (err) {
            console.error("❌ Error cargando notificaciones:", err);
        }
    }, [getAll]);

    useEffect(() => {
        if (profile?.id) {
            loadNotifications();
        }
    }, [loadNotifications, profile?.id]);

    useSocketNotifications(
        profile?.id ?? null,
        (newNotif) => {
            setNotifications((prev) => [newNotif, ...prev]);
            toast.custom(() => (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-3 rounded-xl shadow-2xl w-full max-w-sm flex items-start gap-3 text-white">
                    <div className="flex-shrink-0 mt-1">
                        <div className="p-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full">
                            <BellRing className="w-4 h-4 text-blue-400 animate-pulse" />
                        </div>
                    </div>
                    <div className="text-sm leading-snug">
                        {newNotif.content}
                    </div>
                </div>
            ));
        }
    );

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
            setNotifications((prev) => prev.map((n) => ({...n, status: 1})));
        } catch (err) {
            console.error("❌ Error al marcar como leídas:", err);
        }
    };

    const handleNotificationClick = async (notif: Notification) => {
        const reqId = Number(notif.content.match(/#(\d+)/)?.[1]);
        if (!reqId) return;

        try {
            const req = await getPublicById(reqId);
            setSelectedRequest(req);

            setIsViewDialogOpen(true);

            if (notif.status === 0) {
                await update(notif.id, {status: 1});
                setNotifications((prev) =>
                    prev.map((n) => (n.id === notif.id ? {...n, status: 1} : n))
                );
            }
        } catch (err) {
            console.error("❌ Error al abrir solicitud desde notificación:", err);
            toast.error("No se pudo abrir la solicitud.");
        }
    };

    return (
        <>
            <header className="bg-gradient-to-r from-black/20 via-black/10 to-black/20 backdrop-blur-md text-white shadow-2xl border-b border-white/10 px-6 py-4 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[--secondary-default]/5 to-[--tertiary-default]/5" />
                <div className="flex justify-between items-center relative z-10">

                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="text-white hover:bg-white/10 hover:text-white transition-all duration-200 rounded-lg p-2 backdrop-blur-sm border border-white/20">
                            <Menu className="w-5 h-5"/>
                        </SidebarTrigger>
                        <div className="hidden md:flex items-center gap-2 text-white/80">
                            <Sparkles className="w-4 h-4 text-[--secondary-default] animate-pulse" />
                            <span className="text-sm font-medium">Aurora Connect</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="relative text-white hover:bg-white/10 hover:text-white transition-all duration-200 transform hover:scale-110 active:scale-95 rounded-lg backdrop-blur-sm border border-white/20"
                                    aria-label={formatMessage({id: "navbar_user_notifications"})}
                                >
                                    {notifications.some((n) => n.status === 0) ? (
                                        <BellRing className="w-5 h-5 animate-shake text-[--secondary-default]"/>
                                    ) : (
                                        <Bell className="w-5 h-5"/>
                                    )}
                                    {notifications.some((n) => n.status === 0) && (
                                        <>
                                            <div className="absolute top-1 right-1 w-2 h-2 bg-[--secondary-default] rounded-full animate-ping" />
                                            <div className="absolute top-1 right-1 w-2 h-2 bg-[--secondary-default] rounded-full" />
                                        </>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-80 max-h-[400px] overflow-y-auto bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl text-white z-[9999]"
                                align="end"
                            >
                                <DropdownMenuLabel className="text-white text-sm px-3 pt-2 font-semibold bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-t-xl">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="flex items-center gap-2">
                                            <Bell className="w-4 h-4 text-blue-400" />
                                            <span>{formatMessage({ id: "navbar_user_notifications" })}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs px-3 py-1 text-white bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 backdrop-blur-sm transition-all duration-200 transform hover:scale-105 active:scale-95 rounded-full shadow-lg border border-white/20"
                                            onClick={handleMarkAllAsRead}
                                        >
                                            <Zap className="w-3 h-3 mr-1" />
                                            {formatMessage({ id: "notifications_mark_all" })}
                                        </Button>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-xs w-full text-white bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-600/80 hover:to-red-700/80 backdrop-blur-sm transition-all duration-200 transform hover:scale-105 active:scale-95 rounded-full shadow-lg border border-white/20"
                                        onClick={async () => {
                                            try {
                                                await clearRead();
                                                setNotifications((prev) => prev.filter((n) => n.status !== 1));
                                                toast.success("Notificaciones leídas eliminadas");
                                            } catch (err) {
                                                console.error("❌ Error al vaciar notificaciones:", err);
                                                toast.error("No se pudo vaciar las notificaciones leídas");
                                            }
                                        }}
                                    >
                                        <X className="w-3 h-3 mr-1" />
                                        {formatMessage({ id: "notifications_clear_read" })}
                                    </Button>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-white/30 to-transparent my-2"/>

                                {notifications.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-8 px-4">
                                        <Bell className="w-12 h-12 text-white/30 mb-3" />
                                        <p className="text-white/70 text-sm text-center">
                                            {formatMessage({id: "notifications_empty"})}
                                        </p>
                                    </div>
                                ) : (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className="relative flex items-start gap-3 px-3 py-2 mb-2 group"
                                        >
                                            <div className="flex-shrink-0 mt-1">
                                                <div className={`p-2 rounded-full backdrop-blur-sm ${
                                                    n.status === 0 
                                                        ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border border-blue-400/50' 
                                                        : 'bg-white/20 border border-white/30'
                                                }`}>
                                                    {n.status === 0 ? (
                                                        <BellRing className="w-4 h-4 text-blue-400 animate-pulse"/>
                                                    ) : (
                                                        <Bell className="w-4 h-4 text-white/70"/>
                                                    )}
                                                </div>
                                            </div>

                                            <DropdownMenuItem
                                                onClick={() => handleNotificationClick(n)}
                                                className={`
                                                    flex-1 text-xs px-3 py-2 rounded-lg backdrop-blur-sm transition-all duration-200
                                                    cursor-pointer border hover:scale-[1.01] active:scale-[0.99] hover:shadow-md
                                                    ${n.status === 0
                                                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-400/50 text-white shadow-blue-400/20 hover:from-blue-500/30 hover:to-purple-500/30"
                                                        : "bg-white/10 text-white/90 hover:bg-white/20 border-white/30"}
                                                  `}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <span className="whitespace-normal break-words leading-tight flex-1 text-xs">
                                                        {n.content}
                                                    </span>
                                                    {n.status === 0 && (
                                                        <div className="flex-shrink-0">
                                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
                                                        </div>
                                                    )}
                                                </div>
                                            </DropdownMenuItem>

                                            {n.status === 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="flex-shrink-0 w-6 h-6 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 rounded-md backdrop-blur-sm border border-white/20 hover:scale-105"
                                                    onClick={async () => {
                                                        try {
                                                            await remove(n.id);
                                                            setNotifications((prev) => prev.filter((x) => x.id !== n.id));
                                                            toast.success("Notificación eliminada");
                                                        } catch (err) {
                                                            console.error("❌ Error al eliminar notificación:", err);
                                                            toast.error("No se pudo eliminar");
                                                        }
                                                    }}
                                                >
                                                    <X className="w-3 h-3" />
                                                </Button>
                                            )}
                                        </div>
                                    ))
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {user && (
                            <UserMenu
                                userName={user.name || formatMessage({id: "navbar_user_default_name"})}
                                userPictureUrl={user.picture || undefined}
                            />
                        )}
                    </div>
                </div>
            </header>

            {selectedRequest && (
                <RequestViewDialog
                    isOpen={isViewDialogOpen}
                    onClose={() => {
                        setIsViewDialogOpen(false);
                        setSelectedRequest(null);
                    }}
                    request={selectedRequest}
                />
            )}
        </>
    );
}
