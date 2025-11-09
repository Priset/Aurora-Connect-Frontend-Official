"use client";

import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";
import { useIntl } from "react-intl";

interface UserMenuProps {
    userName: string;
    userPictureUrl?: string;
}

export function UserMenu({ userName, userPictureUrl }: UserMenuProps) {
    const { logout } = useAuth();
    const { formatMessage } = useIntl();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="w-9 h-9 cursor-pointer hover:scale-110 transition-all duration-200 border-2 border-white/20 backdrop-blur-sm">
                    {userPictureUrl ? (
                        <AvatarImage src={userPictureUrl} alt="avatar" />
                    ) : (
                        <AvatarFallback className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 text-white backdrop-blur-sm">
                            <User className="w-5 h-5" />
                        </AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="bg-white/10 backdrop-blur-xl text-white min-w-[200px] rounded-xl shadow-2xl border border-white/20 p-2"
                align="end"
            >
                <DropdownMenuLabel className="text-center font-semibold text-white py-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-lg border border-white/20 mb-2">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <div className="p-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full">
                            <User className="w-3 h-3 text-blue-400" />
                        </div>
                        <span className="text-sm">{userName}</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
                </DropdownMenuLabel>

                <DropdownMenuItem
                    className="cursor-pointer hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 rounded-lg p-3 bg-white/5 backdrop-blur-sm border border-white/10 hover:scale-105 active:scale-95"
                    onClick={logout}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-1 bg-red-500/20 rounded-full">
                            <LogOut className="w-4 h-4 text-red-400" />
                        </div>
                        <span className="font-medium">{formatMessage({ id: "user_menu_logout" })}</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
