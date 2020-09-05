import React, { ReactNode } from "react"
import styled from "styled-components"

const Container = styled.a`
    display: inline-block;
    background-color: var(--color-turqoise);
    border: none;
    padding: 0.4rem;
    border-radius: 0.3rem;
    box-shadow: 0rem 0.4rem 0.4rem rgba(0, 0, 0, 0.25);

    & img {
        width: 2rem;
        height: 2rem;
        display: block;
    }
`

interface ButtonProps {
    onClick: () => void
    ariaLabel: string
    image?: string
    children?: ReactNode
}

export function Button({
    onClick,
    ariaLabel,
    image,
    children = "",
}: ButtonProps) {
    return (
        <Container
            onClick={(event) => {
                event.preventDefault()
                onClick()
            }}
            aria-label={ariaLabel}
            href="#"
            role="button"
        >
            {image ? <img src={image} /> : ""}
            {children}
        </Container>
    )
}
