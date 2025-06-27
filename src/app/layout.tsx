import type { Metadata } from "next";
import { Providers } from './providers'
import "./globals.css";
import { Toaster } from "sonner";
import React from "react";

export const metadata: Metadata = {
    title: "Aurora Connect",
    description: "Conecta con técnicos fácilmente",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <head>
                <link rel="icon" href="/assets/logo.png" type="image/png" />
                <title>Aurora Connect</title>
            </head>
            <body>
                <Providers>{children}</Providers>
                <Toaster position="bottom-right" richColors closeButton />
            </body>
        </html>
    );
}
