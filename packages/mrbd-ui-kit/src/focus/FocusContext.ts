import { createContext } from "react";
import type { FocusEngine } from "./createFocusEngine";

export interface FocusContextValue {
	engine: FocusEngine;
}

export const FocusContext = createContext<FocusContextValue | null>(null);
