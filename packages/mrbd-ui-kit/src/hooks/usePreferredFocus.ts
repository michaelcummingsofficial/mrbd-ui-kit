import { useEffect } from "react";
import { useFocusContext } from "./useFocusContext";

/**
 * Declare the preferred initial focus target for the current page/screen.
 *
 * Takes priority over sessionStorage restore and first-element auto-focus.
 * Cleans up on unmount so the next page gets normal auto-focus behavior.
 *
 * @example
 * ```tsx
 * function LanguagePicker({ selectedLocale }: { selectedLocale: string }) {
 *   usePreferredFocus(`lang-${selectedLocale}`);
 *
 *   return (
 *     <ScrollContainer>
 *       {locales.map((l) => (
 *         <Button key={l} id={`lang-${l}`}>{l}</Button>
 *       ))}
 *     </ScrollContainer>
 *   );
 * }
 * ```
 */
export function usePreferredFocus(id: string | null) {
	const { engine } = useFocusContext();
	useEffect(() => {
		if (id === null) {
			return;
		}

		engine.setPreferredFocus(id);
		return () => {
			engine.setPreferredFocus(null);
		};
	}, [engine, id]);
}
