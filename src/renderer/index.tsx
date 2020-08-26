import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "./components/App"
import { MainToRendererApiMap } from "../preload"
import { MainToRendererApiContext } from "./providers"

declare const _MainToRendererApi: MainToRendererApiMap

ReactDOM.render(
    <MainToRendererApiContext.Provider value={_MainToRendererApi}>
        <App />
    </MainToRendererApiContext.Provider>,
    document.getElementById("app")
)
