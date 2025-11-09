'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { useTechnicians } from '@/hooks/useTechnicians';
import { useAuth } from '@/hooks/useAuth';
import { User, TechnicianProfile } from '@/interfaces/auroraDb';
import { columns as userColumns } from '../../../components/admin/users-table/columns';
import { technicianColumns } from '@/components/admin/technicians-table/technician-columns';
import { DataTable } from '@/components/admin/data-table';
import { Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
    const { profile } = useAuth();
    const { getAll: getUsers } = useUsers();
    const { getAll: getTechnicians } = useTechnicians();

    const [users, setUsers] = useState<User[]>([]);
    const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
    const [isViewingTechnicians, setIsViewingTechnicians] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!profile?.id) return;
        
        const load = async () => {
            try {
                setLoading(true);
                if (isViewingTechnicians) {
                    const data = await getTechnicians();
                    setTechnicians(data);
                } else {
                    const data = await getUsers();
                    setUsers(data);
                }
            } catch (e) {
                console.error("Error cargando datos", e);
            } finally {
                setLoading(false);
            }
        };

        load();

        const handler = () => load();
        window.addEventListener('refreshUsers', handler);
        window.addEventListener('refreshTechnicians', handler);

        return () => {
            window.removeEventListener('refreshUsers', handler);
            window.removeEventListener('refreshTechnicians', handler);
        };
    }, [getUsers, getTechnicians, isViewingTechnicians, profile?.id]);

    const userInitialState = useMemo(
        () => ({
            sorting: [{ id: 'name', desc: false }],
        }),
        []
    );

    const technicianInitialState = useMemo(
        () => ({
            sorting: [{ id: 'user_name', desc: false }],
        }),
        []
    );

    return (
        <main className="px-6 md:px-10 py-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-6 shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-display font-bold text-white">
                        Administración de {isViewingTechnicians ? 'Técnicos' : 'Usuarios'}
                    </h1>
                    <div className="ml-auto flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-white/70">{isViewingTechnicians ? technicians.length : users.length} registros</span>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full">
                            <Loader2 className="animate-spin h-8 w-8 text-blue-400" />
                        </div>
                        <span className="text-white/70 text-sm">Cargando datos...</span>
                    </div>
                </div>
            ) : isViewingTechnicians ? (
                <DataTable<TechnicianProfile, unknown>
                    columns={technicianColumns}
                    data={technicians}
                    view="technicians"
                    onToggleView={() => setIsViewingTechnicians(false)}
                    initialState={technicianInitialState}
                />
            ) : (
                <DataTable<User, unknown>
                    columns={userColumns}
                    data={users}
                    view="users"
                    onToggleView={() => setIsViewingTechnicians(true)}
                    initialState={userInitialState}
                />
            )}
        </main>
    );
}
