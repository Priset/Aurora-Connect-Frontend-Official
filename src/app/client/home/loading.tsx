'use client';

import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[--neutral-200] px-4">
            <div className="backdrop-blur-md bg-white/40 rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 w-full max-w-md">
                <Loader2 className="animate-spin text-[--primary-default]" size={60} />
                <p className="text-lg text-[--primary-default] font-medium text-center">
                    Cargando tu panel de cliente...
                </p>
                <p className="text-sm text-muted-foreground text-center">
                    Por favor espera unos segundos mientras preparamos tus datos.
                </p>
            </div>
        </div>
    );
}
