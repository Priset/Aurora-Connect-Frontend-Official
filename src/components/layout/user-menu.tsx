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
                <Avatar className="w-9 h-9 cursor-pointer">
                    {userPictureUrl ? (
                        <AvatarImage src={userPictureUrl} alt="avatar" />
                    ) : (
                        <AvatarFallback className="bg-[--secondary-default] text-white">
                            <User className="w-5 h-5" />
                        </AvatarFallback>
                    )}
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="bg-[--neutral-100] text-[--foreground] min-w-[180px] rounded-xl shadow-lg border border-[--neutral-300]"
                align="end"
            >
                <DropdownMenuLabel className="text-center font-semibold text-[--primary-default] py-2">
                    {userName}
                </DropdownMenuLabel>

                <DropdownMenuItem
                    className="cursor-pointer hover:bg-[--neutral-200] hover:text-[--error-default] transition rounded-md"
                    onClick={logout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    {formatMessage({ id: "user_menu_logout" })}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
