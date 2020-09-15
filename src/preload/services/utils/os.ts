import { OS } from "../../../shared/constants"

export interface GetOSFunc {
    (): OS
}

export function getOS() {
    return process.platform === "darwin" ? OS.Posix : OS.Windows
}
