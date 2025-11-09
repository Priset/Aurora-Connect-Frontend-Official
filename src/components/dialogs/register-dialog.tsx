"use client";

import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useIntl} from "react-intl";
import {
    registerClientSchema,
    registerTechnicianSchema,
    RegisterClientData,
    RegisterTechnicianData,
} from "@/lib/validations";
import {useFormValidation} from "@/hooks/useFormValidation";

export interface RegisterDialogProps {
    role: "client" | "technician";
    onClose: (result?: RegisterFormData) => void;
}

export type RegisterFormData = RegisterClientData | RegisterTechnicianData;

export function RegisterDialog({role, onClose}: RegisterDialogProps) {
    const [activeRole, setActiveRole] = useState<"client" | "technician">(role);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {formatMessage} = useIntl();
    const {handleValidationError, handleSuccess} = useFormValidation();

    const clientForm = useForm<RegisterClientData>({
        resolver: zodResolver(registerClientSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            last_name: "",
            role: "client",
        },
    });

    const technicianForm = useForm<RegisterTechnicianData>({
        resolver: zodResolver(registerTechnicianSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            last_name: "",
            experience: "",
            years_experience: 1,
            role: "technician",
        },
    });

    const currentForm = activeRole === "client" ? clientForm : technicianForm;

    const submit = async (data: RegisterClientData | RegisterTechnicianData) => {
        setIsSubmitting(true);
        try {
            onClose(data);
            handleSuccess(formatMessage({id: "register_success"}));
        } catch {
            handleValidationError(formatMessage({id: "register_error"}));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open onOpenChange={() => onClose()}>
            <DialogContent
                className="max-w-sm w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-8 shadow-2xl text-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-display text-center text-white">
                        {activeRole === "client"
                            ? formatMessage({id: "register_title_client"})
                            : formatMessage({id: "register_title_technician"})}
                    </DialogTitle>
                    <p className="text-sm text-white/70 text-center mt-1">
                        {formatMessage({id: "register_subtitle"})}
                    </p>
                </DialogHeader>

                <Tabs
                    value={activeRole}
                    onValueChange={(val) => {
                        const roleVal = val as "client" | "technician";
                        setActiveRole(roleVal);
                        if (roleVal === "client") {
                            clientForm.setValue("role", "client");
                        } else {
                            technicianForm.setValue("role", "technician");
                        }
                    }}
                >
                    <TabsList className="grid grid-cols-2 w-full bg-white/20 backdrop-blur-sm rounded-lg mt-6 mb-6 p-1 gap-2 border border-white/30">
                        <TabsTrigger
                            value="client"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/80 data-[state=active]:to-purple-500/80 data-[state=active]:text-white text-white/70 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                        >
                            {formatMessage({id: "register_tab_client"})}
                        </TabsTrigger>
                        <TabsTrigger
                            value="technician"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500/80 data-[state=active]:to-red-500/80 data-[state=active]:text-white text-white/70 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                        >
                            {formatMessage({id: "register_tab_technician"})}
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="client">
                        <Form {...clientForm}>
                            <form
                                onSubmit={clientForm.handleSubmit(submit)}
                                className="space-y-4 pt-4"
                                id="register-form-client"
                            >
                                <FormField
                                    control={clientForm.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-white">
                                                {formatMessage({id: "register_input_name"})}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={formatMessage({id: "register_input_name"})}
                                                    className="bg-white/20 backdrop-blur-sm border border-white/30 placeholder:text-white/70 focus:ring-blue-400/50 rounded-lg text-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={clientForm.control}
                                    name="last_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-white">
                                                {formatMessage({id: "register_input_lastname"})}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={formatMessage({id: "register_input_lastname"})}
                                                    className="bg-white/20 backdrop-blur-sm border border-white/30 placeholder:text-white/70 focus:ring-blue-400/50 rounded-lg text-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </TabsContent>

                    <TabsContent value="technician">
                        <Form {...technicianForm}>
                            <form
                                onSubmit={technicianForm.handleSubmit(submit)}
                                className="space-y-4 pt-4"
                                id="register-form-technician"
                            >
                                <FormField
                                    control={technicianForm.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-white">
                                                {formatMessage({id: "register_input_name"})}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={formatMessage({id: "register_input_name"})}
                                                    className="bg-white/20 backdrop-blur-sm border border-white/30 placeholder:text-white/70 focus:ring-orange-400/50 rounded-lg text-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={technicianForm.control}
                                    name="last_name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-white">
                                                {formatMessage({id: "register_input_lastname"})}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={formatMessage({id: "register_input_lastname"})}
                                                    className="bg-white/20 backdrop-blur-sm border border-white/30 placeholder:text-white/70 focus:ring-orange-400/50 rounded-lg text-white"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={technicianForm.control}
                                    name="experience"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-white">
                                                {formatMessage({id: "register_input_experience"})}
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder={formatMessage({id: "register_input_experience"})}
                                                    className="bg-white/20 backdrop-blur-sm border border-white/30 placeholder:text-white/70 focus:ring-orange-400/50 rounded-lg text-white"
                                                    rows={3}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={technicianForm.control}
                                    name="years_experience"
                                    render={({field: { value, onChange, ...field }}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium text-white">
                                                {formatMessage({id: "register_input_years"})}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={formatMessage({id: "register_input_years"})}
                                                    type="number"
                                                    min={1}
                                                    max={50}
                                                    className="bg-white/20 backdrop-blur-sm border border-white/30 placeholder:text-white/70 focus:ring-orange-400/50 rounded-lg text-white"
                                                    {...field}
                                                    value={value ?? ''}
                                                    onChange={(e) => {
                                                        const inputValue = e.target.value;
                                                        if (inputValue === '') {
                                                            onChange('');
                                                        } else {
                                                            onChange(Number(inputValue));
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-400" />
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="flex justify-center gap-4 pt-6">
                    <Button
                        type="button"
                        className="bg-gradient-to-r from-red-500/80 to-red-600/80 hover:from-red-600/80 hover:to-red-700/80 backdrop-blur-sm text-white transition-all duration-200 rounded-lg transform hover:scale-105 active:scale-95 border border-white/20"
                        onClick={() => onClose()}
                    >
                        {formatMessage({id: "register_cancel"})}
                    </Button>
                    <Button
                        type="button"
                        disabled={isSubmitting}
                        className={`${activeRole === "client" ? "bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80" : "bg-gradient-to-r from-orange-500/80 to-red-500/80 hover:from-orange-600/80 hover:to-red-600/80"} backdrop-blur-sm text-white transition-all duration-200 rounded-lg px-6 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-white/20`}
                        onClick={() => {
                            const formValues = currentForm.getValues();
                            if (activeRole === 'technician') {
                                submit(formValues as RegisterTechnicianData);
                            } else {
                                submit(formValues as RegisterClientData);
                            }
                        }}
                    >
                        {isSubmitting ? formatMessage({id: "register_submitting"}) : formatMessage({id: "register_submit"})}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
