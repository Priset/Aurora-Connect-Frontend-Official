"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import {Bell, Menu} from "lucide-react";
import { useIntl } from "react-intl";

export function NavbarUser() {
    const { user } = useAuth0();
    const { formatMessage } = useIntl();

    return (
        <header className="bg-primary-dark text-white shadow-md px-6 py-4">
            <div className="flex justify-between items-center">

                <div className="flex items-center gap-3">
                    <SidebarTrigger className="text-white hover:bg-primary hover:text-white transition">
                        <Menu className="w-5 h-5" />
                    </SidebarTrigger>
                </div>

                <div className="flex items-center gap-4">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="text-white hover:bg-primary hover:text-secondary-default transition"
                        aria-label={formatMessage({ id: "navbar_user_notifications" })}
                    >
                        <Bell className="w-5 h-5" />
                    </Button>

                    {user && (
                        <UserMenu
                            userName={user.name || formatMessage({ id: "navbar_user_default_name" })}
                            userPictureUrl={user.picture || undefined}
                        />
                    )}
                </div>
            </div>
        </header>
    );
}
