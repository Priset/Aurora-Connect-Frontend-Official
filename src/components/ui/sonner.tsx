"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "flex items-center gap-3 w-full p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl",
          title: "text-white font-semibold text-sm",
          description: "text-white/80 text-xs",
          actionButton: "px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all",
          cancelButton: "px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-all",
          closeButton: "absolute top-2 right-2 p-1 rounded-lg bg-white/20 text-white hover:bg-white/30 transition-all",
          error: "bg-gradient-to-r from-red-500/20 to-orange-500/20 border-red-500/40",
          success: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/40",
          warning: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/40",
          info: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-blue-500/40",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
