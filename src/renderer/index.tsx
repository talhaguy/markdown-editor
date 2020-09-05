import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./components/App"
import { MainToRendererApiMap } from "../preload"
import {
    MainToRendererApiContext,
    ConfigServiceMap,
    ConfigContext,
    TranslationContext,
    TranslationContextMap,
    UtilContext,
    UtilServiceMap,
} from "./providers"
import {
    getLastFolderPathOpened,
    setLastFolderPathOpened,
} from "./services/config"
import { getTranslation } from "./services/translation"
import { getLastPathItem } from "./services/util"
import "./index.css"

declare const _MainToRendererApi: MainToRendererApiMap

const config: ConfigServiceMap = {
    getLastFolderPathOpened,
    setLastFolderPathOpened,
}

const translation: TranslationContextMap = {
    translation: getTranslation,
}

const util: UtilServiceMap = {
    getLastPathItem,
}

ReactDOM.render(
    <MainToRendererApiContext.Provider value={_MainToRendererApi}>
        <ConfigContext.Provider value={config}>
            <TranslationContext.Provider value={translation}>
                <UtilContext.Provider value={util}>
                    <App />
                </UtilContext.Provider>
            </TranslationContext.Provider>
        </ConfigContext.Provider>
    </MainToRendererApiContext.Provider>,
    document.getElementById("app")
)
