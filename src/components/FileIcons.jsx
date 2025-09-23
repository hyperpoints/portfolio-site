import { useEffect, useMemo } from "react"
import { useFileSystemContext } from "../contexts/FileSystemContext"
import { File, FileSymlink, FolderClosed } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
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
    const uniqueId = uuidv4()
    // Clone the file object to avoid modifying the original data
    const newFile = { ...file, id: uniqueId }
    setOpenWindows([...openWindows, newFile])
  }

  const renderFileIcons = useMemo(() => {
    if (iconlist) {
      return iconlist.map((file) => {
        if (file.display == false) return
        // handle folders in their own way
        switch (file.type) {
          case "folder":
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
          case "link":
            return (
              <div
                className="file"
                onDoubleClick={() => window.open(file.link, "_blank")}
                key={file.name}
              >
                <button>
                  <FileSymlink
                    className="file-icons-link"
                    size={60}
                    color="white"
                  ></FileSymlink>
                </button>
                <p className="file-label">{file.name}</p>
              </div>
            )
          case "file":
          default:
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
        }
      })
    }
    return <></>
  }, [iconlist, openWindows])

  return <div className="file-icons-container">{renderFileIcons}</div>
}
