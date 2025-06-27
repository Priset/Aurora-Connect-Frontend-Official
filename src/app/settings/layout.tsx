"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { NavbarUser } from "@/components/layout/navbar-user";
import { SidebarWithTooltips } from "@/components/layout/sidebar-with-tooltips";
import { AuthGuard } from "@/components/auth/authGuard";
import { ReactNode, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ClientChatDialog } from "@/components/chat/client-chat-dialog";
import { TechnicianChatDialog } from "@/components/chat/technician-chat-dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
    const { profile } = useAuth();
    const [chatOpen, setChatOpen] = useState(false);

    const isTechnician = profile?.role === "technician";
    const isClient = profile?.role === "client";

    return (
        <SidebarProvider>
            <AuthGuard>
                <div className="flex min-h-screen w-full overflow-hidden bg-secondary-dark text-[--foreground]">
                    <SidebarWithTooltips />
                    <div className="flex flex-col flex-1 min-w-0">
                        <NavbarUser />
                        <main className="w-full flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 py-8 space-y-8 bg-[--neutral-700] text-[--foreground]">
                            {children}
                        </main>
                    </div>
                </div>

                {isTechnician && (
                    <TechnicianChatDialog
                        isOpen={chatOpen}
                        onCloseAction={() => setChatOpen(false)}
                    />
                )}

                {isClient && (
                    <ClientChatDialog
                        isOpen={chatOpen}
                        onCloseAction={() => setChatOpen(false)}
                    />
                )}

                {(isTechnician || isClient) && !chatOpen && (
                    <Button
                        size="icon"
                        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 bg-[--secondary-default] hover:bg-secondary-hover text-white hover:opacity-90 transform hover:scale-105 active:scale-95"
                        onClick={() => setChatOpen(true)}
                    >
                        <MessageCircle className="w-5 h-5" />
                    </Button>
                )}
            </AuthGuard>
        </SidebarProvider>
    );
}
