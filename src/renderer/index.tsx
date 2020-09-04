import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./components/App"
import { MainToRendererApiMap } from "../preload"
import {
    MainToRendererApiContext,
    ConfigServiceMap,
    ConfigContext,
} from "./providers"
import { getLastFolderPathOpened, setLastFolderPathOpened } from "./services"

declare const _MainToRendererApi: MainToRendererApiMap

const config: ConfigServiceMap = {
    getLastFolderPathOpened,
    setLastFolderPathOpened,
}

ReactDOM.render(
    <MainToRendererApiContext.Provider value={_MainToRendererApi}>
        <ConfigContext.Provider value={config}>
            <App />
        </ConfigContext.Provider>
    </MainToRendererApiContext.Provider>,
    document.getElementById("app")
)
