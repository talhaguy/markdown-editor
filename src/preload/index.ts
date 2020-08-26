import { promises as fs } from "fs"

console.log("preload js")

export interface MainToRendererApiMap {
    test: () => Promise<string[]>
}

const MainToRendererApi: MainToRendererApiMap = {
    test() {
        return fs.readdir(__dirname)
    },
}

;(window as any)._MainToRendererApi = MainToRendererApi
