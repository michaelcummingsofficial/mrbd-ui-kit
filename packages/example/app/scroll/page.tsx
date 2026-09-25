"use client";
import { Button, Card, ScrollArea, ScrollBar, Text, useScroll } from "mrbd-ui-kit";
import { PageHeader } from "../../components/page-header";

const ITEMS = Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`);

export default function ScrollPage() {
	// useScroll() only powers the metrics card. A normal app would use <ScrollContainer> alone.
	const scroll = useScroll();
	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<PageHeader title="Scrolling" />

			<Text size="sm" className="text-mrbd-text-muted">
				Scroll to see the fade and scrollbar animate.
			</Text>

			<div className="flex min-h-0 flex-1 flex-row gap-2">
				<ScrollArea scrollRef={scroll.scrollRef} canScrollUp={scroll.canScrollUp} canScrollDown={scroll.canScrollDown}>
					<div className="flex flex-col gap-2">
						{ITEMS.map((item) => (
							<Button key={item} id={`scrollable-button-${item}`} variant="secondary" className="w-full">
								<Text size="sm" weight="semibold">
									{item}
								</Text>
							</Button>
						))}
					</div>
				</ScrollArea>
				<ScrollBar scrollHeight={scroll.scrollHeight} clientHeight={scroll.clientHeight} scrollTop={scroll.scrollTop} isScrolling={scroll.isScrolling} />
			</div>

			<Card className="flex flex-col gap-1">
				{[
					{ label: "scrollTop", value: `${Math.round(scroll.scrollTop)}px` },
					{ label: "canScrollDown", value: String(scroll.canScrollDown) },
					{ label: "isScrolling", value: String(scroll.isScrolling) }
				].map(({ label, value }) => (
					<div key={label} className="flex flex-row justify-between">
						<Text size="sm" className="text-mrbd-text-muted">
							{label}
						</Text>
						<Text size="sm" weight="semibold">
							{value}
						</Text>
					</div>
				))}
			</Card>
		</div>
	);
}
