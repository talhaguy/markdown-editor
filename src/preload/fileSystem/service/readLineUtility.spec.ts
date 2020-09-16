import {
    shouldGetNextLine,
    shouldStopGettingLines,
    accumulateLines,
} from "./readLineUtility"

describe("readLineUtility", () => {
    describe("shouldGetNextLine()", () => {
        it("should return true if number of lines to get has not been met", () => {
            const lines = ["line 1", "line 2", "line 3"]
            let numLinesToGet = 5
            expect(shouldGetNextLine(lines, numLinesToGet)).toBeTruthy()

            numLinesToGet = 10
            expect(shouldGetNextLine(lines, numLinesToGet)).toBeTruthy()

            numLinesToGet = 3
            expect(shouldGetNextLine(lines, numLinesToGet)).toBeFalsy()

            numLinesToGet = 1
            expect(shouldGetNextLine(lines, numLinesToGet)).toBeFalsy()
        })
    })

    describe("shouldStopGettingLines()", () => {
        it("should return true if number of lines to get has been met", () => {
            const lines = ["line 1", "line 2", "line 3", "line 4", "line 5"]
            let numLinesToGet = 5
            expect(shouldStopGettingLines(lines, numLinesToGet)).toBeTruthy()

            numLinesToGet = 2
            expect(shouldStopGettingLines(lines, numLinesToGet)).toBeTruthy()

            numLinesToGet = 7
            expect(shouldStopGettingLines(lines, numLinesToGet)).toBeFalsy()

            numLinesToGet = 10
            expect(shouldStopGettingLines(lines, numLinesToGet)).toBeFalsy()
        })
    })

    describe("accumulateLines()", () => {
        it("should return an array with a recieved line if it is not empty", () => {
            let receivedLine = "line 2"
            let lines = ["line 1"]
            let result = accumulateLines(receivedLine, lines)
            let expected = ["line 1", "line 2"]
            expect(result).toEqual(expected)

            // blank line
            receivedLine = ""
            lines = ["line 1"]
            result = accumulateLines(receivedLine, lines)
            expected = ["line 1"]
            expect(result).toEqual(expected)

            // blank line, but with spaces
            receivedLine = "     "
            lines = ["line 1"]
            result = accumulateLines(receivedLine, lines)
            expected = ["line 1"]
            expect(result).toEqual(expected)
        })
    })
})
