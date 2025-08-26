import fs from "fs"
import path from "path"

function generateManifests(dirPath) {
  // Read all items (files and directories) in the current directory
  const items = fs.readdirSync(dirPath, { withFileTypes: true })

  const manifest = []

  items.forEach((item) => {
    // Skip the script itself and any manifest files
    if (
      item.name === "generate-manifests.js" ||
      item.name === "manifest.json" ||
      item.name == ".DS_Store"
    ) {
      return
    }

    const fullPath = path.join(dirPath, item.name)

    if (item.isDirectory()) {
      const folderLink = path.join(item.path, item.name).replace("public/", "")
      // Add the directory to the manifest
      manifest.push({ name: item.name, type: "folder", link: folderLink })
      // Recursively call the function for the subdirectory
      generateManifests(fullPath)
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase()
      const fileLink = path.join(item.path, item.name).replace("public/", "")
      // Add the file to the manifest
      switch (ext) {
        case ".html":
          manifest.push({
            name: item.name,
            type: "html",
            link: fileLink,
          })
          break
        case ".jpg":
        case ".jpeg":
        case ".png":
        case ".gif":
        case ".bmp":
        case ".svg":
        case ".webp":
          manifest.push({
            name: item.name,
            type: "image",
            link: fileLink,
          })
          break
        default:
          manifest.push({
            name: item.name,
            type: "file",
            link: fileLink,
          })
          break
      }
    }
  })
  console.log(JSON.stringify(manifest, null, 2))
  // Write the manifest.json file
  const manifestPath = path.join(dirPath, "manifest.json")
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

  console.log(`Generated manifest.json in: ${dirPath}`)
}

// Get the starting directory from the command line arguments
// The script is typically run like: node generate-manifests.js ./path/to/start
const startDir = process.argv[2] || "."

// Start the process
generateManifests(startDir)
