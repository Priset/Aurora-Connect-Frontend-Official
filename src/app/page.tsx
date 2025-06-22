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
import { useIntl } from "react-intl";

export default function WelcomePage() {
    const { formatMessage } = useIntl();

    const technicianSteps = [
        {
            title: formatMessage({ id: "welcome_tech_1_title" }),
            description: formatMessage({ id: "welcome_tech_1_desc" }),
            icon: <FileText className="w-8 h-8" />,
        },
        {
            title: formatMessage({ id: "welcome_tech_2_title" }),
            description: formatMessage({ id: "welcome_tech_2_desc" }),
            icon: <Send className="w-8 h-8" />,
        },
        {
            title: formatMessage({ id: "welcome_tech_3_title" }),
            description: formatMessage({ id: "welcome_tech_3_desc" }),
            icon: <MessageCircle className="w-8 h-8" />,
        },
        {
            title: formatMessage({ id: "welcome_tech_4_title" }),
            description: formatMessage({ id: "welcome_tech_4_desc" }),
            icon: <FileText className="w-8 h-8" />,
        },
        {
            title: formatMessage({ id: "welcome_tech_5_title" }),
            description: formatMessage({ id: "welcome_tech_5_desc" }),
            icon: <ThumbsUp className="w-8 h-8" />,
        },
        {
            title: formatMessage({ id: "welcome_tech_6_title" }),
            description: formatMessage({ id: "welcome_tech_6_desc" }),
            icon: <UserPlus className="w-8 h-8" />,
        },
    ];

    const userSteps = [
        {
            title: formatMessage({ id: "welcome_user_1_title" }),
            description: formatMessage({ id: "welcome_user_1_desc" }),
            icon: <Wrench className="w-8 h-8" />,
        },
        {
            title: formatMessage({ id: "welcome_user_2_title" }),
            description: formatMessage({ id: "welcome_user_2_desc" }),
            icon: <UserPlus className="w-8 h-8" />,
        },
        {
            title: formatMessage({ id: "welcome_user_3_title" }),
            description: formatMessage({ id: "welcome_user_3_desc" }),
            icon: <ThumbsUp className="w-8 h-8" />,
        },
        {
            title: formatMessage({ id: "welcome_user_4_title" }),
            description: formatMessage({ id: "welcome_user_4_desc" }),
            icon: <FileText className="w-8 h-8" />,
        },
        {
            title: formatMessage({ id: "welcome_user_5_title" }),
            description: formatMessage({ id: "welcome_user_5_desc" }),
            icon: <MessageCircle className="w-8 h-8" />,
        },
        {
            title: formatMessage({ id: "welcome_user_6_title" }),
            description: formatMessage({ id: "welcome_user_6_desc" }),
            icon: <Send className="w-8 h-8" />,
        },
    ];

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
                <StepCarousel
                    title={formatMessage({ id: "welcome_steps_technician_title" })}
                    steps={technicianSteps}
                />
                <StepCarousel
                    title={formatMessage({ id: "welcome_steps_user_title" })}
                    steps={userSteps}
                />
            </main>

            <Footer />

            {showDialog && (
                <RegisterDialog role={dialogRole} onClose={handleDialogClose} />
            )}
        </div>
    );
}
