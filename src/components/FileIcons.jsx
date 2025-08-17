import { useEffect, useMemo } from "react"
import { useFileSystemContext } from "../contexts/FileSystemContext"
import { File, FolderClosed } from "lucide-react"
import "./styles/FileIcons.less"

export default function FileIcons() {
  const { iconlist, setIconlist, setOpenWindows, openWindows } =
    useFileSystemContext()

  useEffect(() => {
    fetch("/projects/manifest.json") // Note: no /public in the path
      .then((response) => response.json())
      .then((data) => {
        // console.log("data fetched: ", data)
        setIconlist(data)
      })
  }, [])

  const renderFileIcons = useMemo(() => {
    if (iconlist) {
      return iconlist.map((file) => {
        if (file.display == false) return

        // handle folders in their own way
        if (file.type !== "folder") {
          // console.log(file)
          return (
            <div
              className="file"
              onDoubleClick={() => setOpenWindows([...openWindows, file])}
              key={file.name}
            >
              <button>
                <File size={60}></File>
              </button>
              <p className="file-label">{file.name}</p>
            </div>
          )
        } else {
          return (
            <div
              className="file"
              onDoubleClick={() => setOpenWindows([...openWindows, file])}
              key={file.name}
            >
              <button>
                <FolderClosed size={60}></FolderClosed>
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
