"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Wrench, UserCheck } from "lucide-react";

interface Step {
    title: string;
    description: string;
    icon: React.ReactNode;
}

interface Props {
    title: string;
    steps: Step[];
}

export function StepCarousel({ title, steps }: Props) {
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
    const isUserSteps = title.includes("Usuario");

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const rect = document.querySelector('.step-carousel')?.getBoundingClientRect();
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

    const gradientColors = isUserSteps 
        ? "from-slate-900 via-indigo-900 to-slate-900"
        : "from-slate-900 via-violet-900 to-slate-900";
    
    const glowColor = isUserSteps 
        ? "rgba(99, 102, 241, 0.15)"
        : "rgba(139, 92, 246, 0.15)";

    const headerIcon = isUserSteps ? (
        <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg">
            <UserCheck className="w-6 h-6 text-white" />
        </div>
    ) : (
        <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg">
            <Wrench className="w-6 h-6 text-white" />
        </div>
    );

    return (
        <section className={`step-carousel relative px-6 py-20 bg-gradient-to-br ${gradientColors} text-white overflow-hidden`}>
            <div 
                className="absolute inset-0 opacity-20 transition-all duration-500"
                style={{
                    background: `radial-gradient(800px circle at ${mousePos.x}% ${mousePos.y}%, ${glowColor}, transparent 50%)`
                }}
            />
            
            <div className="absolute inset-0">
                <div className={`absolute top-16 left-16 w-1.5 h-1.5 ${isUserSteps ? 'bg-indigo-400' : 'bg-violet-400'} rounded-full animate-pulse`} />
                <div className={`absolute top-40 right-24 w-1 h-1 ${isUserSteps ? 'bg-blue-400' : 'bg-purple-400'} rounded-full animate-pulse delay-700`} />
                <div className={`absolute bottom-24 left-1/4 w-1.5 h-1.5 ${isUserSteps ? 'bg-cyan-400' : 'bg-pink-400'} rounded-full animate-pulse delay-300`} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 text-center mb-12"
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    {headerIcon}
                    <span className={`text-sm font-medium ${isUserSteps ? 'text-indigo-300' : 'text-violet-300'}`}>
                        Pasos para {isUserSteps ? 'Usuarios' : 'Técnicos'}
                    </span>
                </div>
                <h2 className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${isUserSteps ? 'from-indigo-400 to-blue-400' : 'from-violet-400 to-purple-400'} bg-clip-text text-transparent`}>
                    {title}
                </h2>
            </motion.div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <Carousel className="w-full relative">
                    <CarouselContent className="-ml-4">
                        {steps.map((step, index) => (
                            <CarouselItem
                                key={index}
                                className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                            >
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="h-full"
                                >
                                    <Card className="h-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                                        <CardContent className="flex flex-col items-center text-center p-6 h-full">
                                            <div className="flex flex-col items-center gap-3 mb-4">
                                                <div className={`p-3 bg-gradient-to-r ${isUserSteps ? 'from-indigo-500 to-blue-500' : 'from-violet-500 to-purple-500'} rounded-xl`}>
                                                    {step.icon}
                                                </div>
                                                <span className="text-xs font-medium text-white/60">Paso {index + 1}</span>
                                            </div>
                                            <h3 className="font-semibold text-lg text-white mb-3 leading-tight">
                                                {step.title}
                                            </h3>
                                            <p className="text-sm text-white/80 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-[-3rem] top-1/2 -translate-y-1/2 z-50 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110" />
                    <CarouselNext className="absolute right-[-3rem] top-1/2 -translate-y-1/2 z-50 bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-110" />
                </Carousel>
            </div>
        </section>
    );
}
