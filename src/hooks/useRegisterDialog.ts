import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { RegisterFormData } from "@/components/dialogs/register-dialog";

export function useRegisterDialog() {
    const { register } = useAuth();

    const [showDialog, setShowDialog] = useState(false);
    const [dialogRole, setDialogRole] = useState<"client" | "technician">("client");

    const handleRegisterClick = (role: "client" | "technician") => {
        setDialogRole(role);
        setShowDialog(true);
    };

    const handleDialogClose = (data?: RegisterFormData) => {
        setShowDialog(false);
        if (!data) return;

        const { name, last_name, role } = data;

        if (role === 'technician' && 'experience' in data && 'years_experience' in data) {
            register(role, name.trim(), last_name.trim(), {
                experience: data.experience,
                years_experience: data.years_experience
            });
        } else {
            register(role, name.trim(), last_name.trim());
        }
    };

    return {
        showDialog,
        dialogRole,
        handleRegisterClick,
        handleDialogClose,
    };
}
