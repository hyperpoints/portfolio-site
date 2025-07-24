import { useRef, useState, useEffect } from "react";
import { useWindowManager } from "../contexts/WindowManagerContext";
import "./styles/window.css";

let nextZ = 1000;

export default function WindowWrapper({
	title = "Window",
	children,
	startHeight = 300,
	startWidth = 400,
	windowId, // each window should have a unique id
}) {
	const { focusedId, setFocusedId, isAnyDragging, setIsAnyDragging } = useWindowManager();
	const ref = useRef(null);
	const [zIndex, setZIndex] = useState(nextZ++);
	const [position, setPosition] = useState({ x: 100, y: 100 });
	const [size, setSize] = useState({ width: startWidth, height: startHeight });
	const [isDragging, setDragging] = useState(false);
	const offset = useRef({ x: 0, y: 0 });
	const isFocused = focusedId === windowId;

	useEffect(() => {
		const onMouseMove = (e) => {
			if (!isDragging) return;
			const newX = e.clientX - offset.current.x;
			const newY = e.clientY - offset.current.y;
			const clampedX = Math.max(0, Math.min(newX, window.innerWidth - size.width));
			const clampedY = Math.max(0, Math.min(newY, window.innerHeight - size.height));
			setPosition({ x: clampedX, y: clampedY });
		};

		const onMouseUp = () => {
			setDragging(false);
			setIsAnyDragging(false);
		};

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
		return () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
		};
	}, [isDragging, size, setIsAnyDragging]);

	const startDrag = (e) => {
		offset.current = {
			x: e.clientX - position.x,
			y: e.clientY - position.y,
		};
		setIsAnyDragging(true);
		setDragging(true);
	};

	const raise = () => {
		if (focusedId !== windowId) {
			console.log("focus changed to ", windowId);
			setFocusedId(windowId);
			setZIndex(nextZ++);
		}
	};

	const startResize = (e) => {
		e.preventDefault();
		raise();
		const startX = e.clientX;
		const startY = e.clientY;
		const startWidth = size.width;
		const startHeight = size.height;

		const doResize = (e) => {
			setSize({
				width: Math.max(200, startWidth + (e.clientX - startX)),
				height: Math.max(100, startHeight + (e.clientY - startY)),
			});
		};

		const stopResize = () => {
			window.removeEventListener("mousemove", doResize);
			window.removeEventListener("mouseup", stopResize);
		};

		window.addEventListener("mousemove", doResize);
		window.addEventListener("mouseup", stopResize);
	};

	return (
		<div
			ref={ref}
			className={`window ${isAnyDragging ? "disabled-interaction" : ""}`}
			style={{
				top: position.y,
				left: position.x,
				width: size.width,
				height: size.height,
				zIndex,
			}}
			onMouseDown={raise}
		>
			<div className="window-titlebar" onMouseDown={startDrag}>
				{title}
			</div>
			<div className="window-body" style={{ position: "relative", height: "100%" }} onClick={raise}>
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
						pointerEvents: !isFocused ? "none" : null,
						filter: !isFocused ? "grayscale(50%) blur(1px)" : undefined,
						transition: "filter 0.2s ease, opacity 0.2s ease",
					}}
				>
					{children}
				</div>
			</div>
			<div className="window-resizer" onMouseDown={startResize} />
		</div>
	);
}
