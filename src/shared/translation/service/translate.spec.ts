import { getTranslation } from "./translate"

describe("translate", () => {
    describe("getTranslation()", () => {
        const translations = {
            greeting: "Hello!",
            question: "How are you, {0}?",
            reply: "The weather is {0} today. Tomorrow it is {1}.",
        }

        it("should return the correct translation with any arguments interpolated", () => {
            expect(getTranslation(translations, "greeting")).toBe("Hello!")
            expect(getTranslation(translations, "question", "Joanne")).toBe(
                "How are you, Joanne?"
            )
            expect(getTranslation(translations, "reply", "hot", "cold")).toBe(
                "The weather is hot today. Tomorrow it is cold."
            )
        })

        it("should return an empty string if no translation key is found", () => {
            expect(getTranslation(translations, "some_unavailable_key")).toBe(
                ""
            )
            expect(
                getTranslation(translations, "another_unavailable_key")
            ).toBe("")
        })
    })
})
