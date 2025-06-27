'use client';

import { cn } from '@/lib/utils';

export function MessageBubble({ role, content }: { role: string; content: string }) {
    const isUser = role === 'usuario';

    return (
        <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
            <div
                className={cn(
                    'px-4 py-2 rounded-lg max-w-[80%] whitespace-pre-wrap',
                    isUser
                        ? 'bg-[--secondary-default] text-white rounded-br-none'
                        : 'bg-[--neutral-300] text-black rounded-bl-none',
                )}
            >
                {content}
            </div>
        </div>
    );
}
