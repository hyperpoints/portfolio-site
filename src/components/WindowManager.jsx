import { useEffect, useMemo } from "react"
import WindowWrapper from "../components/WindowWrapper"
import { useFileSystemContext } from "../contexts/FileSystemContext"
import FileExplorer from "./FileExplorer"

function WindowManager() {
  const { setOpenWindows, openWindows, setWindowOrder, windowOrder } =
    useFileSystemContext()

  const closeWindow = (windowId) => {
    setOpenWindows([...openWindows.filter((file) => file.id !== windowId)])
    setWindowOrder([...windowOrder.filter((id) => id != windowId)])
  }

  useEffect(() => {
    // initialize window order
    if (windowOrder.length < 1) {
      setWindowOrder([...openWindows.map((window) => window.id)])
    } else if (openWindows) {
      // update window order with new window
      let newWindow = openWindows[openWindows.length - 1]
      setWindowOrder([...windowOrder, newWindow.id])
    }
  }, [openWindows])

  const renderWindows = useMemo(() => {
    if (openWindows) {
      return openWindows.map((file) => {
        if (file.display !== false) {
          switch (file.type) {
            case "folder":
              return (
                <WindowWrapper
                  name={"Files"}
                  // startHeight={file.startHeight}
                  // startWidth={file.startWidth}
                  windowId={file.id}
                  key={file.id}
                  close={closeWindow}
                >
                  <FileExplorer path={file.link} />
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
                >
                  <img
                    src={file.link}
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
                  allowBlur={true}
                >
                  <iframe
                    src={file.link}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      display: "block",
                    }}
                  ></iframe>
                </WindowWrapper>
              )
          }
        }
      })
    }
  }, [openWindows])

  return <>{renderWindows}</>
}

export default WindowManager
