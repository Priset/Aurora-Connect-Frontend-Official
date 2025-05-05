import type { Metadata } from "next";
import { Providers } from './providers'
import "./globals.css";
import {Toaster} from "sonner";

export const metadata: Metadata = {
    title: "Aurora Connect",
    description: "Conecta con técnicos fácilmente",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
            <body>
                <Providers>{children}</Providers>
                <Toaster position="bottom-right" richColors closeButton />
            </body>
        </html>
    )
}
