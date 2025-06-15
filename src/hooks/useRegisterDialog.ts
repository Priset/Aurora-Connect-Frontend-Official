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

    return {
        showDialog,
        dialogRole,
        handleRegisterClick,
        handleDialogClose,
    };
}
