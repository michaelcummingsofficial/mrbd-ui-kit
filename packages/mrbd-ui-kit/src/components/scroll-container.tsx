import type { ReactNode } from "react";
import { useScroll } from "../hooks/useScroll";
import { cn } from "../lib/cn";
import { ScrollArea } from "./scroll-area";
import { ScrollBar } from "./scroll-bar";

export interface ScrollContainerProps {
	children: ReactNode;
	className?: string;
}

/**
 * Composable scroll region that handles all layout and scroll state automatically.
 *
 * Renders the required `flex min-h-0 flex-1 flex-row` wrapper, a `<ScrollArea>` with
 * top/bottom fade gradients, and an optional `<ScrollBar>` indicator — all wired to
 * an internal `useScroll()` instance.
 *
 * Place `<ScrollContainer>` inside any `flex-col` parent and it will expand to fill
 * the remaining space while keeping content scrollable.
 *
 * ```tsx
 * <div className="flex h-full flex-col gap-4 p-4">
 *   <Text size="lg" weight="bold">Title</Text>
 *
 *   <ScrollContainer>
 *     {items.map((item) => <Button key={item.id} id={item.id}>{item.label}</Button>)}
 *   </ScrollContainer>
 * </div>
 * ```
 *
 * Use `ScrollArea` + `ScrollBar` + `useScroll()` directly only when you need
 * to share scroll state with other elements outside the scroll region.
 */
export function ScrollContainer({ children, className }: ScrollContainerProps) {
	const scroll = useScroll();
	return (
		<div className={cn("flex min-h-0 flex-1 flex-row gap-2", className)}>
			<ScrollArea scrollRef={scroll.scrollRef} canScrollUp={scroll.canScrollUp} canScrollDown={scroll.canScrollDown}>
				{children}
			</ScrollArea>
			<ScrollBar scrollHeight={scroll.scrollHeight} clientHeight={scroll.clientHeight} scrollTop={scroll.scrollTop} isScrolling={scroll.isScrolling} />
		</div>
	);
}
