'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuth } from '@/hooks/useAuth'
import { useTechnicians } from '@/hooks/useTechnicians'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import { useIntl } from 'react-intl'

type AppState = {
    name: string
    last_name: string
    role: 'client' | 'technician' | 'admin'
    returnTo?: string
}

export default function CallbackPage() {
    const router = useRouter()
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const { createUser } = useAuth()
    const { create: createTechnician } = useTechnicians()
    const { formatMessage } = useIntl()

    useEffect(() => {
        const processUser = async () => {
            try {
                const appStateJson = localStorage.getItem('appState')
                const appState = appStateJson ? (JSON.parse(appStateJson) as AppState) : null

                const email = user?.email
                const auth0_id = user?.sub
                if (!email || !auth0_id) throw new Error('Faltan datos del usuario Auth0')

                const token = await getAccessTokenSilently()

                if (appState) {
                    const { name, last_name, role } = appState

                    const createdUser = await createUser({
                        name,
                        last_name,
                        email,
                        role,
                        auth0_id,
                    })

                    if (role === 'technician') {
                        const experience = localStorage.getItem('technicianExperience') || ''
                        const yearsExperience = parseInt(localStorage.getItem('technicianYears') || '0', 10)

                        await createTechnician({
                            user_id: createdUser.id,
                            experience,
                            years_experience: yearsExperience,
                        })

                        localStorage.removeItem('technicianExperience')
                        localStorage.removeItem('technicianYears')
                    }

                    localStorage.removeItem('appState')
                    router.replace(
                        role === 'technician' ? '/technician/home' :
                            role === 'admin' ? '/admin/home' :
                                '/client/home'
                    )
                } else {
                    const { data: profile } = await axios.get(`${API_ROUTES.auth}/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    router.replace(
                        profile.role === 'technician' ? '/technician/home' :
                            profile.role === 'admin' ? '/admin/home' :
                                '/client/home'
                    )
                }
            } catch (err) {
                console.error('Error en el callback de autenticación', err)
                localStorage.removeItem('appState')
                localStorage.removeItem('technicianExperience')
                localStorage.removeItem('technicianYears')
                router.replace('/')
            }
        }

        if (isAuthenticated && !isLoading && user) {
            processUser()
        }
    }, [isAuthenticated, isLoading, user, createUser, createTechnician, router, getAccessTokenSilently])

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-dark p-6">
            <div className="backdrop-blur-lg bg-neutral-200 border border-[--neutral-300] rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 w-full max-w-sm animate-pulse">
                <Loader2 className="animate-spin text-[--primary-default]" size={60} />
                <p className="text-lg font-semibold text-center text-[--primary-default]">
                    {formatMessage({ id: 'callback_loading_title' })}
                </p>
                <p className="text-sm text-muted-foreground text-center">
                    {formatMessage({ id: 'callback_loading_description' })}
                </p>
            </div>
        </div>
    )
}
