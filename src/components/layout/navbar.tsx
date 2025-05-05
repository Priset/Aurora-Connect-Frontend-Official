"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { RegisterDialog, RegisterFormData } from "@/components/dialogs/register-dialog";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { login, register } = useAuth();
    const [showDialog, setShowDialog] = useState(false);
    const [dialogRole, setDialogRole] = useState<"client" | "technician">("client");

    const handleRegisterClick = (role: "client" | "technician") => {
        setDialogRole(role);
        setShowDialog(true);
    };

    const handleDialogClose = (data?: RegisterFormData) => {
        setShowDialog(false);
        if (!data) return;

        const { name, last_name, experience, years_experience, role } = data;

        if (role === "technician") {
            localStorage.setItem("technicianExperience", experience ?? "");
            localStorage.setItem(
                "technicianYears",
                !isNaN(Number(years_experience)) ? String(years_experience) : "0"
            );
        }

        register(role, name.trim(), last_name.trim());
    };

    return (
        <>
            <nav className="bg-[--primary-default] text-white shadow-md px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Image
                            src="/assets/Logo_Aurora.png"
                            alt="Aurora Connect Logo"
                            width={60}
                            height={40}
                            className="h-10 object-contain"
                        />
                        <h1 className="text-xl sm:text-2xl font-bold text-[--neutral-400]">
                            AURORA CONNECT
                        </h1>
                    </div>

                    <button
                        className="md:hidden text-white text-2xl"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Abrir menú"
                    >
                        ☰
                    </button>

                    <div className="hidden md:flex gap-4">
                        <Button variant="default" onClick={login}>
                            Iniciar Sesión
                        </Button>
                        <Button variant="outline" onClick={() => handleRegisterClick("client")}>
                            Registrarse como cliente
                        </Button>
                        <Button variant="outline" onClick={() => handleRegisterClick("technician")}>
                            Registrarse como técnico
                        </Button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="flex flex-col gap-2 mt-4 md:hidden">
                        <Button color="default" onClick={login}>
                            Iniciar Sesión
                        </Button>
                        <Button variant="outline" onClick={() => handleRegisterClick("client")}>
                            Registrarse como cliente
                        </Button>
                        <Button variant="outline" onClick={() => handleRegisterClick("technician")}>
                            Registrarse como técnico
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
