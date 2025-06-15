"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/welcome/hero-section";
import { HowItWorksSection } from "@/components/welcome/how-it-works-section";
import { StepCarousel } from "@/components/welcome/step-carousel";
import {
    Wrench,
    FileText,
    MessageCircle,
    UserPlus,
    ThumbsUp,
    Send
} from "lucide-react";
import { RegisterDialog } from "@/components/dialogs/register-dialog";
import { useRegisterDialog } from "@/hooks/useRegisterDialog";

const technicianSteps = [
    {
        title: "Recibe solicitudes",
        description: "Accede a nuevas oportunidades laborales revisando solicitudes publicadas por usuarios.",
        icon: <FileText className="w-8 h-8" />,
    },
    {
        title: "Envía propuestas",
        description: "Responde con tu precio, mensaje y disponibilidad para ayudar al cliente.",
        icon: <Send className="w-8 h-8" />,
    },
    {
        title: "Concreta y resuelve",
        description: "Cuando el cliente acepte tu propuesta, abre el chat, coordina y resuelve el problema.",
        icon: <MessageCircle className="w-8 h-8" />,
    },
    {
        title: "Administra tu trabajo",
        description: "Desde tu panel puedes visualizar tus tickets, solicitudes pendientes y el historial de servicios.",
        icon: <FileText className="w-8 h-8" />,
    },
    {
        title: "Recibe valoraciones",
        description: "Los clientes pueden valorar tu trabajo y dejar comentarios visibles para futuros usuarios.",
        icon: <ThumbsUp className="w-8 h-8" />,
    },
    {
        title: "Mejora tu perfil",
        description: "Actualiza tu experiencia, habilidades y datos para destacar frente a nuevos clientes.",
        icon: <UserPlus className="w-8 h-8" />,
    },
];

const userSteps = [
    {
        title: "Publica tu problema",
        description: "Describe lo que ocurre con tu equipo. Puedes añadir fotos o detalles relevantes.",
        icon: <Wrench className="w-8 h-8" />,
    },
    {
        title: "Recibe propuestas",
        description: "Los técnicos te enviarán propuestas con precio, mensaje y condiciones.",
        icon: <UserPlus className="w-8 h-8" />,
    },
    {
        title: "Elige y soluciona",
        description: "Acepta una propuesta, abre el chat, coordina con el técnico y soluciona tu problema.",
        icon: <ThumbsUp className="w-8 h-8" />,
    },
    {
        title: "Sigue tu ticket",
        description: "Cada solicitud genera un ticket donde se guarda el historial de mensajes y acciones.",
        icon: <FileText className="w-8 h-8" />,
    },
    {
        title: "Valora el servicio",
        description: "Después del trabajo puedes calificar al técnico y dejar un comentario visible.",
        icon: <MessageCircle className="w-8 h-8" />,
    },
    {
        title: "Confianza asegurada",
        description: "Todos los técnicos están verificados. Revisa su perfil, experiencia y valoraciones antes de contratar.",
        icon: <Send className="w-8 h-8" />,
    },
];

export default function WelcomePage() {
    const {
        showDialog,
        dialogRole,
        handleRegisterClick,
        handleDialogClose,
    } = useRegisterDialog();

    return (
        <div className="flex flex-col min-h-screen bg-[--neutral-400]">
            <Navbar />

            <main className="flex-grow">
                <HeroSection />
                <HowItWorksSection onRegisterClick={handleRegisterClick} />
                <StepCarousel title="¿Eres Técnico? Sigue estos pasos:" steps={technicianSteps} />
                <StepCarousel title="¿Eres Usuario? Así funciona:" steps={userSteps} />
            </main>

            <Footer />

            {showDialog && (
                <RegisterDialog role={dialogRole} onClose={handleDialogClose} />
            )}
        </div>
    );
}
