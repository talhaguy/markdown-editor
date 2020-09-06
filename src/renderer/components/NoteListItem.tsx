import React, { MouseEvent, useContext } from "react"
import styled from "styled-components"
import { TranslationContext } from "../providers"
import { NoteListItem } from "../../models"

const ListItem = styled.li<Pick<NoteListItemProps, "isSelected">>`
    cursor: pointer;
    padding: 0 1.5rem;
    background-color: ${({ isSelected }) =>
        isSelected ? "var(--color-creamGreen)" : "var(--color-lightJet)"};
    position: relative;

    /* to cover the border top of the next unselected item */
    &::after {
        content: "";
        height: 0.1rem;
        background-color: ${({ isSelected }) =>
            isSelected ? "var(--color-creamGreen)" : "transparent"};
        display: block;
        width: 100%;
        position: absolute;
        bottom: -0.1rem;
        left: 0;
        z-index: 100;
    }
`

const ListItemContent = styled.div<Pick<NoteListItemProps, "isSelected">>`
    color: ${({ isSelected }) =>
        isSelected ? "var(--color-darkGreen)" : "var(--color-white)"};
    border-top: 0.1rem solid var(--color-creamGreen);
    font-size: 1.3rem;
    padding: 1.5rem 0;

    ${ListItem}:last-child & {
        border-bottom: 0.1rem solid var(--color-creamGreen);
    }
`

const NoteTitle = styled.div`
    font-weight: bold;
`

const NotePreview = styled.div``

const NoteDateModifiedText = styled.div`
    font-style: italic;
`

interface NoteListItemProps {
    note: NoteListItem
    onSelectNote: (noteId: string) => void
    onDeleteBtnClick: (fileName: string) => void
    isSelected: boolean
}

export function NoteListItem({
    note,
    onSelectNote,
    onDeleteBtnClick,
    isSelected,
}: NoteListItemProps) {
    const { translation } = useContext(TranslationContext)

    const onDeleteClick = (
        event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
        fileName: string
    ) => {
        event.stopPropagation()
        console.log("delete clicked")
        onDeleteBtnClick(fileName)
    }

    return (
        <ListItem
            onClick={() => (!isSelected ? onSelectNote(note.id) : null)}
            isSelected={isSelected}
        >
            <ListItemContent isSelected={isSelected}>
                <NoteTitle>{note.title ? note.title : "N/A"}</NoteTitle>
                <NotePreview>{note.preview ? note.preview : "N/A"}</NotePreview>
                <NoteDateModifiedText>
                    {note.lastModifiedDate
                        ? translation(
                              "lastModified",
                              new Date(note.lastModifiedDate).toLocaleString()
                          )
                        : "N/A"}
                </NoteDateModifiedText>
                <button onClick={(event) => onDeleteClick(event, note.id)}>
                    Delete
                </button>
            </ListItemContent>
        </ListItem>
    )
}
