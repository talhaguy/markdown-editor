import React, { useContext, useRef } from "react"
import {
    TranslationContext,
    UtilContext,
    MainToRendererApiContext,
} from "../providers"
import { Button } from "./Button"
import styled from "styled-components"

const Container = styled.div`
    padding: 1.5rem;
`

const FolderRow = styled.div`
    display: flex;
    margin-bottom: 1.5rem;
`

const SelectedFolder = styled.div`
    border: 0.1rem solid var(--color-creamGreen);
    border-radius: 0.3rem;
    color: var(--color-creamGreen);
    font-size: 1.4rem;
    height: 2.8rem;
    line-height: 2.6rem;
    flex-grow: 1;
    margin-left: 0.5rem;
    padding-left: 0.5rem;
    overflow: hidden;
`

interface ControlsProps {
    chooseFolder: () => void
    folderName: string
    createNewNote: () => void
}

export function Controls({
    chooseFolder,
    folderName,
    createNewNote,
}: ControlsProps) {
    const { translation } = useContext(TranslationContext)
    const { getLastPathItem } = useContext(UtilContext)
    const { getOS } = useContext(MainToRendererApiContext)
    const os = useRef(getOS())

    return (
        <Container data-testid="controls">
            <FolderRow>
                <Button
                    onClick={chooseFolder}
                    ariaLabel={translation("choose_folder_button")}
                    image={"folder-24px.svg"}
                    testId={"choose-folder-btn"}
                ></Button>
                <SelectedFolder data-testid="folder-name">
                    {folderName
                        ? getLastPathItem(os.current, folderName)
                        : translation("not_available_short")}
                </SelectedFolder>
            </FolderRow>
            {folderName ? (
                <Button
                    onClick={createNewNote}
                    image={"note_add-24px.svg"}
                    testId="new-note-btn"
                >
                    {translation("new_note_button")}
                </Button>
            ) : (
                ""
            )}
        </Container>
    )
}
