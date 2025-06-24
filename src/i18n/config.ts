import es from "./messages/es";
import en from "./messages/en";

export type Locale = "en" | "es";

export type MessageDictionary = Record<string, string>;

export const messages: Record<Locale, MessageDictionary> = {
    en,
    es,
};

export const defaultLocale: Locale = "es";

export const getLocaleFromNavigator = (): Locale => {
    if (typeof window !== "undefined") {
        const lang = navigator.language.split("-")[0] as Locale;
        return lang in messages ? lang : defaultLocale;
    }
    return defaultLocale;
};
