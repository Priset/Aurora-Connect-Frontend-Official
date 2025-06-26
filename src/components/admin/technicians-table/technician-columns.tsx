'use client';

import { ColumnDef } from '@tanstack/react-table';
import { TechnicianProfile } from '@/interfaces/auroraDb';
import { Badge } from '@/components/ui/badge';
import { TechnicianActions } from './technician-actions';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const technicianColumns: ColumnDef<TechnicianProfile>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        id: 'user_name',
        accessorFn: (row) => row.user?.name || '',
        enableSorting: true,
        header: ({ column }) => {
            const sorted = column.getIsSorted();
            return (
                <button
                    onClick={() => column.toggleSorting(sorted === 'asc')}
                    className="flex items-center gap-1 text-white hover:underline"
                >
                    Nombre
                    {sorted === 'asc' && <ArrowUp className="w-4 h-4" />}
                    {sorted === 'desc' && <ArrowDown className="w-4 h-4" />}
                </button>
            );
        },
        cell: ({ row }) => row.original.user?.name || 'Sin nombre',
    },
    {
        id: 'user_last_name',
        accessorFn: (row) => row.user?.last_name || '',
        enableSorting: true,
        header: ({ column }) => {
            const sorted = column.getIsSorted();
            return (
                <button
                    onClick={() => column.toggleSorting(sorted === 'asc')}
                    className="flex items-center gap-1 text-white hover:underline"
                >
                    Apellido
                    {sorted === 'asc' && <ArrowUp className="w-4 h-4" />}
                    {sorted === 'desc' && <ArrowDown className="w-4 h-4" />}
                </button>
            );
        },
        cell: ({ row }) => row.original.user?.last_name || 'Sin apellido',
    },
    {
        accessorKey: 'years_experience',
        header: 'Años de Experiencia',
    },
    {
        accessorKey: 'experience',
        header: 'Experiencia',
    },
    {
        accessorKey: 'status',
        header: 'Estado',
        cell: ({ row }) => {
            const status = row.getValue('status') as number;
            const isEnabled = status === 1;

            return (
                <Badge
                    className="capitalize text-neutral-100"
                    style={{
                        backgroundColor: isEnabled
                            ? 'var(--tertiary-dark)'
                            : 'var(--neutral-900)',
                    }}
                >
                    {isEnabled ? 'Habilitado' : 'Deshabilitado'}
                </Badge>
            );
        },
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            const technician = row.original;
            return (
                <TechnicianActions
                    technician={technician}
                    onActionComplete={() => {
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('refreshTechnicians'));
                        }
                    }}
                />
            );
        },
    }
];
