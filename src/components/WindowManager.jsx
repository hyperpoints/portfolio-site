import { useMemo } from "react"
import WindowWrapper from "../components/WindowWrapper"
import { useFileSystemContext } from "../contexts/FileSystemContext"
import FileExplorer from "./FileExplorer"

function WindowManager() {
  const { setOpenWindows, openWindows } = useFileSystemContext()

  const closeWindow = (windowId) => {
    setOpenWindows([...openWindows.filter((file) => file.name !== windowId)])
  }

  const renderWindows = useMemo(() => {
    if (openWindows) {
      // console.log(openWindows)
      return openWindows.map((file, index) => {
        if (file.display !== false) {
          switch (file.type) {
            case "folder":
              return (
                <WindowWrapper
                  title={file.name}
                  // startHeight={file.startHeight}
                  // startWidth={file.startWidth}
                  windowId={file.name}
                  close={closeWindow}
                  key={index}
                >
                  <FileExplorer folder={file.link} />
                </WindowWrapper>
              )
            case "image":
              return (
                <WindowWrapper
                  title={file.name}
                  startHeight={file.startHeight}
                  startWidth={file.startWidth}
                  windowId={file.name}
                  close={closeWindow}
                  key={index}
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
                  title={file.name}
                  startHeight={file.startHeight}
                  startWidth={file.startWidth}
                  windowId={file.name}
                  close={closeWindow}
                  key={index}
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
