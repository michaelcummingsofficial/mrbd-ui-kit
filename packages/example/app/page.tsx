"use client";
import { Eye, Glasses, LayoutPanelTop, List, Paintbrush, Pointer, TextCursor } from "lucide-react";
import { Button, ScrollContainer, Text } from "mrbd-ui-kit";
import Link from "next/link";
import type { ElementType } from "react";

interface NavItemProps {
	id: string;
	href: string;
	icon: ElementType;
	label: string;
	className?: string;
}

function NavItem({ id, href, icon: Icon, label, className }: NavItemProps) {
	return (
		<Button id={id} variant="secondary" className={`w-full ${className ?? ""}`} size="lg" asChild>
			<Link href={href}>
				<div className="flex w-full flex-row items-center gap-4">
					<div className="flex size-14 items-center justify-center rounded-full bg-black/50">
						<Icon className="text-mrbd-text size-7" aria-hidden="true" />
					</div>
					<Text weight="semibold">{label}</Text>
				</div>
			</Link>
		</Button>
	);
}

const NAV_ITEMS: NavItemProps[] = [
	{ id: "buttons", href: "/buttons", icon: Pointer, label: "Buttons" },
	{ id: "typography", href: "/typography", icon: TextCursor, label: "Typography" },
	{ id: "focus", href: "/focus", icon: Eye, label: "Focus & Navigation" },
	{ id: "scroll", href: "/scroll", icon: List, label: "Scrolling" },
	{ id: "card", href: "/card", icon: LayoutPanelTop, label: "Card" },
	{
		id: "themes",
		href: "/themes",
		icon: Paintbrush,
		label: "Themes",
		className:
			"group-focus:border-none group-focus:bg-linear-to-br group-focus:from-red-700 group-focus:via-green-700 group-focus:to-blue-700 hover:border-none hover:bg-linear-to-br hover:from-red-700 hover:via-green-700 hover:via-70% group-focus:via-70% hover:to-blue-700"
	}
];

export default function HomeTab() {
	return (
		<div className="flex h-full flex-col gap-4">
			<div className="flex flex-col items-center gap-2">
				<div className="flex size-12 items-center justify-center rounded-full bg-linear-to-br from-blue-400 to-blue-700">
					<Glasses className="text-mrbd-text h-full" aria-hidden="true" />
				</div>
				<Text size="lg" weight="bold">
					mrbd-ui-kit
				</Text>
				<Text size="sm" className="text-mrbd-text-muted">
					The easiest way to build an app for Meta Ray-Ban Display
				</Text>
			</div>
			<ScrollContainer>
				<div className="flex flex-col gap-4">
					{NAV_ITEMS.map((item) => (
						<NavItem key={item.id} {...item} />
					))}
				</div>
			</ScrollContainer>
		</div>
	);
}
