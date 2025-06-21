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
import {Home, ClipboardList, Settings, HelpCircle} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import Image from "next/image";
import {useAuth} from "@/hooks/useAuth";
import {useState} from "react";
import {TechnicianRatingsSlide} from "@/components/technician/technician-ratings-slide";

export function SidebarWithTooltips() {
    const {state} = useSidebar();
    const pathname = usePathname();
    const router = useRouter();
    const {profile} = useAuth();
    const isTechnician = profile?.role === "technician";
    const [isRatingsOpen, setIsRatingsOpen] = useState(false);

    return (
        <>
            <Sidebar
                collapsible="icon"
                className="group flex-shrink-0 bg-[--primary-default] text-white border-r border-[--primary-dark]"
            >
                <TooltipProvider delayDuration={0}>
                    <SidebarContent className="text-white">
                        <div
                            className="flex items-center px-4 py-4 transition-all duration-200 group-data-[state=collapsed]:justify-center">
                            <Image src="/assets/logo.png" alt="Logo" width={28} height={28}/>
                            <div className="ml-3 flex flex-col group-data-[state=collapsed]:hidden">
                                <span className="font-semibold text-sm text-white">Aurora Connect</span>
                                <span className="text-xs text-[--neutral-500]">Cliente</span>
                            </div>
                        </div>

                        <SidebarSeparator/>

                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs text-[--neutral-500] uppercase tracking-wide">
                                Panel
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <Tooltip open={state === "collapsed" ? undefined : false}>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton
                                                    isActive={
                                                        pathname === (isTechnician ? "/technician/home" : "/client/home")
                                                    }
                                                    onClick={() => router.push(isTechnician ? "/technician/home" : "/client/home")}
                                                    className="text-white hover:bg-[--secondary-default] hover:text-white data-[active=true]:bg-[--secondary-hover] data-[active=true]:text-white"
                                                >
                                                    <Home className="w-5 h-5"/>
                                                    <span className="group-data-[state=collapsed]:hidden">Inicio</span>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                align="center"
                                                className="bg-white text-black px-3 py-1 rounded-md text-xs shadow-md"
                                            >
                                                Inicio
                                            </TooltipContent>
                                        </Tooltip>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <Tooltip open={state === "collapsed" ? undefined : false}>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton
                                                    isActive={false}
                                                    onClick={() => {
                                                        if (isTechnician) {
                                                            setIsRatingsOpen(true);
                                                        } else {
                                                            router.push("/client/requests");
                                                        }
                                                    }}
                                                    className="text-white hover:bg-[--secondary-default] hover:text-white data-[active=true]:bg-[--secondary-hover] data-[active=true]:text-white"
                                                >
                                                    <ClipboardList className="w-5 h-5"/>
                                                    <span className="group-data-[state=collapsed]:hidden">
                                                        {isTechnician ? "Mis Calificaciones" : "Mis Solicitudes"}
                                                    </span>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                align="center"
                                                className="bg-white text-black px-3 py-1 rounded-md text-xs shadow-md"
                                            >
                                                {isTechnician ? "Mis Calificaciones" : "Mis Solicitudes"}
                                            </TooltipContent>
                                        </Tooltip>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarSeparator/>

                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs text-[--neutral-500] uppercase tracking-wide">
                                Configuración
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
                                                    <Settings className="w-5 h-5" />
                                                    <span className="group-data-[state=collapsed]:hidden">Ajustes</span>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                align="center"
                                                className="bg-white text-black px-3 py-1 rounded-md text-xs shadow-md"
                                            >
                                                Ajustes
                                            </TooltipContent>
                                        </Tooltip>
                                    </SidebarMenuItem>

                                    <SidebarMenuItem>
                                        <Tooltip open={state === "collapsed" ? undefined : false}>
                                            <TooltipTrigger asChild>
                                                <SidebarMenuButton
                                                    className="text-white hover:bg-[--secondary-default] hover:text-white">
                                                    <HelpCircle className="w-5 h-5"/>
                                                    <span className="group-data-[state=collapsed]:hidden">Soporte</span>
                                                </SidebarMenuButton>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="right"
                                                align="center"
                                                className="bg-white text-black px-3 py-1 rounded-md text-xs shadow-md"
                                            >
                                                Soporte
                                            </TooltipContent>
                                        </Tooltip>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>

                        <SidebarSeparator/>

                        <SidebarFooter
                            className="mt-auto px-4 py-3 text-xs text-white/60 group-data-[state=collapsed]:hidden">
                            © Aurora Connect 2025
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
