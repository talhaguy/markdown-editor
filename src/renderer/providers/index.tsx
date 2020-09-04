import * as React from "react"
import { MainToRendererApiMap } from "../../preload"
import {
    GetLastFolderPathOpenedFunc,
    SetLastFolderPathOpenedFunc,
} from "../services"

export const MainToRendererApiContext = React.createContext<
    MainToRendererApiMap
>(null)

export interface ConfigServiceMap {
    getLastFolderPathOpened: GetLastFolderPathOpenedFunc
    setLastFolderPathOpened: SetLastFolderPathOpenedFunc
}

export const ConfigContext = React.createContext<ConfigServiceMap>(null)
