import React, { MouseEvent, useContext } from "react"
import { TranslationContext } from "../providers"
import { NoteListItem as NoteListItemModel } from "../../shared/models"
import { NoteListItem } from "./NoteListItem"

interface NoteListItemContainerProps {
    note: NoteListItemModel
    onSelectNote: (noteId: string) => void
    onDeleteBtnClick: (fileName: string) => void
    isSelected: boolean
}

export function NoteListItemContainer({
    note,
    onSelectNote,
    onDeleteBtnClick,
    isSelected,
}: NoteListItemContainerProps) {
    const { translation } = useContext(TranslationContext)

    const onDeleteClick = (
        event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
        fileName: string
    ) => {
        event.stopPropagation()
        onDeleteBtnClick(fileName)
    }

    const onListItemClick = () => {
        if (!isSelected) {
            onSelectNote(note.id)
        }
    }

    return (
        <NoteListItem
            translation={translation}
            onDeleteClick={onDeleteClick}
            onListItemClick={onListItemClick}
            isSelected={isSelected}
            note={note}
        />
    )
}
