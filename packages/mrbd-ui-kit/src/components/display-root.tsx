import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { FocusContext, type FocusContextValue } from "../focus/FocusContext";
import { createFocusEngine, type FocusEngine, type FocusEngineOptions, type SpatialDirection } from "../focus/createFocusEngine";
import { cn } from "../lib/cn";
import { isBackNavigationKey } from "../lib/isBackNavigationKey";
import { FocusGlow } from "./focus-glow";

export interface DisplayRootProps {
	children: ReactNode;
	className?: string;
	focusOptions?: FocusEngineOptions;
	/** Called when select (Enter) is pressed on a focused element */
	onSelect?: (focusedId: string) => void;
	/**
	 * Called on an unclaimed keyboard Back alias (`Escape`, `Backspace`, `BrowserBack`, `GoBack`).
	 * Return `false` to fall through to the default, `history.back()`.
	 *
	 * On the glasses the Back gesture calls `history.back()` directly and never reaches this handler,
	 * so keep navigation in browser history and treat this as the desktop equivalent.
	 */
	onBack?: () => boolean | void;
	/**
	 * Render one glow ring that travels between focused elements.
	 * @default true
	 */
	focusGlow?: boolean;
}

const ARROW_TO_DIRECTION: Record<string, SpatialDirection> = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "left",
	ArrowRight: "right"
};

export function DisplayRoot({ children, className, focusOptions, onSelect, onBack, focusGlow = true }: DisplayRootProps) {
	const engineRef = useRef<FocusEngine | null>(null);
	if (!engineRef.current) {
		engineRef.current = createFocusEngine(focusOptions);
	}

	const rootRef = useRef<HTMLDivElement>(null);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			const engine = engineRef.current;
			if (!engine) {
				return;
			}

			const direction = ARROW_TO_DIRECTION[e.key];
			if (direction) {
				e.preventDefault();
				engine.move(direction);
				return;
			}

			if (e.key === "Enter") {
				e.preventDefault();
				const focusedId = engine.getCurrentId();
				if (focusedId && onSelect) {
					onSelect(focusedId);
				}
			}
		},
		[onSelect]
	);

	useEffect(() => {
		const root = rootRef.current;
		if (!root) {
			return;
		}

		root.addEventListener("keydown", handleKeyDown);
		return () => {
			root.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	const onBackRef = useRef(onBack);
	onBackRef.current = onBack;
	useEffect(() => {
		function handleBack(event: KeyboardEvent) {
			if (!isBackNavigationKey(event) || event.repeat || event.defaultPrevented) {
				return;
			}

			event.preventDefault();
			if (onBackRef.current?.() !== false) {
				return;
			}

			window.history.back();
		}

		// Window fires after document, so useBackNavigation handlers get first refusal.
		window.addEventListener("keydown", handleBack);
		return () => {
			window.removeEventListener("keydown", handleBack);
		};
	}, []);

	useEffect(() => {
		return () => {
			engineRef.current?.destroy();
		};
	}, []);

	const contextValue: FocusContextValue = { engine: engineRef.current };
	return (
		<FocusContext.Provider value={contextValue}>
			<div ref={rootRef} className={cn("bg-mrbd-background relative m-auto size-150 overflow-hidden p-2", className)} tabIndex={-1}>
				{children}
				{focusGlow && <FocusGlow rootRef={rootRef} />}
			</div>
		</FocusContext.Provider>
	);
}
