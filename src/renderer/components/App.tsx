import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import { Editor } from "./Editor"
import { AppTitle } from "./AppTitle"
import { Controls } from "./Controls"
import { NoteList } from "./NoteList"
import { MainToRendererApiContext, ConfigContext } from "../providers"
import { NoteListMap } from "../../models"
import { SetLastFolderPathOpenedFunc } from "../services/config"

const Container = styled.div`
    display: flex;
    background: white;
    height: 100vh;
`

const columnShared = `height: 100%;`

const LeftColumn = styled.div`
    width: 265px;
    background-color: var(--color-lightJet);
    ${columnShared}
`

const RightColumn = styled.div`
    flex-grow: 1;
    ${columnShared}
`

export function useLastFolderPathOpened() {
    const { getLastFolderPathOpened, setLastFolderPathOpened } = useContext(
        ConfigContext
    )

    const [folderPath, setFolderPath] = useState<string>(null)

    // get last folder opened once
    useEffect(() => {
        setFolderPath(getLastFolderPathOpened())
    }, [])

    return [folderPath, setLastFolderPathOpened] as [
        string | null,
        SetLastFolderPathOpenedFunc
    ]
}

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
        // startNotesWatch,
        getNoteContent,
        deleteNote,
    } = useContext(MainToRendererApiContext)

    const onAfterSelectFolder = (folderPath: string) => {
        console.log("chosen folder", folderPath)
        setFolderPath(folderPath)
        getNotesInDirectory(folderPath)
        console.log("DEBUG: before setLastFolderPathOpenedInConfig")
        setLastFolderPathOpenedInConfig(folderPath)
    }

    const chooseFolder = () => {
        selectFolder()
            .then(onAfterSelectFolder)
            .catch(() => {
                console.log("canceled")
            })
    }

    const getNotesInDirectory = (path) => {
        console.log("getNotesInDirectory()")
        getNotesInFolder(path)
            .then((notesListMap) => {
                console.log(notesListMap)
                setNotesListMap(notesListMap)
            })
            .catch((e) => {
                console.log("error getting notes")
            })
    }

    const createNewNoteFile = () => {
        createNewNote(folderPath)
            .then((fileName) => {
                console.log("done creating note")
                getNotesInDirectory(folderPath)

                // after new note creation, select it
                onSelectNote(fileName)
            })
            .catch(() => {
                console.log("could not create note")
            })
    }

    const onSelectNote = (noteId: string) => {
        setNoteContent(null)
        setSelectedNoteId(noteId)

        getNoteContent(folderPath, noteId)
            .then((noteContent) => {
                setNoteContent(noteContent)
            })
            .catch((error) => console.log(error))
    }

    const onNoteListDeleteBtnClick = (fileName: string) => {
        deleteNote(folderPath, fileName)
            .then(() => {
                console.log("deleted note")
                // if note currently opened was deleted, clear it
                setSelectedNoteId(null)
                setNoteContent(null)

                // refresh notes list
                getNotesInDirectory(folderPath)
            })
            .catch((error) => {
                console.log("something went wrong when trying to delete")
            })
    }

    // useEffect(() => {
    //     if (folderPath) {
    //         console.log("got folder path, start watch")
    //         startNotesWatch(folderPath)
    //     }
    // }, [folderPath])

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
                <div>
                    <NoteList
                        notes={Object.values(notesListMap).sort((a, b) => {
                            return (
                                (a.lastModifiedDate - b.lastModifiedDate) * -1
                            )
                        })}
                        onSelectNote={onSelectNote}
                        onDeleteBtnClick={onNoteListDeleteBtnClick}
                    />
                </div>
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
