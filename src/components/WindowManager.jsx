import { useEffect, useMemo, useState } from "react"
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
        // return console.log(file)
        if (file.display !== false && file.type !== "folder") {
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
        } else if (file.type === "folder") {
          console.log(file)
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
        }
      })
    }
  }, [openWindows])

  return <>{renderWindows}</>
}

export default WindowManager
