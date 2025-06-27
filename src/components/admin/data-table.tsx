'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    TableOptions,
} from '@tanstack/react-table';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TechnicianProfile, User } from '@/interfaces/auroraDb';
import { useState } from 'react';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    view: 'users' | 'technicians';
    onToggleView: () => void;
    initialState?: Partial<TableOptions<TData>['state']>;
}

export function DataTable<TData, TValue>({
                                             columns,
                                             data,
                                             view,
                                             onToggleView,
                                             initialState = {},
                                         }: DataTableProps<TData, TValue>) {
    const [filter, setFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter: filter,
            ...initialState,
        },
        onGlobalFilterChange: setFilter,
        globalFilterFn: (row, _columnId, filterValue) => {
            const search = filterValue.toLowerCase();

            if (view === 'users') {
                const user = row.original as User;
                return (
                    user.name.toLowerCase().includes(search) ||
                    user.last_name.toLowerCase().includes(search) ||
                    user.email.toLowerCase().includes(search)
                );
            } else {
                const tech = row.original as TechnicianProfile;
                return (
                    tech.user?.name.toLowerCase().includes(search) ||
                    tech.user?.last_name.toLowerCase().includes(search) ||
                    tech.user?.email.toLowerCase().includes(search)
                );
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState,
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Input
                    placeholder={`Buscar ${view === 'users' ? 'usuario' : 'técnico'}...`}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-64 h-10 px-4 py-2 rounded-md border border-[--secondary-default] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[--secondary-default] transition"
                />
                <Button
                    className="bg-[--secondary-default] hover:bg-[--secondary-hover] text-white font-medium transition transform hover:scale-105 active:scale-95"
                    onClick={onToggleView}
                >
                    {view === 'users' ? 'Administrar Técnicos' : 'Administrar Usuarios'}
                </Button>
            </div>

            <div className="rounded-xl overflow-hidden border border-[--neutral-300] bg-white shadow-md">
                <Table>
                    <TableHeader className="bg-[--secondary-default] text-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, i) => (
                                    <TableHead
                                        key={header.id}
                                        className={`text-white px-4 py-2 text-sm ${
                                            i > 0 ? 'border-l border-[--neutral-300]' : ''
                                        }`}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    className="hover:bg-[--neutral-100] transition"
                                >
                                    {row.getVisibleCells().map((cell, i) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`px-4 py-3 text-sm ${
                                                i > 0 ? 'border-l border-[--neutral-300]' : ''
                                            }`}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center text-sm text-muted-foreground py-6"
                                >
                                    No hay resultados.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between pt-4">
                <Button
                    size="sm"
                    className="bg-secondary hover:bg-secondary-hover active:bg-secondary-pressed scale-95 hover:scale-100 transition-all px-4 py-2 text-sm text-neutral-100 font-medium"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Anterior
                </Button>
                <span className="text-sm text-neutral-100">
          Página {table.getState().pagination.pageIndex + 1} de{' '}
                    {table.getPageCount()}
        </span>
                <Button
                    size="sm"
                    className="bg-secondary hover:bg-secondary-hover active:bg-secondary-pressed scale-95 hover:scale-100 transition-all px-4 py-2 text-sm text-neutral-100 font-medium"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Siguiente
                </Button>
            </div>
        </div>
    );
}
