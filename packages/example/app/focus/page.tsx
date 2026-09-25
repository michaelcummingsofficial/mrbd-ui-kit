"use client";
import { Button, Card, Text, useBackNavigation, usePreferredFocus } from "mrbd-ui-kit";
import { useState } from "react";
import { PageHeader } from "../../components/page-header";

export default function FocusPage() {
	const [selectedItem, setSelectedItem] = useState<string | null>("item-5");
	const [lastFocused, setLastFocused] = useState<string | null>(null);

	usePreferredFocus(selectedItem);
	// Back clears the selection first. With nothing selected it declines, and DisplayRoot goes back a page.
	useBackNavigation(() => {
		if (selectedItem === null) {
			return false;
		}

		setSelectedItem(null);
	});
	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<PageHeader title="Focus" />

			<Text size="sm" className="text-mrbd-text-muted">
				Select an item to make it the preferred focus target. Back clears it.
			</Text>

			<div className="grid grid-cols-3 gap-3">
				{Array.from({ length: 9 }, (_, i) => {
					const id = `item-${i + 1}`;
					const isSelected = id === selectedItem;
					return (
						<Button
							key={id}
							id={id}
							variant={isSelected ? "primary" : "secondary"}
							className="w-full"
							onFocus={() => setLastFocused(id)}
							onSelect={() => setSelectedItem(id)}>
							<Text size="sm" weight="semibold">
								{i + 1}
							</Text>
						</Button>
					);
				})}
			</div>

			<Card className="mt-auto">
				<div className="flex flex-row justify-between">
					<Text size="sm" className="text-mrbd-text-muted">
						Focused
					</Text>
					<Text size="sm" weight="semibold">
						{lastFocused ?? "—"}
					</Text>
				</div>
				<div className="flex flex-row justify-between">
					<Text size="sm" className="text-mrbd-text-muted">
						Preferred
					</Text>
					<Text size="sm" weight="semibold" className="text-mrbd-accent">
						{selectedItem ?? "none"}
					</Text>
				</div>
			</Card>
		</div>
	);
}
