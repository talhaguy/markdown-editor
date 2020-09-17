import { prependZeroesToSingleDigit } from "./string"

describe("string", () => {
    describe("prependZeroesToSingleDigit()", () => {
        it("should prepend zeroes to a single digit", () => {
            expect(prependZeroesToSingleDigit(5, 1)).toBe("05")
            expect(prependZeroesToSingleDigit(2, 2)).toBe("002")
            expect(prependZeroesToSingleDigit(24, 1)).toBe("24")
            expect(prependZeroesToSingleDigit(100, 2)).toBe("100")
        })
    })
})
