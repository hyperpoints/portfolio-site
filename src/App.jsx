import { useState } from "react";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<h1 className="underline text-blue-100 mb-10 cursor-pointer">Hi, I'm Ian.</h1>
			<h2>Welcome to my amazing portfolio!</h2>
			<div className="card">
				<button className="mb-5" onClick={() => setCount((count) => count + 1)}>
					count is {count}
				</button>
				<p className="text-orange-100">
					Edit <code>src/App.jsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">Click on the Vite and React logos to learn more</p>
		</div>
	);
}

export default App;
