import { onSelectFolderStart as _onSelectFolderStart } from "./integration/openDialog"
import { dialog, IpcMainEvent } from "electron"
import { dialogMock } from "../../../e2e/dialogMock"

// need to use mocked dialog (set from e2e test file) for spectron testing due to limitations of not being able to interact with OS dialogs
const dialogModule = process.env.NODE_ENV === "spectron" ? dialogMock : dialog

export const onSelectFolderStart = ((dialog) => (event: IpcMainEvent) =>
    _onSelectFolderStart(dialog, event))(dialogModule)
