import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "success" | "warning" | "error" | "info";
    color?: string;
}

export function Badge({
                          className,
                          variant = "default",
                          color,
                          ...props
                      }: BadgeProps) {
    const baseStyle = "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";

    const variants: Record<string, string> = {
        default: "bg-muted text-foreground",
        success: "bg-green-100 text-green-800",
        warning: "bg-yellow-100 text-yellow-800",
        error: "bg-red-100 text-red-800",
        info: "bg-blue-100 text-blue-800",
    };

    return (
        <span
            className={cn(baseStyle, variants[variant], className)}
            style={color ? { backgroundColor: color + "33", color: color } : {}}
            {...props}
        />
    );
}
