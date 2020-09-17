import { Translation } from "../models/Translation"

export function getTranslation(
    translations: Translation,
    key: string,
    ...args: any
) {
    let message = translations[key]

    if (!message) {
        return ""
    }

    if (args.length > 0) {
        args.forEach((arg, i) => {
            const re = new RegExp(`\\{${i}\\}`, "g")
            message = message.replace(re, arg)
        })
    }

    return message
}
