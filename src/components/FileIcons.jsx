import { useEffect, useMemo } from "react"
import { useFileSystemContext } from "../contexts/FileSystemContext"
import { File, FolderClosed } from "lucide-react"
import "./styles/FileIcons.less"

export default function FileIcons() {
  const { iconlist, setIconlist, setOpenWindows, openWindows } =
    useFileSystemContext()

  useEffect(() => {
    fetch("manifest.json") // Note: no /public in the path
      .then((response) => response.json())
      .then((data) => {
        setIconlist(data)
      })
  }, [])

  const openWindow = (file) => {
    // generate a unique id for this window
    const uniqueId = crypto.randomUUID()
    // Clone the file object to avoid modifying the original data
    const newFile = { ...file, id: uniqueId }
    setOpenWindows([...openWindows, newFile])
  }

  const renderFileIcons = useMemo(() => {
    if (iconlist) {
      return iconlist.map((file) => {
        if (file.display == false) return
        // handle folders in their own way
        if (file.type !== "folder") {
          return (
            <div
              className="file"
              onDoubleClick={() => openWindow(file)}
              key={file.name}
            >
              <button>
                <File className="file-icons-file" size={60}></File>
              </button>
              <p className="file-label">{file.name}</p>
            </div>
          )
        } else {
          return (
            <div
              className="file"
              onDoubleClick={() => openWindow(file)}
              key={file.name}
            >
              <button>
                <FolderClosed
                  className="file-icons-folder"
                  size={60}
                ></FolderClosed>
              </button>
              <p className="file-label">{file.name}</p>
            </div>
          )
        }
      })
    }
    return <></>
  }, [iconlist, openWindows])

  return <div className="file-icons-container">{renderFileIcons}</div>
}
