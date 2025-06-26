'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { useIntl } from "react-intl";

export default function LoadingAdminHome() {
    const { formatMessage } = useIntl();

    const sectionTitles = [
        "admin_requests_new",
        "admin_requests_offers",
        "admin_requests_progress",
        "admin_requests_closed",
    ];

    return (
        <main className="px-6 md:px-10 py-6">
            <h1 className="text-2xl font-display font-bold text-white mb-6">
                {formatMessage({ id: "admin_requests_title" })}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {sectionTitles.map((id, idx) => (
                    <div key={idx} className="flex flex-col w-full max-w-sm h-[calc(100vh-220px)] bg-neutral-100 rounded-xl border border-[--neutral-300] p-4 overflow-hidden">
                        <h3 className="text-sm font-semibold mb-3">
                            {formatMessage({ id })}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                            <Skeleton className="h-9 w-9 rounded-md bg-[--neutral-300]" />
                            <Skeleton className="h-9 flex-1 rounded-md bg-[--neutral-300]" />
                            <Skeleton className="h-4 w-4 rounded-full bg-[--neutral-300]" />
                        </div>
                        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-white border border-[--neutral-300] rounded-lg p-3 animate-pulse space-y-2">
                                    <Skeleton className="h-4 w-2/3 bg-[--neutral-300] rounded" />
                                    <Skeleton className="h-3 w-1/2 bg-[--neutral-300] rounded" />
                                    <Skeleton className="h-3 w-1/4 bg-[--neutral-300] rounded" />
                                    <Skeleton className="h-2 w-1/3 bg-[--neutral-300] rounded" />
                                    <Skeleton className="h-5 w-24 bg-[--secondary-default]/50 rounded mt-2" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
