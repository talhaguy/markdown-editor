import React, { useContext } from "react"
import "codemirror/mode/gfm/gfm"
import "codemirror/lib/codemirror.css"
import "codemirror/theme/monokai.css"
import { useCodeMirror, useCodeMirrorSave } from "../hooks"
import styled from "styled-components"
import { TranslationContext } from "../providers"

const Container = styled.div`
    background-color: var(--color-jet);
    height: 100vh;
    overflow: auto;

    .CodeMirror {
        height: 100%;
        font: var(--font-primary);
        font-size: 1.3rem;
        background-color: var(--color-jet);
        padding: 2rem 0 0 2rem;
    }

    /* custom code mirror styles */
    .cm-s-custom {
        span {
            .cm-comment,
            .cm-quote {
                color: var(--color-creamGreen);
            }

            .cm-variable-2 {
                color: var(--color-lavender);
            }

            .cm-link,
            .cm-url {
                color: var(--color-turqoise);
            }
        }
    }
`

const NoNoteOpen = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.3rem;
    color: var(--color-white);
    font-style: italic;
`

interface EditorProps {
    noteContent: string
    folderPath: string
    noteFileName: string
    refreshNotesList: () => void
}

export function Editor({
    noteContent,
    folderPath,
    noteFileName,
    refreshNotesList,
}: EditorProps) {
    const { translation } = useContext(TranslationContext)
    const [codeMirrorRef, textAreaRef] = useCodeMirror(
        noteFileName,
        noteContent
    )
    useCodeMirrorSave(
        codeMirrorRef,
        noteContent,
        folderPath,
        noteFileName,
        refreshNotesList
    )

    const validNoteOpen = noteContent !== null && noteFileName !== null

    return (
        <Container>
            <textarea ref={textAreaRef} style={{ display: "none" }}></textarea>
            {!validNoteOpen ? (
                <NoNoteOpen>
                    <span>{translation("no_note_open")}</span>
                </NoNoteOpen>
            ) : (
                ""
            )}
        </Container>
    )
}
