import { useEffect, useMemo } from "react"
import WindowWrapper from "../components/WindowWrapper"
import { useFileSystemContext } from "../contexts/FileSystemContext"
import FileExplorer from "./FileExplorer"
import "./styles/window.less"

function WindowManager() {
  const { setOpenWindows, openWindows, setWindowOrder, windowOrder } =
    useFileSystemContext()

  const closeWindow = (windowId) => {
    setOpenWindows([...openWindows.filter((file) => file.id !== windowId)])
  }

  const minimizeWindow = (windowId) => {
    setOpenWindows([
      ...openWindows.map((window) => {
        if (window.id == windowId) {
          // window.name = activeFilePath.split("/").pop()
          window.minimized = true
          return window
        }
        return window
      }),
    ])
  }

  useEffect(() => {
    // initialize window order
    if (windowOrder.length < 1) {
      setWindowOrder([...openWindows.map((window) => window.id)])
    } else if (openWindows.length > 0) {
      // update window order with new window
      let newWindow = openWindows[openWindows.length - 1]
      if (newWindow && !windowOrder.includes(newWindow.id)) {
        setWindowOrder([...windowOrder, newWindow.id])
      }
    }
  }, [openWindows])

  const renderWindows = useMemo(() => {
    if (openWindows) {
      return openWindows.map((file) => {
        if (file.display !== false && file.minimized !== true) {
          switch (file.type) {
            case "folder":
              return (
                <WindowWrapper
                  name={file.name}
                  // startHeight={file.startHeight}
                  // startWidth={file.startWidth}
                  windowId={file.id}
                  key={file.id}
                  close={closeWindow}
                  minimize={minimizeWindow}
                >
                  <FileExplorer path={file.link} windowId={file.id} />
                </WindowWrapper>
              )
            case "image":
              return (
                <WindowWrapper
                  name={file.name}
                  startWidth={600}
                  autoHeight
                  // allowBlur={false}
                  windowId={file.id}
                  key={file.id}
                  close={closeWindow}
                  minimize={minimizeWindow}
                >
                  <img
                    src={file.link}
                    onDoubleClick={() => window.open(file.link, "_blank")}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      display: "block",
                    }}
                  ></img>
                </WindowWrapper>
              )
            default:
              return (
                <WindowWrapper
                  name={file.name}
                  startHeight={600}
                  startWidth={680}
                  windowId={file.id}
                  key={file.id}
                  close={closeWindow}
                  minimize={minimizeWindow}
                  allowBlur={true}
                >
                  <iframe src={file.link}></iframe>
                </WindowWrapper>
              )
          }
        }
      })
    }
  }, [openWindows])

  return <div className="window-manager">{renderWindows}</div>
}

export default WindowManager
