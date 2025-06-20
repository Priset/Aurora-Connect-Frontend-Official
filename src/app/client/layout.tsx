"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { NavbarUser } from "@/components/layout/navbar-user";
import { SidebarWithTooltips } from "@/components/layout/sidebar-with-tooltips";
import { AuthGuard } from "@/components/auth/authGuard";
import { ReactNode, useState } from "react";
import { ClientChatDialog } from "@/components/dialogs/client-chat-dialog";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
    const [chatOpen, setChatOpen] = useState(false);

    return (
        <SidebarProvider>
            <AuthGuard>
                <div className="flex min-h-screen w-full overflow-hidden bg-secondary-dark text-[--foreground]">
                    <SidebarWithTooltips />
                    <div className="flex flex-col flex-1 min-w-0">
                        <NavbarUser />
                        <main className="w-full flex-1 overflow-y-auto">
                            {children}
                        </main>
                    </div>
                </div>

                <ClientChatDialog isOpen={chatOpen} onClose={() => setChatOpen(false)} />

                {!chatOpen && (
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
