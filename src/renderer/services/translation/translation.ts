import { Translation } from "../../../models"

export function getTranslation(translations: Translation, key: string) {
    return translations[key] ? translations[key] : ""
}
