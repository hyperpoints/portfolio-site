import { useEffect, useMemo, useState } from "react"
import "./styles/FileExplorer.less"
import { File, FileSymlink, Folder } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
// import WindowWrapper from "../components/WindowWrapper"
import { useFileSystemContext } from "../contexts/FileSystemContext"

function FileExplorer({ path, isMobile = false, windowId }) {
  const { setOpenWindows, openWindows } = useFileSystemContext()
  const [fileList, setFileList] = useState([])
  const [filePathList, setFilePathList] = useState([])
  const [activeFilePath, setActiveFilePath] = useState(path)

  useEffect(() => {
    if (activeFilePath !== "public") {
      fetch(`/portfolio-site/${activeFilePath}/manifest.json`) // Note: no /public in the path
        .then((response) => response.json())
        .then((data) => {
          updateWindowName()
          setFileList(data)
        })
      // update the filePath
      setFilePathList(activeFilePath.split("/"))
    } else {
      fetch(`manifest.json`) // Note: no /public in the path
        .then((response) => response.json())
        .then((data) => {
          setFileList(data)
          updateWindowName()
        })
      // update the filePath
      setFilePathList([])
    }
  }, [activeFilePath])

  const updateWindowName = () => {
    // update the name of this file explorer window
    setOpenWindows([
      ...openWindows.map((window) => {
        if (window.id == windowId) {
          window.name = activeFilePath.split("/").pop()
          return window
        }
        return window
      }),
    ])
  }

  const openWindow = (file) => {
    // generate a unique id for this window
    const uniqueId = uuidv4()
    // Clone the file object to avoid modifying the original data
    const newFile = { ...file, id: uniqueId }
    setOpenWindows([...openWindows, newFile])
  }

  const renderFilePath = () => {
    // please note:
    // we add the /public item seperately since
    // it is a special case with its own handling
    return [
      <li
        key={-1}
        onClick={() => {
          setActiveFilePath("public")
        }}
      >
        {"public"}
      </li>,
      ...filePathList.map((folder, i) => {
        return (
          <li
            key={i}
            onClick={() => {
              let currentPath = filePathList.slice(0, i + 1).join("/")
              setActiveFilePath(currentPath)
            }}
          >
            {folder}
          </li>
        )
      }),
    ]
  }

  const renderFileList = useMemo(() => {
    if (fileList) {
      return fileList.map((file, index) => {
        switch (file.type) {
          case "folder":
            return (
              <li
                className="file-item"
                key={index}
                onDoubleClick={() => setActiveFilePath(file.link)}
              >
                <Folder className="file-explorer-folder" size={18} />
                {file.name}
              </li>
            )
          case "link":
            return (
              <li
                className="file-item"
                key={index}
                onDoubleClick={() => window.open(file.link, "_blank")}
              >
                <FileSymlink className="file-explorer-link" size={18} />
                {file.name}
              </li>
            )
          case "file":
          default:
            return (
              <li
                className="file-item"
                key={index}
                onDoubleClick={() => openWindow(file)}
              >
                <File className="file-explorer-file" size={18} />
                {file.name}
              </li>
            )
        }
      })
    }
  }, [fileList, openWindows])

  return (
    <div
      className={`file-explorer-container ${isMobile ? "mobile-explorer" : ""}`}
    >
      <ul className="file-path-list">{renderFilePath()}</ul>
      <ul className="file-list">{renderFileList}</ul>
    </div>
  )
}

export default FileExplorer
