import React, { useContext } from "react"
import { TranslationContext } from "../providers"

export function AppTitle() {
    const { translation } = useContext(TranslationContext)

    return (
        <>
            {translation("app_title")} {translation("app_version")}
        </>
    )
}
