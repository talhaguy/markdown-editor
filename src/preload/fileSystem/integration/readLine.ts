import readline from "readline"
import fs from "fs"
import {
    accumulateLines,
    shouldGetNextLine,
    shouldStopGettingLines,
} from "../service/readLineUtility"

export function getLinesOfFile(
    nodeReadline: typeof readline,
    nodeFs: typeof fs,
    pathToFile: string,
    numLinesToGet: number
) {
    return new Promise<string[]>((res, rej) => {
        const rl = nodeReadline.createInterface({
            input: nodeFs.createReadStream(pathToFile),
            output: process.stdout,
            terminal: false,
        })

        let lines = []
        rl.on("line", (line) => {
            if (shouldGetNextLine(lines, numLinesToGet)) {
                lines = accumulateLines(line, lines)
            }

            if (shouldStopGettingLines(lines, numLinesToGet)) {
                rl.close()
            }
        })

        rl.on("close", () => {
            res(lines)
        })

        // TODO: rl error handling
    })
}
