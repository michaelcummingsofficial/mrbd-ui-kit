import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface ScrollAreaProps {
	children: ReactNode;
	/** Ref from useScroll() — attach to the scrollable inner container */
	scrollRef: React.RefObject<HTMLDivElement | null>;
	canScrollUp: boolean;
	canScrollDown: boolean;
	className?: string;
}

/**
 * A scroll viewport with fade gradients that indicate hidden content.
 *
 * - Top gradient fades in when the user scrolls down (content above is clipped).
 * - Bottom gradient fades in when there is more content below.
 *
 * Pair with `useScroll()` and optionally `<ScrollBar>`:
 *
 * ```tsx
 * const scroll = useScroll();
 *
 * <div className="flex flex-row gap-2">
 *   <ScrollArea scrollRef={scroll.scrollRef} canScrollUp={scroll.canScrollUp} canScrollDown={scroll.canScrollDown}>
 *     <Button id="a">A</Button>
 *     <Button id="b">B</Button>
 *   </ScrollArea>
 *   <ScrollBar scrollHeight={scroll.scrollHeight} clientHeight={scroll.clientHeight} scrollTop={scroll.scrollTop} />
 * </div>
 * ```
 */
export function ScrollArea({ children, scrollRef, canScrollUp, canScrollDown, className }: ScrollAreaProps) {
	return (
		<div className={cn("relative min-h-0 flex-1", className)}>
			<div
				className={cn(
					"to-mrbd-background pointer-events-none absolute inset-x-0 top-0 z-10 h-10 bg-linear-to-t from-transparent transition-opacity duration-200",
					canScrollUp ? "opacity-100" : "opacity-0"
				)}
			/>
			<div ref={scrollRef} className="size-full scrollbar-none overflow-x-hidden overflow-y-auto p-2">
				{children}
			</div>
			<div
				className={cn(
					"to-mrbd-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-linear-to-b from-transparent transition-opacity duration-200",
					canScrollDown ? "opacity-100" : "opacity-0"
				)}
			/>
		</div>
	);
}
