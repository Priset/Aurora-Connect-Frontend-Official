"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const images = [
    "/assets/carrusel_1.png",
    "/assets/carrusel_2.png",
    "/assets/carrusel_3.png",
    "/assets/carrusel_4.png",
];

export function HeroSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(id);
    }, []);

    const nextImage = () =>
        setCurrentIndex((prev) => (prev + 1) % images.length);

    const prevImage = () =>
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="flex justify-center items-center min-h-[70vh] px-4">
            <div className="relative w-full max-w-[700px]">
                <Card className="overflow-hidden rounded-xl bg-card shadow-lg">
                    <img
                        src={images[currentIndex]}
                        alt="Imagen del carrusel"
                        className="w-full h-auto aspect-video object-cover transition-all duration-500"
                    />
                </Card>

                <Button
                    onClick={prevImage}
                    aria-label="Anterior"
                    size="icon"
                    className="absolute top-1/2 left-[-1rem] md:left-[-2.5rem] -translate-y-1/2 z-10 hidden sm:flex"
                >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </Button>

                <Button
                    onClick={nextImage}
                    aria-label="Siguiente"
                    size="icon"
                    className="absolute top-1/2 right-[-1rem] md:right-[-2.5rem] -translate-y-1/2 z-10 hidden sm:flex"
                >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </Button>
            </div>
        </div>
    );
}
