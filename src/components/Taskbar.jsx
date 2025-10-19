import { useMemo } from "react"
import { useFileSystemContext } from "../contexts/FileSystemContext"
import { File, FolderClosed } from "lucide-react"
import "./styles/Taskbar.less"

export default function Taskbar() {
  const {
    iconlist,
    openWindows,
    focusedId,
    setFocusedId,
    windowOrder,
    setWindowOrder,
    setOpenWindows,
  } = useFileSystemContext()

  // const openWindow = (file) => {
  //   // generate a unique id for this window
  //   const uniqueId = crypto.randomUUID()
  //   // Clone the file object to avoid modifying the original data
  //   const newFile = { ...file, id: uniqueId }
  //   setOpenWindows([...openWindows, newFile])
  // }
  const raiseWindow = (windowId) => {
    if (focusedId !== windowId) {
      setFocusedId(windowId)
    }
    // update window order (zindex)
    let lastWindow = windowOrder[windowOrder.length - 1]
    if (windowId !== lastWindow) {
      setWindowOrder([...windowOrder.filter((id) => id !== windowId), windowId])
    }
    restoreMinimizedWindow(windowId)
  }

  const restoreMinimizedWindow = (windowId) => {
    setOpenWindows([
      ...openWindows.map((window) => {
        if (window.id == windowId) {
          window.minimized = null
          return window
        }
        return window
      }),
    ])
  }

  const renderWindowIcons = useMemo(() => {
    if (openWindows.length > 0) {
      return openWindows.map((window) => {
        switch (window.type) {
          case "file":
            return (
              <button
                className={`taskbar-icon ${
                  window.minimized ? "minimized" : ""
                }`}
                onClick={() => raiseWindow(window.id)}
                key={window.id}
              >
                {/* <File size={13}></File> */}
                {window.name}
              </button>
            )
          case "folder":
            return (
              <button
                className={`taskbar-icon ${
                  window.minimized ? "minimized" : ""
                }`}
                onClick={() => raiseWindow(window.id)}
                key={window.id}
              >
                {/* <FolderClosed size={13}></FolderClosed> */}
                Files - {window.name}
              </button>
            )
          default:
            return (
              <button
                className={`taskbar-icon ${
                  window.minimized ? "minimized" : ""
                }`}
                onClick={() => raiseWindow(window.id)}
                key={window.id}
              >
                {/* <File size={13}></File> */}
                {window.name}
              </button>
            )
        }
      })
    }
    // return <></>
  }, [iconlist, openWindows, windowOrder, focusedId])

  return <div className="taskbar-container">{renderWindowIcons}</div>
}
