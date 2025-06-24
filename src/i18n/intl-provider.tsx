"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { IntlProvider } from "react-intl"
import { messages, defaultLocale, Locale } from "./config"

type LanguageContextType = {
    locale: Locale
    setLocale: (lang: Locale) => void
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext)
    if (!context) {
        throw new Error("useLanguage debe usarse dentro de <AuroraIntlProvider>")
    }
    return context
}

export const AuroraIntlProvider = ({ children }: { children: ReactNode }) => {
    const [locale, setLocale] = useState<Locale>(defaultLocale)

    useEffect(() => {
        const storedLang = localStorage.getItem("locale")
        if (storedLang && Object.keys(messages).includes(storedLang)) {
            setLocale(storedLang as Locale)
        }
    }, [])

    const changeLocale = (lang: Locale) => {
        localStorage.setItem("locale", lang)
        setLocale(lang)
    }

    return (
        <LanguageContext.Provider value={{ locale, setLocale: changeLocale }}>
            <IntlProvider locale={locale} messages={messages[locale]} defaultLocale={defaultLocale}>
                {children}
            </IntlProvider>
        </LanguageContext.Provider>
    )
}
