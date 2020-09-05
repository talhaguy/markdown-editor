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
} from "./providers"
import { getLastFolderPathOpened, setLastFolderPathOpened } from "./services"
import { getTranslation } from "./services"

declare const _MainToRendererApi: MainToRendererApiMap

const config: ConfigServiceMap = {
    getLastFolderPathOpened,
    setLastFolderPathOpened,
}

const translation: TranslationContextMap = {
    translation: getTranslation,
}

ReactDOM.render(
    <MainToRendererApiContext.Provider value={_MainToRendererApi}>
        <ConfigContext.Provider value={config}>
            <TranslationContext.Provider value={translation}>
                <App />
            </TranslationContext.Provider>
        </ConfigContext.Provider>
    </MainToRendererApiContext.Provider>,
    document.getElementById("app")
)
