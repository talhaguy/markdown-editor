import React, { useContext } from "react"
import { TranslationContext } from "../providers"
import { Button } from "./Button"

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
    return (
        <>
            <Button
                onClick={chooseFolder}
                ariaLabel={translation("chooseFolder")}
                image={"folder-24px.svg"}
            ></Button>
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
