"use client";
import { Button, Text, usePreferredFocus } from "mrbd-ui-kit";
import { useState } from "react";
import { PageHeader } from "../../components/page-header";

const TINTS = [
	{ label: "Default", value: "#dbeafe" },
	{ label: "Teal", value: "#14b8a6" },
	{ label: "Rose", value: "#f43f5e" },
	{ label: "Amber", value: "#f59e0b" },
	{ label: "Violet", value: "#8b5cf6" },
	{ label: "Lime", value: "#84cc16" }
];

export default function ThemesPage() {
	const [activeIndex, setActiveIndex] = useState(0);

	usePreferredFocus(`tint-color-${TINTS[activeIndex].label}`);

	function applyTint(index: number) {
		setActiveIndex(index);
		document.documentElement.style.setProperty("--color-mrbd-accent", TINTS[index].value);
	}

	return (
		<div className="flex h-full flex-col gap-4 p-4">
			<PageHeader title="Themes" />

			<Text size="sm" className="text-mrbd-text-muted">
				Select a color to preview the tint system
			</Text>

			<div className="grid grid-cols-3 gap-2">
				{TINTS.map((tint, i) => (
					<Button
						key={tint.label}
						onClick={() => applyTint(i)}
						id={`tint-color-${tint.label}`}
						variant={i === activeIndex ? "primary" : "secondary"}
						className="w-full flex-col items-center justify-center gap-1">
						<div className="flex flex-row items-center gap-1.5">
							<div className="size-5 rounded-full border border-white/20" style={{ backgroundColor: tint.value }} />
						</div>
						<Text size="sm">{tint.label}</Text>
					</Button>
				))}
			</div>

			<div className="flex w-full flex-col gap-2">
				<Text size="sm" className="text-mrbd-text-muted">
					Preview
				</Text>
				<div className="grid grid-cols-2 gap-4">
					<Button id="preview-primary" variant="primary" size="md" className="w-full">
						Primary
					</Button>
					<Button id="preview-secondary" variant="secondary" size="md" className="w-full">
						Secondary
					</Button>
				</div>
			</div>
		</div>
	);
}
