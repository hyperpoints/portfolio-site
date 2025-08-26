import { useEffect, useMemo, useState } from "react"
import "./styles/FileExplorer.less"
import { File, Folder } from "lucide-react"
// import WindowWrapper from "../components/WindowWrapper"
import { useFileSystemContext } from "../contexts/FileSystemContext"

function FileExplorer({ folder }) {
  const { setOpenWindows, openWindows } = useFileSystemContext()
  const [fileList, setFileList] = useState([])
  const [openFolder, setOpenFolder] = useState(folder)

  useEffect(() => {
    fetch(`/${openFolder}/manifest.json`) // Note: no /public in the path
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setFileList(data)
      })
  }, [openFolder])

  const openWindow = (file) => {
    // generate a unique id for this window
    const uniqueId = crypto.randomUUID()
    // Clone the file object to avoid modifying the original data
    const newFile = { ...file, id: uniqueId }
    setOpenWindows([...openWindows, newFile])
  }

  const renderFileList = useMemo(() => {
    if (fileList) {
      return fileList.map((file, index) => {
        if (file.type == "folder") {
          return (
            <li
              className="file-item"
              key={index}
              // onDoubleClick={() => openWindow(file)}
              onDoubleClick={() => setOpenFolder(file.link)}
            >
              <Folder size={18} />
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
              <File size={18} />
              {file.name}
            </li>
          )
        }
      })
    }
  }, [fileList, openWindows])

  return (
    <div className="file-explorer-container">
      <ul className="file-list">{renderFileList}</ul>
    </div>
  )
}

export default FileExplorer
