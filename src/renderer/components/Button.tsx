import React, { ReactNode, MouseEvent } from "react"
import styled from "styled-components"

const BaseButton = styled.a`
    display: inline-block;
    border: none;
    padding: 0.4rem;
    border-radius: 0.3rem;
    font-size: 1.4rem;
    text-decoration: none;
    display: flex;
    justify-content: center;
    align-items: center;

    & img {
        width: 2rem;
        height: 2rem;
    }
`

const PrimaryButton = styled(BaseButton)`
    background-color: var(--color-turqoise);
    box-shadow: 0rem 0.4rem 0.4rem rgba(0, 0, 0, 0.25);
    color: var(--color-white);
`

const NoBackgroundButton = styled(BaseButton)``

const Label = styled.span`
    margin-left: 0.5rem;
`

export enum ButtonType {
    Primary,
    NoBackground,
}

interface ButtonProps {
    onClick: (
        event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
    ) => void
    ariaLabel?: string
    image?: string
    type: ButtonType
    children?: ReactNode
}

export function Button({
    onClick,
    ariaLabel,
    image,
    type = ButtonType.Primary,
    children = "",
}: ButtonProps) {
    const Container =
        type === ButtonType.Primary ? PrimaryButton : NoBackgroundButton

    return (
        <Container
            onClick={(event) => {
                event.preventDefault()
                onClick(event)
            }}
            aria-label={ariaLabel ? ariaLabel : null}
            href="#"
            role="button"
        >
            {image ? <img src={image} /> : ""}
            {children ? <Label>{children}</Label> : ""}
        </Container>
    )
}
