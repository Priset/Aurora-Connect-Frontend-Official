'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useIntl } from 'react-intl'

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading, authInitialized } = useAuth()
    const router = useRouter()
    const { formatMessage } = useIntl()

    useEffect(() => {
        if (!authInitialized || isLoading) return;

        if (!isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, isLoading, authInitialized, router]);

    if (!authInitialized || isLoading || !isAuthenticated) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-6">
                <div className="absolute inset-0">
                    <div className="absolute top-16 left-16 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
                    <div className="absolute top-32 right-24 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-700" />
                    <div className="absolute bottom-24 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-300" />
                    <div className="absolute bottom-16 right-16 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-1000" />
                </div>
                
                <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 max-w-md w-full">
                    <div className="p-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl">
                        <Loader2 className="animate-spin text-white" size={48} />
                    </div>
                    
                    <div className="text-center space-y-3">
                        <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                            {formatMessage({ id: 'auth_guard_verifying' })}
                        </h2>
                        <p className="text-sm text-white/70 leading-relaxed">
                            {formatMessage({ id: 'auth_guard_description' })}
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-white/60 text-xs">
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-200" />
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-400" />
                        </div>
                        <span>Verificando credenciales...</span>
                    </div>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
