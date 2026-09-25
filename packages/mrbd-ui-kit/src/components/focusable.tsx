import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { useFocusContext } from "../hooks/useFocusContext";
import { cn } from "../lib/cn";

export interface FocusableProps {
	children: ReactNode;
	/** Registers the element with the focus engine. Must be unique within the `<DisplayRoot>`. */
	id: string;
	group?: string;
	/**
	 * When false, skip this element for initial auto-focus but keep it
	 * navigable via arrow keys and explicit focus() calls.
	 * @default true
	 */
	autoFocus?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	/** Called when select (Enter) is pressed while focused */
	onSelect?: () => void;
	/** @default false */
	disabled?: boolean;
	className?: string;
}

export function Focusable({ children, id, group, autoFocus, onFocus, onBlur, onSelect, disabled = false, className }: FocusableProps) {
	const { engine } = useFocusContext();
	const elementRef = useRef<HTMLDivElement>(null);
	const callbacksRef = useRef({ onFocus, onBlur, onSelect });
	callbacksRef.current = { onFocus, onBlur, onSelect };

	useEffect(() => {
		if (disabled || !elementRef.current) {
			return;
		}

		engine.register({ id, element: elementRef.current, group, autoFocus });
		return () => {
			engine.unregister(id);
		};
	}, [engine, id, group, autoFocus, disabled]);

	useEffect(() => {
		if (disabled) {
			return;
		}

		let wasFocused = false;

		const unsubscribe = engine.subscribe((focusedId) => {
			const isFocused = focusedId === id;
			if (isFocused && !wasFocused) {
				callbacksRef.current.onFocus?.();
			}

			if (!isFocused && wasFocused) {
				callbacksRef.current.onBlur?.();
			}

			wasFocused = isFocused;
		});
		return unsubscribe;
	}, [engine, id, disabled]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" && !disabled) {
				e.preventDefault();
				e.stopPropagation();
				callbacksRef.current.onSelect?.();
				const target = (elementRef.current?.firstElementChild ?? elementRef.current) as HTMLElement | null;
				target?.click();
			}
		},
		[disabled]
	);
	return (
		<div
			ref={elementRef}
			id={id}
			tabIndex={disabled ? -1 : 0}
			className={cn("focus:outline-none focus-visible:outline-none", className)}
			onKeyDown={handleKeyDown}
			aria-disabled={disabled || undefined}>
			{children}
		</div>
	);
}
