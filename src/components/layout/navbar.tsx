"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { RegisterDialog } from "@/components/dialogs/register-dialog";
import { useRegisterDialog } from "@/hooks/useRegisterDialog";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { login } = useAuth();
    const {
        showDialog,
        dialogRole,
        handleRegisterClick,
        handleDialogClose,
    } = useRegisterDialog();

    return (
        <>
            <nav className="bg-primary-dark text-white shadow-md px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/assets/logo.png"
                            alt="Aurora Connect Logo"
                            width={60}
                            height={40}
                            className="h-10 object-contain"
                        />
                        <h1 className="text-xl sm:text-2xl font-bold text-neutral-300">
                            AURORA CONNECT
                        </h1>
                    </div>

                    <Button
                        className="md:hidden text-white text-2xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Abrir menú"
                    >
                        ☰
                    </Button>

                    <div className="hidden md:flex gap-4">
                        <Button
                            className="bg-secondary hover:bg-secondary-hover active:bg-secondary-pressed text-white transition"
                            onClick={login}
                        >
                            Iniciar Sesión
                        </Button>
                        <Button
                            className="border border-secondary text-secondary hover:bg-secondary hover:text-white active:bg-secondary-pressed transition"
                            variant="ghost"
                            onClick={() => handleRegisterClick("client")}
                        >
                            Registrarse
                        </Button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="flex flex-col gap-2 mt-4 md:hidden">
                        <Button
                            className="bg-secondary hover:bg-secondary-hover active:bg-secondary-pressed text-white transition"
                            onClick={login}
                        >
                            Iniciar Sesión
                        </Button>
                        <Button
                            className="border border-secondary text-secondary hover:bg-secondary hover:text-white active:bg-secondary-pressed transition"
                            variant="ghost"
                            onClick={() => handleRegisterClick("client")}
                        >
                            Registrarse
                        </Button>
                    </div>
                )}
            </nav>

            {showDialog && (
                <RegisterDialog role={dialogRole} onClose={handleDialogClose} />
            )}
        </>
    );
}
