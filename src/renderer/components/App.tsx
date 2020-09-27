import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import { Editor } from "./Editor"
import { AppTitle } from "./AppTitle"
import { Controls } from "./Controls"
import { NoteList } from "./NoteList"
import { MainToRendererApiContext } from "../providers"
import { NoteListMap } from "../../shared/models"
import { useLastFolderPathOpened } from "../hooks"

const Container = styled.div`
    display: flex;
    background: white;
    height: 100vh;
`

const columnShared = `
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`

const LeftColumn = styled.div`
    flex: 0 0 27rem;
    background-color: var(--color-lightJet);
    box-shadow: 0rem -2rem 1rem rgba(0, 0, 0, 0.25);
    ${columnShared}
`

const NoteListContainer = styled.div`
    flex-grow: 1;
    overflow: hidden;
`

const RightColumn = styled.div`
    flex-grow: 1;
    ${columnShared}
`

export function App() {
    const [folderPath, setFolderPath] = useState(null)
    const [notesListMap, setNotesListMap] = useState<NoteListMap>({})
    const [selectedNoteId, setSelectedNoteId] = useState<string>(null)
    const [noteContent, setNoteContent] = useState<string>(null)

    const [
        lastFolderPathOpened,
        setLastFolderPathOpenedInConfig,
    ] = useLastFolderPathOpened()

    const {
        selectFolder,
        getNotesInFolder,
        createNewNote,
        getNoteContent,
        deleteNote,
    } = useContext(MainToRendererApiContext)

    const onAfterSelectFolder = (folderPath: string) => {
        setFolderPath(folderPath)
        getNotesInDirectory(folderPath)
        setLastFolderPathOpenedInConfig(folderPath)
    }

    const chooseFolder = () => {
        selectFolder().then(onAfterSelectFolder)
    }

    const getNotesInDirectory = (path) => {
        getNotesInFolder(path)
            .then((notesListMap) => {
                setNotesListMap(notesListMap)
            })
            .catch((err) => {
                console.error("error getting notes", err)
            })
    }

    const createNewNoteFile = () => {
        createNewNote(folderPath)
            .then((fileName) => {
                getNotesInDirectory(folderPath)

                // after new note creation, select it
                onSelectNote(fileName)
            })
            .catch(() => {
                console.error("could not create note")
            })
    }

    const onSelectNote = (noteId: string) => {
        setNoteContent(null)
        setSelectedNoteId(noteId)

        getNoteContent(folderPath, noteId)
            .then((noteContent) => {
                setNoteContent(noteContent)
            })
            .catch((error) => console.error(error))
    }

    const onNoteListDeleteBtnClick = (fileName: string) => {
        deleteNote(folderPath, fileName)
            .then(() => {
                // if note currently opened was deleted, clear it
                setSelectedNoteId(null)
                setNoteContent(null)

                // refresh notes list
                getNotesInDirectory(folderPath)
            })
            .catch((error) => {
                console.error(
                    "something went wrong when trying to delete",
                    error
                )
            })
    }

    useEffect(() => {
        if (lastFolderPathOpened) {
            onAfterSelectFolder(lastFolderPathOpened)
        }
    }, [lastFolderPathOpened])

    return (
        <Container>
            <LeftColumn>
                <div>
                    <AppTitle />
                </div>
                <div>
                    <Controls
                        chooseFolder={chooseFolder}
                        folderName={folderPath}
                        createNewNote={createNewNoteFile}
                    />
                </div>
                <NoteListContainer>
                    <NoteList
                        notes={Object.values(notesListMap).sort((a, b) => {
                            return (
                                (a.lastModifiedDate - b.lastModifiedDate) * -1
                            )
                        })}
                        onSelectNote={onSelectNote}
                        onDeleteBtnClick={onNoteListDeleteBtnClick}
                        selectedNoteId={selectedNoteId}
                    />
                </NoteListContainer>
            </LeftColumn>
            <RightColumn>
                <Editor
                    noteContent={noteContent}
                    folderPath={folderPath}
                    noteFileName={selectedNoteId}
                    refreshNotesList={() => getNotesInDirectory(folderPath)}
                />
            </RightColumn>
        </Container>
    )
}
