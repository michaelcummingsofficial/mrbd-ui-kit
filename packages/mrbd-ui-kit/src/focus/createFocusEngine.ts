export type SpatialDirection = "up" | "down" | "left" | "right";

export interface FocusableEntry {
	id: string;
	element: HTMLElement;
	group?: string;
	/**
	 * When false, this entry is skipped during initial auto-focus selection.
	 * It remains fully reachable via arrow-key navigation, explicit focusById(), and restore.
	 * @default true
	 */
	autoFocus?: boolean;
}

export interface FocusEngineOptions {
	/** Wrap focus at boundaries. @default true */
	wrap?: boolean;
}

export interface FocusEngine {
	register: (entry: FocusableEntry) => void;
	unregister: (id: string) => void;
	move: (direction: SpatialDirection) => void;
	focusById: (id: string) => void;
	/**
	 * Declare the preferred focus target.
	 * Takes priority over sessionStorage restore and first-element auto-focus.
	 * Pass `null` to clear the preference and restore normal auto-focus behavior.
	 */
	setPreferredFocus: (id: string | null) => void;
	getCurrentId: () => string | null;
	/** The focused entry's element, or null. */
	getCurrentElement: () => HTMLElement | null;
	subscribe: (listener: (id: string | null) => void) => () => void;
	destroy: () => void;
}

interface Rect {
	top: number;
	bottom: number;
	left: number;
	right: number;
	centerX: number;
	centerY: number;
}

function getRect(el: HTMLElement): Rect {
	const r = el.getBoundingClientRect();
	return {
		top: r.top,
		bottom: r.bottom,
		left: r.left,
		right: r.right,
		centerX: r.left + r.width / 2,
		centerY: r.top + r.height / 2
	};
}

/**
 * Filter candidates that are in the given direction relative to the current rect.
 * For "right": candidates whose left edge is at or beyond current right edge.
 * Small tolerance (1px) to avoid self-matching.
 */
function filterByDirection(
	direction: SpatialDirection,
	current: Rect,
	candidates: Array<{ id: string; rect: Rect }>
): Array<{ id: string; rect: Rect }> {
	switch (direction) {
		case "up":
			return candidates.filter((c) => c.rect.centerY < current.centerY - 1);
		case "down":
			return candidates.filter((c) => c.rect.centerY > current.centerY + 1);
		case "left":
			return candidates.filter((c) => c.rect.centerX < current.centerX - 1);
		case "right":
			return candidates.filter((c) => c.rect.centerX > current.centerX + 1);
	}
}

/**
 * Score a candidate by distance + off-axis penalty.
 * Lower score = better match.
 *
 * For vertical movement (up/down): primary axis is Y, penalty axis is X.
 * For horizontal movement (left/right): primary axis is X, penalty axis is Y.
 *
 * The penalty ensures elements roughly aligned on the movement axis are preferred
 * over elements that are closer but far off to the side.
 */
function scoreCandidate(direction: SpatialDirection, current: Rect, candidate: Rect): number {
	const dx = candidate.centerX - current.centerX;
	const dy = candidate.centerY - current.centerY;

	const isVertical = direction === "up" || direction === "down";
	const primaryDist = isVertical ? Math.abs(dy) : Math.abs(dx);
	const offAxisDist = isVertical ? Math.abs(dx) : Math.abs(dy);

	const OFF_AXIS_WEIGHT = 2.5;
	return primaryDist + offAxisDist * OFF_AXIS_WEIGHT;
}

/**
 * For wrap-around: find the element on the opposite edge.
 * e.g., if moving "right" with no candidates, wrap to the leftmost element.
 */
function getWrapTarget(direction: SpatialDirection, entries: Array<{ id: string; rect: Rect }>): string | null {
	if (entries.length === 0) {
		return null;
	}

	let best = entries[0];
	for (const entry of entries) {
		switch (direction) {
			case "up":
				if (entry.rect.centerY > best.rect.centerY) {
					best = entry;
				}

				break;
			case "down":
				if (entry.rect.centerY < best.rect.centerY) {
					best = entry;
				}

				break;
			case "left":
				if (entry.rect.centerX > best.rect.centerX) {
					best = entry;
				}

				break;
			case "right":
				if (entry.rect.centerX < best.rect.centerX) {
					best = entry;
				}

				break;
		}
	}

	return best.id;
}

