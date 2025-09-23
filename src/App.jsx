import { useEffect, useState } from "react"
import "./App.css"
import FileIcons from "./components/FileIcons"
import WindowManager from "./components/WindowManager"
import { FileSystemProvider } from "./contexts/FileSystemContext"
import FileExplorer from "./components/FileExplorer"

function App() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (window.innerWidth < 500 || window.innerHeight < 700) {
      setIsMobile(true)
    }
  }, [])

  const renderBaseWindow = () => {
    if (!isMobile) {
      return <FileIcons />
    } else {
      return <FileExplorer path={"public"} isMobile={true} />
    }
  }

  return (
    <div>
      <FileSystemProvider>
        {renderBaseWindow()}
        <WindowManager />
      </FileSystemProvider>
    </div>
  )
}

export default App
