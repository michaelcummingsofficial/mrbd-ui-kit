import { useContext } from "react";
import { FocusContext, type FocusContextValue } from "../focus/FocusContext";

export function useFocusContext(): FocusContextValue {
	const ctx = useContext(FocusContext);
	if (!ctx) {
		throw new Error("useFocusContext must be used within a <DisplayRoot>. Wrap your MRBD app in <DisplayRoot> to enable focus management.");
	}

	return ctx;
}
