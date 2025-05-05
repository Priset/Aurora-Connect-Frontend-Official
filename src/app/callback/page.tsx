'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuth } from '@/hooks/useAuth'
import { useTechnicians } from '@/hooks/useTechnicians'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'

type AppState = {
    name: string
    last_name: string
    role: 'client' | 'technician'
    returnTo?: string
}

export default function CallbackPage() {
    const router = useRouter()
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const { createUser } = useAuth()
    const { create: createTechnician } = useTechnicians()

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
                    // Registro nuevo
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
                            yearsExperience,
                        })

                        localStorage.removeItem('technicianExperience')
                        localStorage.removeItem('technicianYears')
                    }

                    localStorage.removeItem('appState')
                    router.replace(role === 'technician' ? '/technician/home' : '/client/home')
                } else {
                    // Login normal: obtener perfil desde backend
                    const { data: profile } = await axios.get(`${API_ROUTES.auth}/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })

                    router.replace(profile.role === 'technician' ? '/technician/home' : '/client/home')
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
        <div className="min-h-screen flex items-center justify-center bg-[--neutral-200] p-6">
            <div className="backdrop-blur-md bg-white/40 rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6">
                <Loader2 className="animate-spin text-[--primary-default]" size={60} />
                <p className="text-lg text-[--primary-default] font-medium text-center">
                    Procesando autenticación...
                </p>
            </div>
        </div>
    )
}
