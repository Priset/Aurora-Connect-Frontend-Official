'use client';

import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export function MessageBubble({ role, content }: { role: string; content: string }) {
    const isUser = role === 'usuario';

    return (
        <div className={cn('flex items-start gap-3', isUser ? 'justify-end' : 'justify-start')}>
            {!isUser && (
                <div className="p-2 bg-[--secondary-default]/20 rounded-full backdrop-blur-sm border border-white/20 flex-shrink-0">
                    <svg className="w-5 h-5 text-[--secondary-default]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
            )}
            <div className="flex flex-col max-w-[80%]">
                {!isUser && (
                    <span className="text-xs text-white/60 mb-1 ml-1">Aurora</span>
                )}
                <div
                    className={cn(
                        'px-4 py-3 rounded-2xl shadow-lg backdrop-blur-sm border prose prose-invert max-w-none',
                        isUser
                            ? 'bg-[--secondary-default] text-white rounded-br-md border-[--secondary-default]/30'
                            : 'bg-white/10 text-white rounded-bl-md border-white/20',
                    )}
                >
                    {isUser ? (
                        <span className="whitespace-pre-wrap">{content}</span>
                    ) : (
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                                ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                                li: ({ children }) => <li className="mb-1">{children}</li>,
                                code: ({ children }) => <code className="bg-white/10 px-1 py-0.5 rounded text-sm">{children}</code>,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    )}
                </div>
            </div>
            {isUser && (
                <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>
            )}
        </div>
    );
}
