import React, { useContext } from "react"
import styled from "styled-components"
import { TranslationContext } from "../providers"

const Container = styled.div`
    background: var(--color-darkPurple);
    color: var(--color-lavender);
    font-weight: bold;
    font-size: 1.8rem;
    padding: 1.5rem;
`

const VersionText = styled.span`
    font-size: 1.3rem;
`

export function AppTitle() {
    const { translation } = useContext(TranslationContext)

    return (
        <Container>
            {translation("app_title")}{" "}
            <VersionText>{translation("app_version")}</VersionText>
        </Container>
    )
}
