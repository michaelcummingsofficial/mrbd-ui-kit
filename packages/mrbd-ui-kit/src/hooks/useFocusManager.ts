import { useCallback, useEffect, useState } from "react";
import type { SpatialDirection } from "../focus/createFocusEngine";
import { useFocusContext } from "./useFocusContext";

export interface FocusManager {
	move: (direction: SpatialDirection) => void;
	focus: (id: string) => void;
	focusedId: string | null;
}

export function useFocusManager(): FocusManager {
	const { engine } = useFocusContext();
	const [focusedId, setFocusedId] = useState<string | null>(engine.getCurrentId());

	useEffect(() => {
		const unsubscribe = engine.subscribe((id) => {
			setFocusedId(id);
		});
		return unsubscribe;
	}, [engine]);

	const move = useCallback(
		(direction: SpatialDirection) => {
			engine.move(direction);
		},
		[engine]
	);

	const focus = useCallback(
		(id: string) => {
			engine.focusById(id);
		},
		[engine]
	);
	return { move, focus, focusedId };
}
