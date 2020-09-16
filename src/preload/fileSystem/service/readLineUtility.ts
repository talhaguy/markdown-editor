export function shouldGetNextLine(lines: string[], numLinesToGet: number) {
    return lines.length < numLinesToGet
}

export function shouldStopGettingLines(lines: string[], numLinesToGet: number) {
    return lines.length >= numLinesToGet
}

export function accumulateLines(line: string, accumLines: string[]) {
    const updatedAccumLines = accumLines.slice()
    if (line.trim() !== "") {
        updatedAccumLines.push(line)
    }
    return updatedAccumLines
}
