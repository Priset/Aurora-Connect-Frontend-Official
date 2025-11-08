'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth0 } from '@auth0/auth0-react'
import { useAuth } from '@/hooks/useAuth'
import { useTechnicians } from '@/hooks/useTechnicians'
import { Loader2 } from 'lucide-react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import { useIntl } from 'react-intl'
import { RegisterFormData } from '@/components/dialogs/register-dialog'

type AppState = RegisterFormData & {
    returnTo?: string
}

export default function CallbackPage() {
    const router = useRouter()
    const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0()
    const { createUser } = useAuth()
    const { create: createTechnician } = useTechnicians()
    const { formatMessage } = useIntl()
    const processingRef = useRef(false)

    useEffect(() => {
        const processUser = async () => {
            if (processingRef.current) return
            processingRef.current = true
            try {
                const appStateJson = localStorage.getItem('appState')
                const appState = appStateJson ? (JSON.parse(appStateJson) as AppState) : null

                const email = user?.email
                const auth0_id = user?.sub
                if (!email || !auth0_id) {
                    console.error('Faltan datos del usuario Auth0')
                    router.replace('/')
                    return
                }

                const token = await getAccessTokenSilently()

                if (appState) {
                    const { name, last_name, role } = appState

                    let createdUser;
                    try {
                        createdUser = await createUser({
                            name,
                            last_name,
                            email,
                            role,
                        })
                    } catch (createError) {
                        if (createError && typeof createError === 'object' && 'response' in createError && (createError as { response?: { status?: number } }).response?.status === 409) {
                            const { data: existingUser } = await axios.get(`${API_ROUTES.auth}/me`, {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            })
                            createdUser = existingUser
                        }
                    }

                    if (role === 'technician' && appState.experience && typeof appState.years_experience === 'number') {
                        try {
                            if (!createdUser.technicianProfile) {
                                await createTechnician({
                                    experience: appState.experience,
                                    years_experience: appState.years_experience,
                                })
                            }
                        } catch (techError) {
                            if (techError && typeof techError === 'object' && 'response' in techError) {
                                const axiosError = techError as { response?: { status?: number } }
                                if (axiosError.response?.status === 409) {
                                    // Ignore duplicate technician profile
                                }
                            }
                        }
                    }

                    localStorage.removeItem('appState')
                    
                    const getHomeRoute = (userRole: string) => {
                        switch (userRole) {
                            case 'technician':
                                return '/technician/home'
                            case 'admin':
                                return '/admin/home'
                            default:
                                return '/client/home'
                        }
                    }
                    
                    router.replace(getHomeRoute(role))
                } else {
                    try {
                        const { data: profile } = await axios.get(`${API_ROUTES.auth}/me`, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                        const getHomeRoute = (userRole: string) => {
                            switch (userRole) {
                                case 'technician':
                                    return '/technician/home'
                                case 'admin':
                                    return '/admin/home'
                                default:
                                    return '/client/home'
                            }
                        }
                        router.replace(getHomeRoute(profile.role))
                    } catch (profileError) {
                        console.error('Error al obtener perfil del backend:', profileError)

                        if (profileError && typeof profileError === 'object' && 'response' in profileError) {
                            const axiosError = profileError as { response?: { status?: number } }
                            if (axiosError.response?.status === 404) {
                                try {
                                    await createUser({
                                        name: user.given_name || user.name?.split(' ')[0] || 'Usuario',
                                        last_name: user.family_name || user.name?.split(' ').slice(1).join(' ') || 'Nuevo',
                                        email,
                                        role: 'client',
                                    })
                                    
                                    router.replace('/client/home')
                                    return
                                } catch (registerError) {
                                    console.error('Error al registrar usuario automáticamente:', registerError)
                                }
                            }
                        }

                        router.replace('/')
                    }
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-1000" />
                <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-500" />
                <div className="absolute bottom-20 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-700" />
            </div>
            
            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-6 w-full max-w-md">
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl">
                    <Loader2 className="animate-spin text-white" size={48} />
                </div>
                
                <div className="text-center space-y-3">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {formatMessage({ id: 'callback_loading_title' })}
                    </h2>
                    <p className="text-sm text-white/70 leading-relaxed">
                        {formatMessage({ id: 'callback_loading_description' })}
                    </p>
                </div>
                
                <div className="flex items-center gap-2 text-white/60 text-xs">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200" />
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-400" />
                    </div>
                    <span>Procesando autenticación...</span>
                </div>
            </div>
        </div>
    )
}
