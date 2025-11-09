'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useIntl } from "react-intl";
import { Heart } from 'lucide-react';

export function Footer() {
    const { formatMessage } = useIntl();

    return (
        <footer className="relative bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            
            <div className="relative z-10 px-6 py-8">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-4">
                            <div className="flex items-center gap-2">
                                <Heart className="w-5 h-5 text-purple-400" />
                                <span className="font-semibold text-lg">
                                    {formatMessage({ id: "footer_brand" })}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                {[
                                    {
                                        href: "https://www.facebook.com/emanuelkarim.lozanoleano",
                                        alt: "Facebook Logo",
                                        src: "/assets/facebook.png",
                                        label: "Facebook",
                                        gradient: "from-blue-500 to-blue-600"
                                    },
                                    {
                                        href: "https://www.linkedin.com/in/emanuel-lozano-leaño-0765661b6",
                                        alt: "LinkedIn Logo",
                                        src: "/assets/linkedln.png",
                                        label: "LinkedIn",
                                        gradient: "from-blue-600 to-blue-700"
                                    },
                                    {
                                        href: "https://www.instagram.com/_emanuel_lozano/",
                                        alt: "Instagram Logo",
                                        src: "/assets/instagram.png",
                                        label: "Instagram",
                                        gradient: "from-pink-500 to-purple-600"
                                    }
                                ].map((icon, idx) => (
                                    <Link
                                        key={idx}
                                        href={icon.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={icon.label}
                                    >
                                        <div className={`p-2 bg-gradient-to-r ${icon.gradient} rounded-xl hover:scale-110 active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                                            <Image
                                                src={icon.src}
                                                alt={icon.alt}
                                                width={24}
                                                height={24}
                                                className="object-contain"
                                            />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-white/20 pt-4">
                            <p className="text-white/70 text-sm text-center">
                                {formatMessage({ id: "footer_rights_reserved" })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
