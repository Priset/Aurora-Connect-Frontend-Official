"use client";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { motion } from "framer-motion";
import { useRipples } from "@/hooks/useRipples";
import { Wrench, UserCheck } from "lucide-react";
import { SectionEffect } from "@/components/ui/section-effect";

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
    const { sectionRef, ripples, handleMouseMove } = useRipples();

    const headerIcon = title.includes("Usuario") ? (
        <UserCheck className="inline-block w-6 h-6 text-[--secondary-default] mr-2" />
    ) : (
        <Wrench className="inline-block w-6 h-6 text-[--secondary-default] mr-2" />
    );

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

            <h2 className="text-center text-xl sm:text-3xl font-bold mb-10 text-white z-10 relative flex items-center justify-center gap-2">
                {headerIcon}
                {title}
            </h2>

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
                                    exit={{ opacity: 0, y: 50 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                >
                                    <Card className="h-full flex flex-col bg-neutral-500 text-primary shadow-md hover:shadow-xl transition-all border border-neutral-300">
                                        <CardContent className="flex flex-col justify-start items-center text-center p-4 h-full">
                                            <div className="flex flex-col items-center gap-1 mb-2">
                                                <div className="text-[--secondary-default] h-8 flex items-center justify-center">
                                                    {step.icon}
                                                </div>
                                                <h3 className="font-semibold text-lg text-primary leading-tight">
                                                    {step.title}
                                                </h3>
                                            </div>
                                            <p className="text-sm text-neutral-900 leading-snug">
                                                {step.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-[-3rem] top-1/2 -translate-y-1/2 z-50 bg-[--primary-hover] text-white hover:bg-[--secondary-default] transform hover:scale-105 active:scale-95" />
                    <CarouselNext className="absolute right-[-3rem] top-1/2 -translate-y-1/2 z-50 bg-[--primary-hover] text-white hover:bg-[--secondary-default] transform hover:scale-105 active:scale-95" />
                </Carousel>
            </div>
        </section>
    );
}
