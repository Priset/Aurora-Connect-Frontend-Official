'use client'

import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'
import { API_ROUTES } from '@/config/api.config'
import { useEffect, useState } from 'react'

export const useAuth = () => {
    const {
        loginWithRedirect,
        logout,
        user,
        isAuthenticated,
        isLoading,
        getAccessTokenSilently,
    } = useAuth0()

    const [profile, setProfile] = useState<{ id: number; role: 'client' | 'technician' } | null>(null)

    useEffect(() => {
        const fetchProfile = async () => {
            if (!isAuthenticated) return
            const token = await getAccessTokenSilently()
            const { data } = await axios.get(`${API_ROUTES.auth}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setProfile(data)
        }

        fetchProfile()
    }, [isAuthenticated, getAccessTokenSilently])

    const register = async (
        role: 'client' | 'technician',
        name: string,
        last_name: string
    ) => {
        const appState = { role, name, last_name }
        localStorage.setItem('appState', JSON.stringify(appState))

        await loginWithRedirect({
            appState,
            authorizationParams: {
                redirect_uri: `${window.location.origin}/callback`,
                scope: 'openid profile email offline_access',
                screen_hint: 'signup',
            },
        })
    }

    const createUser = async (data: {
        name: string
        last_name: string
        email?: string
        role: 'client' | 'technician'
        auth0_id?: string
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
            return loginWithRedirect({
                authorizationParams: {
                    redirect_uri: `${window.location.origin}/callback`,
                    scope: 'openid profile email offline_access',
                },
            })
        },
        register,
        createUser,
        logout: () =>
            logout({
                logoutParams: {
                    returnTo: window.location.origin,
                },
            }),
        user,
        profile,
        isAuthenticated,
        isLoading,
    }
}
