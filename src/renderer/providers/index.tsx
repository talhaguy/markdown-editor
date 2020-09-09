import * as React from "react"
import { MainToRendererApiMap } from "../../preload"
import {
    GetLastFolderPathOpenedFunc,
    SetLastFolderPathOpenedFunc,
} from "../services/config"
import { GetTranslationFunc } from "../../shared/services/translation"
import { GetLastPathItemFunc } from "../services/util"

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

export interface UtilServiceMap {
    getLastPathItem: GetLastPathItemFunc
}

export const UtilContext = React.createContext<UtilServiceMap>(null)
