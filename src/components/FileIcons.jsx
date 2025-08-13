import { useEffect, useMemo } from "react"
import { useFileSystemContext } from "../contexts/FileSystemContext"
import { File } from "lucide-react"

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
        if (file.display !== false) {
          console.log(file)
          return (
            <div style={{ padding: "3px" }}>
              <button
                onDoubleClick={() => setOpenWindows([...openWindows, file])}
                key={file.name}
              >
                <File size={50}></File>
              </button>
              <p
                className="file-label"
                style={{
                  maxWidth: "200px",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: 2,
                  overflow: "hidden",
                }}
              >
                {file.name}
              </p>
            </div>
          )
        }
      })
    }
    return <></>
  }, [fileList, openWindows])

  return <div>{renderFileIcons}</div>
}
