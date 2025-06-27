"use client";

import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useIntl } from "react-intl";

export const HeroSection = () => {
    const { formatMessage } = useIntl();

    return (
        <section className="relative w-full h-[80vh] flex items-center justify-center bg-neutral-900 overflow-hidden">
            <Image
                src="/assets/fondo-mundo-morado.png"
                alt="Fondo"
                fill
                className="z-0 opacity-80 object-cover"
                priority
            />

            <div className="absolute inset-0 bg-black/40 z-10" />

            <div className="relative z-20 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="text-white text-left max-w-xl"
                >
                    <h1 className="text-4xl sm:text-5xl font-display font-bold leading-snug mb-4">
                        <span className="bg-[--secondary-default] px-4 py-2 rounded-xl inline-block mb-2">
                            {formatMessage({ id: "hero_real_solutions" })}
                        </span>{" "}
                        {formatMessage({ id: "hero_real_solutions_2"})}<br />
                        {formatMessage({ id: "hero_real_solutions_3" })}{" "}
                        <span className="bg-[--secondary-default] px-4 py-2 rounded-xl inline-block mt-2">
                            {formatMessage({ id: "hero_real_solutions_4" })}
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mt-8 lg:mt-0 text-white text-sm lg:text-base max-w-sm lg:ml-8 border-l-2 pl-4 border-white flex flex-col gap-4"
                >
                    <p>
                        {formatMessage({ id: "hero_connecting_people" })}
                    </p>
                    <BadgeCheck className="w-16 h-16 text-[--secondary-default]" />
                </motion.div>
            </div>
        </section>
    );
};
