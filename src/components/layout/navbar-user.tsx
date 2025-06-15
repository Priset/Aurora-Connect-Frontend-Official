"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import {Bell, Info, Menu} from "lucide-react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

export function NavbarUser() {
    const { user } = useAuth0();

    return (
        <header className="bg-primary-dark text-white shadow-md px-6 py-4">
            <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">
                    <SidebarTrigger className="text-white hover:bg-primary hover:text-white transition">
                        <Menu className="w-5 h-5" />
                    </SidebarTrigger>
                </div>

                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-white hover:bg-primary hover:text-secondary-default transition"
                                aria-label="Soporte"
                            >
                                <Info className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-30 bg-neutral-500 text-black border border-neutral-300 shadow-lg rounded-md"
                        >
                            <DropdownMenuItem
                                className="hover:bg-neutral-400 cursor-pointer"
                                onClick={() => {
                                    console.log("Abrir preguntas frecuentes");
                                }}
                            >
                                <Info className="w-4 h-4 mr-2 inline" />
                                Preguntas frecuentes
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-primary hover:text-secondary-default transition"
                        aria-label="Notificaciones"
                    >
                        <Bell className="w-5 h-5" />
                    </Button>

                    {user && (
                        <UserMenu
                            userName={user.name || "Usuario"}
                            userPictureUrl={user.picture || undefined}
                        />
                    )}
                </div>
            </div>
        </header>
    );
}
