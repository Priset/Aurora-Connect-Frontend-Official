'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useIntl } from "react-intl";

export function Footer() {
    const { formatMessage } = useIntl();

    return (
        <footer className="bg-[--primary-dark] text-white text-sm px-6 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2 text-center sm:text-left">
                <span className="font-semibold">
                    {formatMessage({ id: "footer_brand" })}
                </span>

                <div className="flex gap-4 justify-center sm:justify-end pr-2 sm:pr-6">
                    {[
                        {
                            href: "https://www.facebook.com/emanuelkarim.lozanoleano",
                            alt: "Facebook Logo",
                            src: "/assets/facebook.png",
                            label: "Facebook"
                        },
                        {
                            href: "https://www.linkedin.com/in/emanuel-lozano-leaño-0765661b6",
                            alt: "LinkedIn Logo",
                            src: "/assets/linkedln.png",
                            label: "LinkedIn"
                        },
                        {
                            href: "https://www.instagram.com/_emanuel_lozano/",
                            alt: "Instagram Logo",
                            src: "/assets/instagram.png",
                            label: "Instagram"
                        }
                    ].map((icon, idx) => (
                        <Link
                            key={idx}
                            href={icon.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={icon.label}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="transition-transform transform hover:scale-110 active:scale-95"
                            >
                                <Image
                                    src={icon.src}
                                    alt={icon.alt}
                                    width={60}
                                    height={40}
                                    className="h-10 object-contain"
                                />
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>

            <p className="text-[--neutral-300] text-center sm:text-left">
                {formatMessage({ id: "footer_rights_reserved" })}
            </p>
        </footer>
    )
}