const SCROLL_MARGIN = 12;

/**
 * Find the nearest scrollable ancestor and scroll just enough to keep
 * `element` fully visible, with SCROLL_MARGIN clearance on top/bottom.
 * Unlike native scrollIntoView, this only scrolls the nearest scroll
 * container (not the root viewport) and respects gradient overlays.
 */
function scrollIntoScrollContainer(element: HTMLElement) {
	const container = findScrollParent(element);
	if (!container) {
		return;
	}

	const elRect = element.getBoundingClientRect();
	const ctRect = container.getBoundingClientRect();

	const offTop = elRect.top - ctRect.top - SCROLL_MARGIN;
	const offBottom = elRect.bottom - ctRect.bottom + SCROLL_MARGIN;
	if (offTop < 0) {
		container.scrollBy({ top: offTop, behavior: "smooth" });
	} else if (offBottom > 0) {
		container.scrollBy({ top: offBottom, behavior: "smooth" });
	}
}

/** Walk up the DOM to find the first ancestor with overflow scroll/auto. */
function findScrollParent(el: HTMLElement): HTMLElement | null {
	let current = el.parentElement;
	while (current) {
		const style = getComputedStyle(current);
		if (/(auto|scroll)/.test(style.overflowY)) {
			return current;
		}

		current = current.parentElement;
	}

	return null;
}

/**
 * Whether candidates spread along the movement axis by more than SPREAD_THRESHOLD.
 * Without this, left/right would wrap around a single column and up/down a single row.
 */
const SPREAD_THRESHOLD = 10;

function hasSpatialSpread(direction: SpatialDirection, candidates: Array<{ id: string; rect: Rect }>): boolean {
	if (candidates.length < 2) {
		return false;
	}

	const isHorizontal = direction === "left" || direction === "right";
	const values = candidates.map((c) => (isHorizontal ? c.rect.centerX : c.rect.centerY));
	const min = Math.min(...values);
	const max = Math.max(...values);
	return max - min > SPREAD_THRESHOLD;
}

