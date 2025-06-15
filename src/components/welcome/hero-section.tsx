"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";

export const HeroSection = () => {
    return (
        <section className="relative w-full h-[80vh] flex items-center justify-center bg-neutral-900 overflow-hidden">
            <Image
                src="/assets/fondo-mundo-morado.png"
                alt="Fondo"
                layout="fill"
                objectFit="cover"
                className="z-0 opacity-80"
                priority
            />

            <div className="absolute inset-0 bg-black/40 z-10" />

            <div className="relative z-20 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16">
                <div className="text-white text-left max-w-xl">
                    <h1 className="text-4xl sm:text-5xl font-display font-bold leading-snug mb-4">
                        <span className="bg-[--secondary-default] px-4 py-2 rounded-xl inline-block mb-2">
                            Soluciones reales
                        </span>{" "}
                        para problemas digitales,<br />
                        en manos de{" "}
                        <span className="bg-[--secondary-default] px-4 py-2 rounded-xl inline-block mt-2">
                            técnicos verificados
                        </span>
                    </h1>
                </div>

                <div className="mt-8 lg:mt-0 text-white text-sm lg:text-base max-w-sm lg:ml-8 border-l-2 pl-4 border-white flex flex-col gap-4">
                    <p>
                        Conectamos a quienes necesitan soporte con quienes saben cómo solucionarlo.
                    </p>
                    <BadgeCheck className="w-16 h-16 text-[--secondary-default]" />
                </div>
            </div>
        </section>
    );
};
