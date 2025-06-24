"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {useAuth} from "@/hooks/useAuth";
import {useUsers} from "@/hooks/useUsers";
import {useTechnicians} from "@/hooks/useTechnicians";
import {useLanguage} from "@/i18n/intl-provider";
import {useEffect, useState} from "react";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Pencil, Loader2} from "lucide-react";
import {useIntl} from "react-intl";
import { useTheme } from "@/hooks/useTheme";
import {toast} from "sonner";

export default function SettingsPage() {
    const {profile, refreshProfile} = useAuth();
    const {update: updateUser} = useUsers();
    const {update: updateTechnician} = useTechnicians();
    const {formatMessage} = useIntl();
    const isTechnician = profile?.role === "technician";
    const {locale, setLocale} = useLanguage();

    const [form, setForm] = useState({
        name: "",
        last_name: "",
        experience: "",
        years_experience: "" as number | "",
        theme: typeof window !== "undefined" && localStorage.getItem("theme") === "dark" ? "dark" : "light",
        language: "es",
    });

    const [errors, setErrors] = useState({
        name: false,
        last_name: false,
        experience: false,
        years_experience: false,
    });

    const [editMode, setEditMode] = useState({
        name: false,
        last_name: false,
        experience: false,
        years_experience: false,
    });

    const [loading, setLoading] = useState(false);

    useTheme(form.theme as "light" | "dark");

    useEffect(() => {
        if (profile) {
            setForm((prev) => ({
                ...prev,
                name: profile.name,
                last_name: profile.last_name,
                experience: profile.technicianProfile?.experience || "",
                years_experience: profile.technicianProfile?.years_experience || 0,
            }));
        }
    }, [profile]);

    const handleChange = <K extends keyof typeof form>(field: K, value: typeof form[K]) => {
        setForm((prev) => ({...prev, [field]: value}));
    };

    const toggleEdit = (field: keyof typeof editMode) => {
        setEditMode((prev) => ({...prev, [field]: !prev[field]}));
    };

    const handleSave = async () => {
        if (!profile) return;

        const newErrors = {
            name: !form.name.trim(),
            last_name: !form.last_name.trim(),
            experience: isTechnician && !form.experience.trim(),
            years_experience: isTechnician && (form.years_experience === "" || Number(form.years_experience) < 0),
        };

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(Boolean);
        if (hasErrors) {
            toast.error(formatMessage({id: "settings_field_required"}));
            return;
        }

        setLoading(true);
        try {
            await updateUser(profile.id, {
                name: form.name,
                last_name: form.last_name,
            });

            if (isTechnician && profile.technicianProfile?.id) {
                await updateTechnician(profile.technicianProfile.id, {
                    experience: form.experience,
                    years_experience: Number(form.years_experience),
                });
            }

            toast.success(formatMessage({id: "settings_save_success"}));
            setEditMode({
                name: false,
                last_name: false,
                experience: false,
                years_experience: false,
            });
            setErrors({
                name: false,
                last_name: false,
                experience: false,
                years_experience: false,
            });

            refreshProfile?.();
        } catch (error) {
            console.error(error);
            toast.error(formatMessage({id: "settings_save_error"}));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="px-4 sm:px-6 md:px-2 py-1 space-y-8 w-full text-[--foreground]">
            <h1 className="text-2xl font-display font-bold text-primary">
                {formatMessage({id: "settings_title"})}
            </h1>

            <Card className="rounded-2xl p-6 bg-neutral-200 border border-[--neutral-300] shadow-lg max-w-xl">
                <CardHeader>
                    <CardTitle
                        className="text-[--primary-default] pb-1 border-b-2 border-[--primary-default] w-fit text-lg">
                        {formatMessage({id: "settings_personal_info_title"})}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {["name", "last_name"].map((field) => (
                        <div key={field} className="flex items-center gap-4">
                            <Label htmlFor={field} className="text-sm font-semibold w-32 capitalize">
                                {formatMessage({id: `settings_field_${field}`})}
                            </Label>
                            {editMode[field as keyof typeof editMode] ? (
                                <div className="space-y-1">
                                    <Input
                                        id={field}
                                        value={form[field as keyof typeof form] as string}
                                        onChange={(e) => handleChange(field as keyof typeof form, e.target.value)}
                                        className={`bg-white text-sm w-60 ${errors[field as keyof typeof errors] ? 'border-error' : ''}`}
                                    />
                                    {errors[field as keyof typeof errors] && (
                                        <p className="text-xs text-error">
                                            {formatMessage({id: "settings_field_required"})}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-60 px-3 py-2 bg-white text-sm border border-[--neutral-300] rounded-md">
                                        {form[field as keyof typeof form]}
                                    </div>
                                    <Pencil
                                        className="w-4 h-4 text-muted-foreground cursor-pointer"
                                        onClick={() => toggleEdit(field as keyof typeof editMode)}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {isTechnician && (
                <Card className="rounded-2xl p-6 bg-neutral-200 border border-[--neutral-300] shadow-lg max-w-xl">
                    <CardHeader>
                        <CardTitle
                            className="text-[--primary-default] pb-1 border-b-2 border-[--primary-default] w-fit text-lg">
                            {formatMessage({id: "settings_professional_info_title"})}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                            <Label htmlFor="experience" className="text-sm font-semibold w-32 pt-2">
                                {formatMessage({id: "settings_field_experience"})}
                            </Label>
                            {editMode.experience ? (
                                <div className="space-y-1">
                                    <Textarea
                                        id="experience"
                                        value={form.experience}
                                        onChange={(e) => handleChange("experience", e.target.value)}
                                        rows={3}
                                        className={`bg-white text-sm w-60 ${errors.experience ? 'border-error' : ''}`}
                                    />
                                    {errors.experience && (
                                        <p className="text-xs text-error">
                                            {formatMessage({id: "settings_field_required"})}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-start gap-2">
                                    <div
                                        className="w-60 px-3 py-2 bg-white text-sm border border-[--neutral-300] rounded-md min-h-[80px] whitespace-pre-wrap">
                                        {form.experience || formatMessage({id: "settings_field_experience_empty"})}
                                    </div>
                                    <Pencil
                                        className="w-4 h-4 text-muted-foreground mt-1 cursor-pointer"
                                        onClick={() => toggleEdit("experience")}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Label htmlFor="years_experience" className="text-sm font-semibold w-32">
                                {formatMessage({id: "settings_field_years_experience"})}
                            </Label>
                            {editMode.years_experience ? (
                                <div className="space-y-1">
                                    <Input
                                        id="years_experience"
                                        type="number"
                                        value={form.years_experience}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            handleChange("years_experience", value === "" ? "" : parseInt(value));
                                        }}
                                        className={`bg-white text-sm w-60 ${errors.years_experience ? 'border-error' : ''}`}
                                    />
                                    {errors.years_experience && (
                                        <p className="text-xs text-error">
                                            {formatMessage({id: "settings_field_required"})}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-60 px-3 py-2 bg-white text-sm border border-[--neutral-300] rounded-md">
                                        {form.years_experience || 0} {formatMessage({id: "settings_field_years_label"})}
                                    </div>
                                    <Pencil
                                        className="w-4 h-4 text-muted-foreground cursor-pointer"
                                        onClick={() => toggleEdit("years_experience")}
                                    />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="pt-2">
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-[--secondary-default] text-white hover:bg-[--secondary-hover] transition transform hover:scale-105 active:scale-95"
                >
                    {loading ? (
                        <Loader2 className="animate-spin w-4 h-4 mr-2"/>
                    ) : null}
                    {formatMessage({id: "settings_save_button"})}
                </Button>
            </div>

            <Card className="rounded-2xl p-6 bg-neutral-200 border border-[--neutral-300] shadow-lg max-w-xl">
                <CardHeader>
                    <CardTitle
                        className="text-[--primary-default] pb-1 border-b-2 border-[--primary-default] w-fit text-lg">
                        {formatMessage({id: "settings_preferences_title"})}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Label htmlFor="theme" className="text-sm font-semibold w-32">
                            {formatMessage({id: "settings_dark_mode"})}
                        </Label>
                        <Switch
                            id="theme"
                            checked={form.theme === "dark"}
                            onCheckedChange={(checked) =>
                                handleChange("theme", checked ? "dark" : "light")
                            }
                            className={form.theme === "dark" ? "" : "bg-[--neutral-400]"}
                        />
                        <span className="text-sm text-muted-foreground">
                            {form.theme === "dark"
                                ? formatMessage({id: "settings_dark_mode_on"})
                                : formatMessage({id: "settings_dark_mode_off"})}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Label className="text-sm font-semibold w-32">
                            {formatMessage({id: "settings_language"})}
                        </Label>
                        <Select
                            value={locale}
                            onValueChange={(value) => {
                                handleChange("language", value as "es" | "en");
                                setLocale(value as "es" | "en");
                            }}
                        >
                            <SelectTrigger
                                className="bg-white text-sm border border-[--neutral-300] w-60 focus:ring-1 focus:ring-[--secondary-default]">
                                <SelectValue
                                    placeholder={formatMessage({id: "settings_language_placeholder"})}
                                />
                            </SelectTrigger>
                            <SelectContent className="bg-white text-sm">
                                <SelectItem value="es">
                                    {formatMessage({id: "settings_language_es"})}
                                </SelectItem>
                                <SelectItem value="en">
                                    {formatMessage({id: "settings_language_en"})}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}
