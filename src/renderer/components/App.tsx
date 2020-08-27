import React, { useContext, useState } from "react"
import styled from "styled-components"
import { Editor } from "./Editor"
import { AppTitle } from "./AppTitle"
import { Controls } from "./Controls"
import { NoteList } from "./NoteList"
import { MainToRendererApiContext } from "../providers"

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
    const [folderPath, setFolderPath] = useState(null)
    const [notes, setNotes] = useState([])

    const { selectFolder, getNotesInFolder } = useContext(
        MainToRendererApiContext
    )

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
        getNotesInFolder(path)
            .then((files) => {
                console.log(files)
                setNotes(files)
            })
            .catch((e) => {
                console.log("error getting notes")
            })
    }

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
                    />
                </div>
                <div>
                    <NoteList notes={notes} />
                </div>
            </LeftColumn>
            <RightColumn>
                <Editor />
            </RightColumn>
        </Container>
    )
}
