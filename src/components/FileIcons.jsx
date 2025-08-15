import { useEffect, useMemo } from "react"
import { useFileSystemContext } from "../contexts/FileSystemContext"
import { File, FolderClosed } from "lucide-react"
import "./styles/FileIcons.less"

export default function FileIcons() {
  const { fileList, setFileList, setOpenWindows, openWindows } =
    useFileSystemContext()

  useEffect(() => {
    fetch("/projects/manifest.json") // Note: no /public in the path
      .then((response) => response.json())
      .then((data) => {
        console.log("data fetched: ", data)
        setFileList(data)
      })
  }, [])

  const renderFileIcons = useMemo(() => {
    if (fileList) {
      return fileList.map((file) => {
        if (file.display == false) return

        // handle folders in their own way
        if (file.type !== "folder") {
          console.log(file)
          return (
            <div
              className="file"
              onDoubleClick={() => setOpenWindows([...openWindows, file])}
            >
              <button key={file.name}>
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
            >
              <button key={file.name}>
                <FolderClosed size={60}></FolderClosed>
              </button>
              <p className="file-label">{file.name}</p>
            </div>
          )
        }
      })
    }
    return <></>
  }, [fileList, openWindows])

  return <div className="file-icons-container">{renderFileIcons}</div>
}
