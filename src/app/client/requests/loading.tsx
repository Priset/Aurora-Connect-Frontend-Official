"use client";

export default function Loading() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[--neutral-200] px-4">
            <div className="flex flex-col items-center gap-6">
                <div className="w-14 h-14 rounded-full border-4 border-[--primary-default] border-t-transparent animate-spin" />
                <p className="text-[--primary-default] font-semibold text-base text-center">
                    Cargando solicitudes del cliente...
                </p>
            </div>
        </div>
    );
}
