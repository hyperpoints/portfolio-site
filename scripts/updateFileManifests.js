import fs from "fs"
import path from "path"

function generateManifests(dirPath) {
  // Read all items (files and directories) in the current directory
  const items = fs.readdirSync(dirPath, { withFileTypes: true })

  const manifest = []

  let links = []
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
      manifest.unshift({ name: item.name, type: "folder", link: folderLink })
      // Recursively call the function for the subdirectory
      generateManifests(fullPath)
    } else if (item.isFile()) {
      const ext = path.extname(item.name).toLowerCase()
      const fileLink = path.join(item.path, item.name).replace("public/", "")
      const name = item.name.replace(ext, "")
      // Add the file to the manifest
      switch (ext) {
        case ".url": {
          // read the url from the file
          const url = fs
            .readFileSync(path.join(item.path, item.name), {
              encoding: "utf8",
              flag: "r",
            })
            .trim()
          // add it to the list
          links.push({
            name: name,
            type: "link",
            link: url,
          })
          break
        }
        case ".html":
          manifest.push({
            name: name,
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
            name: name,
            type: "image",
            link: fileLink,
          })
          break
        default:
          manifest.push({
            name: name,
            type: "file",
            link: fileLink,
          })
          break
      }
    }
  })
  // add links at the bottom of the list
  manifest.push(...links)
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
