'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

export function MessageInput({
                                 onSend,
                                 disabled,
                             }: {
    onSend: (value: string) => void;
    disabled?: boolean;
}) {
    const [value, setValue] = useState('');

    const handleSubmit = () => {
        if (value.trim()) {
            onSend(value.trim());
            setValue('');
        }
    };

    return (
        <div className="flex gap-2 items-center">
            <Input
                disabled={disabled}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Escribe tu mensaje..."
            />
            <Button
                onClick={handleSubmit}
                disabled={disabled || !value.trim()}
                className="bg-[--secondary-default] text-white"
            >
                <Send className="w-4 h-4 mr-1" /> Enviar
            </Button>
        </div>
    );
}
