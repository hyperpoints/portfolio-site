import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useFileSystemContext } from "../contexts/FileSystemContext"
// import { File, FolderClosed } from "lucide-react"
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
    taskbarOrder,
    setTaskbarOrder,
  } = useFileSystemContext()

  const [draggingId, setDraggingId] = useState()
  const dragState = useRef({
    isDragging: false,
    draggingId: null,
    startX: 0,
    startIndex: 0,
  })

  useEffect(() => {
    // initialize window order
    if (taskbarOrder.length < 1) {
      setTaskbarOrder([...openWindows.map((window) => window.id)])
    } else if (openWindows.length > 0) {
      // update window order with new window
      let newWindow = openWindows[openWindows.length - 1]
      if (newWindow && !taskbarOrder.includes(newWindow.id)) {
        setTaskbarOrder([...taskbarOrder, newWindow.id])
      }
    }
  }, [openWindows])

  const handleMouseDown = (e, windowId) => {
    e.preventDefault()
    dragState.current = {
      isDragging: true,
      draggingId: windowId,
      startX: e.clientX,
      startIndex: taskbarOrder.indexOf(windowId),
    }

    // Add global listeners
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragState.current.isDragging) return

      const { startX, draggingId, startIndex } = dragState.current
      const minDrag = 100
      const currentDistance = Math.abs(e.clientX - startX)

      if (currentDistance > 5) {
        setDraggingId(dragState.current.draggingId)
      }

      // Calculate new index based on mouse movement
      let newIndex
      if (e.clientX > startX + minDrag) {
        newIndex = startIndex + 1
      } else if (e.clientX < startX - minDrag) {
        newIndex = startIndex - 1
      }

      if (newIndex >= 0) {
        const newOrder = [...taskbarOrder]
        const currentIndex = newOrder.indexOf(draggingId)

        // Remove from current position and insert at new position
        newOrder.splice(currentIndex, 1)
        newOrder.splice(newIndex, 0, draggingId)

        setTaskbarOrder(newOrder)
        // dragState.current.startIndex = currentIndex
        // dragState.current.startX = e.clientX
        dragState.current.isDragging = false
        dragState.current.draggingId = null
      }
    },
    [taskbarOrder]
  )

  const handleMouseUp = useCallback((e) => {
    dragState.current.isDragging = false
    dragState.current.draggingId = null
    setDraggingId(null)

    // if we didn't drag very far allow window ping
    const currentDistance = Math.abs(e.clientX - dragState.current.startX)
    if (currentDistance < 5) {
      dragState.current.draggingId = "ping"
    }

    // clean up event listeners
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

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

  const pingWindow = (windowId, minimized) => {
    if (dragState.current.draggingId !== "ping")
      return (dragState.current.draggingId = null)

    if (minimized) {
      raiseWindow(windowId)
    } else if (windowOrder[windowOrder.length - 1] !== windowId) {
      raiseWindow(windowId)
    } else {
      minimizeWindow(windowId)
    }
  }

  const minimizeWindow = (windowId) => {
    setOpenWindows([
      ...openWindows.map((window) => {
        if (window.id == windowId) {
          window.minimized = true
          return window
        }
        return window
      }),
    ])
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
      return openWindows
        .map((window) => {
          switch (window.type) {
            case "file":
              return (
                <button
                  className={`taskbar-icon ${
                    window.minimized ? "minimized" : ""
                  } ${window.id == focusedId ? "focused" : ""}`}
                  onMouseDown={(e) => handleMouseDown(e, window.id)}
                  style={{
                    cursor: draggingId === window.id ? "grabbing" : "auto",
                    opacity: draggingId === window.id ? 0.7 : 1,
                  }}
                  onClick={() => pingWindow(window.id, window.minimized)}
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
                  } ${window.id == focusedId ? "focused" : ""}`}
                  onMouseDown={(e) => handleMouseDown(e, window.id)}
                  style={{
                    cursor: draggingId === window.id ? "grabbing" : "auto",
                    opacity: draggingId === window.id ? 0.7 : 1,
                  }}
                  onClick={() => pingWindow(window.id, window.minimized)}
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
                  } ${window.id == focusedId ? "focused" : ""}`}
                  onMouseDown={(e) => handleMouseDown(e, window.id)}
                  style={{
                    cursor: draggingId === window.id ? "grabbing" : "auto",
                    opacity: draggingId === window.id ? 0.7 : 1,
                  }}
                  onClick={() => pingWindow(window.id, window.minimized)}
                  key={window.id}
                >
                  {/* <File size={13}></File> */}
                  {window.name}
                </button>
              )
          }
        })
        .sort(
          (a, b) => taskbarOrder.indexOf(a.key) - taskbarOrder.indexOf(b.key)
        )
    }
    // return <></>
  }, [iconlist, openWindows, taskbarOrder, focusedId, draggingId])

  return (
    <div className="taskbar-container" onMouseMove={handleMouseMove}>
      {renderWindowIcons}
    </div>
  )
}
