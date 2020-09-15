import { OS } from "../../../shared/constants"

export interface GetLastPathItemFunc {
    (os: OS, path: string): string
}

export function getLastPathItem(os: OS, path: string) {
    const splitPath = os === OS.Windows ? path.split("\\") : path.split("/")
    return splitPath[splitPath.length - 1]
}
