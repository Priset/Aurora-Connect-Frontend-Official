'use client';

import { SidebarProvider } from "@/components/ui/sidebar";
import { NavbarUser } from "@/components/layout/navbar-user";
import { SidebarWithTooltips } from "@/components/layout/sidebar-with-tooltips";
import { AuthGuard } from "@/components/auth/authGuard";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <AuthGuard>
                <div className="flex min-h-screen w-full overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[--primary-dark] via-[--secondary-dark] to-[--primary-default]" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
                    
                    <div className="absolute top-20 left-20 w-32 h-32 bg-[--secondary-default]/10 rounded-full blur-xl animate-pulse" />
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-[--tertiary-default]/10 rounded-full blur-xl animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/5 rounded-full blur-lg animate-pulse delay-500" />
                    
                    <SidebarWithTooltips />
                    <div className="flex flex-col flex-1 min-w-0 relative z-10">
                        <NavbarUser />
                        <main className="w-full flex-1 overflow-y-auto relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/10 pointer-events-none" />
                            {children}
                        </main>
                    </div>
                </div>
            </AuthGuard>
        </SidebarProvider>
    );
}
