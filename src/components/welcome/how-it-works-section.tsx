"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Settings, Users } from "lucide-react";

interface Props {
    onRegisterClick: (role: "client" | "technician") => void;
}

export const HowItWorksSection = ({ onRegisterClick }: Props) => {
    const { formatMessage } = useIntl();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const rect = document.querySelector('.how-it-works')?.getBoundingClientRect();
            if (rect) {
                setMousePos({ 
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100
                });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="how-it-works relative px-6 py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
            <div 
                className="absolute inset-0 opacity-20 transition-all duration-300"
                style={{
                    background: `radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, rgba(147, 51, 234, 0.15), transparent 50%)`
                }}
            />
            
            <div className="absolute inset-0">
                <div className="absolute top-10 left-10 w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
                <div className="absolute top-32 right-20 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-500" />
                <div className="absolute bottom-20 left-1/3 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="order-2 md:order-1"
                >
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                        <Image
                            src="/assets/carrusel_1.png"
                            alt="Laptop abierta y herramientas"
                            width={600}
                            height={400}
                            className="rounded-2xl shadow-2xl w-full h-auto"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="order-1 md:order-2"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                            <Settings className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-purple-300 text-sm font-medium">Cómo Funciona</span>
                    </div>
                    
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {formatMessage({ id: "howitworks_title" })}
                    </h2>
                    
                    <p className="text-white/80 text-base leading-relaxed mb-8">
                        {formatMessage({ id: "howitworks_paragraph" })}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={() => onRegisterClick("technician")}
                            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                        >
                            <Settings className="w-4 h-4 mr-2" />
                            {formatMessage({ id: "howitworks_register_technician" })}
                        </Button>
                        <Button
                            onClick={() => onRegisterClick("client")}
                            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                        >
                            <Users className="w-4 h-4 mr-2" />
                            {formatMessage({ id: "howitworks_register_client" })}
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
