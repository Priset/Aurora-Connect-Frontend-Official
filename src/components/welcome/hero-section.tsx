"use client";

import Image from "next/image";
import { BadgeCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useIntl } from "react-intl";
import { useEffect, useState } from "react";

export const HeroSection = () => {
    const { formatMessage } = useIntl();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
            <Image
                src="/assets/fondo-mundo-morado.png"
                alt="Fondo"
                fill
                className="z-0 object-cover"
                priority
            />
            
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-purple-900/40 to-slate-900/60 z-10" />
            
            <div 
                className="absolute inset-0 opacity-20 z-20"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(147, 51, 234, 0.15), transparent 40%)`
                }}
            />
            
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-1000" />
                <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse delay-500" />
                <div className="absolute bottom-20 right-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-700" />
            </div>

            <div className="relative z-30 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-white text-left max-w-xl"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        <span className="text-purple-300 text-sm font-medium">Aurora Connect</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {formatMessage({ id: "hero_real_solutions" })}
                        </span>{" "}
                        {formatMessage({ id: "hero_real_solutions_2"})}<br />
                        {formatMessage({ id: "hero_real_solutions_3" })}{" "}
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {formatMessage({ id: "hero_real_solutions_4" })}
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="mt-8 lg:mt-0 max-w-sm lg:ml-8"
                >
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                <BadgeCheck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-white font-semibold">Conectamos Profesionales</span>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed">
                            {formatMessage({ id: "hero_connecting_people" })}
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
