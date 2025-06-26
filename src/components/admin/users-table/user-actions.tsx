'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    MoreVertical,
    EyeOff,
    Eye,
    Trash,
} from 'lucide-react';
import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { User } from '@/interfaces/auroraDb';
import { toast } from 'sonner';

interface UserActionsProps {
    user: User;
    onActionComplete?: () => void;
}

export function UserActions({ user, onActionComplete }: UserActionsProps) {
    const { update, remove } = useUsers();
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus: number) => {
        try {
            setLoading(true);
            await update(user.id, { status: newStatus });
            toast.success(newStatus === 1 ? 'Cuenta habilitada' : 'Cuenta deshabilitada');
            onActionComplete?.();
        } catch {
            toast.error('Error al cambiar estado');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await remove(user.id);
            toast.success('Cuenta eliminada');
            onActionComplete?.();
        } catch {
            toast.error('Error al eliminar cuenta');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    disabled={loading}
                    className="p-1 rounded-md hover:bg-[--neutral-300] hover:scale-105 transition-all"
                >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border border-[--neutral-300] rounded-md shadow-md text-sm z-50">
                {user.status === 1 ? (
                    <DropdownMenuItem
                        className="flex items-center gap-2 hover:bg-[--neutral-100] cursor-pointer"
                        onClick={() => handleStatusChange(0)}
                    >
                        <EyeOff className="w-4 h-4 text-[--warning]" />
                        Deshabilitar
                    </DropdownMenuItem>
                ) : (
                    <>
                        <DropdownMenuItem
                            className="flex items-center gap-2 hover:bg-[--neutral-100] cursor-pointer"
                            onClick={() => handleStatusChange(1)}
                        >
                            <Eye className="w-4 h-4 text-[--success]" />
                            Habilitar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={handleDelete}
                            className="flex items-center gap-2 text-error hover:bg-[--neutral-100] cursor-pointer"
                        >
                            <Trash className="w-4 h-4" />
                            Eliminar
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
