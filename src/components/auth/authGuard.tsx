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
            <div className="min-h-screen w-full flex items-center justify-center bg-secondary-dark">
                <div className="backdrop-blur-lg bg-neutral-200 border border-[--neutral-300] rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-md animate-pulse">
                    <Loader2 className="animate-spin text-[--primary-default]" size={60} />
                    <p className="text-lg font-semibold text-center text-[--primary-default]">
                        {formatMessage({ id: 'auth_guard_verifying' })}
                    </p>
                    <p className="text-sm text-muted-foreground text-center">
                        {formatMessage({ id: 'auth_guard_description' })}
                    </p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
