import React, { MouseEvent, useContext } from "react"
import styled from "styled-components"
import { TranslationContext } from "../providers"
import { NoteListItem } from "../../shared/models"
import { Button, ButtonType } from "./Button"

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
    display: flex;
    align-items: center;

    ${ListItem}:last-child & {
        border-bottom: 0.1rem solid var(--color-creamGreen);
    }
`

const ListItemLeftColumn = styled.div`
    flex-grow: 1;
`

const ListItemRightColumn = styled.div`
    margin-left: 1rem;
    width: 2.8rem;
    height: 2.8rem;
`

const NoteTitle = styled.div`
    font-weight: bold;
`

const NotePreview = styled.div``

const NoteDateModifiedText = styled.div`
    font-style: italic;
    white-space: nowrap;
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
        event: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
        fileName: string
    ) => {
        event.stopPropagation()
        onDeleteBtnClick(fileName)
    }

    const notAvailableText = translation("not_available_short")

    return (
        <ListItem
            onClick={() => (!isSelected ? onSelectNote(note.id) : null)}
            isSelected={isSelected}
            data-testid="list-item"
        >
            <ListItemContent isSelected={isSelected}>
                <ListItemLeftColumn>
                    <NoteTitle data-testid={`${note.id}-title`}>
                        {note.title ? note.title : notAvailableText}
                    </NoteTitle>
                    <NotePreview data-testid={`${note.id}-preview`}>
                        {note.preview ? note.preview : notAvailableText}
                    </NotePreview>
                    <NoteDateModifiedText
                        data-testid={`${note.id}-last-modified-date`}
                    >
                        {note.lastModifiedDate
                            ? translation(
                                  "last_modified",
                                  new Date(
                                      note.lastModifiedDate
                                  ).toLocaleString()
                              )
                            : notAvailableText}
                    </NoteDateModifiedText>
                </ListItemLeftColumn>
                {isSelected ? (
                    <ListItemRightColumn>
                        <Button
                            onClick={(event) => onDeleteClick(event, note.id)}
                            ariaLabel={translation("note_delete")}
                            image={"delete-24px.svg"}
                            type={ButtonType.NoBackground}
                        />
                    </ListItemRightColumn>
                ) : (
                    ""
                )}
            </ListItemContent>
        </ListItem>
    )
}
