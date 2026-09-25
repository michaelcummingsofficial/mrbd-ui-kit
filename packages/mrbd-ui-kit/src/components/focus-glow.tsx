import { useEffect, useRef, type RefObject } from "react";
import { useFocusContext } from "../hooks/useFocusContext";

interface FocusGlowProps {
	rootRef: RefObject<HTMLDivElement | null>;
}

const FOLLOW_MS = 400;

/**
 * One glow ring that springs between focused elements instead of each element lighting up on its own.
 * It measures the focused element's first child, which is the visible control inside `<Focusable>`.
 */
export function FocusGlow({ rootRef }: FocusGlowProps) {
	const { engine } = useFocusContext();
	const glowRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const glow = glowRef.current;
		const root = rootRef.current;
		if (!glow || !root) {
			return;
		}

		let frame: number | null = null;
		let followUntil = 0;
		function measure() {
			const wrapper = engine.getCurrentElement();
			const target = wrapper?.firstElementChild instanceof HTMLElement ? wrapper.firstElementChild : wrapper;
			if (!glow || !root || !target) {
				if (glow) {
					glow.style.opacity = "0";
				}

				return;
			}

			const rect = target.getBoundingClientRect();
			const rootRect = root.getBoundingClientRect();
			glow.style.opacity = "1";
			glow.style.transform = `translate(${rect.left - rootRect.left}px, ${rect.top - rootRect.top}px)`;
			glow.style.width = `${rect.width}px`;
			glow.style.height = `${rect.height}px`;
			glow.style.borderRadius = getComputedStyle(target).borderRadius;
		}

		// Smooth scrolling and the focus scale transition move the target for a few frames after focus lands.
		function follow() {
			measure();
			frame = performance.now() < followUntil ? requestAnimationFrame(follow) : null;
		}

		function start() {
			followUntil = performance.now() + FOLLOW_MS;
			if (frame === null) {
				frame = requestAnimationFrame(follow);
			}
		}

		const unsubscribe = engine.subscribe(start);
		root.addEventListener("scroll", start, { capture: true, passive: true });
		const resizeObserver = new ResizeObserver(start);
		resizeObserver.observe(root);
		start();
		return () => {
			unsubscribe();
			root.removeEventListener("scroll", start, { capture: true });
			resizeObserver.disconnect();
			if (frame !== null) {
				cancelAnimationFrame(frame);
			}
		};
	}, [engine, rootRef]);
	return (
		<div
			ref={glowRef}
			aria-hidden="true"
			className="shadow-mrbd-glow-ring pointer-events-none absolute top-0 left-0 z-10 opacity-0 transition-[transform,width,height,opacity] duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] motion-reduce:transition-none"
		/>
	);
}
