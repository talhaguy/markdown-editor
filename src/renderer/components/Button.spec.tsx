import React from "react"
import { render, screen, fireEvent, cleanup } from "@testing-library/react"
import { Button } from "./Button"

describe("Button", () => {
    afterEach(() => {
        cleanup()
    })

    it("should render button text if it is passed in as a child", () => {
        const onClick = jest.fn()
        const ariaLabel = "aria label"
        const buttonText = "Button Text"
        render(
            <Button onClick={onClick} ariaLabel={ariaLabel}>
                {buttonText}
            </Button>
        )
        expect(screen.getByText(buttonText)).toBeTruthy()
    })

    it("should run the the onclick function on a button press", () => {
        const onClick = jest.fn()
        const ariaLabel = "aria label"
        render(<Button onClick={onClick} ariaLabel={ariaLabel} />)
        fireEvent.click(screen.getByLabelText(ariaLabel))
        expect(onClick).toHaveBeenCalled()
    })

    it("should render an image icon if an image prop is passed in", () => {
        // image
        let onClick = jest.fn()
        let ariaLabel = "aria label"
        let imageName = "image.png"
        render(
            <Button onClick={onClick} ariaLabel={ariaLabel} image={imageName} />
        )
        expect(screen.getByTestId("img")).toBeTruthy()

        // no image
        cleanup()
        onClick = jest.fn()
        ariaLabel = "aria label"
        render(<Button onClick={onClick} ariaLabel={ariaLabel} />)
        expect(screen.queryByTestId("img")).toBeFalsy()
    })
})
