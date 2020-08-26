import * as React from "react"
import { MainToRendererApiMap } from "../../preload"

export const MainToRendererApiContext = React.createContext<
    MainToRendererApiMap
>(null)
