import { useState, useMemo } from "react";
import "./App.css";
import { projects } from "./data/projects.js";

function App() {
	const [count, setCount] = useState(0);
	const [inputValue, setInputValue] = useState("");

	const renderProjects = useMemo(() => {
		if (projects.length > 0) {
			return projects.map((project) => {
				console.log(project);
				return (
					<li key={project.title}>
						<b>{project.title}</b> - {project.description}
					</li>
				);
			});
		}
		return;
	}, [projects]);

	return (
		<div>
			<h1 className="underline text-blue-100 mb-10 cursor-pointer">Hi, I'm Ian.</h1>
			<h2>Welcome to my amazing portfolio!</h2>
			<input
				type="text"
				placeholder={"query"}
				value={inputValue}
				onChange={(e) => {
					setInputValue(e.target.value);
				}}
				className="mt-5 center bg-black text-green-300 p-2 rounded-sm w-100"
			></input>
			<div className="card size-full">
				<button className="mb-5" onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<ul className="mb-5">{renderProjects}</ul>
				<p className="text-orange-100">
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</div>
	);
}

export default App;
