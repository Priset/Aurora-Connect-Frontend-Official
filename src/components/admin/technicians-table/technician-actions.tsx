'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, EyeOff, Eye, Trash } from 'lucide-react';
import { useState } from 'react';
import { useTechnicians } from '@/hooks/useTechnicians';
import { TechnicianProfile } from '@/interfaces/auroraDb';
import { toast } from 'sonner';

interface TechnicianActionsProps {
    technician: TechnicianProfile;
    onActionComplete?: () => void;
}

export function TechnicianActions({ technician, onActionComplete }: TechnicianActionsProps) {
    const { update, remove } = useTechnicians();
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus: number) => {
        try {
            setLoading(true);
            await update(technician.id, { status: newStatus });
            toast.success(newStatus === 1 ? 'Técnico habilitado' : 'Técnico deshabilitado');
            onActionComplete?.();
        } catch {
            toast.error('Error al cambiar estado del técnico');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await remove(technician.id);
            toast.success('Técnico eliminado');
            onActionComplete?.();
        } catch {
            toast.error('Error al eliminar técnico');
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
                {technician.status === 1 ? (
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
