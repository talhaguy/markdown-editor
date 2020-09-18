import { useContext, useEffect, useState } from "react"
import { ConfigContext } from "../providers"
import { SetLastFolderPathOpenedFunc } from "../services/config"

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
