import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface TextProps {
	children: ReactNode;
	/** @default 'md' */
	size?: "sm" | "md" | "lg";
	/** @default 'medium'. Minimum 500 weight — thin fonts are illegible on additive displays. */
	weight?: "medium" | "semibold" | "bold";
	/** @default 'span' */
	as?: "p" | "span" | "h1" | "h2" | "h3" | "label";
	/** Text direction. Use 'auto' to let the browser detect from content, or specify 'ltr' or 'rtl'. @default 'auto' */
	dir?: "ltr" | "rtl" | "auto";
	className?: string;
}

const SIZE_CLASSES: Record<NonNullable<TextProps["size"]>, string> = {
	sm: "text-xl",
	md: "text-2xl",
	lg: "text-3xl"
};

const WEIGHT_CLASSES: Record<NonNullable<TextProps["weight"]>, string> = {
	medium: "font-medium",
	semibold: "font-semibold",
	bold: "font-bold"
};

export function Text({ children, size = "md", weight = "medium", as: Tag = "span", dir = "auto", className }: TextProps) {
	return (
		<Tag className={cn("box-trim-both box-edge-cap", SIZE_CLASSES[size], WEIGHT_CLASSES[weight], "text-mrbd-text", className)} dir={dir}>
			{children}
		</Tag>
	);
}
