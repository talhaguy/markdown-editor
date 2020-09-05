import * as React from "react"
import { MainToRendererApiMap } from "../../preload"
import {
    GetLastFolderPathOpenedFunc,
    SetLastFolderPathOpenedFunc,
    GetTranslationFunc,
} from "../services"
import { Translation } from "../../models"

export const MainToRendererApiContext = React.createContext<
    MainToRendererApiMap
>(null)

export interface ConfigServiceMap {
    getLastFolderPathOpened: GetLastFolderPathOpenedFunc
    setLastFolderPathOpened: SetLastFolderPathOpenedFunc
}

export const ConfigContext = React.createContext<ConfigServiceMap>(null)

export interface TranslationContextMap {
    translation: GetTranslationFunc
}

export const TranslationContext = React.createContext<TranslationContextMap>(
    null
)
