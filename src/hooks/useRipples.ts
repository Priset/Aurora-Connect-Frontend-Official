"use client"

import { useRef, useState } from "react"

type Ripple = { id: number; x: number; y: number }

export function useRipples(throttle = 250) {
    const sectionRef = useRef<HTMLDivElement>(null)
    const [ripples, setRipples] = useState<Ripple[]>([])
    const lastTime = useRef(0)

    const handleMouseMove = (e: React.MouseEvent) => {
        const now = Date.now()
        if (now - lastTime.current < throttle) return
        lastTime.current = now

        const rect = sectionRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const id = now

        setRipples(prev => [...prev, { id, x, y }])
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== id))
        }, 1000)
    }

    return { sectionRef, ripples, handleMouseMove }
}
