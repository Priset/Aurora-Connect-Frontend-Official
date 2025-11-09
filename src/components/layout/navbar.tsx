"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useAuth0 } from "@auth0/auth0-react";
import { RegisterDialog } from "@/components/dialogs/register-dialog";
import { useRegisterDialog } from "@/hooks/useRegisterDialog";
import { useIntl } from "react-intl";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, User, LogOut, Menu, X, Sparkles } from "lucide-react";

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { login, profile, authInitialized, forceLogout } = useAuth();
    const { isAuthenticated, isLoading } = useAuth0();
    const router = useRouter();
    const { formatMessage } = useIntl();
    const {
        showDialog,
        dialogRole,
        handleRegisterClick,
        handleDialogClose,
    } = useRegisterDialog();

    const isAuthenticatedWithoutProfile = isAuthenticated && !isLoading && authInitialized && !profile;

    const handleGoToAccount = () => {
        router.push('/callback');
    };

    return (
        <>
            <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20 text-white px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                            <Image
                                src="/assets/logo.png"
                                alt="Aurora Connect Logo"
                                width={24}
                                height={24}
                                className="object-contain filter brightness-0 invert"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {formatMessage({ id: "navbar_brand" })}
                            </h1>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-white hover:bg-white/20 transition-all duration-300"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Abrir menú"
                    >
                        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>

                    <div className="hidden md:flex gap-3">
                        {isAuthenticatedWithoutProfile ? (
                            <>
                                <Button
                                    onClick={handleGoToAccount}
                                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    Ir a mi cuenta
                                </Button>
                                <Button
                                    onClick={forceLogout}
                                    className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Cerrar sesión
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={login}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                                >
                                    <LogIn className="w-4 h-4 mr-2" />
                                    {formatMessage({ id: "navbar_login" })}
                                </Button>
                                <Button
                                    onClick={() => handleRegisterClick("client")}
                                    className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                                >
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    {formatMessage({ id: "navbar_register" })}
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="md:hidden mt-4 p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                        <div className="flex flex-col gap-3">
                            {isAuthenticatedWithoutProfile ? (
                                <>
                                    <Button
                                        onClick={handleGoToAccount}
                                        className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white border-0 transition-all duration-300 w-full justify-start"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Ir a mi cuenta
                                    </Button>
                                    <Button
                                        onClick={forceLogout}
                                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 transition-all duration-300 w-full justify-start"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Cerrar sesión
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={login}
                                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 transition-all duration-300 w-full justify-start"
                                    >
                                        <LogIn className="w-4 h-4 mr-2" />
                                        {formatMessage({ id: "navbar_login" })}
                                    </Button>
                                    <Button
                                        onClick={() => handleRegisterClick("client")}
                                        className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 transition-all duration-300 w-full justify-start"
                                    >
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        {formatMessage({ id: "navbar_register" })}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {showDialog && (
                <RegisterDialog role={dialogRole} onClose={handleDialogClose} />
            )}
        </>
    );
}
