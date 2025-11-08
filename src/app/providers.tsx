'use client'

import { Auth0Provider } from '@auth0/auth0-react'
import { useRouter } from 'next/navigation'
import { AuroraIntlProvider } from '@/i18n/intl-provider'
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!
    const redirectUri = typeof window !== 'undefined' ? window.location.origin + '/callback' : ''
    const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: redirectUri,
                audience,
                scope: 'openid profile email offline_access'
            }}
            cacheLocation="localstorage"
            useRefreshTokens={true}
            useRefreshTokensFallback={true}
            skipRedirectCallback={false}
            onRedirectCallback={(appState) => {
                if (appState?.returnTo) {
                    router.replace(appState.returnTo)
                } else {
                    router.replace('/callback')
                }
            }}
        >
            <AuroraIntlProvider>
                {children}
            </AuroraIntlProvider>
        </Auth0Provider>
    )
}
