'use client';

import { Button } from '@/components/ui/button';
import { FacebookIcon, LinkedinIcon, Camera } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-[--primary-default] text-white text-sm px-6 py-6 mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2 text-center sm:text-left">
                <span className="font-semibold">AURORA CONNECT</span>

                <div className="flex gap-4 justify-center sm:justify-end pr-2 sm:pr-6">
                    <Link
                        href="https://www.facebook.com/emanuelkarim.lozanoleano"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Facebook"
                    >
                        <Button variant="ghost" size="icon">
                            <FacebookIcon className="h-5 w-5 text-white" />
                        </Button>
                    </Link>

                    <Link
                        href="https://www.linkedin.com/in/emanuel-lozano-leaño-0765661b6"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn"
                    >
                        <Button variant="ghost" size="icon">
                            <LinkedinIcon className="h-5 w-5 text-white" />
                        </Button>
                    </Link>

                    <Link
                        href="https://www.instagram.com/_emanuel_lozano/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Instagram"
                    >
                        <Button variant="ghost" size="icon">
                            <Camera className="h-5 w-5 text-white" />
                        </Button>
                    </Link>
                </div>
            </div>

            <p className="text-[--neutral-300] text-center sm:text-left">
                Todos los derechos reservados – Aurora Connect 2025
            </p>
        </footer>
    );
}
