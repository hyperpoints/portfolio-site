import { useRef, useState, useEffect } from "react"
import { useFileSystemContext } from "../contexts/FileSystemContext"
import { Maximize2, Minus, X } from "lucide-react"

export default function WindowWrapper({
  name = "Window",
  children,
  autoHeight = false,
  startHeight = 300,
  startWidth = 500,
  allowBlur = false,
  windowId, // each window should have a unique id
  close,
}) {
  const {
    focusedId,
    setFocusedId,
    isAnyDragging,
    setIsAnyDragging,
    windowOrder,
    setWindowOrder,
  } = useFileSystemContext()
  const ref = useRef(null)
  const docWidth = document.documentElement.clientWidth
  const docHeight = document.documentElement.clientHeight
  const [zIndex, setZIndex] = useState(windowOrder.indexOf(windowId))
  const [position, setPosition] = useState({
    // x: window.innerWidth > startWidth ? window.innerWidth / 3 : 0,
    x: docWidth > startWidth ? (docWidth - startWidth) / 2 : 0,
    y: docWidth > 500 ? (docHeight - startHeight) / 2 - 100 : 0,
  })
  const [size, setSize] = useState({ width: startWidth, height: startHeight })
  const [isDragging, setDragging] = useState(false)
  const offset = useRef({ x: 0, y: 0 })
  const isFocused = focusedId === windowId
  const dragStartEvent = useRef(null) // Track if it was touch or mouse

  useEffect(() => {
    setFocusedId(windowId)
    const onMove = (e) => {
      if (!isDragging) return

      // Handle both mouse and touch events
      const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX
      const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY

      const newX = clientX - offset.current.x
      const newY = clientY - offset.current.y
      const clampedX = Math.max(
        0,
        Math.min(newX, window.innerWidth - size.width)
      )
      // const clampedY = Math.max(0, Math.min(newY, window.innerHeight - 30)) // 30 = titlebar height
      const clampedY = Math.max(
        0,
        Math.min(newY, document.documentElement.clientHeight - 30)
      ) // 30 = titlebar height
      setPosition({ x: clampedX, y: clampedY })
    }

    const onEnd = () => {
      setDragging(false)
      setIsAnyDragging(false)
      dragStartEvent.current = null
    }

    document.addEventListener("mousemove", onMove)
    document.addEventListener("touchmove", onMove, { passive: false })
    document.addEventListener("mouseup", onEnd)
    document.addEventListener("touchend", onEnd)
    document.addEventListener("touchcancel", onEnd)

    return () => {
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("touchmove", onMove)
      document.removeEventListener("mouseup", onEnd)
      document.removeEventListener("touchend", onEnd)
      document.removeEventListener("touchcancel", onEnd)
    }
  }, [isDragging, size, setIsAnyDragging])

  useEffect(() => {
    if (windowOrder.includes(windowId)) {
      setZIndex(windowOrder.indexOf(windowId))
    }
  }, [windowOrder])

  const startDrag = (e) => {
    // Prevent handling both mouse and touch events for the same action
    if (dragStartEvent.current && dragStartEvent.current !== e.type) return

    if (!isAnyDragging) {
      dragStartEvent.current = e.type

      // Prevent default on touch to avoid scrolling
      if (e.type === "touchstart") {
        e.preventDefault()
      }

      const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX
      const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY

      offset.current = {
        x: clientX - position.x,
        y: clientY - position.y,
      }
      setIsAnyDragging(true)
      setDragging(true)
    }
  }

  const maximize = () => {
    // if it's not full screen set it
    if (size.height !== docHeight && size.width !== docWidth) {
      setPosition({ x: 0, y: 0 })
      setSize({
        width: docWidth,
        height: docHeight - 30,
      })
    } else {
      // otherwise set it back to the default width/height
      setPosition({
        x: docWidth > startWidth ? (docWidth - startWidth) / 2 : 0,
        y: docWidth > 500 ? (docHeight - startHeight) / 2 - 100 : 0,
      })
      setSize({
        width: startWidth,
        height: startHeight,
      })
    }
  }

  const raise = (e) => {
    // Prevent handling both mouse and touch events for the same action
    if (dragStartEvent.current && dragStartEvent.current !== e.type) return

    if (focusedId !== windowId) {
      setFocusedId(windowId)
    }
    // update window order (zindex)
    let lastWindow = windowOrder[windowOrder.length - 1]
    if (windowId !== lastWindow) {
      setWindowOrder([...windowOrder.filter((id) => id !== windowId), windowId])
    }
  }

  const sizeRef = useRef(size)
  const resizeStartEvent = useRef(null)

  const startResize = (e) => {
    // Prevent handling both mouse and touch events for the same action
    if (resizeStartEvent.current && resizeStartEvent.current !== e.type) return

    resizeStartEvent.current = e.type

    // Prevent default on touch to avoid scrolling
    if (e.type === "touchstart") {
      e.preventDefault()
    }

    const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX
    const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY

    const startX = clientX
    const startY = clientY
    const startWidth = size.width
    const startHeight = size.height
    setIsAnyDragging(true)

    const doResize = (e) => {
      const moveX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX
      const moveY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY

      const newWidth = Math.max(200, startWidth + (moveX - startX))
      const newHeight = Math.max(100, startHeight + (moveY - startY))
      sizeRef.current = { width: newWidth, height: newHeight }
      // Force an update using requestAnimationFrame for smoother feedback
      requestAnimationFrame(() => {
        setSize(sizeRef.current)
      })
    }

    const stopResize = () => {
      window.removeEventListener("mousemove", doResize)
      window.removeEventListener("touchmove", doResize)
      window.removeEventListener("mouseup", stopResize)
      window.removeEventListener("touchend", stopResize)
      window.removeEventListener("touchcancel", stopResize)
      window.removeEventListener("mouseleave", stopResize)
      setIsAnyDragging(false)
      resizeStartEvent.current = null
    }

    window.addEventListener("mousemove", doResize)
    window.addEventListener("touchmove", doResize, { passive: false })
    window.addEventListener("mouseup", stopResize)
    window.addEventListener("touchend", stopResize)
    window.addEventListener("touchcancel", stopResize)
    window.addEventListener("mouseleave", stopResize)
  }

  return (
    <div
      ref={ref}
      className={`window ${isAnyDragging ? "disabled-interaction" : ""}`}
      style={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: autoHeight ? "auto" : size.height,
        zIndex,
        touchAction: "none", // Prevent browser touch actions like scrolling
      }}
      onMouseDown={raise}
      onTouchStart={raise}
    >
      <div
        className="window-titlebar"
        onDoubleClick={maximize}
        onMouseDown={startDrag}
        onTouchStart={startDrag}
      >
        <div className="window-buttons">
          <button
            onClick={() => {
              setWindowOrder([...windowOrder.filter((id) => id !== windowId)])
              close(windowId)
            }}
            onTouchEnd={(e) => {
              // Handle touch equivalent of click
              e.preventDefault()
              setWindowOrder([...windowOrder.filter((id) => id !== windowId)])
              close(windowId)
            }}
            style={{
              backgroundColor: "#f9844a",
              color: "black",
              borderRadius: "10%",
            }}
          >
            <X size={9} />
          </button>
          {/* <button
            onClick={() => console.log("minimize button clicked: ", name)}
            onTouchEnd={(e) => {
              e.preventDefault()
              console.log("minimize button clicked: ", name)
            }}
            style={{
              backgroundColor: "#f9c74f",
              color: "black",
              borderRadius: "10%",
            }}
          >
            <Minus size={9}></Minus>
          </button> */}
          <button
            onClick={() => {
              console.log("fullscreen button clicked: ", name)
              maximize()
            }}
            onTouchEnd={(e) => {
              e.preventDefault()
              maximize()
              // console.log("fullscreen button clicked: ", name)
            }}
            style={{
              backgroundColor: "#90be6d",
              color: "black",
              borderRadius: "10%",
            }}
          >
            <Maximize2 size={9} style={{ transform: "scaleX(-1)" }}></Maximize2>
          </button>
        </div>
        <div className="window-name">{name}</div>
      </div>
      <div
        className="window-body"
        style={{ position: "relative", height: "100%" }}
        onClick={raise}
        onTouchStart={raise}
      >
        {isDragging && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 10,
              cursor: "grabbing",
            }}
          />
        )}
        <div
          style={{
            height: "100%",
            background: "#ccc",
            pointerEvents: !isFocused && allowBlur ? "none" : null,
            filter:
              !isFocused && allowBlur
                ? "grayscale(30%) blur(0.7px)"
                : undefined,
            transition: "filter 0.2s ease, opacity 0.2s ease",
          }}
        >
          {children}
        </div>
        <div
          className="window-resizer"
          onMouseDown={startResize}
          onTouchStart={startResize}
        />
      </div>
    </div>
  )
}
