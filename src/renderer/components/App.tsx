import React, { useContext, useState, useEffect } from "react"
import styled from "styled-components"
import { Editor } from "./Editor"
import { AppTitle } from "./AppTitle"
import { Controls } from "./Controls"
import { NoteList } from "./NoteList"
import { MainToRendererApiContext } from "../providers"
import { NoteListMap } from "../../models"

const Container = styled.div`
    display: flex;
    background: white;
`

const LeftColumn = styled.div`
    width: 265px;
`

const RightColumn = styled.div`
    flex-grow: 1;
`

export function App() {
    const [folderPath, setFolderPath] = useState(null)
    const [notesListMap, setNotesListMap] = useState<NoteListMap>({})
    const [selectedNoteId, setSelectedNoteId] = useState<string>(null)
    const [noteContent, setNoteContent] = useState<string>(null)

    const {
        selectFolder,
        getNotesInFolder,
        createNewNote,
        // startNotesWatch,
        getNoteContent,
        deleteNote,
    } = useContext(MainToRendererApiContext)

    const chooseFolder = () => {
        selectFolder()
            .then((folderPath) => {
                console.log("chosen folder", folderPath)
                setFolderPath(folderPath)
                getNotesInDirectory(folderPath)
            })
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
