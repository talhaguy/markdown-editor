import { createNoteFileName } from "./file"

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
})
