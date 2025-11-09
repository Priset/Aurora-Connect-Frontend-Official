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
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Loader2, Settings, User, Briefcase, Palette, Globe, Save, Edit3} from "lucide-react";
import {useIntl} from "react-intl";
import { useTheme } from "@/hooks/useTheme";
import {updateUserSchema, updateTechnicianSchema, UpdateUserData, UpdateTechnicianData} from "@/lib/validations";
import {useFormValidation} from "@/hooks/useFormValidation";

export default function SettingsPage() {
    const {profile, refreshProfile} = useAuth();
    const {update: updateUser} = useUsers();
    const {update: updateTechnician} = useTechnicians();
    const {formatMessage} = useIntl();
    const isTechnician = profile?.role === "technician";
    const {locale, setLocale} = useLanguage();
    const {handleValidationError, handleSuccess} = useFormValidation();

    const userForm = useForm<UpdateUserData>({
        resolver: zodResolver(updateUserSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            last_name: "",
        },
    });

    const technicianForm = useForm<UpdateTechnicianData>({
        resolver: zodResolver(updateTechnicianSchema),
        mode: "onChange",
        defaultValues: {
            experience: "",
            years_experience: 0,
        },
    });

    const [form, setForm] = useState({
        name: "",
        last_name: "",
        experience: "",
        years_experience: "" as number | "",
        theme: "dark" as "light" | "dark",
        language: "es",
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
            
            userForm.reset({
                name: profile.name,
                last_name: profile.last_name,
            });
            
            if (isTechnician) {
                technicianForm.reset({
                    experience: profile.technicianProfile?.experience || "",
                    years_experience: profile.technicianProfile?.years_experience || 0,
                });
            }
        }
    }, [profile, userForm, technicianForm, isTechnician]);

    const handleChange = <K extends keyof typeof form>(field: K, value: typeof form[K]) => {
        setForm((prev) => ({...prev, [field]: value}));
    };

    const toggleEdit = (field: keyof typeof editMode) => {
        setEditMode((prev) => ({...prev, [field]: !prev[field]}));
    };

    const handleSave = async () => {
        if (!profile) return;

        const userData = userForm.getValues();
        const techData = isTechnician ? technicianForm.getValues() : null;

        // Validar formularios
        const userValid = await userForm.trigger();
        const techValid = isTechnician ? await technicianForm.trigger() : true;

        if (!userValid || !techValid) {
            handleValidationError(formatMessage({id: "settings_field_required"}));
            return;
        }

        setLoading(true);
        try {
            await updateUser(profile.id, userData);

            if (isTechnician && profile.technicianProfile?.id && techData) {
                await updateTechnician(profile.technicianProfile.id, techData);
            }

            handleSuccess(formatMessage({id: "settings_save_success"}));
            setEditMode({
                name: false,
                last_name: false,
                experience: false,
                years_experience: false,
            });

            refreshProfile?.();
        } catch (error) {
            console.error(error);
            handleValidationError(formatMessage({id: "settings_save_error"}));
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="px-4 sm:px-6 md:px-10 py-8 space-y-8 w-full relative z-10">
            <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Settings className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-display font-bold text-white">
                    {formatMessage({id: "settings_title"})}
                </h1>
            </div>

            <Card className="rounded-2xl p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3 text-lg">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <User className="w-5 h-5 text-blue-400" />
                        </div>
                        {formatMessage({id: "settings_personal_info_title"})}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {["name", "last_name"].map((field) => (
                        <div key={field} className="flex items-center gap-4">
                            <Label htmlFor={field} className="text-sm font-semibold w-32 capitalize text-white flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                {formatMessage({id: `settings_field_${field}`})}
                            </Label>
                            {editMode[field as keyof typeof editMode] ? (
                                <div className="space-y-1">
                                    <Input
                                        {...userForm.register(field as keyof UpdateUserData)}
                                        className={`bg-white/10 backdrop-blur-sm text-white text-sm w-60 border-white/20 placeholder:text-white/50 focus:border-[--secondary-default] transition-colors ${userForm.formState.errors[field as keyof UpdateUserData] ? 'border-red-400' : ''}`}
                                    />
                                    {userForm.formState.errors[field as keyof UpdateUserData] && (
                                        <p className="text-xs text-red-500">
                                            {userForm.formState.errors[field as keyof UpdateUserData]?.message}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-60 px-3 py-2 bg-white/10 backdrop-blur-sm text-white text-sm border border-white/20 rounded-md">
                                        {form[field as keyof typeof form]}
                                    </div>
                                    <div className="p-1 bg-[--secondary-default]/20 rounded cursor-pointer hover:bg-[--secondary-default]/30 transition-colors" onClick={() => toggleEdit(field as keyof typeof editMode)}>
                                        <Edit3 className="w-4 h-4 text-[--secondary-default]" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>

            {isTechnician && (
                <Card className="rounded-2xl p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3 text-lg">
                            <div className="p-2 bg-orange-500/20 rounded-lg">
                                <Briefcase className="w-5 h-5 text-orange-400" />
                            </div>
                            {formatMessage({id: "settings_professional_info_title"})}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4">
                            <Label htmlFor="experience" className="text-sm font-semibold w-32 pt-2 text-white flex items-start gap-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full mt-1"></div>
                                {formatMessage({id: "settings_field_experience"})}
                            </Label>
                            {editMode.experience ? (
                                <div className="space-y-1">
                                    <Textarea
                                        {...technicianForm.register("experience")}
                                        rows={3}
                                        className={`bg-white/10 backdrop-blur-sm text-white text-sm w-60 border-white/20 placeholder:text-white/50 focus:border-[--secondary-default] transition-colors resize-none ${technicianForm.formState.errors.experience ? 'border-red-400' : ''}`}
                                    />
                                    {technicianForm.formState.errors.experience && (
                                        <p className="text-xs text-red-500">
                                            {technicianForm.formState.errors.experience.message}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-start gap-2">
                                    <div className="w-60 px-3 py-2 bg-white/10 backdrop-blur-sm text-white text-sm border border-white/20 rounded-md min-h-[80px] whitespace-pre-wrap">
                                        {form.experience || formatMessage({id: "settings_field_experience_empty"})}
                                    </div>
                                    <div className="p-1 bg-[--secondary-default]/20 rounded cursor-pointer hover:bg-[--secondary-default]/30 transition-colors mt-1" onClick={() => toggleEdit("experience")}>
                                        <Edit3 className="w-4 h-4 text-[--secondary-default]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <Label htmlFor="years_experience" className="text-sm font-semibold w-32 text-white flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                {formatMessage({id: "settings_field_years_experience"})}
                            </Label>
                            {editMode.years_experience ? (
                                <div className="space-y-1">
                                    <Input
                                        {...technicianForm.register("years_experience", { valueAsNumber: true })}
                                        type="number"
                                        className={`bg-white/10 backdrop-blur-sm text-white text-sm w-60 border-white/20 placeholder:text-white/50 focus:border-[--secondary-default] transition-colors ${technicianForm.formState.errors.years_experience ? 'border-red-400' : ''}`}
                                    />
                                    {technicianForm.formState.errors.years_experience && (
                                        <p className="text-xs text-red-500">
                                            {technicianForm.formState.errors.years_experience.message}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <div className="w-60 px-3 py-2 bg-white/10 backdrop-blur-sm text-white text-sm border border-white/20 rounded-md">
                                        {form.years_experience || 0} {formatMessage({id: "settings_field_years_label"})}
                                    </div>
                                    <div className="p-1 bg-[--secondary-default]/20 rounded cursor-pointer hover:bg-[--secondary-default]/30 transition-colors" onClick={() => toggleEdit("years_experience")}>
                                        <Edit3 className="w-4 h-4 text-[--secondary-default]" />
                                    </div>
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
                    className="bg-[--secondary-default] text-white hover:bg-[--secondary-hover] transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                    {loading ? (
                        <Loader2 className="animate-spin w-4 h-4"/>
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {formatMessage({id: "settings_save_button"})}
                </Button>
            </div>

            <Card className="rounded-2xl p-6 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-xl max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-3 text-lg">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Palette className="w-5 h-5 text-purple-400" />
                        </div>
                        {formatMessage({id: "settings_preferences_title"})}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Label htmlFor="theme" className="text-sm font-semibold w-32 text-white flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
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
                        <span className="text-sm text-white/70">
                            {form.theme === "dark"
                                ? formatMessage({id: "settings_dark_mode_on"})
                                : formatMessage({id: "settings_dark_mode_off"})}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <Label className="text-sm font-semibold w-32 text-white flex items-center gap-2">
                            <Globe className="w-4 h-4 text-green-400" />
                            {formatMessage({id: "settings_language"})}
                        </Label>
                        <Select
                            value={locale}
                            onValueChange={(value) => {
                                handleChange("language", value as "es" | "en");
                                setLocale(value as "es" | "en");
                            }}
                        >
                            <SelectTrigger className="bg-white/10 backdrop-blur-sm text-white text-sm border border-white/20 w-60 focus:ring-1 focus:ring-[--secondary-default] transition-colors">
                                <SelectValue
                                    placeholder={formatMessage({id: "settings_language_placeholder"})}
                                />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95 backdrop-blur-md text-sm border border-white/20">
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
