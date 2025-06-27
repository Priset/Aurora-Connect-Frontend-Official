'use client';

import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/interfaces/auroraDb';
import { Badge } from '@/components/ui/badge';
import {UserActions} from "@/components/admin/users-table/user-actions";
import { ArrowUp, ArrowDown } from 'lucide-react';

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
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
    },
    {
        accessorKey: 'last_name',
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
    },
    {
        accessorKey: 'email',
        header: 'Correo',
    },
    {
        accessorKey: 'role',
        header: 'Rol',
        cell: ({ row }) => {
            const role = row.getValue('role') as string;
            return (
                <Badge
                    className="capitalize"
                    variant={
                        role === 'admin'
                            ? 'error'
                            : role === 'technician'
                                ? 'info'
                                : 'success'
                    }
                >
                    {role}
                </Badge>
            );
        },
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
        accessorKey: 'created_at',
        header: 'Creado',
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'));
            return <span>{date.toLocaleDateString()}</span>;
        },
    },
    {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
            const user = row.original;
            return (
                <UserActions
                    user={user}
                    onActionComplete={() => {
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('refreshUsers'));
                        }
                    }}
                />
            );
        },
    }
];
