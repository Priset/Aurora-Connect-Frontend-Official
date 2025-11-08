'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { chatMessageSchema, ChatMessageData } from '@/lib/validations';

export function MessageInput({
                                 onSend,
                                 disabled,
                             }: {
    onSend: (value: string) => void;
    disabled?: boolean;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<ChatMessageData>({
        resolver: zodResolver(chatMessageSchema),
        mode: "onChange",
        defaultValues: {
            message: "",
        },
    });

    const message = watch("message");

    const onSubmit = (data: ChatMessageData) => {
        onSend(data.message.trim());
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3 items-end">
            <div className="flex-1">
                <Input
                    {...register("message")}
                    disabled={disabled}
                    placeholder="Escribe tu mensaje a Aurora..."
                    className={`bg-white/10 backdrop-blur-sm text-white border-white/20 placeholder:text-white/50 focus:border-[--secondary-default] transition-colors ${errors.message ? "border-red-400" : ""}`}
                />
                {errors.message && (
                    <p className="text-xs text-red-400 mt-1">{errors.message.message}</p>
                )}
            </div>
            <Button
                type="submit"
                disabled={disabled || !message?.trim()}
                className="bg-[--secondary-default] hover:bg-[--secondary-hover] text-white transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl flex items-center gap-2"
            >
                <Send className="w-4 h-4" />
                Enviar
            </Button>
        </form>
    );
}
