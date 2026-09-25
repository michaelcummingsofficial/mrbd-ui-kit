import type { ReactNode } from "react";
import { cn } from "../lib/cn";

export interface PillProps {
	children: ReactNode;
	className?: string;
}

export function Pill({ children, className }: PillProps) {
	return (
		<span
			className={cn(
				"box-trim-both box-edge-cap border-mrbd-border from-mrbd-surface-2 relative m-auto h-12 rounded-full border-t border-l bg-linear-to-b to-transparent px-4",
				className
			)}>
			{children}
		</span>
	);
}
