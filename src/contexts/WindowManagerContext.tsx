// WindowManagerContext.tsx
import { createContext, useState, useContext } from "react";

const WindowManagerContext: any = createContext({});

export function WindowManagerProvider({ children }) {
	const [focusedId, setFocusedId] = useState(null);
	const [isAnyDragging, setIsAnyDragging] = useState(false);

	return (
		<WindowManagerContext.Provider
			value={{
				focusedId,
				setFocusedId,
				isAnyDragging,
				setIsAnyDragging,
			}}
		>
			{children}
		</WindowManagerContext.Provider>
	);
}

export function useWindowManager(): any {
	return useContext(WindowManagerContext);
}
