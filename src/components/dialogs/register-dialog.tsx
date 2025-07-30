"use client";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import {useForm, useWatch} from "react-hook-form";
import {useState} from "react";
import {useIntl} from "react-intl";

export interface RegisterDialogProps {
    role: "client" | "technician";
    onClose: (result?: RegisterFormData) => void;
}

export interface RegisterFormData {
    name: string;
    last_name: string;
    experience?: string;
    years_experience?: number;
    role: "client" | "technician";
}

export function RegisterDialog({role, onClose}: RegisterDialogProps) {
    const [activeRole, setActiveRole] = useState<"client" | "technician">(role);
    const {formatMessage} = useIntl();

    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
        setValue,
    } = useForm<RegisterFormData>({mode: "onChange"});

    const watchedRole = useWatch({control, name: "role", defaultValue: role});

    const submit = (data: RegisterFormData) => {
        const payload: RegisterFormData = {
            ...data,
            role: activeRole,
        };

        if (activeRole === "client") {
            delete payload.experience;
            delete payload.years_experience;
        } else {
            payload.years_experience = Number(payload.years_experience || 0);
        }

        onClose(payload);
    };

    return (
        <Dialog open onOpenChange={() => onClose()}>
            <DialogContent
                className="max-w-sm w-full bg-neutral-100 border border-[--neutral-300] rounded-2xl px-6 py-8 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-display text-center text-[--primary-default]">
                        {activeRole === "client"
                            ? formatMessage({id: "register_title_client"})
                            : formatMessage({id: "register_title_technician"})}
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                        {formatMessage({id: "register_subtitle"})}
                    </p>
                </DialogHeader>

                <Tabs
                    value={activeRole}
                    onValueChange={(val) => {
                        const roleVal = val as "client" | "technician";
                        setActiveRole(roleVal);
                        setValue("role", roleVal);
                    }}
                >
                    <TabsList className="grid grid-cols-2 w-full bg-[--neutral-200] rounded-lg mt-6 mb-6 p-1 gap-2">
                        <TabsTrigger
                            value="client"
                            className="data-[state=active]:bg-[--secondary-default] data-[state=active]:text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                        >
                            {formatMessage({id: "register_tab_client"})}
                        </TabsTrigger>
                        <TabsTrigger
                            value="technician"
                            className="data-[state=active]:bg-[--secondary-default] data-[state=active]:text-white text-sm font-medium px-4 py-2 rounded-lg transition"
                        >
                            {formatMessage({id: "register_tab_technician"})}
                        </TabsTrigger>
                    </TabsList>

                    <form
                        onSubmit={handleSubmit(submit)}
                        className="space-y-4 pt-4"
                        id="register-form"
                    >
                        <TabsContent value="client">
                            <div className="space-y-4">
                                <Input
                                    placeholder={formatMessage({id: "register_input_name"})}
                                    className="bg-[--neutral-200] border border-[--neutral-400] placeholder:text-[--neutral-700] focus:ring-[--secondary-default] rounded-lg"
                                    {...register("name", {required: true})}
                                />
                                {errors.name &&
                                    <p className="text-sm text-[--error-default]">{formatMessage({id: "register_required"})}</p>}

                                <Input
                                    placeholder={formatMessage({id: "register_input_lastname"})}
                                    className="bg-[--neutral-200] border border-[--neutral-400] placeholder:text-[--neutral-700] focus:ring-[--secondary-default] rounded-lg"
                                    {...register("last_name", {required: true})}
                                />
                                {errors.last_name &&
                                    <p className="text-sm text-[--error-default]">{formatMessage({id: "register_required"})}</p>}
                            </div>
                        </TabsContent>

                        <TabsContent value="technician">
                            <div className="space-y-4">
                                <Input
                                    placeholder={formatMessage({id: "register_input_name"})}
                                    className="bg-[--neutral-200] border border-[--neutral-400] placeholder:text-[--neutral-700] focus:ring-[--secondary-default] rounded-lg"
                                    {...register("name", {required: true})}
                                />
                                {errors.name && <p className="text-sm text-[--error-default]">
                                    {formatMessage({id: "register_required"})}
                                </p>}

                                <Input
                                    placeholder={formatMessage({id: "register_input_lastname"})}
                                    className="bg-[--neutral-200] border border-[--neutral-400] placeholder:text-[--neutral-700] focus:ring-[--secondary-default] rounded-lg"
                                    {...register("last_name", {required: true})}
                                />
                                {errors.last_name && <p className="text-sm text-[--error-default]">
                                    {formatMessage({id: "register_required"})}
                                </p>}

                                <Textarea
                                    placeholder={formatMessage({id: "register_input_experience"})}
                                    className="bg-[--neutral-200] border border-[--neutral-400] placeholder:text-[--neutral-700] focus:ring-[--secondary-default] rounded-lg"
                                    {...register("experience", {
                                        validate: (value) => {
                                            if (watchedRole === "technician" && !value) {
                                                return formatMessage({id: "register_required"});
                                            }
                                            return true;
                                        },
                                    })}
                                />
                                {errors.experience && (
                                    <p className="text-sm text-[--error-default]">
                                        {formatMessage({id: "register_required"})}
                                    </p>
                                )}
                                <Input
                                    placeholder={formatMessage({id: "register_input_years"})}
                                    type="number"
                                    min={0}
                                    className="bg-[--neutral-200] border border-[--neutral-400] placeholder:text-[--neutral-700] focus:ring-[--secondary-default] rounded-lg"
                                    {...register("years_experience", {
                                        valueAsNumber: true,
                                        min: 0,
                                        validate: (value) => {
                                            if (watchedRole === "technician" && (value === null || value === undefined)) {
                                                return formatMessage({id: "register_required"});
                                            }
                                            return true;
                                        },
                                    })}
                                />
                                {errors.years_experience && (
                                    <p className="text-sm text-[--error-default]">
                                        {formatMessage({id: "register_required"})}
                                    </p>
                                )}
                            </div>
                        </TabsContent>
                    </form>
                </Tabs>

                <DialogFooter className="flex justify-center gap-4 pt-6">
                    <Button
                        type="button"
                        className="bg-error text-white hover:bg-[--error-hover]  active:bg-[--error-pressed] transition rounded-lg transform hover:scale-105 active:scale-95"
                        onClick={() => onClose()}
                    >
                        {formatMessage({id: "register_cancel"})}
                    </Button>
                    <Button
                        type="submit"
                        form="register-form"
                        className="bg-[--secondary-default] text-white hover:bg-[--secondary-hover] active:bg-[--secondary-pressed] transition rounded-lg px-6 transform hover:scale-105 active:scale-95"
                    >
                        {formatMessage({id: "register_submit"})}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
