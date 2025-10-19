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

  // const pingWindow = (minimized, windowId) => {
  //   if (minimized) {
  //     raiseWindow(windowId)
  //   } else {
  //     minimizeWindow(windowId)
  //   }
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

  // const minimizeWindow = (windowId) => {
  //   setOpenWindows([
  //     ...openWindows.map((window) => {
  //       if (window.id == windowId) {
  //         window.minimized = true
  //         return window
  //       }
  //       return window
  //     }),
  //   ])
  // }

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
    // console.log(openWindows)
    if (openWindows.length > 0) {
      return openWindows.map((window) => {
        switch (window.type) {
          case "file":
            return (
              <button
                className={`taskbar-icon ${
                  window.minimized ? "minimized" : ""
                }`}
                // onDoubleClick={() => pingWindow(window.minimized, window.id)}
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
                // onDoubleClick={() => pingWindow(window.minimized, window.id)}
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
                // onDoubleClick={() => pingWindow(window.minimized, window.id)}
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
