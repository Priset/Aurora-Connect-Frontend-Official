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
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <Input
                        placeholder={`Buscar ${view === 'users' ? 'usuario' : 'técnico'}...`}
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-64 h-10 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                    />
                </div>
                <Button
                    className="bg-gradient-to-r from-green-500/80 to-emerald-500/80 hover:from-green-600/80 hover:to-emerald-600/80 backdrop-blur-sm text-white font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 border border-white/20 px-6 py-2"
                    onClick={onToggleView}
                >
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        {view === 'users' ? 'Ver Técnicos' : 'Ver Usuarios'}
                    </div>
                </Button>
            </div>

            <div className="rounded-xl overflow-hidden border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl">
                <Table>
                    <TableHeader className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b border-white/20">
                                {headerGroup.headers.map((header, i) => (
                                    <TableHead
                                        key={header.id}
                                        className={`text-white px-6 py-4 text-sm font-semibold ${
                                            i > 0 ? 'border-l border-white/20' : ''
                                        } hover:bg-white/10 transition-all duration-200`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="bg-white/5 backdrop-blur-sm">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, rowIndex) => (
                                <TableRow
                                    key={row.id}
                                    className={`hover:bg-white/10 transition-all duration-200 border-b border-white/10 ${
                                        rowIndex % 2 === 0 ? 'bg-white/5' : 'bg-white/2'
                                    }`}
                                >
                                    {row.getVisibleCells().map((cell, i) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`px-6 py-4 text-sm text-white ${
                                                i > 0 ? 'border-l border-white/10' : ''
                                            }`}
                                        >
                                            <div className="flex items-center">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="text-center text-sm text-white/70 py-12"
                                >
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-white/10 rounded-full">
                                            <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                        </div>
                                        <span>No hay resultados para mostrar</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between pt-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4 shadow-2xl">
                <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 backdrop-blur-sm transition-all duration-200 px-6 py-2 text-sm text-white font-medium disabled:opacity-50 hover:scale-105 active:scale-95 border border-white/20"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Anterior
                    </div>
                </Button>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                    <span className="text-sm text-white font-medium">
                        Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
                    </span>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 backdrop-blur-sm transition-all duration-200 px-6 py-2 text-sm text-white font-medium disabled:opacity-50 hover:scale-105 active:scale-95 border border-white/20"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <div className="flex items-center gap-2">
                        Siguiente
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </Button>
            </div>
        </div>
    );
}
