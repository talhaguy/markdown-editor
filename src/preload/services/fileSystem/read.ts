import readline from "readline"
import fs from "fs"

export function getLinesOfFile(
    nodeReadline: typeof readline,
    nodeFs: typeof fs,
    pathToFile: string,
    numLines: number
) {
    return new Promise<string[]>((res, rej) => {
        const rl = nodeReadline.createInterface({
            input: nodeFs.createReadStream(pathToFile),
            output: process.stdout,
            terminal: false,
        })

        let lines = []
        rl.on("line", (line) => {
            if (lines.length < numLines) {
                if (line.trim() !== "") {
                    lines.push(line)
                }
            }

            if (lines.length === numLines) {
                rl.close()
            }
        })

        rl.on("close", () => {
            res(lines)
        })

        // TODO: rl error handling
    })
}
