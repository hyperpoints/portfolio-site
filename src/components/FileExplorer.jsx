import { useEffect, useMemo, useState } from "react"
import "./styles/FileExplorer.less"
import { File, Folder } from "lucide-react"
// import WindowWrapper from "../components/WindowWrapper"
// import { useFileSystemContext } from "../contexts/FileSystemContext"

function FileExplorer({ folder }) {
  // const { iconlist, setIconlist, setOpenWindows, openWindows } =
  //   useFileSystemContext()
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    fetch(`/${folder}/manifest.json`) // Note: no /public in the path
      .then((response) => response.json())
      .then((data) => {
        console.log("fileExplorer", data)
        setFileList(data)
      })
  }, [])

  // const closeWindow = (windowId) => {
  //   setOpenWindows([...openWindows.filter((file) => file.name !== windowId)])
  // }

  const renderFileList = useMemo(() => {
    if (fileList) {
      // console.log(openWindows)
      return fileList.map((file, index) => {
        // return console.log(file)
        return (
          <li className="file-item" key={file.name}>
            {/* <Folder size={18} /> */}
            <File size={18} />
            {file.name}
          </li>
        )
      })
    }
  }, [fileList])

  return (
    <div className="file-explorer-container">
      <ul className="file-list">{renderFileList}</ul>
    </div>
  )
}

export default FileExplorer
