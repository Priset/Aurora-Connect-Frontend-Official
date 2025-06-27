"use client";

import {useAuth0} from "@auth0/auth0-react";
import {SidebarTrigger} from "@/components/ui/sidebar";
import {UserMenu} from "@/components/layout/user-menu";
import {Button} from "@/components/ui/button";
import {Bell, Menu, Dot, BellRing, X} from "lucide-react";
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
        loadNotifications();
    }, [loadNotifications]);

    useSocketNotifications(
        profile?.id ?? null,
        (newNotif) => {
            setNotifications((prev) => [newNotif, ...prev]);
            toast.custom(() => (
                <div
                    className="bg-[--neutral-100] text-[--foreground] border border-[--neutral-300] px-4 py-3 rounded-xl shadow-lg w-full max-w-sm flex items-start gap-3"
                >
                    <div className="mt-1">
                        <Bell className="w-5 h-5 text-[--secondary-default]" />
                    </div>
                    <div className="text-sm">
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
            <header className="bg-primary-dark text-white shadow-md px-6 py-4">
                <div className="flex justify-between items-center">

                    <div className="flex items-center gap-3">
                        <SidebarTrigger className="text-white hover:bg-primary hover:text-white transition">
                            <Menu className="w-5 h-5"/>
                        </SidebarTrigger>
                    </div>

                    <div className="flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="relative text-white hover:bg-primary hover:text-secondary-default transition transform hover:scale-110 active:scale-95"
                                    aria-label={formatMessage({id: "navbar_user_notifications"})}
                                >
                                    {notifications.some((n) => n.status === 0) ? (
                                        <BellRing className="w-5 h-5 animate-shake text-[--secondary-default]"/>
                                    ) : (
                                        <Bell className="w-5 h-5"/>
                                    )}
                                    {notifications.some((n) => n.status === 0) && (
                                        <Dot
                                            className="absolute top-1 right-1 text-[--secondary-default] animate-ping"/>
                                    )}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-80 max-h-[400px] overflow-y-auto bg-[--neutral-100] border border-[--neutral-300] shadow-xl rounded-lg text-[--foreground] z-[9999]"
                                align="end"
                            >
                                <DropdownMenuLabel className="text-[--primary-default] text-sm px-3 pt-2 font-semibold">
                                    <div className="flex justify-between items-center">
                                        <span>{formatMessage({ id: "navbar_user_notifications" })}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs px-2 py-1 text-[--secondary-default] bg-neutral-200 hover:bg-[--neutral-300] transition transform hover:scale-105 active:scale-95"
                                            onClick={handleMarkAllAsRead}
                                        >
                                            {formatMessage({ id: "notifications_mark_all" })}
                                        </Button>
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="mt-2 text-xs w-full text-[--error-default] bg-neutral-200 hover:bg-[--neutral-300] transition transform hover:scale-105 active:scale-95"
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
                                        {formatMessage({ id: "notifications_clear_read" })}
                                    </Button>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator className="bg-[--neutral-300]"/>

                                {notifications.length === 0 ? (
                                    <DropdownMenuItem disabled className="text-muted-foreground text-sm px-3 py-2">
                                        {formatMessage({id: "notifications_empty"})}
                                    </DropdownMenuItem>
                                ) : (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className="relative flex items-center gap-2 px-2 mb-2 group"
                                        >
                                            <div className="mt-2 ml-1">
                                                <Bell className="w-4 h-4 text-[--secondary-default]"/>
                                            </div>

                                            <DropdownMenuItem
                                                onClick={() => handleNotificationClick(n)}
                                                className={`
                                                    flex-1 text-sm px-3 py-2 rounded-lg shadow-md transition-transform
                                                    cursor-pointer border border-[--neutral-300]
                                                    ${n.status === 0
                                                    ? "bg-[--neutral-100] border-l-4 border-[--secondary-default] text-[--foreground] animate-pulse"
                                                    : "bg-white text-[--foreground] hover:bg-[--neutral-100]"}
                                                    hover:scale-[1.01] active:scale-[0.98]
                                                  `}
                                            >
                                                <span
                                                    className="whitespace-normal break-words leading-snug text-[--foreground]">
                                                    {n.content}
                                                </span>
                                            </DropdownMenuItem>

                                            {n.status === 1 && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="w-6 h-6 text-[--error-default] hover:bg-[--neutral-300] transition rounded-full"
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
                                                    <X className="w-4 h-4" />
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
