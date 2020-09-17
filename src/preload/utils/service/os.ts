import { OS } from "../../../shared/constants"

export interface GetOSFunc {
    (): OS
}

export function getOSFactory(process: NodeJS.Process) {
    return () => {
        return process.platform === "darwin" ? OS.Posix : OS.Windows
    }
}
