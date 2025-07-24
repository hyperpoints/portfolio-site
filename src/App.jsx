// import { useState } from "react";
import "./App.css";
import WindowWrapper from "./components/WindowWrapper";
import { WindowManagerProvider } from "./contexts/WindowManagerContext";
// import { projects } from "./data/projects.js";

function App() {
	// const [count, setCount] = useState(0);
	// const [inputValue, setInputValue] = useState("");

	// const renderProjects = useMemo(() => {
	// 	if (projects.length > 0) {
	// 		return projects.map((project) => {
	// 			console.log(project);
	// 			return (
	// 				<li key={project.title}>
	// 					<b>{project.title}</b> - {project.description}
	// 				</li>
	// 			);
	// 		});
	// 	}
	// 	return;
	// }, [projects]);

	return (
		<WindowManagerProvider>
			{/* <WindowWrapper title="🐸 Glorbo Console" startHeight={160}>
				<div style={{ padding: "20px" }}>
					<h2 className="text-blue-100 cursor-pointer bg-black rounded-t-sm p-3 border-b-2 border-b-gray-600 text-left">
						A Beautiful Selection
					</h2>
					<input
						type="text"
						placeholder={"query"}
						value={inputValue}
						onChange={(e) => {
							setInputValue(e.target.value);
						}}
						onKeyDown={(e) => {
							if (e.key == "Enter" && inputValue !== "") {
								console.log(inputValue);
							}
						}}
						className="center bg-black text-green-300 p-2 rounded-b-lg w-full opacity-80"
					></input>
				</div>
			</WindowWrapper> */}

			<WindowWrapper title="🐸 Glorbo Console" startHeight={400} startWidth={680} windowId={1}>
				<iframe
					src="/projects/sample.html"
					style={{
						width: "100%",
						height: "100%",
						border: "none",
						display: "block",
					}}
				></iframe>
			</WindowWrapper>
			<WindowWrapper
				title="🐳 Theatrical Intelligence"
				startHeight={633}
				startWidth={680}
				windowId={2}
			>
				<iframe
					src="/projects/theatrical.html"
					style={{
						width: "100%",
						height: "100%",
						border: "none",
						display: "block",
					}}
				></iframe>
			</WindowWrapper>
			{/* <div className="card size-full">
				<button
					className="mt-1 opacity-80 bg-green-500"
					onClick={() => setCount((count) => count + 1)}
				>
					search
				</button>
				
				<ul className="mb-5 text-cyan-950 bg-sky-200 rounded-sm text-left p-7 opacity-75">
					{renderProjects}
				</ul>
				
			</div> */}
		</WindowManagerProvider>
	);
}

export default App;
