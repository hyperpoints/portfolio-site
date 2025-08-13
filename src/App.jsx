import "./App.css"
import FileIcons from "./components/FileIcons"
import WindowManager from "./components/WindowManager"
import { FileSystemProvider } from "./contexts/FileSystemContext"

function App() {
  return (
    <div>
      <FileSystemProvider>
        <FileIcons />
        <WindowManager />
      </FileSystemProvider>
    </div>
  )
}

export default App
