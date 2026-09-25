const BACK_KEYS = new Set(["Escape", "Backspace", "BrowserBack", "GoBack"]);
const NON_TEXT_INPUT_TYPES = new Set(["button", "checkbox", "color", "file", "hidden", "image", "radio", "range", "reset", "submit"]);

function isTextEntry(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) {
		return false;
	}

	if (target.isContentEditable) {
		return true;
	}

	const field = target.closest("input, textarea");
	return field instanceof HTMLTextAreaElement || (field instanceof HTMLInputElement && !NON_TEXT_INPUT_TYPES.has(field.type));
}

/**
 * Whether a keyboard event is one of the Back aliases (`Escape`, `Backspace`, `BrowserBack`, `GoBack`).
 *
 * On the glasses the Back gesture never reaches the page as a key: the shell calls `history.back()`
 * instead. These aliases are how desktop browsers and hardware keyboards exercise the same path.
 * `Backspace` is ignored inside text entry so typing never navigates.
 */
export function isBackNavigationKey(event: Pick<KeyboardEvent, "key"> & { readonly target?: EventTarget | null }): boolean {
	if (!BACK_KEYS.has(event.key)) {
		return false;
	}

	return event.key !== "Backspace" || !isTextEntry(event.target ?? null);
}
