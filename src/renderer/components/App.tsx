import * as React from "react"
import styled from "styled-components"
import { Editor } from "./Editor"
import { AppTitle } from "./AppTitle"
import { Controls } from "./Controls"
import { NoteList } from "./NoteList"

const Container = styled.div`
    display: flex;
`

const LeftColumn = styled.div`
    width: 265px;
`

const RightColumn = styled.div`
    flex-grow: 1;
`

export function App() {
    return (
        <Container>
            <LeftColumn>
                <div>
                    <AppTitle />
                </div>
                <div>
                    <Controls />
                </div>
                <div>
                    <NoteList />
                </div>
            </LeftColumn>
            <RightColumn>
                <Editor />
            </RightColumn>
        </Container>
    )
}