export function createFocusEngine(options: FocusEngineOptions = {}): FocusEngine {
	const { wrap = true } = options;

	const entries = new Map<string, FocusableEntry>();
	let currentId: string | null = null;
	const listeners = new Set<(id: string | null) => void>();
	let pendingInitialFocusFrame: number | null = null;
	let preferredFocusId: string | null = null;

	function getStorageKey(): string {
		try {
			return `mrbd-focus:${window.location.pathname}`;
		} catch {
			return "mrbd-focus:default";
		}
	}

	function getSavedFocusId(): string | null {
		try {
			return sessionStorage.getItem(getStorageKey());
		} catch {
			return null;
		}
	}

	function saveFocusId(id: string) {
		try {
			sessionStorage.setItem(getStorageKey(), id);
		} catch {
			// sessionStorage may be unavailable
		}
	}

	function notify() {
		for (const listener of listeners) {
			listener(currentId);
		}
	}

	function applyFocus(id: string | null, { persist = true } = {}) {
		if (currentId) {
			const prev = entries.get(currentId);
			if (prev?.element) {
				prev.element.setAttribute("data-focused", "false");
				prev.element.blur();
			}
		}

		currentId = id;
		if (currentId) {
			const next = entries.get(currentId);
			if (next?.element) {
				next.element.setAttribute("data-focused", "true");
				next.element.focus({ preventScroll: true });
				scrollIntoScrollContainer(next.element);
			}

			// Chrome items (autoFocus=false) are not saved, so back-nav restores the last content item, not a toolbar button.
			if (persist) {
				const entry = entries.get(currentId);
				if (entry?.autoFocus !== false) {
					saveFocusId(currentId);
				}
			}
		}

		notify();
	}

	/** Return the first entry eligible for initial auto-focus (autoFocus !== false). */
	function findFirstAutoFocusable(): string | undefined {
		for (const [id, entry] of entries) {
			if (entry.autoFocus !== false) {
				return id;
			}
		}

		return undefined;
	}

	function register(entry: FocusableEntry) {
		entries.set(entry.id, entry);
		if (preferredFocusId === entry.id) {
			if (pendingInitialFocusFrame !== null) {
				cancelAnimationFrame(pendingInitialFocusFrame);
				pendingInitialFocusFrame = null;
			}

			requestAnimationFrame(() => applyFocus(entry.id));
			return;
		}

		/**
		 * Defer the initial pick one frame so every element on the page has registered.
		 * Priority: preferred focus > saved focus > first auto-focusable > first entry.
		 */
		if (currentId === null && pendingInitialFocusFrame === null) {
			pendingInitialFocusFrame = requestAnimationFrame(() => {
				pendingInitialFocusFrame = null;
				if (preferredFocusId && entries.has(preferredFocusId)) {
					applyFocus(preferredFocusId);
					return;
				}

				const savedId = getSavedFocusId();
				if (savedId && entries.has(savedId)) {
					applyFocus(savedId);
				} else {
					const first = findFirstAutoFocusable() ?? entries.keys().next().value;
					if (first) {
						applyFocus(first);
					}
				}
			});
		}
	}

	function setPreferredFocus(id: string | null) {
		preferredFocusId = id;
		if (id === null) {
			return;
		}

		if (pendingInitialFocusFrame !== null) {
			cancelAnimationFrame(pendingInitialFocusFrame);
			pendingInitialFocusFrame = null;
		}

		if (entries.has(id)) {
			applyFocus(id);
		}
	}

	function unregister(id: string) {
		entries.delete(id);
		if (currentId === id) {
			// Not persisted: a teardown cascade is not user intent.
			const first = entries.keys().next().value;
			applyFocus(first ?? null, { persist: false });
		}
	}

	function move(direction: SpatialDirection) {
		if (entries.size === 0) {
			return;
		}

		if (currentId === null) {
			const first = entries.keys().next().value;
			if (first) {
				applyFocus(first);
			}

			return;
		}

		const currentEntry = entries.get(currentId);
		if (!currentEntry) {
			return;
		}

		const currentRect = getRect(currentEntry.element);

		const candidates: Array<{ id: string; rect: Rect }> = [];
		for (const [id, entry] of entries) {
			if (id === currentId) {
				continue;
			}

			if (currentEntry.group && entry.group !== currentEntry.group) {
				continue;
			}

			candidates.push({ id, rect: getRect(entry.element) });
		}

		const directional = filterByDirection(direction, currentRect, candidates);
		if (directional.length > 0) {
			let bestId = directional[0].id;
			let bestScore = scoreCandidate(direction, currentRect, directional[0].rect);
			for (let i = 1; i < directional.length; i++) {
				const score = scoreCandidate(direction, currentRect, directional[i].rect);
				if (score < bestScore) {
					bestScore = score;
					bestId = directional[i].id;
				}
			}

			applyFocus(bestId);
		} else if (wrap && hasSpatialSpread(direction, candidates)) {
			// Wrapping only when elements spread along the axis keeps left/right from wrapping a single column.
			const allWithRects = candidates.map((c) => ({ id: c.id, rect: c.rect }));
			const wrapId = getWrapTarget(direction, allWithRects);
			if (wrapId) {
				applyFocus(wrapId);
			}
		}
	}

	function focusById(id: string) {
		if (pendingInitialFocusFrame !== null) {
			cancelAnimationFrame(pendingInitialFocusFrame);
			pendingInitialFocusFrame = null;
		}

		if (entries.has(id)) {
			applyFocus(id);
		}
	}

	function getCurrentId() {
		return currentId;
	}

	function getCurrentElement() {
		return currentId ? (entries.get(currentId)?.element ?? null) : null;
	}

	function subscribe(listener: (id: string | null) => void) {
		listeners.add(listener);
		return () => {
			listeners.delete(listener);
		};
	}

	function destroy() {
		if (pendingInitialFocusFrame !== null) {
			cancelAnimationFrame(pendingInitialFocusFrame);
			pendingInitialFocusFrame = null;
		}

		entries.clear();
		listeners.clear();
		currentId = null;
		preferredFocusId = null;
	}

	return {
		register,
		unregister,
		move,
		focusById,
		setPreferredFocus,
		getCurrentId,
		getCurrentElement,
		subscribe,
		destroy
	};
}
