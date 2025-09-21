import { useEffect, useMemo, useState } from "react"
import "./styles/FileExplorer.less"
import { File, Folder } from "lucide-react"
// import WindowWrapper from "../components/WindowWrapper"
import { useFileSystemContext } from "../contexts/FileSystemContext"

function FileExplorer({ path }) {
  const { setOpenWindows, openWindows } = useFileSystemContext()
  const [fileList, setFileList] = useState([])
  const [filePathList, setFilePathList] = useState([])
  const [activeFilePath, setActiveFilePath] = useState(path)

  useEffect(() => {
    if (activeFilePath !== "public") {
      fetch(`/portfolio-site/${activeFilePath}/manifest.json`) // Note: no /public in the path
        .then((response) => response.json())
        .then((data) => {
          setFileList(data)
        })
      // update the filePath
      setFilePathList(activeFilePath.split("/"))
    } else {
      fetch(`manifest.json`) // Note: no /public in the path
        .then((response) => response.json())
        .then((data) => {
          setFileList(data)
        })
      // update the filePath
      setFilePathList([])
    }
  }, [activeFilePath])

  const openWindow = (file) => {
    // generate a unique id for this window
    const uniqueId = crypto.randomUUID()
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
        if (file.type == "folder") {
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
        } else {
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
    <div className="file-explorer-container">
      <ul className="file-path-list">{renderFilePath()}</ul>
      <ul className="file-list">{renderFileList}</ul>
    </div>
  )
}

export default FileExplorer
