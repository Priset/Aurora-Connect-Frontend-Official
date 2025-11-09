import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarSeparator,
    SidebarFooter,
    useSidebar,
} from "@/components/ui/sidebar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {Home, ClipboardList, Settings, HelpCircle, AlertTriangle, TicketIcon, Star} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import Image from "next/image";
import {useAuth} from "@/hooks/useAuth";
import {useState} from "react";
import {TechnicianRatingsSlide} from "@/components/technician/technician-ratings-slide";
import {useIntl} from "react-intl";

export function SidebarWithTooltips() {
    const {state} = useSidebar();
    const pathname = usePathname();
    const router = useRouter();
    const {profile} = useAuth();
    const isTechnician = profile?.role === "technician";
    const [isRatingsOpen, setIsRatingsOpen] = useState(false);
    const {formatMessage} = useIntl();

    return (
        <>
            <Sidebar
                collapsible="icon"
                className="group flex-shrink-0 bg-gradient-to-b from-[--primary-default] via-[--primary-dark] to-[--primary-default] text-white border-r border-white/10 shadow-2xl backdrop-blur-sm sticky top-0 h-screen"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-[--secondary-default]/5 to-transparent pointer-events-none" />
                <TooltipProvider delayDuration={0}>
                    <SidebarContent className="text-white">
                        <div
                            className="flex items-center px-4 py-4 transition-all duration-200 group-data-[state=collapsed]:justify-center relative z-10 bg-white/5 backdrop-blur-sm rounded-lg mx-2 mt-2 border border-white/10">
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex-shrink-0">
                                <Image
                                    src="/assets/logo.png"
                                    alt="Logo"
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 object-contain filter brightness-0 invert"
                                />
                            </div>
                            <div className="ml-3 flex flex-col group-data-[state=collapsed]:hidden">
                                <span
                                    className="font-semibold text-sm text-white">{formatMessage({id: "sidebar_app_name"})}</span>
                                <span
                                    className="text-xs text-[--neutral-500]">{formatMessage({id: "sidebar_role_client"})}</span>
                            </div>
                        </div>

                        <SidebarSeparator/>

                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs text-[--neutral-500] uppercase tracking-wide">
                                {formatMessage({id: "sidebar_group_panel"})}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <Tooltip open={state === "collapsed" ? undefined : false}>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton
                                                    isActive={
                                                        pathname === (
                                                            profile?.role === "technician"
                                                                ? "/technician/home"
                                                                : profile?.role === "admin"
                                                                    ? "/admin/home"
                                                                    : "/client/home"
                                                        )
                                                    }
                                                    onClick={() =>
                                                        router.push(
                                                            profile?.role === "technician"
                                                                ? "/technician/home"
                                                                : profile?.role === "admin"
                                                                    ? "/admin/home"
                                                                    : "/client/home"
                                                        )
                                                    }
                                                    className="text-white hover:bg-[--secondary-default] hover:text-white data-[active=true]:bg-[--secondary-hover] data-[active=true]:text-white"
                                                >
                                                    <Home className="w-5 h-5"/>
                                                    <span
                                                        className="group-data-[state=collapsed]:hidden">{formatMessage({id: "sidebar_home"})}</span>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                align="center"
                                                className="bg-white text-black px-3 py-1 rounded-md text-xs shadow-md"
                                            >
                                                {formatMessage({id: "sidebar_home"})}
                                            </TooltipContent>
                                        </Tooltip>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <Tooltip open={state === "collapsed" ? undefined : false}>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton
                                                    isActive={
                                                        profile?.role === "admin"
                                                            ? pathname === "/admin/users"
                                                            : profile?.role === "client"
                                                                ? pathname === "/client/requests"
                                                                : pathname === "/technician/tickets"
                                                    }
                                                    onClick={() => {
                                                        if (profile?.role === "technician") {
                                                            router.push("/technician/tickets");
                                                        } else if (profile?.role === "admin") {
                                                            router.push("/admin/users");
                                                        } else {
                                                            router.push("/client/requests");
                                                        }
                                                    }}
                                                    className="text-white hover:bg-[--secondary-default] hover:text-white data-[active=true]:bg-[--secondary-hover] data-[active=true]:text-white"
                                                >
                                                    <ClipboardList className="w-5 h-5"/>
                                                    <span className="group-data-[state=collapsed]:hidden">
                                                        {profile?.role === "technician"
                                                            ? "Mis Tickets"
                                                            : profile?.role === "admin"
                                                                ? formatMessage({id: "sidebar_users"})
                                                                : formatMessage({id: "sidebar_requests_client"})
                                                        }
                                                    </span>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                align="center"
                                                className="bg-white text-black px-3 py-1 rounded-md text-xs shadow-md"
                                            >
                                                {profile?.role === "technician"
                                                    ? "Mis Tickets"
                                                    : profile?.role === "admin"
                                                        ? formatMessage({id: "sidebar_users"})
                                                        : formatMessage({id: "sidebar_requests_client"})
                                                }
                                            </TooltipContent>
                                        </Tooltip>
                                    </SidebarMenuItem>
                                    
                                    {profile?.role === "admin" && (
                                        <SidebarMenuItem>
                                            <Tooltip open={state === "collapsed" ? undefined : false}>
                                                <TooltipTrigger asChild>
                                                    <SidebarMenuButton
                                                        isActive={pathname === "/admin/reports"}
                                                        onClick={() => router.push("/admin/reports")}
                                                        className="text-white hover:bg-[--secondary-default] hover:text-white data-[active=true]:bg-[--secondary-hover] data-[active=true]:text-white"
                                                    >
                                                        <AlertTriangle className="w-5 h-5"/>
                                                        <span className="group-data-[state=collapsed]:hidden">
                                                            Reportes
                                                        </span>
                                                    </SidebarMenuButton>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="right"
                                                    align="center"
                                                    className="bg-white text-black px-3 py-1 rounded-md text-xs shadow-md"
                                                >
                                                    Reportes
                                                </TooltipContent>
                                            </Tooltip>
                                        </SidebarMenuItem>
                                    )}
                                    
                                    {profile?.role === "client" && (
                                        <SidebarMenuItem>
                                            <Tooltip open={state === "collapsed" ? undefined : false}>
                                                <TooltipTrigger asChild>
                                                    <SidebarMenuButton
                                                        isActive={pathname === "/client/tickets"}
                                                        onClick={() => router.push("/client/tickets")}
                                                        className="text-white hover:bg-[--secondary-default] hover:text-white data-[active=true]:bg-[--secondary-hover] data-[active=true]:text-white"
                                                    >
                                                        <TicketIcon className="w-5 h-5"/>
                                                        <span className="group-data-[state=collapsed]:hidden">
                                                            Mis Tickets
                                                        </span>
                                                    </SidebarMenuButton>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="right"
                                                    align="center"
                                                    className="bg-white text-black px-3 py-1 rounded-md text-xs shadow-md"
                                                >
                                                    Mis Tickets
                                                </TooltipContent>
                                            </Tooltip>
                                        </SidebarMenuItem>
                                    )}
                                    
                                    {profile?.role === "technician" && (
                                        <SidebarMenuItem>
                                            <Tooltip open={state === "collapsed" ? undefined : false}>
                                                <TooltipTrigger asChild>
                                                    <SidebarMenuButton
                                                        onClick={() => setIsRatingsOpen(true)}
                                                        className="text-white hover:bg-[--secondary-default] hover:text-white"
                                                    >
                                                        <Star className="w-5 h-5"/>
                                                        <span className="group-data-[state=collapsed]:hidden">
                                                            Mis Calificaciones
                                                        </span>
                                                    </SidebarMenuButton>
                                                </TooltipTrigger>
                                                <TooltipContent
                                                    side="right"
                                                    align="center"
                                                    className="bg-white text-black px-3 py-1 rounded-md text-xs shadow-md"
                                                >
                                                    Mis Calificaciones
                                                </TooltipContent>
                                            </Tooltip>
                                        </SidebarMenuItem>
                                    )}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarSeparator/>

                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs text-[--neutral-500] uppercase tracking-wide">
                                {formatMessage({id: "sidebar_group_settings"})}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <Tooltip open={state === "collapsed" ? undefined : false}>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton
                                                    isActive={pathname === "/settings"}
                                                    onClick={() => router.push("/settings")}
                                                    className="text-white hover:bg-[--secondary-default] hover:text-white data-[active=true]:bg-[--secondary-hover] data-[active=true]:text-white"
                                                >
                                                    <Settings className="w-5 h-5"/>
                                                    <span className="group-data-[state=collapsed]:hidden">
                                                        {formatMessage({id: "sidebar_settings"})}
                                                    </span>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                align="center"
                                                className="bg-white text-black px-3 py-1 rounded-md text-xs shadow-md"
                                            >
                                                {formatMessage({id: "sidebar_settings"})}
                                            </TooltipContent>
                                        </Tooltip>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <Tooltip open={state === "collapsed" ? undefined : false}>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton
                                                    isActive={pathname === "/support"}
                                                    onClick={() => router.push("/support")}
                                                    className="text-white hover:bg-[--secondary-default] hover:text-white data-[active=true]:bg-[--secondary-hover] data-[active=true]:text-white"
                                                >
                                                    <HelpCircle className="w-5 h-5" />
                                                    <span className="group-data-[state=collapsed]:hidden">
                                                        {formatMessage({ id: "sidebar_support" })}
                                                    </span>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                align="center"
                                                className="bg-white text-black px-3 py-1 rounded-md text-xs shadow-md"
                                            >
                                                {formatMessage({id: "sidebar_support"})}
                                            </TooltipContent>
                                        </Tooltip>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarSeparator/>

                        <SidebarFooter
                            className="mt-auto px-4 py-3 text-xs text-white/60 group-data-[state=collapsed]:hidden relative z-10">
                            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 border border-white/10 text-center">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                    <span className="text-green-400 text-xs font-semibold">Online</span>
                                </div>
                                {formatMessage({id: "sidebar_footer"})}
                            </div>
                        </SidebarFooter>
                    </SidebarContent>
                </TooltipProvider>
            </Sidebar>

            {isTechnician && (
                <TechnicianRatingsSlide
                    isOpen={isRatingsOpen}
                    onClose={() => setIsRatingsOpen(false)}
                />
            )}
        </>
    );
}