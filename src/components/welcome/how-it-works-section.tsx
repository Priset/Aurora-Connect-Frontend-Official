"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React from "react";
import { useRipples } from "@/hooks/useRipples";
import { SectionEffect } from "@/components/ui/section-effect";

interface Props {
    onRegisterClick: (role: "client" | "technician") => void;
}

export const HowItWorksSection = ({ onRegisterClick }: Props) => {
    const { sectionRef, ripples, handleMouseMove } = useRipples();

    return (
        <section
            ref={sectionRef}
            onMouseMove={handleMouseMove}
            className="relative px-6 py-20 bg-primary text-white overflow-hidden"
        >
            <SectionEffect />
            {ripples.map((ripple) => (
                <motion.div
                    key={ripple.id}
                    initial={{ scale: 0, opacity: 0.15 }}
                    animate={{ scale: 6, opacity: 0.2 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute w-28 h-28 rounded-full pointer-events-none z-0"
                    style={{
                        left: ripple.x - 56,
                        top: ripple.y - 56,
                        background: "rgba(108, 99, 255, 0.15)",
                    }}
                />
            ))}

            <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <Image
                        src="/assets/carrusel_1.png"
                        alt="Laptop abierta y herramientas"
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <h2 className="text-3xl sm:text-4xl font-display font-bold mb-4 text-white">
                        Problemas tecnológicos reales, soluciones al instante.
                    </h2>
                    <p className="text-base leading-relaxed text-neutral-300 mb-6 text-justify">
                        Conectamos a personas que enfrentan fallas o dudas con sus equipos
                        digitales con técnicos verificados y listos para ayudar.
                        Simplificamos la asistencia técnica con rapidez, confianza y
                        comunicación directa.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="secondary"
                            className="transition-all hover:bg-secondary-hover active:bg-secondary-pressed transform hover:scale-105 active:scale-95"
                            onClick={() => onRegisterClick("technician")}
                        >
                            Registrarme como Técnico
                        </Button>
                        <Button
                            variant="secondary"
                            className="transition-all hover:bg-secondary-hover active:bg-secondary-pressed transform hover:scale-105 active:scale-95"
                            onClick={() => onRegisterClick("client")}
                        >
                            Registrarme como Cliente
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
