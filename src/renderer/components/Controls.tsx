import React from "react"

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
    return (
        <>
            <button onClick={chooseFolder}>Choose Folder</button>
            {folderName ? folderName : "N/A"}
            <br />
            {folderName ? (
                <button onClick={createNewNote}>New Note</button>
            ) : (
                ""
            )}
        </>
    )
}
