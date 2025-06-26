'use client';

import { useEffect, useMemo, useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { useTechnicians } from '@/hooks/useTechnicians';
import { User, TechnicianProfile } from '@/interfaces/auroraDb';
import { columns as userColumns } from '../../../components/admin/users-table/columns';
import { technicianColumns } from '@/components/admin/technicians-table/technician-columns';
import { DataTable } from '@/components/admin/data-table';
import { Loader2 } from 'lucide-react';

export default function AdminUsersPage() {
    const { getAll: getUsers } = useUsers();
    const { getAll: getTechnicians } = useTechnicians();

    const [users, setUsers] = useState<User[]>([]);
    const [technicians, setTechnicians] = useState<TechnicianProfile[]>([]);
    const [isViewingTechnicians, setIsViewingTechnicians] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    }, [getUsers, getTechnicians, isViewingTechnicians]);

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
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-display font-bold text-neutral-100">
                    Administración de {isViewingTechnicians ? 'Técnicos' : 'Usuarios'}
                </h1>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="animate-spin h-8 w-8 text-[--primary-default]" />
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
