// WindowManagerContext.tsx
import { createContext, useState, useContext } from "react"

const FileSystemContext: any = createContext({})

export function FileSystemProvider({ children }) {
  const [focusedId, setFocusedId] = useState(null)
  const [isAnyDragging, setIsAnyDragging] = useState(false)
  const [iconlist, setIconlist] = useState([])
  const [openWindows, setOpenWindows] = useState([])

  return (
    <FileSystemContext.Provider
      value={{
        focusedId,
        setFocusedId,
        isAnyDragging,
        setIsAnyDragging,
        iconlist,
        setIconlist,
        openWindows,
        setOpenWindows,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  )
}

export function useFileSystemContext(): any {
  return useContext(FileSystemContext)
}
