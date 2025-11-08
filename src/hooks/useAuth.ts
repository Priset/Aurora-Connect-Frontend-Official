'use client'

import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import { useEffect, useState } from 'react'

type ProfileBase = {
    id: number;
    name: string;
    last_name: string;
    role: 'client' | 'technician' | 'admin';
    technicianProfile?: TechnicianProfile;
};

type TechnicianProfile = {
    id: number;
    user_id: number;
    experience?: string;
    years_experience: number;
    status: number;
    created_at: string;
    updated_at: string;
};

type ExtendedProfile = ProfileBase;

export const useAuth = () => {
    const {
        loginWithRedirect,
        logout,
        user,
        isAuthenticated,
        isLoading,
        getAccessTokenSilently,
    } = useAuth0()

    const [profile, setProfile] = useState<ExtendedProfile | null>(null)
    const [authInitialized, setAuthInitialized] = useState(false)

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const isProtectedRoute = window.location.pathname.startsWith('/client') || 
                                       window.location.pathname.startsWith('/technician') || 
                                       window.location.pathname.startsWith('/admin') ||
                                       window.location.pathname.startsWith('/settings') ||
                                       window.location.pathname.startsWith('/support');

                if (isAuthenticated && !isLoading && user && (isProtectedRoute || window.location.pathname === '/')) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    
                    const token = await getAccessTokenSilently({
                        cacheMode: 'on'
                    });
                    
                    const { data } = await axios.get(`${API_ROUTES.auth}/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setProfile(data);
                }
            } catch (err) {
                console.error("[useAuth] ❌ Error al inicializar autenticación:", err);

                if (err instanceof Error && err.message.includes('Missing Refresh Token')) {
                    console.log('[useAuth] Refresh token missing - user needs to login again')
                    setProfile(null)
                    return
                }

                if (err && typeof err === 'object' && 'response' in err) {
                    const axiosError = err as { response?: { status?: number; data?: unknown }; config?: { url?: string; headers?: unknown } }
                    if (axiosError.response?.status === 404) {
                        const isProtectedRoute = window.location.pathname.startsWith('/client') || 
                                               window.location.pathname.startsWith('/technician') || 
                                               window.location.pathname.startsWith('/admin') ||
                                               window.location.pathname.startsWith('/settings') ||
                                               window.location.pathname.startsWith('/support');
                        
                        if (isProtectedRoute) {
                            console.log('[useAuth] Usuario no encontrado en BD, redirigiendo al home')
                            window.location.href = '/'
                            return
                        }
                    }

                    console.error('[useAuth] Status:', axiosError.response?.status)
                    console.error('[useAuth] Data:', axiosError.response?.data)
                    console.error('[useAuth] URL:', axiosError.config?.url)
                    console.error('[useAuth] Headers:', axiosError.config?.headers)
                }

                setProfile(null);
            } finally {
                setAuthInitialized(true);
            }
        };

        if (!isLoading) {
            initializeAuth();
        }
    }, [isAuthenticated, isLoading, user, getAccessTokenSilently]);


    const register = async (
        role: 'client' | 'technician' | 'admin',
        name: string,
        last_name: string,
        technicianData?: { experience: string; years_experience: number }
    ) => {
        try {
            const appState = { 
                role, 
                name, 
                last_name,
                ...(technicianData && { 
                    experience: technicianData.experience,
                    years_experience: technicianData.years_experience 
                })
            }
            localStorage.setItem('appState', JSON.stringify(appState))

            await loginWithRedirect({
                appState,
                authorizationParams: {
                    redirect_uri: `${window.location.origin}/callback`,
                    scope: 'openid profile email offline_access',
                    screen_hint: 'signup',
                },
            })
        } catch (error) {
            console.error('[useAuth] Error en registro:', error)
            localStorage.removeItem('appState')
            throw error
        }
    }

    const refreshProfile = async () => {
        try {
            const token = await getAccessTokenSilently();
            const { data } = await axios.get(`${API_ROUTES.auth}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfile(data);
        } catch (err) {
            console.error("Error al refrescar el perfil:", err);
        }
    };

    const createUser = async (data: {
        name: string
        last_name: string
        email: string
        role: 'client' | 'technician' | 'admin'
    }) => {
        const token = await getAccessTokenSilently()
        const res = await axios.post(`${API_ROUTES.auth}/register`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return res.data
    }

    return {
        login: () => {
            try {
                return loginWithRedirect({
                    authorizationParams: {
                        redirect_uri: `${window.location.origin}/callback`,
                        scope: 'openid profile email offline_access',
                    },
                })
            } catch (error) {
                console.error('[useAuth] Error en login:', error)
                throw error
            }
        },
        register,
        createUser,
        logout: () =>
            logout({
                logoutParams: {
                    returnTo: window.location.origin,
                },
            }),
        forceLogout: () => {
            localStorage.clear();
            logout({
                logoutParams: {
                    returnTo: window.location.origin,
                },
            });
        },
        user,
        profile,
        isAuthenticated,
        isLoading,
        authInitialized,
        refreshProfile,
    }
}
