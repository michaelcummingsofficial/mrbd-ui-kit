import { useEffect, useRef } from "react";
import { isBackNavigationKey } from "../lib/isBackNavigationKey";

/**
 * Return `false` when the screen cannot go back, so `<DisplayRoot>` falls through to `history.back()`.
 * Any other return value claims the event.
 */
export type BackNavigationHandler = () => boolean | void;

/**
 * Handle a keyboard Back alias before `<DisplayRoot>` does.
 *
 * Use it for state that Back should undo without leaving the page: closing a menu,
 * clearing a selection, stepping out of a sub-view. Return `false` to decline and let
 * `<DisplayRoot>` call `history.back()` as usual.
 *
 * This runs for the desktop aliases only. On the glasses, Back traverses browser history,
 * so a screen that must survive the device gesture should push a history entry when it opens
 * and listen for `popstate`.
 *
 * @example
 * ```tsx
 * useBackNavigation(() => {
 *   if (!isMenuOpen) {
 *     return false;
 *   }
 *   setMenuOpen(false);
 * });
 * ```
 */
export function useBackNavigation(handler: BackNavigationHandler) {
	const handlerRef = useRef(handler);
	handlerRef.current = handler;
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (!isBackNavigationKey(event) || event.repeat || event.defaultPrevented) {
				return;
			}

			if (handlerRef.current() !== false) {
				event.preventDefault();
			}
		}

		// Listens on document so it runs before DisplayRoot's window listener regardless of mount order.
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);
}
