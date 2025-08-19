import { useEffect, useMemo, useState } from "react"
import "./styles/FileExplorer.less"
import { File, Folder } from "lucide-react"
// import WindowWrapper from "../components/WindowWrapper"
import { useFileSystemContext } from "../contexts/FileSystemContext"

function FileExplorer({ folder }) {
  const { setOpenWindows, openWindows } = useFileSystemContext()
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    fetch(`/${folder}/manifest.json`) // Note: no /public in the path
      .then((response) => response.json())
      .then((data) => {
        setFileList(data)
      })
  }, [])

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
        return (
          <li
            className="file-item"
            key={index}
            onDoubleClick={() => openWindow(file)}
          >
            {/* <Folder size={18} /> */}
            <File size={18} />
            {file.name}
          </li>
        )
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
