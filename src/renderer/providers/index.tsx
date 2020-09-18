import React, { ReactNode } from "react"
import { MainToRendererApiMap } from "../../preload"
import {
    GetLastFolderPathOpenedFunc,
    SetLastFolderPathOpenedFunc,
} from "../services/config"
import { GetTranslationFunc } from "../../shared/translation"
import { GetLastPathItemFunc } from "../services/util"
import {
    getLastFolderPathOpened,
    setLastFolderPathOpened,
} from "../services/config"
import { getTranslation } from "../../shared/translation"
import { getLastPathItem } from "../services/util"

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

declare const _MainToRendererApi: MainToRendererApiMap

const configValue: ConfigServiceMap = {
    getLastFolderPathOpened,
    setLastFolderPathOpened,
}

const translationValue: TranslationContextMap = {
    translation: getTranslation,
}

const utilValue: UtilServiceMap = {
    getLastPathItem,
}

interface ProvidersProps {
    mainToRendererApi?: MainToRendererApiMap
    config?: ConfigServiceMap
    translation?: TranslationContextMap
    util?: UtilServiceMap
    children: ReactNode
}

export const Providers = ({
    mainToRendererApi = _MainToRendererApi,
    config = configValue,
    translation = translationValue,
    util = utilValue,
    children,
}: ProvidersProps) => (
    <MainToRendererApiContext.Provider value={mainToRendererApi}>
        <ConfigContext.Provider value={config}>
            <TranslationContext.Provider value={translation}>
                <UtilContext.Provider value={util}>
                    {children}
                </UtilContext.Provider>
            </TranslationContext.Provider>
        </ConfigContext.Provider>
    </MainToRendererApiContext.Provider>
)
