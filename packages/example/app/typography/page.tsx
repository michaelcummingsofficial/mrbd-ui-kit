"use client";
import { Text } from "mrbd-ui-kit";
import { PageHeader } from "../../components/page-header";

export default function TypographyPage() {
	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<PageHeader title="Typography" />

			<div className="flex flex-col gap-4">
				<Text size="sm" className="text-mrbd-text-muted">
					Sizes
				</Text>

				<div className="flex flex-col gap-0.5">
					<Text size="lg" weight="bold">
						Large Bold
					</Text>
					<Text size="sm" className="text-mrbd-text-muted">
						Best for page titles &amp; section headers
					</Text>
				</div>

				<div className="flex flex-col gap-0.5">
					<Text size="md" weight="semibold">
						Medium Semibold
					</Text>
					<Text size="sm" className="text-mrbd-text-muted">
						Best for body copy &amp; primary content
					</Text>
				</div>

				<div className="flex flex-col gap-0.5">
					<Text size="sm">Small Medium</Text>
					<Text size="sm" className="text-mrbd-text-muted">
						Best for subheadings, labels &amp; descriptions
					</Text>
				</div>
			</div>
		</div>
	);
}
