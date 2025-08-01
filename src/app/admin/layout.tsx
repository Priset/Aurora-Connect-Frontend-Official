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
                <div className="flex min-h-screen w-full overflow-hidden bg-secondary-dark text-[--foreground]">
                    <SidebarWithTooltips />
                    <div className="flex flex-col flex-1 min-w-0">
                        <NavbarUser />
                        <main className="w-full flex-1 overflow-y-auto">{children}</main>
                    </div>
                </div>
            </AuthGuard>
        </SidebarProvider>
    );
}
