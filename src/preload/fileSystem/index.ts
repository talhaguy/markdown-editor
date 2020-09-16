import readline from "readline"
import fs from "fs"
import { getLinesOfFile as _getLinesOfFile } from "./integration/readLine"

export interface GetLinesOfFileFunc {
    (pathToFile: string, numLines: number): Promise<string[]>
}

export const getLinesOfFile: GetLinesOfFileFunc = ((readline, fs) => (
    pathToFile,
    numLines
) => _getLinesOfFile(readline, fs, pathToFile, numLines))(readline, fs)
