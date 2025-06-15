"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SectionEffect({ className }: { className?: string }) {
    return (
        <motion.div
            className={cn(
                "absolute inset-0 pointer-events-none z-0 overflow-hidden",
                className
            )}
        >
            <motion.div
                className="absolute top-0 left-0 w-[300%] h-full opacity-[0.35] blur-3xl"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    background: `
                        radial-gradient(circle at 25% 40%, rgba(108,99,255,0.35) 0%, transparent 60%),
                        radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 60%),
                        radial-gradient(circle at 60% 30%, rgba(255, 138, 255, 0.25) 0%, transparent 50%)
                    `,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    mixBlendMode: "overlay",
                }}
            />
        </motion.div>
    );
}
