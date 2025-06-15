'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading, authInitialized } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (authInitialized && !isLoading && !isAuthenticated) {
            router.push('/')
        }
    }, [isAuthenticated, isLoading, authInitialized, router])

    if (!authInitialized || isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-secondary-dark">
                <div className="backdrop-blur-lg bg-neutral-200 border border-[--neutral-300] rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-md animate-pulse">
                    <Loader2 className="animate-spin text-[--primary-default]" size={60} />
                    <p className="text-lg font-semibold text-center text-[--primary-default]">
                        Verificando autenticación...
                    </p>
                    <p className="text-sm text-muted-foreground text-center">
                        Por favor espera unos segundos mientras preparamos tus datos.
                    </p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
