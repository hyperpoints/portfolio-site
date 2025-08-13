import { useEffect, useMemo, useState } from "react"
import WindowWrapper from "../components/WindowWrapper"
import { useFileSystemContext } from "../contexts/FileSystemContext"

function WindowManager() {
  const { fileList, setFileList, setOpenWindows, openWindows } =
    useFileSystemContext()

  // useEffect(() => {
  //   fetch("/projects/manifest.json") // Note: no /public in the path
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setFileManifest(data)
  //     })
  // }, [])

  const closeWindow = (windowId) => {
    setOpenWindows([...openWindows.filter((file) => file.name !== windowId)])
  }

  const renderWindows = useMemo(() => {
    if (openWindows) {
      console.log(openWindows)
      return openWindows.map((file, index) => {
        // return console.log(file)
        if (file.display !== false) {
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
      })
    }
  }, [openWindows])

  return <>{renderWindows}</>
}

export default WindowManager
