'use client';

import { Loader2 } from 'lucide-react';
import {useIntl} from "react-intl";

export default function Loading() {
    const { formatMessage } = useIntl()

    return (
        <div className="min-h-screen flex items-center justify-center bg-[--neutral-200] px-4">
            <div className="backdrop-blur-md bg-white/40 rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 w-full max-w-md">
                <Loader2 className="animate-spin text-[--primary-default]" size={60} />
                <p className="text-lg text-[--primary-default] font-medium text-center">
                    {formatMessage({ id: "client_home_loading_title" })}
                </p>
                <p className="text-sm text-muted-foreground text-center">
                    {formatMessage({ id: "client_home_loading_description" })}
                </p>
            </div>
        </div>
    );
}
