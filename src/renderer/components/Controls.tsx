import React from "react"

interface ControlsProps {
    chooseFolder: () => void
    folderName: string
}

export function Controls({ chooseFolder, folderName }: ControlsProps) {
    return (
        <>
            <button onClick={chooseFolder}>Choose Folder</button>
            {folderName ? folderName : "N/A"}
        </>
    )
}
