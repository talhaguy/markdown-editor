import {
    createNoteFileName,
    getTextForDisplayFactory,
    getMarkdownFilesNamesFromList,
} from "./file"

describe("file", () => {
    describe("createNoteFileName()", () => {
        it("should create note file name in the correct date/time format", () => {
            // 9/3/2020 7:06:05 (zero to be prepended to single digit)
            let date = new Date(2020, 8, 3, 7, 6, 5)
            let fileName = createNoteFileName(date)
            let expected = "09032020070605.md"
            expect(fileName).toBe(expected)

            // 11/23/2022 14:34:12 (no zero to be prepended to double digit)
            date = new Date(2022, 10, 23, 14, 34, 12)
            fileName = createNoteFileName(date)
            expected = "11232022143412.md"
            expect(fileName).toBe(expected)
        })
    })

    describe("getTextForDisplayFactory()", () => {
        it("should shorten a given line with an overflow string if the line is over the given max length", () => {
            const translation = jest.fn().mockReturnValue("...")
            const getTextForDisplay = getTextForDisplayFactory(translation)

            // don't shorten
            let line = "Some text line" // 14 chars
            let result = getTextForDisplay(line, 20)
            expect(result).toBe("Some text line")

            // shorten
            jest.clearAllMocks()
            line = "Some text line that should be shortened" // 39 chars
            result = getTextForDisplay(line, 9)
            expect(translation).toBeCalledWith("ellipses") // check for correct overflow string
            expect(result).toBe("Some text...")
        })

        it("should return a default value if given line is undefined", () => {
            const defaultString = "default string"
            const translation = jest.fn().mockReturnValue(defaultString)
            const getTextForDisplay = getTextForDisplayFactory(translation)
            let line = undefined
            let result = getTextForDisplay(line, 20)
            expect(translation).toBeCalledWith("not_available_short") // check for default string
            expect(result).toBe(defaultString)
        })
    })

    describe("getMarkdownFilesNamesFromList()", () => {
        it("should get markdown files from a list of files given", () => {
            const markdownFiles = getMarkdownFilesNamesFromList([
                "file.txt",
                "markdown-file-1.md",
                "picture.png",
                "data.csv",
                "markdown-file-2.md",
            ])
            expect(markdownFiles).toEqual([
                "markdown-file-1.md",
                "markdown-file-2.md",
            ])
        })
    })
})
